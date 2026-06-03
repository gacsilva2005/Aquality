import asyncio
import json
import logging
import os
import re
import tempfile
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
    message: str

class ChatResponse(BaseModel):
    content: str
    sources: list[dict] = []


def _resolve_athlete_context(session_id: str) -> Optional[str]:
    """
    Se session_id for numérico, interpreta como atleta_id e busca dados.
    Caso contrário, retorna None (modo RAG puro).
    """
    try:
        atleta_id = int(session_id)
        logger.info("session_id '%s' é numérico — buscando dados do atleta %d", session_id, atleta_id)
        context = build_athlete_context(atleta_id)
        if context:
            logger.info("Contexto do atleta %d montado com sucesso (%d chars)", atleta_id, len(context))
        else:
            logger.info("Nenhum dado encontrado para atleta %d — usando RAG puro", atleta_id)
        return context
    except ValueError:
        logger.info("session_id '%s' não é numérico — modo RAG puro", session_id)
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
        # Resolve contexto do atleta baseado no session_id
        athlete_context = await asyncio.to_thread(_resolve_athlete_context, req.session_id)

        content = await asyncio.to_thread(_run_agent, req.session_id, req.message, athlete_context)
        return ChatResponse(content=content, sources=[])
    except Exception as e:
        logger.exception("Erro no /chat")
        raise HTTPException(status_code=500, detail=str(e))


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

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            with open(tmp_path, "rb") as f:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/audio/transcriptions",
                    headers={"Authorization": f"Bearer {groq_key}"},
                    files={"file": (file.filename or "audio.m4a", f, file.content_type or "audio/m4a")},
                    data={"model": "whisper-large-v3", "language": "pt"},
                )

        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        data = resp.json()
        return {"transcript": data.get("text", "")}
    finally:
        os.unlink(tmp_path)


@app.get("/health")
async def health():
    return {"status": "ok"}
