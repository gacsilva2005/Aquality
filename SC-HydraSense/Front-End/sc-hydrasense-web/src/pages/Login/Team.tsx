import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, ShieldCheck, Hash, ChevronLeft, ArrowLeft } from 'lucide-react';
import './Team.css';

export function Team() {
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [teamCode, setTeamCode] = useState('');
  const [progressWidth, setProgressWidth] = useState('66%');

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth('100%'), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 7) value = value.slice(0, 7); 
    
    if (value.length > 6) {
      value = value.replace(/^(\d{6})(\d{1})/, '$1-$2');
    }
    setTeamCode(value);
  };

  const isCodeValid = teamCode.length === 8;

  return (
    <div className="tela-registro-full">
      <main className="painel-principal-central login-step-container" style={{ position: 'relative' }}>
        <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '0', left: '0' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <header className="cabecalho-fluxo">
          <span className="texto-passo">PASSO 03 / EQUIPE</span>
          <h1 className="titulo-pagina">FORMAÇÃO DE EQUIPE</h1>
        </header>

        <div className="card-selecao-equipe">
          <div className="modal-equipe">
            {!showCodeInput ? (
              <>
                <button 
                  className="botao-equipe-primario" 
                  onClick={() => navigate('/athlete')}
                >
                  <UserPlus size={20} /> ADICIONAR ATLETA
                </button>

                <button 
                  className="botao-equipe-primario" 
                  onClick={() => setShowCodeInput(true)}
                >
                  <ShieldCheck size={20} /> ENTRAR EM EQUIPE
                </button>

                <div className="divisor-avancar">
                  <div className="linha-divisor"></div>
                  <span>OU</span>
                  <div className="linha-divisor"></div>
                </div>

                <button className="botao-avancar-fluxo" onClick={() => navigate('/')}>
                  AVANÇAR PARA O PORTAL <ArrowRight size={20} />
                </button>
              </>
            ) : (
              <div className="sessao-codigo-equipe">
                <button className="botao-voltar-limpo" onClick={() => setShowCodeInput(false)}>
                  <ChevronLeft size={18} /> <span>CANCELAR E VOLTAR</span>
                </button>
                
                <div className="textos-centro">
                  <h3 className="titulo-sessao">CÓDIGO DA EQUIPE</h3>
                </div>
                
                <div className={`input-codigo-wrapper ${isCodeValid ? 'valid' : ''}`}>
                  <Hash size={20} className="icone-hash" />
                  <input 
                    type="text" 
                    placeholder="000000-0" 
                    value={teamCode}
                    onChange={handleCodeChange}
                    className="input-codigo-equipe"
                    autoFocus
                  />
                </div>

                <button 
                  className="botao-equipe-primario btn-confirmar-codigo" 
                  disabled={!isCodeValid}
                >
                  CONFIRMAR ENTRADA
                </button>
              </div>
            )}
            <p className="legenda-avancar">Você poderá configurar sua equipe depois no menu lateral</p>
          </div>
        </div>
      </main>

      <footer className="progresso-footer-compacto">
        <div className="barra-progresso-container" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <div className="signup-progress-track">
            <div className="signup-progress-fill" style={{ width: progressWidth }}></div>
          </div>
          <div className="fluxo-progresso-wrapper" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span className="legenda-mini ativa">CREDENCIAIS</span>
            <span className="legenda-mini ativa">IDENTIDADE</span>
            <span className="legenda-mini ativa">EQUIPE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}