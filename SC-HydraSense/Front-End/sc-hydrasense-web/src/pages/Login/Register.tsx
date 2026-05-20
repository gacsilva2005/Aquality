import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, Utensils, Activity, BriefcaseMedical, MapPin, Award, User, Hash, Trophy, ArrowLeft } from 'lucide-react';
import './Login.css';

const PERFIS = [
  { id: 'nutricionista', rotulo: 'NUTRICIONISTA', icone: <Utensils size={24} /> },
  { id: 'treinador', rotulo: 'TREINADOR', icone: <Activity size={24} /> },
  { id: 'medico', rotulo: 'MÉDICO', icone: <BriefcaseMedical size={24} /> },
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
    { id: 10, nome: "Portuguesa" }
];

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function Register() {
    const = { setUser } = useUser();
  const navigate = useNavigate();
  const [perfilAtivo, setPerfilAtivo] = useState('nutricionista');
  const [buscaClube, setBuscaClube] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const dados = await response.json();

  setUser(dados);

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
          <h2 className="lateral-titulo">SÃO CAMILO WEB</h2>
          <span className="lateral-subtitulo">HYDRO SENSE PROTOCOLO V4.0</span>
        </div>

        <div className="lateral-meio">
          <div className="lateral-icone">
            <Microscope size={28} strokeWidth={1.5} />
          </div>
          <div className="lateral-textos-meio">
            <h3 className="lateral-destaque">PRECISÃO CLÍNICA</h3>
            <p className="lateral-texto">
              Cadastre suas credenciais profissionais<br />
              para acessar logs de performance de alta<br />
              densidade e análises de hidratação.
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