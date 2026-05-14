import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Droplet, ArrowLeft } from 'lucide-react';
import './number.css';

export function Number() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState('');

    const [showError, setShowError] = useState(false);

    const [showCountries, setShowCountries] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        flag: '🇧🇷',
        ddd: '+55'
    });

    const countries = [
    { flag: '🇧🇷', ddd: '+55', name: 'Brasil' },
    { flag: '🇺🇸', ddd: '+1', name: 'Estados Unidos' },
    { flag: '🇨🇦', ddd: '+1', name: 'Canadá' },
    { flag: '🇲🇽', ddd: '+52', name: 'México' },
    { flag: '🇦🇷', ddd: '+54', name: 'Argentina' },
    { flag: '🇨🇱', ddd: '+56', name: 'Chile' },
    { flag: '🇨🇴', ddd: '+57', name: 'Colômbia' },
    { flag: '🇵🇪', ddd: '+51', name: 'Peru' },
    { flag: '🇺🇾', ddd: '+598', name: 'Uruguai' },
    { flag: '🇵🇾', ddd: '+595', name: 'Paraguai' },
    { flag: '🇧🇴', ddd: '+591', name: 'Bolívia' },
    { flag: '🇻🇪', ddd: '+58', name: 'Venezuela' },
    { flag: '🇪🇨', ddd: '+593', name: 'Equador' },

    { flag: '🇵🇹', ddd: '+351', name: 'Portugal' },
    { flag: '🇪🇸', ddd: '+34', name: 'Espanha' },
    { flag: '🇫🇷', ddd: '+33', name: 'França' },
    { flag: '🇩🇪', ddd: '+49', name: 'Alemanha' },
    { flag: '🇮🇹', ddd: '+39', name: 'Itália' },
    { flag: '🇬🇧', ddd: '+44', name: 'Reino Unido' },
    { flag: '🇮🇪', ddd: '+353', name: 'Irlanda' },
    { flag: '🇳🇱', ddd: '+31', name: 'Holanda' },
    { flag: '🇧🇪', ddd: '+32', name: 'Bélgica' },
    { flag: '🇨🇭', ddd: '+41', name: 'Suíça' },
    { flag: '🇸🇪', ddd: '+46', name: 'Suécia' },
    { flag: '🇳🇴', ddd: '+47', name: 'Noruega' },
    { flag: '🇩🇰', ddd: '+45', name: 'Dinamarca' },
    { flag: '🇫🇮', ddd: '+358', name: 'Finlândia' },
    { flag: '🇵🇱', ddd: '+48', name: 'Polônia' },
    { flag: '🇺🇦', ddd: '+380', name: 'Ucrânia' },
    { flag: '🇷🇺', ddd: '+7', name: 'Rússia' },

    { flag: '🇯🇵', ddd: '+81', name: 'Japão' },
    { flag: '🇰🇷', ddd: '+82', name: 'Coreia do Sul' },
    { flag: '🇨🇳', ddd: '+86', name: 'China' },
    { flag: '🇮🇳', ddd: '+91', name: 'Índia' },
    { flag: '🇹🇭', ddd: '+66', name: 'Tailândia' },
    { flag: '🇸🇬', ddd: '+65', name: 'Singapura' },
    { flag: '🇻🇳', ddd: '+84', name: 'Vietnã' },
    { flag: '🇮🇩', ddd: '+62', name: 'Indonésia' },
    { flag: '🇵🇭', ddd: '+63', name: 'Filipinas' },

    { flag: '🇦🇺', ddd: '+61', name: 'Austrália' },
    { flag: '🇳🇿', ddd: '+64', name: 'Nova Zelândia' },

    { flag: '🇿🇦', ddd: '+27', name: 'África do Sul' },
    { flag: '🇪🇬', ddd: '+20', name: 'Egito' },
    { flag: '🇳🇬', ddd: '+234', name: 'Nigéria' },
    { flag: '🇲🇦', ddd: '+212', name: 'Marrocos' },

    { flag: '🇸🇦', ddd: '+966', name: 'Arábia Saudita' },
    { flag: '🇦🇪', ddd: '+971', name: 'Emirados Árabes' },
    { flag: '🇮🇱', ddd: '+972', name: 'Israel' },
    { flag: '🇹🇷', ddd: '+90', name: 'Turquia' }
];

    const numbersOnly = phone.replace(/\D/g, '');

    const isValidPhone = numbersOnly.length === 11;

    const handlePhoneChange = (value: string) => {

        const numbers = value.replace(/\D/g, '');

        let formatted = numbers;

        if (numbers.length <= 11) {

            formatted = numbers
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        }

        setPhone(formatted);

        if (showError) {
            setShowError(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        if (!isValidPhone) {
            setShowError(true);
            return;
        }

        navigate('/codigo');
    };

    return (
        <div className="number-page">

            <main className="number-main" style={{ position: 'relative' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '24px', left: '24px' }}>
                    <ArrowLeft size={16} /> Voltar
                </button>
                <div className="number-content">

                    <div className="number-logo">

                        <Droplet
                            size={28}
                            fill="#111111"
                            color="#111111"
                        />

                        <span className="number-logo-text">
                            HYDRASENSE
                        </span>

                    </div>

                    <h1 className="number-title">
                        Insira seu celular para<br />
                        recuperar sua senha.
                    </h1>

                    <form
                        className="number-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="phone-wrapper">

                            <div
                                className="country-selector"
                                onClick={() =>
                                    setShowCountries(!showCountries)
                                }
                            >

                                <span className="country-flag">
                                    {selectedCountry.flag}
                                </span>

                                <span className="country-ddd">
                                    {selectedCountry.ddd}
                                </span>

                                <ChevronDown
                                    size={16}
                                    color="#757575"
                                />

                            </div>

                            {showCountries && (

                                <div className="country-dropdown">

                                    {countries.map((country) => (

                                        <div
                                            key={country.ddd}
                                            className="country-option"
                                            onClick={() => {
                                                setSelectedCountry(country);
                                                setShowCountries(false);
                                            }}
                                        >

                                            <span>
                                                {country.flag}
                                            </span>

                                            <span>
                                                {country.name}
                                            </span>

                                            <span>
                                                {country.ddd}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            )}

                            <input
                                type="tel"
                                className="number-input"
                                placeholder="(11) 91234-5678"
                                value={phone}
                                onChange={(e) =>
                                    handlePhoneChange(e.target.value)
                                }
                                required
                                autoFocus
                            />

                        </div>

                        {showError && (

                            <p className="number-error">
                                Insira um número de celular válido com DDD.
                            </p>

                        )}

                        <p className="number-terms">

                            Deseja voltar para recuperação via e-mail?{' '}

                            <span
                                className="number-link"
                                onClick={() =>
                                    navigate('/recuperar-senha')
                                }
                            >
                                Clique aqui.
                            </span>

                        </p>

                        <div className="number-actions">

                            <button
                                type="submit"
                                className="number-btn-primary"
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