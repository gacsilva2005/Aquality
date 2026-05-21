import { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Users, Save, Pencil, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  { useUser } from '../../context/UserContext';

interface SideBarPagePerfilProps {
    aberto: boolean;
    onFechar: () => void;
}

export function SideBarPagePerfil({ aberto, onFechar }: SideBarPagePerfilProps) {
    const navigate = useNavigate();

    // Estado dos campos editáveis
    const [nome, setNome] = useState(user?.nome || '');
    const [email, setEmail] = useState(user?.email || '');
    const [telefone, setTelefone] = useState(user?.telefone || '');
    const [idade, setIdade] = useState(user?.idade?.toString() || '');
    const [cargo, setCargo] = useState(user?.cargo || '');

    // Controle de qual campo está em modo de edição (null = nenhum)
    const [editando, setEditando] = useState<string | null>(null);

    const confirmarEdicao = () => setEditando(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') confirmarEdicao();
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
                    <div className="perfil-avatar-wrapper">
                        <div className="perfil-avatar">
                            <User size={28} />
                        </div>
                        <button className="perfil-avatar-edit" title="Alterar Foto">
                            <Pencil size={10} />
                        </button>
                    </div>
                    <div className="perfil-usuario-info">
                        {editando === 'nome' ? (
                            <div className="perfil-edit-row">
                                <input
                                    className="perfil-edit-input perfil-edit-input-nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                                <button className="perfil-edit-confirm" onClick={confirmarEdicao} title="Confirmar">
                                    <Check size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-display-row">
                                <h3 className="perfil-usuario-nome">{nome}</h3>
                                <button className="perfil-edit-btn" onClick={() => setEditando('nome')} title="Editar Nome">
                                    <Pencil size={14} />
                                </button>
                            </div>
                        )}
                        <p className="perfil-usuario-cargo">
                            {cargo === 'treinador' ? 'Treinador' :
                             cargo === 'medico' ? 'Médico' :
                             cargo === 'nutricionista' ? 'Nutricionista' :
                             cargo === 'fisioterapeuta' ? 'Fisioterapeuta' :
                             'Fisiologista'}
                        </p>
                    </div>
                </div>

                {/* Seção: Dados da Conta */}
                <section className="perfil-secao">
                    <h4 className="perfil-secao-titulo">Dados da Conta</h4>

                    {/* E-mail */}
                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Mail size={12} /> Endereço de E-mail
                        </p>
                        {editando === 'email' ? (
                            <div className="perfil-edit-row">
                                <input
                                    className="perfil-edit-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                                <button className="perfil-edit-confirm" onClick={confirmarEdicao} title="Confirmar">
                                    <Check size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-display-row">
                                <p className="perfil-campo-valor">{email}</p>
                                <button className="perfil-edit-btn" onClick={() => setEditando('email')} title="Editar E-mail">
                                    <Pencil size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Telefone */}
                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Phone size={12} /> Telefone
                        </p>
                        {editando === 'telefone' ? (
                            <div className="perfil-edit-row">
                                <input
                                    className="perfil-edit-input"
                                    type="tel"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                                <button className="perfil-edit-confirm" onClick={confirmarEdicao} title="Confirmar">
                                    <Check size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-display-row">
                                <p className="perfil-campo-valor">{telefone}</p>
                                <button className="perfil-edit-btn" onClick={() => setEditando('telefone')} title="Editar Telefone">
                                    <Pencil size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Seção: Função na Plataforma */}
                <section className="perfil-secao">
                    <h4 className="perfil-secao-titulo">Função na Plataforma</h4>

                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <Users size={12} /> Cargo / Especialidade
                        </p>
                        <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
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
                </div>

            </aside>
        </>
    );
}