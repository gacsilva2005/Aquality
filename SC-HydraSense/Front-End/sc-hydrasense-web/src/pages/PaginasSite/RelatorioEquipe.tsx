import { Download, Filter, Thermometer, Droplets, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RelatorioEquipe() {
    const navigate = useNavigate();

    const handleExportarPdf = async () => {
        try {
            // ID 1 mockado para a prova de conceito ponta a ponta
            const sessaoId = 1;
            const response = await fetch(`http://localhost:8080/api/relatorios/sessao/${sessaoId}/pdf`);
            
            if (!response.ok) {
                throw new Error("Erro ao gerar PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio-hydroperform-${sessaoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Erro no download:", error);
            alert("Erro ao exportar o relatório PDF. Verifique se o backend está rodando.");
        }
    };

    return (
        <div className="relatorio-container">
            {/* Breadcrumb e Cabeçalho */}
            <div style={{ marginBottom: '16px' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Voltar para Equipes
                </button>
            </div>
            <div className="relatorio-header">
                <div className="relatorio-title-wrapper">
                    <div>
                        <h1 className="relatorio-title">
                            RELATÓRIO DETALHADO:
                        </h1>
                        <h1 className="relatorio-subtitle">
                            FUTEBOL MASCULINO A
                        </h1>
                    </div>
                    <button onClick={handleExportarPdf} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '12px 24px' }}>
                        <Download size={18} /> EXPORTAR RELATÓRIO
                    </button>
                </div>
            </div>

            {/* Barra de Filtros */}
            <div className="relatorio-filtros">
                <div className="relatorio-filtros-left">
                    <div className="relatorio-filtro-label">
                        <Filter size={18} />
                        <span>FILTROS:</span>
                    </div>
                    
                    <div className="relatorio-filtro-item">
                        <span className="relatorio-filtro-item-label">TIPO:</span>
                        <select className="relatorio-filtro-select">
                            <option>Todos</option>
                        </select>
                    </div>
                    
                    <div className="relatorio-filtro-item">
                        <span className="relatorio-filtro-item-label">DURAÇÃO:</span>
                        <select className="relatorio-filtro-select">
                            <option>Microciclo (7 dias)</option>
                        </select>
                    </div>
                </div>

                <div className="relatorio-filtros-right">
                    <div className="relatorio-filtro-info">
                        <Thermometer size={18} /> Temp: 28°C
                    </div>
                    <div className="relatorio-filtro-info">
                        <Droplets size={18} /> Umidade: 65%
                    </div>
                </div>
            </div>

            {/* Painel Longitudinal */}
            <h3 className="relatorio-section-title">PAINEL LONGITUDINAL</h3>
            <div className="relatorio-painel">
                
                <div className="relatorio-chart-wrapper">
                    <div className="relatorio-chart-y-axis relatorio-chart-y-top">+1.5 L/h</div>
                    <div className="relatorio-chart-y-axis relatorio-chart-y-mid">Baseline</div>
                    <div className="relatorio-chart-y-axis relatorio-chart-y-bottom">-1.5 L/h</div>
                    
                    <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="relatorio-chart-svg" height="100%">
                        <line x1="0" y1="100" x2="800" y2="100" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="6,6" />
                        <path d="M 0 100 C 60 100, 80 140, 130 140 C 200 140, 220 30, 300 30 C 380 30, 400 200, 450 200 C 500 200, 550 20, 600 20 M 700 20 L 730 130" fill="none" stroke="var(--hydro-action)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    
                    <div className="relatorio-chart-x-axis">
                        {[
                            {day: 'Seg', dot: 'var(--hydro-action)'},
                            {day: 'Ter', dot: '#E5E7EB'},
                            {day: 'Qua', dot: '#8B4513'},
                            {day: 'Qui', dot: 'var(--hydro-action)'},
                            {day: 'Sex', dot: 'var(--hydro-success)'},
                            {day: 'Sáb', dot: '#E5E7EB'},
                            {day: 'Dom', dot: 'var(--hydro-action)'}
                        ].map((item, i) => (
                            <div key={i} className="relatorio-chart-x-item">
                                <div className="relatorio-chart-dot" style={{ backgroundColor: item.dot }}></div>
                                <span className="relatorio-chart-x-label">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relatorio-painel-footer">
                    <div>
                        <h4 className="relatorio-painel-title">Comportamento Hídrico Médio</h4>
                        <p className="relatorio-painel-desc">Taxa de Suor vs Baseline (7 dias)</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="relatorio-painel-valor">1.2 <span>L/h</span></div>
                        <div className="relatorio-painel-meta">MÉDIA DA EQUIPE</div>
                    </div>
                </div>
            </div>

            {/* Tabela de Atletas */}
            <h3 className="relatorio-section-title">ATLETAS (24)</h3>
            <div className="atletas-tabela-container relatorio-tabela-container">
                <table className="atletas-table">
                    <thead className="relatorio-table-header" style={{ backgroundColor: '#F8F9FA' }}>
                        <tr>
                            <th>ATLETA</th>
                            <th>ÚLTIMA TAXA DE SUOR (L/H)</th>
                            <th>% VARIAÇÃO DE MASSA</th>
                            <th>STATUS</th>
                            <th>AÇÃO</th>
                        </tr>
                    </thead>
                    <tbody className="relatorio-table-body">
                        <tr>
                            <td className="td-atleta relatorio-td-atleta">
                                <div className="relatorio-atleta-number">10</div>
                                <span className="atleta-nome">João Silva</span>
                            </td>
                            <td className="relatorio-td-suor">1.4</td>
                            <td className="relatorio-td-variacao-critica">-2.1%</td>
                            <td>
                                <div className="td-status critico">
                                    <span className="status-text">CRÍTICO</span>
                                </div>
                            </td>
                            <td className="relatorio-td-action">
                                <ChevronRight size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className="td-atleta relatorio-td-atleta">
                                <div className="relatorio-atleta-number">07</div>
                                <span className="atleta-nome">Carlos Mendes</span>
                            </td>
                            <td className="relatorio-td-suor">1.1</td>
                            <td className="relatorio-td-variacao-moderada">-1.2%</td>
                            <td>
                                <div className="td-status moderado">
                                    <span className="status-text" style={{ color: '#c9601d' }}>ATENÇÃO</span>
                                </div>
                            </td>
                            <td className="relatorio-td-action">
                                <ChevronRight size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className="td-atleta relatorio-td-atleta" style={{ borderBottom: 'none' }}>
                                <div className="relatorio-atleta-number">04</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="atleta-nome">Lucas Pereira</span>
                                </div>
                            </td>
                            <td className="relatorio-td-suor" style={{ borderBottom: 'none' }}>0.9</td>
                            <td className="relatorio-td-variacao-estavel" style={{ borderBottom: 'none' }}>-0.5%</td>
                            <td style={{ borderBottom: 'none' }}>
                                <div className="td-status estavel">
                                    <span className="status-text" style={{ color: 'var(--hydro-success)' }}>IDEAL</span>
                                </div>
                            </td>
                            <td className="relatorio-td-action" style={{ borderBottom: 'none' }}>
                                <ChevronRight size={18} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}