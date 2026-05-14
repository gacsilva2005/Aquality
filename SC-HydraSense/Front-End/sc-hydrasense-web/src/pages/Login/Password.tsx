import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './password.css';

export function Password() {

    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordsMatch =
        password &&
        confirmPassword &&
        password === confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        navigate('/confirmacao');
    };

    return (
        <div className="password-page">
            <main className="password-main" style={{ position: 'relative' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '24px', left: '24px' }}>
                    <ArrowLeft size={16} /> Voltar
                </button>
                <div className="password-content">

                    <div className="password-logo">
                        <Droplet size={28} fill="#111111" color="#111111" />
                        <span className="password-logo-text">HYDRASENSE</span>
                    </div>

                    <h1 className="password-title">
                        Crie sua nova<br />
                        senha.
                    </h1>

                    <p className="password-description">
                        Defina uma nova senha para acessar sua conta.
                        Certifique-se de utilizar uma senha segura.
                    </p>

                    <form className="password-form" onSubmit={handleSubmit}>

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="password-input"
                                placeholder="Nova senha*"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="password-input"
                                placeholder="Confirmar senha*"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <p className={`password-match ${!confirmPassword ? 'hidden' : passwordsMatch ? 'success' : 'error'}`}>
                            {confirmPassword
                                ? passwordsMatch
                                    ? 'As senhas coincidem.'
                                    : 'As senhas não coincidem.'
                                : '\u00A0'
                            }
                        </p>

                        <p className="password-info">
                            Utilize pelo menos 8 caracteres para maior segurança.
                        </p>

                        <div className="password-actions">
                            <button
                                type="submit"
                                className="password-btn-primary"
                                disabled={!passwordsMatch}
                            >
                                CONFIRMAR NOVA SENHA
                            </button>
                        </div>

                    </form>

                </div>

            </main>
        </div>
    );
}