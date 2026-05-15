import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Unlock, ChevronRight, Globe, Apple, Droplet, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './Home.css';

import logoFundo from '../assets/Logo-Fundo.png';

export function GoogleCallback() {
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        fetch("http://localhost:8080/auth/user", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Usuário não autenticado");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Usuário Google:", data);
                setUsuario(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Bem-vindo ao Portal</h1>

            {usuario && (
                <>
                    <p>{usuario.name}</p>
                    <p>{usuario.email}</p>
                    <img src={usuario.picture} width={80} />
                </>
            )}
        </div>
    );
}

export function Home() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const handleGoogleLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const { success, error } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      if (!response.ok) {
        error('Erro de Autenticação', 'E-mail ou senha inválidos. Tente novamente.');
        return;
      }

      const dados = await response.json();
      console.log("Login realizado:", dados);
      localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

      if (dados.tipo === "profissional") {
        success('Login Realizado!', 'Bem-vindo ao painel HydraSense.');
        setTimeout(() => navigate("/PageWeb"), 1500);
      } else if (dados.tipo === "atleta") {
        success('Login Realizado!', 'Redirecionando para o dashboard do atleta.');
        setTimeout(() => navigate("/dashboardAtleta"), 1500);
      } else {
        error('Acesso Negado', 'Tipo de usuário inválido.');
      }

    } catch (err) {
      error('Erro de Conexão', 'Erro ao conectar ao servidor.');
      console.error(err);
    }
  };

  return (
    <>
      <div className="login-container">
      {/* Lado Esquerdo: Branding */}
      <div
        className="login-branding"
        style={{
          backgroundImage: `linear-gradient(rgba(100, 18, 32, 0.85), rgba(100, 18, 32, 0.85)), url(${logoFundo})`
        }}
      >
        {/* Logo Superior Esquerdo */}
        <div className="logo-section">
          <Droplet size={24} color="#FFFFFF" fill="#FFFFFF" />
          <span className="logo-text">HYDRA SENSE</span>
        </div>

        {/* Rodapé Centralizado e na Base */}
        <div className="branding-footer">
          <h2 className="hospital-name">HOSPITAL</h2>
          <h3 className="brand-name">SÃO CAMILO</h3>
        </div>
      </div>

      {/* Lado Direito: Formulário */}
      <div className="login-form-side">
        <div className="form-wrapper">
          <header className="form-header">
            <h1>ACESSO AO PORTAL</h1>
            <p>Insira suas credenciais técnicas para autenticação.</p>
          </header>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>ENDEREÇO DE E-MAIL</label>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="nome@performance.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="#6C757D" />
              </div>
            </div>

            <div className="input-group">
              <label>SENHA DE ACESSO</label>
              <div className="input-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Unlock size={18} color="#D90429" />
                  ) : (
                    <Lock size={18} color="#6C757D" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
  <label className="remember-me">
    <input type="checkbox" /> Lembrar sessão
  </label>
  <button type="button" className="forgot-password" onClick={() => navigate('/recuperar-senha')}>
    ESQUECI MINHA SENHA
  </button>
</div>

            {/* O aviso <p> antigo de erro foi removido, agora o Toast cuida disso */}

            <button type="submit" className="btn-login-primary">
              ACESSAR PORTAL <ChevronRight size={18} />
            </button>

            <div className="divider">
              <span>OU CONECTE VIA</span>
            </div>

            <div className="social-login">
                <button type="button" className="btn-social" onClick={handleGoogleLogin}>
                    <Globe size={18} /> GOOGLE
                </button>
              <button type="button" className="btn-social">
                <Apple size={18} /> APPLE
              </button>
            </div>

            <p className="signup-prompt">
              Novo no Hydra Sense?
              <span onClick={() => navigate('/registro')} style={{ cursor: 'pointer' }}> Solicitar acesso ao Painel</span>
            </p>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}