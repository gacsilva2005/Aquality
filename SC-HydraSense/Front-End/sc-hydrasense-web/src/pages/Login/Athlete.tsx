import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ChevronUp, ChevronDown, AlertCircle, ArrowLeft } from 'lucide-react';
import './Athlete.css';

export function Athlete() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailsMatch, setEmailsMatch] = useState(true);

  useEffect(() => {
    if (confirmEmail.length > 0) {
      setEmailsMatch(email === confirmEmail);
    } else {
      setEmailsMatch(true);
    }
  }, [email, confirmEmail]);

  return (
    <div className="tela-atleta-background">
      <aside className="barra-vinho esquerda"></aside>
      <aside className="barra-vinho direita"></aside>

      <main className="container-atleta-distribuido" style={{ position: 'relative' }}>
        <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '0', left: '0' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        {/* Header agora centralizado via CSS */}
        <header className="header-atleta">
          <span className="label-passo">CADASTRO DE ATLETA</span>
          <h1 className="titulo-hero-atleta">INFORMAÇÕES BÁSICAS</h1>
        </header>

        <section className="form-atleta-full">
          <div className="grid-campos-atleta">
            <div className="bloco-input">
              <label>NOME COMPLETO</label>
              <div className="wrapper-input-atleta">
                <User size={20} />
                <input type="text" placeholder="Nome completo do atleta" required />
              </div>
            </div>
            
            <div className="bloco-input">
              <label>TELEFONE</label>
              <div className="wrapper-input-atleta">
                <Phone size={20} />
                <input type="tel" placeholder="(00) 00000-0000" required />
              </div>
            </div>
          </div>

          <div className="grid-campos-atleta">
            <div className="bloco-input">
              <label>E-MAIL DO ATLETA</label>
              <div className={`wrapper-input-atleta ${!emailsMatch ? 'input-error' : ''}`}>
                <Mail size={20} />
                <input 
                  type="email" 
                  placeholder="atleta@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="bloco-input">
              <label>CONFIRMAR E-MAIL</label>
              <div className={`wrapper-input-atleta ${!emailsMatch ? 'input-error' : ''}`}>
                <Mail size={20} />
                <input 
                  type="email" 
                  placeholder="Confirme o e-mail"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="container-avisos-central">
            {!emailsMatch && (
              <p className="mensagem-erro-email">
                <AlertCircle size={14} /> Os e-mails digitados não são iguais.
              </p>
            )}
            <p className="texto-informativo-atleta">
              O pedido de criação de senha será enviado para o e-mail inserido acima.
            </p>
          </div>

          {/* Navegação compactada via CSS */}
          <div className="navegacao-vertical-container">
            <button type="button" className="seta-v-btn desativada" disabled>
              <ChevronUp size={40} />
            </button>
            <div className="ponto-estilo-minimal"></div>
            <button 
              type="button" 
              className="seta-v-btn ativa" 
              onClick={() => emailsMatch && confirmEmail && {/* Navegar */}}
              disabled={!emailsMatch}
            >
              <ChevronDown size={40} />
            </button>
          </div>

          <button className="link-voltar-atleta" onClick={() => navigate('/equipe')}>
            CANCELAR E VOLTAR
          </button>
        </section>
      </main>
    </div>
  );
}