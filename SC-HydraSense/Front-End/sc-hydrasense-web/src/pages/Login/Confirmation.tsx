import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Droplet } from 'lucide-react';
import './Confirmation.css';

export function Confirmation() {

    const navigate = useNavigate();

    return (
        <div className="confirmation-page">

            <main className="confirmation-main">

                <div className="confirmation-content">

                    <div className="confirmation-logo">

                        <Droplet
                            size={30}
                            fill="#111111"
                            color="#111111"
                        />

                        <span className="confirmation-logo-text">
                            AQUALITY
                        </span>

                    </div>

                    <div className="confirmation-icon">

                        <CheckCircle2
                            size={78}
                            strokeWidth={1.8}
                        />

                    </div>

                    <h1 className="confirmation-title">
                        Senha alterada com sucesso.
                    </h1>

                    <p className="confirmation-description">
                        Sua senha foi redefinida corretamente.
                        <br />
                        Agora você já pode retornar ao portal
                        e acessar sua conta normalmente.
                    </p>

                    <button
                        className="confirmation-btn"
                        onClick={() => navigate('/')}
                    >
                        PROSSEGUIR PARA LOGIN
                    </button>

                </div>

            </main>

        </div>
    );
}