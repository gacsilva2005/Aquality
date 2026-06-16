import os
from typing import Optional
from agno.agent import Agent
from agno.models.google import Gemini
from dotenv import load_dotenv, find_dotenv
from agno.db.sqlite import SqliteDb
from agno.vectordb.chroma import ChromaDb
from agno.knowledge.knowledge import Knowledge
from agno.knowledge.reader.pdf_reader import PDFReader
from agno.knowledge.embedder.google import GeminiEmbedder

load_dotenv(find_dotenv())

# Carrega a chave diretamente do .env (removendo aspas duplas, caso existam)
api_key = os.getenv("GOOGLE_API_KEY", "").strip('"').strip("'")
if not api_key:
    api_key = os.getenv("GEMINI_API_KEY", "").strip('"').strip("'")

if not api_key:
    raise RuntimeError("GOOGLE_API_KEY / GEMINI_API_KEY nao encontrada no .env")

# Injeta a chave também no ambiente para garantir compatibilidade com bibliotecas subjacentes
os.environ["GEMINI_API_KEY"] = api_key
os.environ["GOOGLE_API_KEY"] = api_key

diretorio_atual = os.path.dirname(os.path.abspath(__file__))
caminho_dos_pdfs = os.path.join(diretorio_atual, "..", "PDFs")

# Cria a pasta db se não existir para o volume funcionar localmente
os.makedirs("db", exist_ok=True)
histórico = SqliteDb(db_url="sqlite:///db/agno.db", session_table="sessões")
vector_db = ChromaDb(
    collection="camilo",
    path="./chroma_data",
    embedder=GeminiEmbedder(api_key=api_key),
    persistent_client=True,
)

reader = PDFReader()
base_conhecimento = Knowledge(vector_db=vector_db, readers=[reader], max_results=3)

# Carrega PDFs apenas se a collection estiver vazia (evita re-inserção no startup do FastAPI)
try:
    if vector_db.get_count() == 0:
        base_conhecimento.insert(path=caminho_dos_pdfs)
except Exception:
    base_conhecimento.insert(path=caminho_dos_pdfs)


# ─── Prompt base do sistema ───

_PROMPT_BASE = (
    "Você é o Camilo, o assistente científico avançado da HydraSense. "
    "Seu objetivo é analisar diretrizes acadêmicas e ajudar usuários com informações precisas sobre hidratação, "
    "taxa de sudorese, reposição de eletrólitos e desempenho esportivo.\n\n"
    "REGRAS DE FORMATAÇÃO (OBRIGATÓRIAS):\n"
    "- Responda SEMPRE em texto plano, sem formatação markdown.\n"
    "- NUNCA use **, ##, ###, >, |---|, ```, nem qualquer outro símbolo de markdown.\n"
    "- Para listas, use apenas travessão (–) ou números (1., 2., 3.).\n"
    "- Para ênfase, use letras MAIÚSCULAS em vez de negrito.\n"
    "- Para separar seções, use uma linha em branco.\n\n"
    "DIRETRIZES DE COMPORTAMENTO:\n"
    "1. USO DE FERRAMENTAS: Para responder a QUALQUER pergunta técnica, você DEVE SEMPRE usar a ferramenta de "
    "busca na base de conhecimento primeiro.\n\n"
    "2. FONTE DE VERDADE ESTRITA: Você deve basear suas respostas EXCLUSIVAMENTE nos documentos, papers, "
    "diretrizes e materiais da São Camilo fornecidos pela ferramenta de busca. Se a resposta "
    "não estiver nos documentos retornados, diga claramente: 'Não encontrei essa informação na literatura "
    "disponibilizada no momento.' Nunca invente dados ou use conhecimentos externos.\n\n"
    "3. CITAÇÕES AUTOMÁTICAS: Toda afirmação científica ou recomendação numérica deve ser acompanhada de sua origem real. "
    "Ao final de toda resposta, crie obrigatoriamente uma seção chamada 'Fontes:' e liste os documentos utilizados.\n\n"
    "4. COMPREENSÃO CLÍNICA E SEMÂNTICA: Se o usuário disser 'estou tendo muita câimbra', relacione isso imediatamente a "
    "'déficit de eletrólitos', 'desidratação' ou 'suor salgado', e busque na literatura esses termos.\n\n"
    "5. IDENTIDADE: Se questionado sobre 'Camila', 'Camilo' ou quem você é, responda: 'Sou Camilo, a inteligência "
    "artificial acadêmica da HydraSense. Fui treinado com diretrizes científicas da São Camilo para otimizar hidratação e performance.'"
)

_PROMPT_DADOS_ATLETA = (
    "\n\nDIRETRIZES SOBRE DADOS DO ATLETA:\n"
    "6. DADOS REAIS DO ATLETA: Abaixo estão os dados REAIS coletados pelo sistema HydraSense para o atleta que "
    "está conversando com você. Use esses dados para personalizar suas respostas.\n"
    "   – Quando o atleta perguntar sobre si (nome, peso, treinos, etc.), use os dados reais abaixo.\n"
    "   – Quando houver dados de treino, CRUZE com a literatura acadêmica para dar recomendações personalizadas.\n"
    "   – Indique claramente quando está usando dados reais ('Segundo seus registros...') vs. recomendações gerais ('De acordo com a literatura...').\n"
    "   – Se os dados estiverem incompletos para responder, diga o que falta e use a literatura como complemento.\n"
    "   – NUNCA invente dados do atleta — use apenas o que está abaixo.\n"
)


def criar_agente(session_id: Optional[str] = None, athlete_context: Optional[str] = None) -> Agent:
    """
    Cria o agente Camilo.

    Se athlete_context for fornecido (texto estruturado com dados do atleta),
    ele é injetado no system prompt para personalizar respostas.
    """
    if athlete_context:
        description = _PROMPT_BASE + _PROMPT_DADOS_ATLETA + athlete_context
    else:
        description = _PROMPT_BASE

    return Agent(
        model=Gemini(id="gemini-2.5-flash-lite", api_key=api_key),
        knowledge=base_conhecimento,
        search_knowledge=True,
        db=histórico,
        session_id=session_id,
        add_history_to_context=True,
        num_history_runs=2,
        enable_agentic_memory=False,
        add_memories_to_context=False,
        markdown=False,
        description=description,
    )

if __name__ == "__main__":
    agente = criar_agente()
    while True:
        print("Digite sair para fechar o chat")
        pergunta = input("Faça sua pergunta ao Camilo: ")
        if pergunta.lower() == "sair":
            break
        elif not pergunta:
            continue
        else:
            agente.print_response(pergunta, stream=True)