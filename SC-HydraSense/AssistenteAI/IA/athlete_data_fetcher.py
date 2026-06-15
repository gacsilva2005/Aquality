"""
Módulo responsável por buscar dados do atleta no backend Spring Boot
e montar um contexto textual estruturado para injetar no prompt da IA.

Princípio: falhas de rede NUNCA devem quebrar o chat.
Se o backend estiver offline, retorna contexto vazio e a IA funciona via RAG.
"""

import os
import logging
from datetime import date, datetime
from typing import Optional

import httpx
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

logger = logging.getLogger(__name__)

BACKEND_URL = os.getenv("BACKEND_API_URL", "http://localhost:8080").rstrip("/")
TIMEOUT = 5.0  # segundos — não travar o chat esperando backend


def _get(endpoint: str) -> Optional[dict | list]:
    """GET genérico com tratamento de erro robusto."""
    url = f"{BACKEND_URL}{endpoint}"
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            resp = client.get(url)
            if resp.status_code == 200:
                return resp.json()
            logger.warning("Backend retornou %d para %s", resp.status_code, url)
    except httpx.ConnectError:
        logger.warning("Backend offline — não foi possível conectar em %s", url)
    except httpx.TimeoutException:
        logger.warning("Timeout ao acessar %s", url)
    except Exception as e:
        logger.warning("Erro inesperado ao acessar %s: %s", url, e)
    return None


def fetch_athlete_profile(atleta_id: int) -> Optional[dict]:
    """Busca perfil básico do atleta."""
    return _get(f"/Atleta/{atleta_id}")


def fetch_training_sessions(atleta_id: int, limit: int = 5) -> list[dict]:
    """Busca as sessões de treino do atleta (mais recentes primeiro)."""
    data = _get(f"/sessoes-de-treino/atleta/{atleta_id}")
    if not data or not isinstance(data, list):
        return []
    # Ordena por data de início decrescente e limita
    data.sort(key=lambda s: s.get("dataHoraInicio", ""), reverse=True)
    return data[:limit]


def fetch_hydration_records(atleta_id: int, limit: int = 10) -> list[dict]:
    """Busca registros de hidratação do atleta."""
    data = _get(f"/hidratacao/atleta/{atleta_id}")
    if not data or not isinstance(data, list):
        return []
    data.sort(key=lambda r: r.get("dataHora", ""), reverse=True)
    return data[:limit]


def _calcular_idade(data_nascimento: str) -> Optional[int]:
    """Calcula idade a partir de string ISO (YYYY-MM-DD)."""
    try:
        nascimento = date.fromisoformat(data_nascimento)
        hoje = date.today()
        return hoje.year - nascimento.year - (
            (hoje.month, hoje.day) < (nascimento.month, nascimento.day)
        )
    except (ValueError, TypeError):
        return None


def _formatar_data(iso_str: Optional[str]) -> str:
    """Converte datetime ISO para formato legível."""
    if not iso_str:
        return "N/A"
    try:
        dt = datetime.fromisoformat(iso_str)
        return dt.strftime("%d/%m/%Y %H:%M")
    except (ValueError, TypeError):
        return str(iso_str)


def _formatar_duracao(segundos: Optional[int]) -> str:
    """Converte segundos em formato legível."""
    if not segundos or segundos <= 0:
        return "N/A"
    minutos = segundos // 60
    if minutos < 60:
        return f"{minutos} min"
    horas = minutos // 60
    mins_restantes = minutos % 60
    return f"{horas}h{mins_restantes:02d}min"


def build_athlete_context(atleta_id: int) -> str:
    """
    Agrega todos os dados do atleta em um bloco de texto estruturado
    para injetar no system prompt da IA.

    Retorna string vazia se não houver dados disponíveis.
    """
    perfil = fetch_athlete_profile(atleta_id)
    sessoes = fetch_training_sessions(atleta_id)
    hidratacao = fetch_hydration_records(atleta_id)

    if not perfil and not sessoes and not hidratacao:
        return ""

    blocos = []

    # --- Perfil do Atleta ---
    if perfil:
        idade = _calcular_idade(perfil.get("dataNascimento", ""))
        idade_str = f"{idade} anos" if idade else "N/A"

        bloco_perfil = (
            "PERFIL DO ATLETA:\n"
            f"- Nome: {perfil.get('nome', 'N/A')}\n"
            f"- Idade: {idade_str}\n"
            f"- Peso atual: {perfil.get('pesoAtual', 'N/A')} kg\n"
            f"- Altura: {perfil.get('altura', 'N/A')} m\n"
            f"- Modalidade: {perfil.get('modalidade', 'N/A')}\n"
            f"- Clube: {perfil.get('clube', {}).get('nome', 'N/A') if perfil.get('clube') else 'N/A'}"
        )
        blocos.append(bloco_perfil)

    # --- Sessões de Treino ---
    if sessoes:
        linhas_sessoes = ["HISTORICO DE TREINOS (ultimas sessoes):"]
        for i, s in enumerate(sessoes, 1):
            status = s.get("statusHidratacao", "N/A")
            linhas_sessoes.append(
                f"\n  Sessao {i}:\n"
                f"  - Data: {_formatar_data(s.get('dataHoraInicio'))}\n"
                f"  - Modalidade: {s.get('modalidade', 'N/A')}\n"
                f"  - Duracao: {_formatar_duracao(s.get('duracaoSegundos'))}\n"
                f"  - Peso pre-treino: {s.get('pesoPre', 'N/A')} kg\n"
                f"  - Peso pos-treino: {s.get('pesoPos', 'N/A')} kg\n"
                f"  - Taxa de sudorese: {s.get('taxaSudorese', 'N/A')} L/h\n"
                f"  - Balanco hidrico: {s.get('balancoHidrico', 'N/A')} kg\n"
                f"  - Hidratacao durante treino: {s.get('hidratacaoMl', 'N/A')} ml\n"
                f"  - Status de hidratacao: {status}"
            )
        blocos.append("\n".join(linhas_sessoes))

    # --- Registros de Hidratação ---
    if hidratacao:
        linhas_hidratacao = ["REGISTROS DE HIDRATACAO RECENTES:"]
        for r in hidratacao:
            linhas_hidratacao.append(
                f"  - {_formatar_data(r.get('dataHora'))}: "
                f"{r.get('volume', 'N/A')} ml de {r.get('tipoFluido', 'N/A')}"
            )
        blocos.append("\n".join(linhas_hidratacao))

    if not blocos:
        return ""

    return (
        "\n\n---\n"
        "DADOS REAIS DO ATLETA LOGADO (coletados pelo sistema HydraSense):\n\n"
        + "\n\n".join(blocos)
        + "\n---"
    )
