import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './recovery.css';

export function Recovery() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const { success } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        success('Código Enviado', 'Verifique sua caixa de entrada e spam.');
        navigate('/codigo');
    };

    return (
        <div className="recovery-page">
            <main className="recovery-main" style={{ position: 'relative' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '24px', left: '24px' }}>
                    <ArrowLeft size={16} /> Voltar
                </button>
                <div className="recovery-content">

                    <div className="recovery-logo">
                        <Droplet size={28} fill="#111111" color="#111111" />
                        <span className="recovery-logo-text">HYDRASENSE</span>
                    </div>

                    <h1 className="recovery-title">
                        Insira seu e-mail para<br />
                        recuperar sua senha.
                    </h1>

                    <form className="recovery-form" onSubmit={handleSubmit}>

                        <input
                            type="email"
                            className="recovery-input"
                            placeholder="E-mail*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />

                        <p className="recovery-terms">
                            Ao continuar, enviaremos um código de verificação
                            para o e-mail cadastrado. Caso não tenha mais
                            acesso ao e-mail,{' '}

                            <span
                                className="recovery-link"
                                onClick={() => navigate('/recuperar-celular')}
                            >
                                clique aqui.
                            </span>
                        </p>

                        <div className="recovery-actions">
                            <button
                                type="submit"
                                className="recovery-btn-primary"
                            >
                                CONTINUAR
                            </button>
                        </div>

                    </form>

                </div>

            </main>
        </div>
    );
}