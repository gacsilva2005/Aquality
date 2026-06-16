import { useEffect, useState, useMemo } from 'react';
import { NovoAtleta } from './NovoAtleta';
import { AthleteDetailModal } from '../../components/ui/AthleteDetailModal';
import { useUser } from '../../context/UserContext';

export function Atletas() {
    const [verFormulario, setVerFormulario] = useState(false);
    const [atletasBase, setAtletasBase] = useState<any[]>([]);
    const [atletaSelecionado, setAtletaSelecionado] = useState<any>(null);
    const { user } = useUser();

    // Filtros
    const [busca, setBusca] = useState('');
    const [filtroTime, setFiltroTime] = useState('Todos os times');
    const [filtroStatus, setFiltroStatus] = useState('Todos os status');
    const [filtroModalidade, setFiltroModalidade] = useState('Todas as modalidades');
    const [filtroSessao, setFiltroSessao] = useState('Qualquer momento');

    const handleNovoAtleta = () => {
        setVerFormulario(true);
    };

    useEffect(() => {
        if (user?.clube?.id) {
            buscarAtletas();
        }
    }, [user]);

    const buscarAtletas = async () => {
        try {
            const clubeId = user?.clube?.id;
            const response = await fetch(`http://127.0.0.1:8080/Atleta/clube/${clubeId}/resumo`);

            if (!response.ok) {
                throw new Error('Erro ao buscar resumo dos atletas do clube');
            }

            const data = await response.json();
            setAtletasBase(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Extração dinâmica de opções para os selects
    const timesUnicos = Array.from(new Set(atletasBase.map(a => a.equipeNome))).filter(Boolean);
    const modalidadesUnicas = Array.from(new Set(atletasBase.map(a => a.modalidade))).filter(Boolean);

    // Lógica de Filtragem Cruzada
    const atletasFiltrados = useMemo(() => {
        return atletasBase.filter(atleta => {
            // Filtro Busca
            const nomeOuId = (atleta.nome + atleta.id).toLowerCase();
            if (busca && !nomeOuId.includes(busca.toLowerCase())) return false;

            // Filtro Time
            if (filtroTime !== 'Todos os times' && atleta.equipeNome !== filtroTime) return false;

            // Filtro Status
            if (filtroStatus !== 'Todos os status' && atleta.status !== filtroStatus) return false;

            // Filtro Modalidade
            if (filtroModalidade !== 'Todas as modalidades' && atleta.modalidade !== filtroModalidade) return false;

            // Filtro Última Sessão
            if (filtroSessao !== 'Qualquer momento') {
                if (!atleta.ultimaSessao) return false; // Se não tem sessão, cai no filtro
                
                const dataSessao = new Date(atleta.ultimaSessao);
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                
                const ontem = new Date(hoje);
                ontem.setDate(ontem.getDate() - 1);
                
                const umaSemanaAtras = new Date(hoje);
                umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
                
                const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

                if (filtroSessao === 'Hoje' && dataSessao < hoje) return false;
                if (filtroSessao === 'Ontem' && (dataSessao >= hoje || dataSessao < ontem)) return false;
                if (filtroSessao === 'Esta semana' && dataSessao < umaSemanaAtras) return false;
                if (filtroSessao === 'Este mês' && dataSessao < inicioMes) return false;
            }

            return true;
        });
    }, [atletasBase, busca, filtroTime, filtroStatus, filtroModalidade, filtroSessao]);

    const statusColor = (status: string) => {
        if (status === 'Crítico') return 'critico';
        if (status === 'Atenção') return 'atencao';
        if (status === 'Ideal') return 'estavel';
        return 'estavel'; // Sem dados ou padrão
    };

    const formatData = (dataStr: string) => {
        if (!dataStr) return '--';
        const d = new Date(dataStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getPhotoSrc = (fotoPerfil: string) => {
        if (!fotoPerfil) return null;
        return fotoPerfil.startsWith('data:image') ? fotoPerfil : `data:image/jpeg;base64,${fotoPerfil}`;
    };

    if (verFormulario) {
        return <NovoAtleta onBack={() => {
            setVerFormulario(false);
            buscarAtletas(); // recarrega após criar
        }} />;
    }

    return (
        <>
            <div className="atletas-header">
                <div className="atletas-header__info">
                    <h1 className="pageweb__title">NOSSOS ATLETAS</h1>
                    <p>
                        Monitoramento ativo da hidratação para acompanhamento do desempenho de atletas de elite.
                        Dados atualizados a cada 15 minutos.
                    </p>
                </div>
                <button className="btn-primary btn-header-novo-atleta" onClick={handleNovoAtleta}>+ NOVO ATLETA</button>
            </div>

            <section className="filtros-container">
                <div className="filtro-grupo filtro-busca">
                    <label>Pesquisar</label>
                    <div className="input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-busca">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Código ou nome do atleta..." 
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filtro-grupo">
                    <label>Time</label>
                    <select value={filtroTime} onChange={e => setFiltroTime(e.target.value)}>
                        <option value="Todos os times">Todos os times</option>
                        {timesUnicos.map((t, idx) => <option key={idx} value={t as string}>{t as string}</option>)}
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Status</label>
                    <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                        <option value="Todos os status">Todos os status</option>
                        <option value="Crítico">Crítico</option>
                        <option value="Atenção">Atenção</option>
                        <option value="Ideal">Ideal</option>
                        <option value="Sem Dados">Sem Dados</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Modalidade</label>
                    <select value={filtroModalidade} onChange={e => setFiltroModalidade(e.target.value)}>
                        <option value="Todas as modalidades">Todas as modalidades</option>
                        {modalidadesUnicas.map((m, idx) => <option key={idx} value={m as string}>{m as string}</option>)}
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Última sessão</label>
                    <select value={filtroSessao} onChange={e => setFiltroSessao(e.target.value)}>
                        <option value="Qualquer momento">Qualquer momento</option>
                        <option value="Hoje">Hoje</option>
                        <option value="Ontem">Ontem</option>
                        <option value="Esta semana">Esta semana</option>
                        <option value="Este mês">Este mês</option>
                    </select>
                </div>
            </section>

            <section className="atletas-tabela-container">
                <table className="atletas-table">
                    <thead>
                        <tr>
                            <th>Atleta</th>
                            <th>Time</th>
                            <th>Modalidade</th>
                            <th>Status</th>
                            <th>Adesão</th>
                            <th>Última sessão</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atletasFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Nenhum atleta encontrado para os filtros selecionados.</td>
                            </tr>
                        ) : null}
                        
                        {atletasFiltrados.map((atleta: any) => {
                            const photo = getPhotoSrc(atleta.fotoPerfil);
                            return (
                            <tr key={atleta.id} onClick={() => setAtletaSelecionado(atleta)} style={{ cursor: 'pointer' }} className="tr-clicavel">
                                <td>
                                    <div className="td-atleta">
                                        {photo ? (
                                            <img src={photo} alt={atleta.nome} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="avatar-placeholder" />
                                        )}
                                        <div className="atleta-info">
                                            <span className="atleta-nome">
                                                {atleta.nome}
                                            </span>
                                            <span className="atleta-id">
                                                #{atleta.id}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    {atleta.equipeNome}
                                </td>

                                <td>
                                    {atleta.modalidade || '--'}
                                </td>

                                <td>
                                    <div className={`td-status ${statusColor(atleta.status)}`}>
                                        <span className="status-dot"></span>
                                        <span className="status-text">
                                            {atleta.status.toUpperCase()}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    {atleta.adesao}
                                </td>

                                <td>
                                    {formatData(atleta.ultimaSessao)}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </section>

            <AthleteDetailModal 
                isOpen={!!atletaSelecionado} 
                onClose={() => setAtletaSelecionado(null)} 
                atletaId={atletaSelecionado?.id || null} 
            />
        </>
    );
}