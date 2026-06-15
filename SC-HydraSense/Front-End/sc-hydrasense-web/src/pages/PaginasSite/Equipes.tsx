import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import teamLogo from '../../assets/icone_petala.png';

export function Equipes() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomeEquipe, setNomeEquipe] = useState('');
    const [esporteRef, setEsporteRef] = useState('');
    const [limiteAtletas, setLimiteAtletas] = useState('');
    const [atletasIds, setAtletasIds] = useState<number[]>([]);
    const [atletas, setAtletas] = useState<any[]>([]);
    const [equipes, setEquipes] = useState<any[]>([]);

    const { user } = useUser();

    const carregarAtletas = useCallback(async () => {
      try {
        const clubeId = user?.clube?.id;
        const response = await fetch(`http://localhost:8080/Atleta/clube/${clubeId}`);
        const data = await response.json();
        setAtletas(data);
      } catch (error) {
        console.error('Erro ao carregar atletas:', error);
      }
    }, [user?.clube?.id]);

    const carregarEquipes = useCallback(async () => {
      try {
        const clubeId = user?.clube?.id;

        const response = await fetch(
          `http://localhost:8080/Equipe/clube/${clubeId}`
        );

        const data = await response.json();
        setEquipes(data);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
      }
    }, [user?.clube?.id]);

    useEffect(() => {
      if (user?.clube?.id) {
        carregarEquipes();
        carregarAtletas();
      }
    }, [user?.clube?.id, carregarEquipes, carregarAtletas]);

    const handleCriarEquipe = async () => {
        if (!nomeEquipe || !esporteRef || !limiteAtletas) return;

        try {
            const clubeId = user?.clube?.id;
            const payload = {
                nome: nomeEquipe.toUpperCase(),
                categoria: esporteRef,
                limiteAtletas: parseInt(limiteAtletas, 10),
                clubeId: clubeId,
                atletasIds: atletasIds
            };

            const response = await fetch(`http://localhost:8080/Equipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await carregarEquipes();
                setNomeEquipe('');
                setEsporteRef('');
                setLimiteAtletas('');
                setAtletasIds([]);
                setIsModalOpen(false);
            } else {
                console.error("Erro ao criar equipe");
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const isFormValid = nomeEquipe.trim() !== '' && esporteRef !== '' && limiteAtletas !== '';

    return (
        <>
            {/* === CABEÇALHO === */}
            <header className="atletas-header" style={{ alignItems: 'center' }}>
                <div className="atletas-header__info">
                    <h1 style={{ color: 'var(--hydro-text-primary)' }}>EQUIPES PRINCIPAIS</h1>
                    <p className="equipes-header-subtitle">
                        Visão geral de performance e aderência biométrica.
                    </p>
                </div>
                <button className="btn-primary equipes-btn-add" onClick={() => setIsModalOpen(true)}>
                    ADICIONAR EQUIPE
                </button>
            </header>
            {/* === CARTÕES DE RESUMO GERAL === */}
            <section className="equipes-kpi-container">
                <div className="equipes-kpi-card borda-critica">
                    <p className="equipes-kpi-titulo">EQUIPES CADASTRADAS</p>
                    <h2 className="equipes-kpi-valor">{equipes.length}</h2>
                </div>

                <div className="equipes-kpi-card borda-critica">
                    <p className="equipes-kpi-titulo">ATLETAS ATIVOS</p>
                    <h2 className="equipes-kpi-valor">{atletas.length}</h2>
                </div>

                <div className="equipes-kpi-card borda-critica">
                    <p className="equipes-kpi-titulo">ADERÊNCIA DO CLUBE</p>
                    <h2 className="equipes-kpi-valor">
                        94<span>%</span>
                    </h2>
                </div>

                <div className="equipes-kpi-card borda-critica">
                    <p className="equipes-kpi-titulo">TAXA DE SUOR MÉDIA</p>
                    <h2 className="equipes-kpi-valor">
                        1.2<span className="unidade">L/h</span>
                    </h2>
                </div>
            </section>

            {/* === ÁREA DE CONTEÚDO (DUAS COLUNAS) === */}
            <div className="equipes-layout-principal">

                {/* === ROSTER DE EQUIPES === */}
                <section>
                    <h3 className="equipes-roster-titulo">
                        ROSTER DE EQUIPES
                    </h3>

                    <div className="equipes-roster-grid">
                        {equipes.map((equipe) => (
                            <div
                                key={equipe.id}
                                className="equipe-card"
                                onClick={() =>
                                    navigate(`/PageWeb/equipes/relatorio/${equipe.id}`)
                                }
                            >
                                <div className="equipe-card-status-dot"></div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <img
                                        src={teamLogo}
                                        alt="Logo Equipe"
                                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                    />

                                    <h4 className="equipe-card-nome" style={{ margin: 0 }}>
                                        {equipe.nome}
                                    </h4>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <p className="equipe-card-esporte" style={{ marginBottom: '4px' }}>
                                        Esporte: {equipe.categoria}
                                    </p>
                                    <p className="equipe-card-esporte" style={{ margin: 0 }}>
                                        Clube: {equipe.clube?.nome || '-'}
                                    </p>
                                </div>

                                <div className="equipe-card-stats">
                                    <div className="equipe-stat-item">
                                        <p>ATLETAS</p>
                                        <p>{equipe.atletas?.length || 0}/{equipe.limiteAtletas || 30}</p>
                                    </div>

                                    <div className="equipe-stat-item">
                                        <p>ADERÊNCIA</p>
                                        <p className={Math.round((equipe.adherence || 0) * 100) < 50 ? "critico" : ""}>
                                            {Math.round((equipe.adherence || 0) * 100)}%
                                        </p>
                                    </div>

                                    <div className="equipe-stat-item">
                                        <p>SUOR MÉDIO</p>
                                        <p>{(equipe.sweatRate || 0).toFixed(1)}L/h</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === BARRA LATERAL DE ATLETAS === */}
                <aside className="equipes-sidebar">
                    <div className="equipes-sidebar-header">
                        <h3 className="equipes-sidebar-titulo">
                            ATLETAS DO CLUBE
                        </h3>
                        <span className="equipes-sidebar-tag">
                            VISÃO GERAL
                        </span>
                    </div>

                    <div className="equipes-sidebar-lista">
                        {atletas.length > 0 ? (
                            atletas.slice(0, 10).map((atleta) => {
                                // Separa o primeiro e último nome para o formato "Sobrenome, Nome"
                                const partesNome = atleta.nome.split(' ');
                                const nomeFormatado = partesNome.length > 1 
                                    ? `${partesNome[partesNome.length - 1]}, ${partesNome[0]}`
                                    : atleta.nome;

                                let modalidadesStr = 'ATLETA';
                                if (atleta.modalidade && atleta.modalidade !== '[]') {
                                    try {
                                        const parsed = JSON.parse(atleta.modalidade);
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                            modalidadesStr = parsed.join(', ');
                                        }
                                    } catch (e) {
                                        modalidadesStr = atleta.modalidade;
                                    }
                                }

                                return (
                                    <div key={atleta.id} className="atleta-item">
                                        <div className="atleta-item-avatar">
                                            <img src={teamLogo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                        </div>
                                        <div className="atleta-item-info">
                                            <p className="atleta-item-nome" style={{ textTransform: 'capitalize' }}>
                                                {nomeFormatado.toLowerCase()}
                                            </p>
                                            <p className="atleta-item-posicao">{modalidadesStr}</p>
                                        </div>
                                        <div className="atleta-item-status">
                                            <span className="badge-status ideal">IDEAL</span>
                                            <span className="dot-status ideal"></span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ fontSize: '14px', color: '#666', padding: '16px', textAlign: 'center' }}>
                                Nenhum atleta cadastrado.
                            </p>
                        )}
                    </div>
                </aside>
            </div>

            {/* MODAL ADICIONAR EQUIPE */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>ADICIONAR EQUIPE</h2>
                            <p>Configure os parâmetros do novo grupo de atletas.</p>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-field">
                                <label>NOME DA EQUIPE</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Seleção Principal" 
                                    value={nomeEquipe}
                                    onChange={e => setNomeEquipe(e.target.value)}
                                />
                            </div>
                            
                            <div className="modal-field">
                                <label>CATEGORIA DO ESPORTE</label>
                                <div className="modal-chips-container">
                                    {['Futebol', 'Natação', 'Corrida', 'Musculação', 'Ciclismo'].map(esp => (
                                        <button 
                                            key={esp} 
                                            className={`chip-btn ${esporteRef === esp ? 'active' : ''}`}
                                            onClick={() => setEsporteRef(esp)}
                                            type="button"
                                        >
                                            {esp}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="modal-field">
                                <label>MÁXIMO DE ATLETAS</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 30" 
                                    value={limiteAtletas}
                                    onChange={e => setLimiteAtletas(e.target.value)}
                                    min="1"
                                />
                            </div>

                            <div className="modal-field">
                                <label>VINCULAR ATLETAS</label>
                                <div className="modal-atletas-list">
                                    {atletas.map(atleta => (
                                        <label key={atleta.id} className="atleta-checkbox">
                                            <input 
                                                type="checkbox" 
                                                checked={atletasIds.includes(atleta.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAtletasIds([...atletasIds, atleta.id]);
                                                    } else {
                                                        setAtletasIds(atletasIds.filter(id => id !== atleta.id));
                                                    }
                                                }}
                                            />
                                            {atleta.nome}
                                        </label>
                                    ))}
                                    {atletas.length === 0 && (
                                        <p style={{ fontSize: '13px', color: '#6c757d', margin: 0, padding: '4px' }}>
                                            Nenhum atleta encontrado neste clube.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>
                                CANCELAR
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleCriarEquipe}
                                disabled={!isFormValid}
                                style={{ padding: '12px 20px', fontSize: '12px' }}
                            >
                                SALVAR EQUIPE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}