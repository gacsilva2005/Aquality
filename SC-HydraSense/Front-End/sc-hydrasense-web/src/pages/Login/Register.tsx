import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, Utensils, Activity, BriefcaseMedical, MapPin, Award, User, Hash, Trophy, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
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
  const navigate = useNavigate();
  const [perfilAtivo, setPerfilAtivo] = useState('nutricionista');
  const [buscaClube, setBuscaClube] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth('33%'), 50);
    return () => clearTimeout(timer);
  }, []);

    const [formData, setFormData] = useState({
        nome: '',
        registro: '',
        uf: '',
        especialidade: '',
        clube: {
            id: 0
        },
        perfil: perfilAtivo,
        sexo: ''
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
          <span className="lateral-subtitulo">AQUALITY PROTOCOLO V4.0</span>
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
          <div className="signup-progress-track">
            <div className="signup-progress-fill" style={{ width: progressWidth }}></div>
          </div>
          <div className="legendas-progresso">
            <span className="legenda-progresso ativa">CREDENCIAIS</span>
            <span className="legenda-progresso">IDENTIDADE</span>
            <span className="legenda-progresso">EQUIPE</span>
          </div>
        </div>
      </aside>

      <main className="painel-principal login-step-container">
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
          <div className="linha-dupla">
            <Input
              label="NOME COMPLETO"
              iconLeft={<User size={18} color="#6C757D" />}
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <Select
              label="SEXO BIOLÓGICO"
              iconLeft={<User size={18} color="#6C757D" />}
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Select>
          </div>

          <div className="linha-dupla">
            <Input
              label="REGISTRO PROFISSIONAL (CRN/CRM/CREF)"
              iconLeft={<Hash size={18} color="#6C757D" />}
              type="text"
              name="registro"
              placeholder="Ex: CRM-12345"
              value={formData.registro}
              onChange={handleChange}
              required
            />

            <Select
              label="UF DA FILIAÇÃO"
              iconLeft={<MapPin size={18} color="#6C757D" />}
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione</option>
              {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </Select>
          </div>

          <div className="linha-dupla">
            <Input
              label="ESPECIALIDADE"
              iconLeft={<Award size={18} color="#6C757D" />}
              type="text"
              name="especialidade"
              placeholder="Ex: Fisiologia"
              value={formData.especialidade}
              onChange={handleChange}
              required
            />

            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Input
                label="INSTITUIÇÃO/CLUBE"
                iconLeft={<Trophy size={18} color="#6C757D" />}
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
            <Button type="submit" variant="primary">
              PRÓXIMO PASSO
            </Button>
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