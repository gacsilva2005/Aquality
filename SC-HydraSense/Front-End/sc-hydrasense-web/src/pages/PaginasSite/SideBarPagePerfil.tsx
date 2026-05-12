import { X, User, Mail, Hash, Shield, Users, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SideBarPagePerfilProps {
    aberto: boolean;
    onFechar: () => void;
}

export function SideBarPagePerfil({ aberto, onFechar }: SideBarPagePerfilProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Pode limpar os dados salvos antes de sair, ex: localStorage.clear();
        navigate('/');
    };

    return (
        <>
            {/* Overlay escuro atrás do painel */}
            <div
                className={`perfil-overlay ${aberto ? 'aberto' : ''}`}
                onClick={onFechar}
            />

            {/* Painel lateral deslizante */}
            <aside className={`perfil-painel ${aberto ? 'aberto' : ''}`}>

                {/* Cabeçalho */}
                <div className="perfil-painel-header">
                    <h2 className="perfil-painel-titulo">Configurações</h2>
                    <button className="perfil-btn-fechar" onClick={onFechar}>
                        <X size={20} />
                    </button>
                </div>

                {/* Card do Usuário */}
                <div className="perfil-usuario-card">
                    <div className="perfil-avatar">
                        <User size={28} />
                    </div>
                    <div className="perfil-usuario-info">
                        <h3 className="perfil-usuario-nome">ALEX MERCER</h3>
                        <p className="perfil-usuario-cargo">Treinador</p>
                    </div>
                </div>

                {/* Seção: Dados da Conta */}
                <section className="perfil-secao">
                    <h4 className="perfil-secao-titulo">Dados da Conta</h4>

                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Mail size={12} /> Endereço de E-mail
                        </p>
                        <p className="perfil-campo-valor">a.mercer@hydroperform.com</p>
                    </div>

                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Hash size={12} /> ID do Atleta
                        </p>
                        <p className="perfil-campo-valor">HP-492-BX</p>
                    </div>

                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Shield size={12} /> Código da Equipe
                        </p>
                        <p className="perfil-campo-valor">ALPHA-SQUAD-01</p>
                    </div>
                </section>

                {/* Seção: Função na Plataforma */}
                <section className="perfil-secao">
                    <h4 className="perfil-secao-titulo">Função na Plataforma</h4>

                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Users size={12} /> Cargo / Especialidade
                        </p>
                        <select defaultValue="treinador">
                            <option value="treinador">Treinador Principal</option>
                            <option value="medico">Médico Responsável</option>
                            <option value="nutricionista">Nutricionista Esportivo</option>
                            <option value="fisioterapeuta">Fisioterapeuta</option>
                            <option value="fisiologista">Fisiologista / Biomecânico</option>
                        </select>
                    </div>
                </section>

                {/* Botões de Ação */}
                <div className="perfil-acoes">
                    <button className="btn-primary">
                        <Save size={16} /> Salvar Parâmetros
                    </button>
                    <button className="btn-secondary" onClick={handleLogout}>
                        <LogOut size={16} /> Encerrar Sessão
                    </button>
                </div>

            </aside>
        </>
    );
}