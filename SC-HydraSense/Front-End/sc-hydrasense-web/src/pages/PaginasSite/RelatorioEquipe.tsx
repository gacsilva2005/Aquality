import { Download, Filter, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AthleteDetailModal } from '../../components/ui/AthleteDetailModal';

interface AtletaResumo {
    id: number;
    nome: string;
    status: string;
    variacao: number;
    taxa: number;
}

interface RelatorioEquipeData {
    sessaoId: number;
    nomeEquipe: string;
    dataGeracao: string;
    atletas: AtletaResumo[];
}

export function RelatorioEquipe() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [data, setData] = useState<RelatorioEquipeData | null>(null);
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const equipeId = id || '1';
                const response = await fetch(`http://127.0.0.1:8080/api/relatorios/equipe/${equipeId}/dados`);
                
                if (response.status === 204) {
                    setData(null);
                } else if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    console.error("Erro ao buscar dados do relatório.");
                }
            } catch (error) {
                console.error("Erro de conexão:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [id]);

    const handleExportarPdf = async () => {
        setLoadingPdf(true);
        try {
            const equipeId = id || '1';
            const response = await fetch(`http://127.0.0.1:8080/api/relatorios/equipe/${equipeId}/pdf`);
            
            if (response.status === 204) {
                alert('Sem dados suficientes para gerar PDF desta equipe.');
                return;
            }

            if (!response.ok) {
                throw new Error("Erro ao gerar PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            setPdfBlobUrl(url);
            setShowPreview(true);
        } catch (error) {
            console.error("Erro no download:", error);
            alert("Erro ao exportar o relatório PDF. Verifique se o backend está rodando.");
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleDownload = () => {
        if (pdfBlobUrl) {
            const a = document.createElement('a');
            a.href = pdfBlobUrl;
            a.download = `relatorio-aquality-equipe-${id || '1'}.pdf`;
            a.click();
        }
    };

    const statusColor = (status: string) => {
        const s = status.toUpperCase();
        if (s === 'CRÍTICO' || s === 'CRITICAL') return 'critico';
        if (s === 'ATENÇÃO' || s === 'WARNING') return 'atencao';
        if (s === 'IDEAL' || s === 'ESTÁVEL') return 'estavel';
        return 'estavel'; 
    };

    const chartData = data?.atletas ? data.atletas.slice(0, 5).map(a => ({
        name: a.nome.split(' ')[0],
        taxa: a.taxa
    })) : [];

    const taxaMedia = data?.atletas && data.atletas.length > 0 
        ? (data.atletas.reduce((sum, a) => sum + a.taxa, 0) / data.atletas.length).toFixed(2)
        : '--';

    return (
        <div className="relatorio-container">
            <div style={{ marginBottom: '16px' }}>
                <button className="btn-ghost-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Voltar para Equipes
                </button>
            </div>
            
            <div className="relatorio-header">
                <div className="relatorio-title-wrapper">
                    <div>
                        <h1 className="relatorio-title">
                            RELATÓRIO DETALHADO:
                        </h1>
                        <h1 className="relatorio-subtitle">
                            {data?.nomeEquipe ? data.nomeEquipe.toUpperCase() : 'CARREGANDO EQUIPE...'}
                        </h1>
                    </div>
                    <button onClick={handleExportarPdf} disabled={loadingPdf || loadingData || !data} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '12px 24px' }}>
                        <Download size={18} /> {loadingPdf ? 'GERANDO...' : 'EXPORTAR RELATÓRIO'}
                    </button>
                </div>
            </div>

            <div className="relatorio-filtros">
                <div className="relatorio-filtros-left">
                    <div className="relatorio-filtro-label">
                        <Filter size={18} />
                        <span>FILTROS:</span>
                    </div>
                    
                    <div className="relatorio-filtro-item">
                        <span className="relatorio-filtro-item-label">TIPO:</span>
                        <select className="relatorio-filtro-select">
                            <option>Todos Atletas</option>
                        </select>
                    </div>
                    
                    <div className="relatorio-filtro-item">
                        <span className="relatorio-filtro-item-label">DURAÇÃO:</span>
                        <select className="relatorio-filtro-select">
                            <option>Última Sessão</option>
                        </select>
                    </div>
                </div>
            </div>

            {loadingData ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--hydro-text-muted)' }}>Carregando dados da equipe...</div>
            ) : !data ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--hydro-text-muted)' }}>
                    Sem dados fisiológicos suficientes para esta equipe.
                </div>
            ) : (
                <>
                    <h3 className="relatorio-section-title">PAINEL LONGITUDINAL (TOP ATLETAS)</h3>
                    <div className="relatorio-painel">
                        
                        <div style={{ height: '250px', width: '100%', marginBottom: '16px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} unit=" L/h" />
                                    <Tooltip cursor={{ fill: '#F8F9FA' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--hydro-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="taxa" fill="#D90429" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="relatorio-painel-footer">
                            <div>
                                <h4 className="relatorio-painel-title">Comportamento Hídrico</h4>
                                <p className="relatorio-painel-desc">Taxa de Suor dos Atletas</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="relatorio-painel-valor">{taxaMedia} <span>L/h</span></div>
                                <div className="relatorio-painel-meta">MÉDIA DA EQUIPE</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="relatorio-section-title">ATLETAS ({data.atletas.length})</h3>
                    <div className="atletas-tabela-container relatorio-tabela-container">
                        <table className="atletas-table">
                            <thead className="relatorio-table-header" style={{ backgroundColor: '#F8F9FA' }}>
                                <tr>
                                    <th>ATLETA</th>
                                    <th>ÚLTIMA TAXA DE SUOR (L/H)</th>
                                    <th>% VARIAÇÃO DE MASSA</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="relatorio-table-body">
                                {data.atletas.map((atleta, idx) => (
                                    <tr key={idx} onClick={() => setSelectedAthleteId(atleta.id)} style={{ cursor: 'pointer' }} className="hover-row">
                                        <td className="td-atleta relatorio-td-atleta" style={idx === data.atletas.length - 1 ? { borderBottom: 'none' } : {}}>
                                            <div className="relatorio-atleta-number">{String(idx + 1).padStart(2, '0')}</div>
                                            <span className="atleta-nome">{atleta.nome}</span>
                                        </td>
                                        <td className="relatorio-td-suor" style={idx === data.atletas.length - 1 ? { borderBottom: 'none' } : {}}>
                                            {atleta.taxa.toFixed(2)}
                                        </td>
                                        <td className="relatorio-td-variacao-estavel" style={idx === data.atletas.length - 1 ? { borderBottom: 'none' } : {}}>
                                            {atleta.variacao.toFixed(1)}%
                                        </td>
                                        <td style={idx === data.atletas.length - 1 ? { borderBottom: 'none' } : {}}>
                                            <div className={`td-status ${statusColor(atleta.status)}`}>
                                                <span className="status-text">{atleta.status.toUpperCase()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {showPreview && pdfBlobUrl && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', width: '90%', height: '90%', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                            <h3 style={{ margin: 0, color: '#111827', fontSize: '18px', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif' }}>
                                Prévia do Relatório da Equipe
                            </h3>
                            <button 
                                onClick={() => setShowPreview(false)} 
                                style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', width: '32px', height: '32px', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                                    e.currentTarget.style.color = '#111827';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#4B5563';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <iframe src={pdfBlobUrl} style={{ flex: 1, border: 'none', background: '#F3F4F6' }} title="Prévia PDF" />
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                            <button onClick={() => setShowPreview(false)} className="btn-ghost-back" style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600 }}>Fechar</button>
                            <button onClick={handleDownload} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600 }}>Baixar PDF</button>
                        </div>
                    </div>
                </div>
            )}

            <AthleteDetailModal 
                isOpen={!!selectedAthleteId} 
                onClose={() => setSelectedAthleteId(null)} 
                atletaId={selectedAthleteId} 
            />
        </div>
    );
}