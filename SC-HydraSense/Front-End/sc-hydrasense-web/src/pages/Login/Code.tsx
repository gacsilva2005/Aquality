import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, ArrowLeft } from 'lucide-react';
import './Code.css';

export function Code() {
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '', '', '']);

    const [timeLeft, setTimeLeft] = useState(0);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const updated = [...code];
        updated[index] = value;
        setCode(updated);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalCode = code.join('');

        if (finalCode.length === 6) {
            navigate('/atualizar-senha');
        }
    };

    const handleResend = () => {
        if (timeLeft > 0) return;

        setTimeLeft(300);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="code-page">
            <main className="code-main" style={{ position: 'relative' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '24px', left: '24px' }}>
                    <ArrowLeft size={16} /> Voltar
                </button>
                <div className="code-content">

                    <div className="code-logo">
                        <Droplet size={28} fill="#111111" color="#111111" />
                        <span className="code-logo-text">HYDRASENSE</span>
                    </div>

                    <h1 className="code-title">
                        Insira o código<br />
                        de verificação.
                    </h1>

                    <p className="code-description">
                        Enviamos um código de 6 dígitos para o e-mail cadastrado.
                        Digite-o abaixo para continuar a recuperação da sua conta.
                    </p>

                    <form className="code-form" onSubmit={handleSubmit}>

                        <div className="code-inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputsRef.current[index] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, index)
                                    }
                                    className="code-input"
                                />
                            ))}
                        </div>

                        <p className="code-resend">
                            Não recebeu o código?{' '}

                            <span
                                className={`code-link ${timeLeft > 0 ? 'disabled' : ''}`}
                                onClick={handleResend}
                            >
                                Reenviar
                            </span>

                            {timeLeft > 0 && (
                                <span className="code-timer">
                                    {' '}({formatTime(timeLeft)})
                                </span>
                            )}
                        </p>

                        <div className="code-actions">
                            <button type="submit" className="code-btn-primary">
                                CONTINUAR
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}