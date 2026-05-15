import { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Mail, Shield, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface NovoAtletaProps {
    onBack: () => void;
}

export function NovoAtleta({ onBack }: NovoAtletaProps) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        codigoEquipe: ''
    });

    const [carregando, setCarregando] = useState(false);

    const { success, error } = useToast();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);

        try {
            const response = await fetch("http://localhost:8080/Atleta/convite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    codigoEquipe: formData.codigoEquipe
                })
            });

            if (!response.ok) {
                const erro = await response.text();
                console.log(erro);
                error('Erro de Validação', 'O código de equipe inserido não existe ou não pertence a você.');
                setCarregando(false);
                return;
            }

            success('Convite Enviado', 'Atleta vinculado! Um e-mail de convite foi enviado com as instruções.');

            // Aguarda o toast de sucesso aparecer antes de voltar
            setTimeout(() => {
                onBack();
            }, 2000);

        } catch (err) {
            console.error(err);
            error('Erro de Conexão', 'Não foi possível conectar ao servidor.');
            setCarregando(false);
        }
    };

    return (
        <div className="novo-atleta-wrapper">

            {/* === CABEÇALHO DO FORMULÁRIO === */}
            <div className="atletas-header">
                <div className="atletas-header__info">
                    <button className="btn-ghost-back" onClick={onBack} style={{ marginBottom: '16px' }}>
                        <ArrowLeft size={16} /> Voltar para a listagem
                    </button>
                    <h1 className="pageweb__title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '38px', color: 'var(--hydro-text-primary)', letterSpacing: '-0.5px' }}>
                        CADASTRAR NOVO ATLETA
                    </h1>
                    <p style={{ color: 'var(--hydro-text-muted)', fontSize: '16px' }}>Preencha os dados básicos abaixo para iniciar o vínculo do atleta com sua equipe.</p>
                </div>
            </div>

            <form className="novo-atleta-form" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--hydro-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }} onSubmit={handleSubmit}>
                <div className="form-grid" style={{ marginBottom: '40px' }}>

                    {/* Nome Completo */}
                    <div className="filtro-grupo" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '12px', color: 'var(--hydro-action)', fontWeight: 700, letterSpacing: '0.5px' }}>NOME COMPLETO</label>
                        <div className="input-wrapper" style={{ height: '48px', backgroundColor: '#F8F9FA' }}>
                            <User size={18} className="icone-busca" />
                            <input
                                type="text"
                                name="nome"
                                placeholder="Ex: Carlos Silva"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* E-mail */}
                    <div className="filtro-grupo">
                        <label style={{ fontSize: '12px', color: 'var(--hydro-action)', fontWeight: 700, letterSpacing: '0.5px' }}>E-MAIL DO ATLETA</label>
                        <div className="input-wrapper" style={{ height: '48px', backgroundColor: '#F8F9FA' }}>
                            <Mail size={18} className="icone-busca" />
                            <input
                                type="email"
                                name="email"
                                placeholder="atleta@time.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Código da Equipe */}
                    <div className="filtro-grupo">
                        <label style={{ fontSize: '12px', color: 'var(--hydro-action)', fontWeight: 700, letterSpacing: '0.5px' }}>CÓDIGO DA EQUIPE</label>
                        <div className="input-wrapper" style={{ height: '48px', backgroundColor: '#F8F9FA' }}>
                            <Shield size={18} className="icone-busca" />
                            <input
                                type="text"
                                name="codigoEquipe"
                                placeholder="Ex: FUT-MASC-A"
                                value={formData.codigoEquipe}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                </div>

                <div className="form-actions" style={{ paddingTop: '32px', borderTop: '1px solid var(--hydro-border)' }}>
                    <button type="button" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }} onClick={onBack} disabled={carregando}>
                        CANCELAR
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', opacity: carregando ? 0.7 : 1, cursor: carregando ? 'not-allowed' : 'pointer' }} disabled={carregando}>
                        {carregando ? (
                            <>Aguarde...</>
                        ) : (
                            <><Save size={18} /> ENVIAR CONVITE</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}