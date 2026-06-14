import { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Phone, Users, Save, Pencil, Check } from 'lucide-react';

import  { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

interface SideBarPagePerfilProps {
    aberto: boolean;
    onFechar: () => void;
}

export function SideBarPagePerfil({ aberto, onFechar }: SideBarPagePerfilProps) {

    const { user, setUser } = useUser();
    const { success, error } = useToast();
    console.log(JSON.stringify(user, null, 2));
    
    // Estado dos campos editáveis
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cargo, setCargo] = useState('');
    const [sexo, setSexo] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [carregando, setCarregando] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNome(user.nome || '');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEmail(user.email || '');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTelefone(user.telefone || '');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCargo(user.cargo || '');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSexo(user.sexo || '');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFotoPerfil(user.fotoPerfil || '');
        }
    }, [user]);

    // Controle de qual campo está em modo de edição (null = nenhum)
    const [editando, setEditando] = useState<string | null>(null);

    const confirmarEdicao = () => setEditando(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') confirmarEdicao();
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setFotoPerfil(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSalvar = async () => {
        if (!user || !user.id) {
            error("Erro", "Usuário não autenticado.");
            return;
        }

        setCarregando(true);
        try {
            const response = await fetch(`http://localhost:8080/profissionais/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...user,
                    nome,
                    email,
                    telefone,
                    sexo,
                    cargo,
                    especialidade: cargo,
                    fotoPerfil
                })
            });

            if (!response.ok) {
                const msg = await response.text();
                error("Erro ao Salvar", msg || "Não foi possível atualizar o perfil.");
                setCarregando(false);
                return;
            }

            const usuarioAtualizado = await response.json();
            setUser(usuarioAtualizado);
            success("Sucesso", "Parâmetros de perfil salvos com sucesso.");
            
        } catch (err) {
            console.error(err);
            error("Erro de Conexão", "Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
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
                        <div className="perfil-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {fotoPerfil ? (
                                <img src={fotoPerfil} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={28} />
                            )}
                        </div>
                        <button className="perfil-avatar-edit" title="Alterar Foto" onClick={handleAvatarClick}>
                            <Pencil size={10} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
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

                    {/* Sexo Biológico */}
                    <div className="perfil-campo">
                        <p className="perfil-campo-label">
                            <User size={12} /> Sexo Biológico
                        </p>
                        {editando === 'sexo' ? (
                            <div className="perfil-edit-row">
                                <select 
                                    className="perfil-edit-input"
                                    value={sexo} 
                                    onChange={(e) => setSexo(e.target.value)}
                                >
                                    <option value="" disabled>Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                                <button className="perfil-edit-confirm" onClick={confirmarEdicao} title="Confirmar">
                                    <Check size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-display-row">
                                <p className="perfil-campo-valor">{sexo || 'Não informado'}</p>
                                <button className="perfil-edit-btn" onClick={() => setEditando('sexo')} title="Editar Sexo">
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
                    <button className="btn-primary" onClick={handleSalvar} disabled={carregando}>
                        {carregando ? 'Salvando...' : <><Save size={16} /> Salvar Parâmetros</>}
                    </button>
                </div>

            </aside>
        </>
    );
}