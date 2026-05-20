import { useEffect, useState } from 'react';
import { NovoAtleta } from './NovoAtleta';

export function Atletas() {
    const [verFormulario, setVerFormulario] = useState(false);

    const handleNovoAtleta = () => {
        setVerFormulario(true);
    };

    if (verFormulario) {
        return <NovoAtleta onBack={() => setVerFormulario(false)} />;
    }

    return (
        <>
            <div className="atletas-header">
                <div className="atletas-header__info">
                    <h1 className="pageweb__title">NOSSOS ATLETAS</h1>
                    <p>
                        Monitoramento ativo da hidratação para acompanhamento do desempenho de atletas de elite.
                        Dados atualizados a cada 15 minutos.
                    </p>
                </div>
                <button className="btn-primary btn-header-novo-atleta" onClick={handleNovoAtleta}>+ NOVO ATLETA</button>
            </div>

            <section className="filtros-container">
                <div className="filtro-grupo filtro-busca">
                    <label>Pesquisar</label>
                    <div className="input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-busca">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Código ou nome do atleta..." />
                    </div>
                </div>

                <div className="filtro-grupo">
                    <label>Time</label>
                    <select defaultValue="Todos os times">
                        <option value="Todos os times">Todos os times</option>
                        <option value="SPFC">São Paulo FC</option>
                        <option value="PAL">Palmeiras</option>
                        <option value="COR">Corinthians</option>
                        <option value="SAN">Santos</option>
                        <option value="RBB">Red Bull Bragantino</option>
                        <option value="BOT">Botafogo</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Status</label>
                    <select defaultValue="Todos os status">
                        <option value="Todos os status">Todos os status</option>
                        <option value="Critico">Crítico</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Estavel">Estável</option>
                        <option value="Baixo">Baixo</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Modalidade</label>
                    <select defaultValue="Todas as modalidades">
                        <option value="Todas as modalidades">Todas as modalidades</option>
                        <option value="Futebol">Futebol</option>
                        <option value="Basquete">Basquete</option>
                        <option value="Volei">Vôlei</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Última sessão</label>
                    <select defaultValue="Qualquer momento">
                        <option value="Qualquer momento">Qualquer momento</option>
                        <option value="Hoje">Hoje</option>
                        <option value="Ontem">Ontem</option>
                        <option value="Esta semana">Esta semana</option>
                        <option value="Este mês">Este mês</option>
                    </select>
                </div>
            </section>

            <section className="atletas-tabela-container">
                <table className="atletas-table">
                    <thead>
                        <tr>
                            <th>Atleta</th>
                            <th>Time</th>
                            <th>Perda média de massa</th>
                            <th>Taxa de transpiração (l/h)</th>
                            <th>Status</th>
                            <th>Adesão</th>
                            <th>Última sessão</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="td-atleta">
                                    <div className="avatar-placeholder" />
                                    <div className="atleta-info">
                                        <span className="atleta-nome">Carlos Silva</span>
                                        <span className="atleta-id">#10</span>
                                    </div>
                                </div>
                            </td>
                            <td>São Paulo FC</td>
                            <td>1.8%</td>
                            <td>1.5 L/h</td>
                            <td>
                                <div className="td-status moderado">
                                    <span className="status-dot"></span>
                                    <span className="status-text">MODERADO</span>
                                </div>
                            </td>
                            <td>95%</td>
                            <td>15 Jun, 2024</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </>
    );
}