import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import teamLogo from '../../assets/icone_petala.png';

export function Equipes() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomeEquipe, setNomeEquipe] = useState('');
    const [esporteRef, setEsporteRef] = useState('');
    const [codigoAcesso, setCodigoAcesso] = useState('gerar');
    const [codigoFranquia, setCodigoFranquia] = useState('');
    const [equipes, setEquipes] = useState<any[]>([]);

    const { user } = useUser();

    useEffect(() => {
      if (user?.clube?.id) {
        carregarEquipes();
      }
    }, [user]);

    const carregarEquipes = async () => {
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
    };

    const handleCriarEquipe = async () => {
        if (!nomeEquipe || !esporteRef) return;
        
        const novaEquipe = {
            id: Date.now(),
            nome: nomeEquipe.toUpperCase(),
            esporte: esporteRef,
            atletas: 0,
            aderencia: '0%',
            suorMedio: '0L/h'
        };
        
        await carregarEquipes();
        
        setNomeEquipe('');
        setEsporteRef('');
        setCodigoAcesso('gerar');
        setCodigoFranquia('');
        setIsModalOpen(false);
    };

    const isFormValid = nomeEquipe.trim() !== '' && esporteRef !== '';

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
                    <p className="equipes-kpi-titulo">ADERÊNCIA DA EQUIPE</p>
                    <h2 className="equipes-kpi-valor">
                        94<span>%</span>
                    </h2>
                </div>

                <div className="equipes-kpi-card borda-critica">
                    <p className="equipes-kpi-titulo">ALERTAS CRÍTICOS</p>
                    <h2 className="equipes-kpi-valor">03</h2>
                </div>

                <div className="equipes-kpi-card">
                    <p className="equipes-kpi-titulo">ATLETAS ATIVOS</p>
                    <h2 className="equipes-kpi-valor">42</h2>
                </div>

                <div className="equipes-kpi-card">
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

                                <p className="equipe-card-esporte">
                                    Esporte: {equipe.categoria}
                                </p>

                                <div className="equipe-card-stats">
                                    <div className="equipe-stat-item">
                                        <p>ATLETAS</p>
                                        <p>{equipe.atletas?.length || 0}</p>
                                    </div>

                                    <div className="equipe-stat-item">
                                        <p>LIMITE</p>
                                        <p>{equipe.limiteAtletas}</p>
                                    </div>

                                    <div className="equipe-stat-item">
                                        <p>CLUBE</p>
                                        <p>{equipe.clube?.nome || '-'}</p>
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
                            ATLETAS SELECIONADOS
                        </h3>
                        <span className="equipes-sidebar-tag">
                            FUT-MASC-A
                        </span>
                    </div>

                    <div className="equipes-sidebar-lista">

                        <div className="atleta-item">
                            <div className="atleta-item-avatar">
                                <img src={teamLogo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                            </div>
                            <div className="atleta-item-info">
                                <p className="atleta-item-nome">Silva, Carlos</p>
                                <p className="atleta-item-posicao">ATACANTE</p>
                            </div>
                            <div className="atleta-item-status">
                                <span className="badge-status ideal">IDEAL</span>
                                <span className="dot-status ideal"></span>
                            </div>
                        </div>

                        <div className="atleta-item">
                            <div className="atleta-item-avatar">
                                <img src={teamLogo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                            </div>
                            <div className="atleta-item-info">
                                <p className="atleta-item-nome">Santos, ...</p>
                                <p className="atleta-item-posicao">MEIO-CAMPO</p>
                            </div>
                            <div className="atleta-item-status">
                                <span className="badge-status alerta">ALERTA</span>
                                <span className="dot-status alerta"></span>
                            </div>
                        </div>

                        <div className="atleta-item critico">
                            <div className="atleta-item-avatar">
                                <img src={teamLogo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                            </div>
                            <div className="atleta-item-info">
                                <p className="atleta-item-nome">Oliveira, ...</p>
                                <p className="atleta-item-posicao">ZAGUEIRO</p>
                            </div>
                            <div className="atleta-item-status">
                                <span className="badge-status critico">CRÍTICO</span>
                                <span className="dot-status critico"></span>
                            </div>
                        </div>

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
                                <label>ESPORTE DE REFERÊNCIA</label>
                                <select 
                                    className={esporteRef === '' ? 'is-placeholder' : ''}
                                    value={esporteRef} 
                                    onChange={e => setEsporteRef(e.target.value)}
                                >
                                    <option value="" disabled>Selecione um esporte</option>
                                    <option value="Futebol de Campo">Futebol de Campo</option>
                                    <option value="Basquete">Basquete</option>
                                    <option value="Vôlei">Vôlei</option>
                                    <option value="Corrida">Corrida</option>
                                </select>
                            </div>
                            
                            <div className="modal-access-box">
                                <h3 className="modal-access-title">CÓDIGO DE ACESSO</h3>
                                <div className="modal-radio-group">
                                    <label className="modal-radio-label">
                                        <input 
                                            type="radio" 
                                            name="codigoAcesso" 
                                            value="gerar"
                                            checked={codigoAcesso === 'gerar'}
                                            onChange={() => setCodigoAcesso('gerar')}
                                        />
                                        Gerar Novo Código
                                    </label>
                                    <label className="modal-radio-label">
                                        <input 
                                            type="radio" 
                                            name="codigoAcesso" 
                                            value="existente"
                                            checked={codigoAcesso === 'existente'}
                                            onChange={() => setCodigoAcesso('existente')}
                                        />
                                        Inserir Código Existente
                                    </label>
                                </div>
                                
                                <div className="modal-validation-group">
                                    <label>CÓDIGO DA FRANQUIA/ORGANIZAÇÃO</label>
                                    <div className="modal-validation-input-row">
                                        <input 
                                            type="text" 
                                            placeholder="XYZ-9876" 
                                            value={codigoFranquia}
                                            onChange={e => setCodigoFranquia(e.target.value)}
                                        />
                                        <button className="modal-btn-validate">VALIDAR</button>
                                    </div>
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
                                CRIAR EQUIPE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}