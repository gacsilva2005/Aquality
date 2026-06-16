import asyncio
import json
import logging
import os
import re
import tempfile
import ssl
from typing import Optional

import httpx
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from CamiloAI import criar_agente
from athlete_data_fetcher import build_athlete_context

load_dotenv(find_dotenv())

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flag para ambiente da Mauá (desabilita verificação SSL)
DISABLE_SSL_VERIFY = os.getenv("DISABLE_SSL_VERIFY", "false").lower() == "true"
if DISABLE_SSL_VERIFY:
    os.environ["CURL_CA_BUNDLE"] = ""
    os.environ["REQUESTS_CA_BUNDLE"] = ""
    ssl._create_default_https_context = ssl._create_unverified_context
    logger.warning("AVISO CRÍTICO: VERIFICAÇÃO SSL DESABILITADA (DISABLE_SSL_VERIFY=true). Risco de MITM.")



def strip_markdown(text: str) -> str:
    """Remove símbolos residuais de Markdown que o modelo possa ter incluído."""
    if not text:
        return text
    # Remove headings (### Título → Título)
    text = re.sub(r'^#{1,6}\s*', '', text, flags=re.MULTILINE)
    # Remove bold/italic (**texto** ou *texto*)
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    # Remove code fences (```)
    text = re.sub(r'```[a-zA-Z]*\n?', '', text)
    # Remove inline code (`texto`)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    # Remove separadores de tabela markdown (|---|---|)
    text = re.sub(r'^\|[\s\-:|]+\|$', '', text, flags=re.MULTILINE)
    # Remove blockquotes (> texto → texto)
    text = re.sub(r'^>\s?', '', text, flags=re.MULTILINE)
    # Remove linhas em branco consecutivas (max 2)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


app = FastAPI(title="HydraSense AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    atleta_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    content: str
    sources: list[dict] = []


def _resolve_athlete_context(atleta_id: Optional[int]) -> Optional[str]:
    """
    Busca dados do atleta no backend para contextualização se o ID for fornecido.
    """
    if not atleta_id:
        logger.info("atleta_id não fornecido — modo RAG puro")
        return None
    try:
        logger.info("Buscando dados do atleta %d", atleta_id)
        context = build_athlete_context(atleta_id)
        if context:
            logger.info("Contexto do atleta %d montado com sucesso (%d chars)", atleta_id, len(context))
        else:
            logger.info("Nenhum dado encontrado para atleta %d", atleta_id)
        return context
    except Exception as e:
        logger.error("Erro ao resolver contexto do atleta: %s", e)
        return None


def _run_agent(session_id: str, message: str, athlete_context: Optional[str] = None) -> str:
    """Executa o agente em thread separada (bloqueante)."""
    agente = criar_agente(session_id=session_id, athlete_context=athlete_context)
    response = agente.run(message)
    content = response.content

    # Detecta se o Gemini retornou um erro em vez de uma resposta real
    if content and content.strip().startswith("{"):
        try:
            parsed = json.loads(content)
            if "error" in parsed:
                error_msg = parsed["error"].get("message", "Erro desconhecido")
                raise RuntimeError(f"Modelo indisponível: {error_msg}")
        except json.JSONDecodeError:
            pass

    return strip_markdown(content)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        # Resolve contexto do atleta baseado no atleta_id
        athlete_context = await asyncio.to_thread(_resolve_athlete_context, req.atleta_id)

        content = await asyncio.to_thread(_run_agent, req.session_id, req.message, athlete_context)
        return ChatResponse(content=content, sources=[])
    except Exception as e:
        logger.exception("Erro no /chat")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chat/history/{session_id}")
async def get_history(session_id: str):
    """Retorna o histórico de uma conversa."""
    try:
        def _fetch_history():
            agente = criar_agente(session_id=session_id)
            if hasattr(agente, "read_from_db"):
                agente.read_from_db()
            elif hasattr(agente, "load_memory"):
                agente.load_memory()
            
            history = []
            if getattr(agente, "memory", None) and getattr(agente.memory, "messages", None):
                for i, msg in enumerate(agente.memory.messages):
                    # Retorna apenas user/assistant, ignorando system prompts
                    if msg.role in ['user', 'assistant']:
                        history.append({
                            "id": str(i),
                            "role": msg.role,
                            "content": strip_markdown(msg.content) if msg.role == 'assistant' else msg.content
                        })
            return history

        messages = await asyncio.to_thread(_fetch_history)
        return {"messages": messages}
    except Exception as e:
        logger.exception("Erro ao buscar histórico")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar histórico")


@app.get("/athlete-context/{atleta_id}")
async def debug_athlete_context(atleta_id: int):
    """Endpoint de debug — mostra o contexto que a IA receberia para este atleta."""
    context = await asyncio.to_thread(build_athlete_context, atleta_id)
    return {
        "atleta_id": atleta_id,
        "context_length": len(context) if context else 0,
        "context": context or "Nenhum dado encontrado para este atleta.",
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Transcreve áudio usando Whisper via Groq API."""
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY não configurada")

    # Salva o áudio temporariamente
    suffix = os.path.splitext(file.filename or "audio.m4a")[1] or ".m4a"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        audio_bytes = await file.read()
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    # 1. Tenta usar o Gemini para transcrição primeiro (conexão mais estável neste ambiente)
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        try:
            from google import genai
            from google.genai import types

            logger.info("Tentando transcrever com Gemini (gemini-2.5-flash-lite)...")
            client = genai.Client(api_key=gemini_key.strip('"').strip("'"))
            with open(tmp_path, "rb") as f:
                raw_audio = f.read()

            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=[
                    "Transcreva o áudio a seguir exatamente como foi falado, em português. Não adicione comentários, introduções ou notas. Apenas o texto falado. Se o áudio estiver sem fala ou silencioso, retorne uma string vazia.",
                    types.Part.from_bytes(
                        data=raw_audio,
                        mime_type=file.content_type or "audio/m4a"
                    )
                ]
            )
            transcript = (response.text or "").strip()
            logger.info("Transcrição via Gemini concluída com sucesso.")
            return {"transcript": transcript}
        except Exception as gemini_err:
            logger.warning("Falha ao transcrever com Gemini, tentando fallback para Groq Whisper: %s", gemini_err)

    # 2. Fallback para Groq Whisper
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=500, detail="Sem chave de API configurada para transcrição (Gemini/Groq)")

    try:
        logger.info("Tentando transcrever com Groq Whisper...")
        async with httpx.AsyncClient(timeout=60.0, verify=not DISABLE_SSL_VERIFY) as client:
            with open(tmp_path, "rb") as f:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/audio/transcriptions",
                    headers={"Authorization": f"Bearer {groq_key}"},
                    files={"file": (file.filename or "audio.m4a", f, file.content_type or "audio/m4a")},
                    data={"model": "whisper-large-v3", "language": "pt"},
                )

        if resp.status_code != 200:
            logger.error(f"Erro na Groq API ({resp.status_code}): {resp.text}")
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        data = resp.json()
        return {"transcript": data.get("text", "")}
    except httpx.ConnectError as e:
        logger.error("Falha de conexão com api.groq.com — verifique DNS/rede do container: %s", e)
        raise HTTPException(status_code=503, detail="Sem conexão com o serviço de transcrição (Groq). Verifique a rede.")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        logger.exception("Erro interno ao transcrever áudio")
        raise HTTPException(status_code=500, detail="Falha interna na transcrição")
    finally:
        os.unlink(tmp_path)


@app.get("/health")
async def health():
    return {"status": "ok"}
