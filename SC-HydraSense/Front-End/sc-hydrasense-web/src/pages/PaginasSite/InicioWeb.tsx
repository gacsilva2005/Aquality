import { useState } from 'react';
import { Copy, CheckCircle2, Users, Activity, FileBarChart, Droplet } from 'lucide-react';

export function InicioWeb() {
    // Estado para o mock do usuário e do código da equipe
    const nomeProfissional = localStorage.getItem("nomeProfissional") || "Profissional";
    const codigoEquipe = "ALPHA-SQUAD-01";
    
    const [copiado, setCopiado] = useState(false);

    const handleCopiarCodigo = () => {
        navigator.clipboard.writeText(codigoEquipe);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    return (
        <div className="onboarding-container">
            {/* === CABEÇALHO DE BOAS-VINDAS === */}
            <header className="onboarding-header">
                <h1 className="onboarding-title">
                    Bem-vindo ao Hydrasense, <span>{nomeProfissional}</span>!
                </h1>
                <p className="onboarding-subtitle">
                    Seu centro de comando para monitoramento avançado de hidratação e performance esportiva.
                </p>
            </header>

            {/* === CARD DE CÓDIGO DA EQUIPE (DESTAQUE) === */}
            <section className="onboarding-invite-card">
                <div className="invite-card-info">
                    <h2>Seu Código de Convite Exclusivo 📋</h2>
                    <p>
                        Compartilhe este código com seus atletas para que eles possam se vincular à sua equipe no aplicativo móvel.
                    </p>
                </div>
                
                <div className="invite-code-wrapper">
                    <div className="invite-code-content">
                        <span className="invite-code-label">Código da Equipe</span>
                        <span className="invite-code-value">{codigoEquipe}</span>
                    </div>
                    <button 
                        className={`btn-copy-code ${copiado ? 'copied' : ''}`}
                        onClick={handleCopiarCodigo}
                    >
                        {copiado ? <><CheckCircle2 size={18} /> COPIADO</> : <><Copy size={18} /> COPIAR</>}
                    </button>
                </div>
            </section>

            {/* === ONBOARDING: O QUE VOCÊ PODE FAZER === */}
            <section className="onboarding-features">
                <h3 className="features-title">
                    O que você pode fazer por aqui?
                </h3>
                
                <div className="onboarding-grid">
                    
                    {/* Feature 1 */}
                    <div className="onboarding-card">
                        <div className="feature-icon droplet">
                            <Droplet size={24} />
                        </div>
                        <h4>Monitoramento Preciso</h4>
                        <p>
                            Acompanhe a taxa de sudorese, perda de sódio e necessidades de reposição hídrica de cada atleta em tempo real através do nosso Dashboard interativo.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="onboarding-card">
                        <div className="feature-icon users">
                            <Users size={24} />
                        </div>
                        <h4>Gestão de Equipes</h4>
                        <p>
                            Organize seus atletas em equipes, facilite a visualização de métricas por grupos e mantenha todo o elenco alinhado com suas estratégias de saúde.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="onboarding-card">
                        <div className="feature-icon chart">
                            <FileBarChart size={24} />
                        </div>
                        <h4>Relatórios Detalhados</h4>
                        <p>
                            Gere e exporte relatórios consolidados sobre a performance da sua equipe ao longo de torneios e períodos intensos de treinamento.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="onboarding-card">
                        <div className="feature-icon activity">
                            <Activity size={24} />
                        </div>
                        <h4>Prevenção de Lesões</h4>
                        <p>
                            Utilize os alertas do sistema para identificar riscos de desidratação crítica antes que elas impactem a saúde musculoesquelética do atleta.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
}
