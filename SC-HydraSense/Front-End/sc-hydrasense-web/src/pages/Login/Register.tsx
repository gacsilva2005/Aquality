import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, Utensils, Activity, BriefcaseMedical, MapPin, Award, User, Hash, Trophy, ArrowLeft, Droplets, HeartPulse, ShieldCheck } from 'lucide-react';
import './Login.css';

const PERFIS = [
  { id: 'nutricionista', rotulo: 'NUTRICIONISTA', icone: <Utensils size={24} /> },
  { id: 'treinador', rotulo: 'TREINADOR', icone: <Activity size={24} /> },
  { id: 'medico', rotulo: 'MÉDICO', icone: <BriefcaseMedical size={24} /> },
];

const DESTAQUES = [
  { icone: <Microscope size={28} strokeWidth={1.5} />, titulo: 'PRECISÃO CLÍNICA', texto: 'Cadastre suas credenciais profissionais para acessar logs de performance de alta densidade e análises de hidratação.' },
  { icone: <Droplets size={28} strokeWidth={1.5} />, titulo: 'MONITORAMENTO HÍDRICO', texto: 'Acompanhe em tempo real os níveis de hidratação dos atletas com dados precisos e confiáveis.' },
  { icone: <HeartPulse size={28} strokeWidth={1.5} />, titulo: 'SAÚDE EM FOCO', texto: 'Tome decisões baseadas em evidências clínicas para maximizar a performance e prevenir lesões.' },
  { icone: <ShieldCheck size={28} strokeWidth={1.5} />, titulo: 'SEGURANÇA TOTAL', texto: 'Seus dados e os de seus atletas protegidos com os mais altos padrões de segurança.' },
];

