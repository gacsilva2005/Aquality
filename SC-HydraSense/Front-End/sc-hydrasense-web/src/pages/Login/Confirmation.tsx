import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PlusAP from '../../assets/Plus-AP.png';
import './Confirmation.css';

export function Confirmation() {

    const navigate = useNavigate();

    return (
        <div className="confirmation-page">

            <main className="confirmation-main">

                <div className="confirmation-content">

                    <div className="confirmation-logo">
                        <img src={PlusAP} alt="Plus-A Logo" className="confirmation-logo-img" />
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