const CLUBES_DISPONIVEIS = [
    { id: 1, nome: "Corinthians" },
    { id: 2, nome: "Palmeiras" },
    { id: 3, nome: "Santos" },
    { id: 4, nome: "São Paulo" },
    { id: 5, nome: "América-SP" },
    { id: 6, nome: "Guarani" },
    { id: 7, nome: "Ponte Preta" },
    { id: 8, nome: "Ituano" },
    { id: 9, nome: "Juventus" },
    { id: 10, nome: "Portuguesa" },
    { id: 11, nome: "Red Bull Bragantino" },
    { id: 12, nome: "Mirassol" },
    { id: 13, nome: "Novorizontino" },
    { id: 14, nome: "Botafogo-SP" },
    { id: 15, nome: "Ferroviária" },
    { id: 16, nome: "Noroeste" },
    { id: 17, nome: "XV de Piracicaba" },
    { id: 18, nome: "São Bento" },
    { id: 19, nome: "Oeste" },
    { id: 20, nome: "São Caetano" },
    { id: 21, nome: "Taubaté" },
    { id: 22, nome: "Marília" },
    { id: 23, nome: "Comercial-SP" },
    { id: 24, nome: "Velo Clube" },
    { id: 25, nome: "Inter de Limeira" },
    { id: 26, nome: "Rio Claro" },
    { id: 27, nome: "Santo André" },
    { id: 28, nome: "Água Santa" },
    { id: 29, nome: "Audax" },
    { id: 30, nome: "Capivariano" },
    { id: 31, nome: "Nacional-SP" },
    { id: 32, nome: "Primavera" },
    { id: 33, nome: "Linense" },
    { id: 34, nome: "Mogi Mirim" },
    { id: 35, nome: "Grêmio Prudente" },
    { id: 36, nome: "Penapolense" },
    { id: 37, nome: "Batatais" },
    { id: 38, nome: "Barretos" },
    { id: 39, nome: "Paulista" },
    { id: 40, nome: "Jabaquara" },
    { id: 41, nome: "Desportivo Brasil" },
    { id: 42, nome: "EC São Bernardo" },
    { id: 43, nome: "São José-SP" },
    { id: 44, nome: "Monte Azul" },
    { id: 45, nome: "Vocem" },
    { id: 46, nome: "Francana" },
    { id: 47, nome: "União Barbarense" },
    { id: 48, nome: "Matonense" },
    { id: 49, nome: "Araçatuba" },
    { id: 50, nome: "Catanduvense" }
];

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function Register() {
  const navigate = useNavigate();
  const [perfilAtivo, setPerfilAtivo] = useState('nutricionista');
  const [buscaClube, setBuscaClube] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [destaqueAtivo, setDestaqueAtivo] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDestaqueAtivo(prev => (prev + 1) % DESTAQUES.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

    const [formData, setFormData] = useState({
        nome: '',
        registro: '',
        uf: '',
        especialidade: '',
        clube: {
            id: 0
        },
        perfil: perfilAtivo
    });

    const clubesFiltrados = CLUBES_DISPONIVEIS.filter(clube =>
        clube.nome.toLowerCase().includes(buscaClube.toLowerCase())
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/identificador', {
      state: { ...formData, perfil: perfilAtivo }
    });
  };

  return (
    <div className="tela-registro">
      <aside className="painel-lateral">
        <div className="lateral-topo">
          <h2 className="lateral-titulo">AQUALITY COMPANY</h2>
          <span className="lateral-subtitulo">PROTOCOLO V4.0</span>
        </div>

        <div className="lateral-meio">
          <div className="lateral-icone" key={destaqueAtivo} style={{ animation: 'fadeSlide 0.5s ease' }}>
            {DESTAQUES[destaqueAtivo].icone}
          </div>
          <div className="lateral-textos-meio">
            <h3 className="lateral-destaque" key={`titulo-${destaqueAtivo}`} style={{ animation: 'fadeSlide 0.5s ease' }}>
              {DESTAQUES[destaqueAtivo].titulo}
            </h3>
            <p className="lateral-texto" key={`texto-${destaqueAtivo}`} style={{ animation: 'fadeSlide 0.5s ease' }}>
              {DESTAQUES[destaqueAtivo].texto}
            </p>
          </div>
        </div>

        <div className="lateral-rodape">
          <div className="trilhas-progresso">
            <div className="trilha ativa"></div>
            <div className="trilha"></div>
            <div className="trilha"></div>
          </div>
          <div className="legendas-progresso">
            <span className="legenda-progresso ativa">CREDENCIAIS</span>
            <span className="legenda-progresso">IDENTIDADE</span>
            <span className="legenda-progresso">EQUIPE</span>
          </div>
        </div>
      </aside>

      <main className="painel-principal">
        <button className="btn-ghost-back" onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start', marginBottom: '24px', marginLeft: '-12px' }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <header className="cabecalho-fluxo">
          <span className="texto-passo">PASSO 01 / CREDENCIAMENTO</span>
          <h1 className="titulo-pagina">CADASTRO PROFISSIONAL</h1>
        </header>

        <section className="secao-selecao">
          <h2 className="titulo-secao">SELECIONE O PERFIL PROFISSIONAL</h2>
          <div className="grade-perfis">
            {PERFIS.map((perfil) => (
              <button
                key={perfil.id}
                type="button"
                className={`botao-perfil ${perfilAtivo === perfil.id ? 'ativo' : ''}`}
                onClick={() => {
                  setPerfilAtivo(perfil.id);
                  setFormData(prev => ({ ...prev, perfil: perfil.id }));
                }}
              >
                <span className="icone-perfil">{perfil.icone}</span>
                <span className="legenda-perfil">{perfil.rotulo}</span>
              </button>
            ))}
          </div>
        </section>

        <form className="formulario-corpo" onSubmit={handleSubmit}>
          <div className="campo-entrada">
            <label>NOME COMPLETO</label>
            <div className="container-input-linha">
              <User size={18} color="#6C757D" />
              <input
                type="text"
                name="nome"
                placeholder="Nome Completo"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="linha-dupla">
            <div className="campo-entrada">
              <label>REGISTRO PROFISSIONAL (CRN/CRM/CREF)</label>
              <div className="container-input-linha">
                <Hash size={18} color="#6C757D" />
                <input
                  type="text"
                  name="registro"
                  placeholder="Ex: CRM-12345"
                  value={formData.registro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="campo-entrada">
              <label>UF DA FILIAÇÃO</label>
              <div className="container-input-linha">
                <MapPin size={18} color="#6C757D" />
                <select
                  required
                  name="uf"
                  className="select-registro"
                  value={formData.uf}
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecione</option>
                  {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="linha-dupla">
            <div className="campo-entrada">
              <label>ESPECIALIDADE</label>
              <div className="container-input-linha">
                <Award size={18} color="#6C757D" />
                <input
                  type="text"
                  name="especialidade"
                  placeholder="Ex: Fisiologia"
                  value={formData.especialidade}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="campo-entrada" style={{ position: 'relative' }}>
              <label>INSTITUIÇÃO/CLUBE</label>
              <div className="container-input-linha">
                <Trophy size={18} color="#6C757D" />
                <input
                  type="text"
                  placeholder="Pesquisar Clube..."
                  value={buscaClube}
                  onChange={(e) => {
                    setBuscaClube(e.target.value);
                    setMostrarSugestoes(true);
                  }}
                  onFocus={() => setMostrarSugestoes(true)}
                  required
                />
              </div>

              {mostrarSugestoes && buscaClube.length > 0 && (
                <ul className="sugestoes-clubes">
                  {clubesFiltrados.map((clube) => (
                      <li
                          key={clube.id}
                          onClick={() => {
                              setBuscaClube(clube.nome);
                              setFormData(prev => ({
                                  ...prev,
                                  clube: {
                                      id: clube.id
                                  }
                              }));
                              setMostrarSugestoes(false);
                          }}
                      >
                          {clube.nome}
                      </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <footer className="acoes-formulario">
            <button type="submit" className="botao-acao-principal">
              PRÓXIMO PASSO
            </button>
            <div className="bloco-login">
              <span className="pergunta-login">Já tem uma conta?</span>
              <button type="button" className="botao-acao-secundario" onClick={() => navigate('/')}>
                Fazer Login
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}