import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { AthleteDetailModal } from '../../components/ui/AthleteDetailModal';

interface Equipe {
  id: number;
  nome: string;
}

interface DashboardData {
  totalAtletas: number;
  sessoesUltimos7Dias: number;
  taxaMediaSudorese: number;
  variacaoMediaMassa: number;
  temperaturaAtual: number | null;
  umidadeAtual: number | null;
  descricaoClima: string | null;
  rankingPerformance: {
    id: number;
    nome: string;
    avatar: string | null;
    totalSessoes: number;
    sessoesIdeais: number;
    percentualIdeal: number;
  }[];
  mapaRisco: {
    id: number;
    nome: string;
    avatar: string | null;
    status: string;
    statusColor: string;
    variacaoMassa: number;
    taxaSudorese: number;
    alerta: string;
  }[];
  sintomasRecorrentes: any[];
  alertasOutliers: {
    sessaoId: number;
    atletaId: number;
    nomeAtleta: string;
    tipo: string;
    descricao: string;
    dataHora: string;
  }[];
  tendenciaSemanal: any[];
  atletasCriticos: number;
  atletasAtencao: number;
  atletasIdeais: number;
  atletasSuperingestao: number;
}

export function Dashboard() {
  const { user } = useUser();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [selectedEquipe, setSelectedEquipe] = useState<number | ''>('');
  const [selectedDias, setSelectedDias] = useState<number>(7);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(null);

  const clubeId = user?.clube?.id || 1;

  useEffect(() => {
    fetch(`http://localhost:8080/Equipe/clube/${clubeId}`)
      .then(res => res.json())
      .then(data => setEquipes(data))
      .catch(err => console.error("Erro ao buscar equipes:", err));
  }, [clubeId]);

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:8080/api/dashboard/profissional/${clubeId}?dias=${selectedDias}`;
    if (selectedEquipe !== '') {
      url += `&equipeId=${selectedEquipe}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dashboard:", err);
        setLoading(false);
      });
  }, [clubeId, selectedEquipe, selectedDias]);

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `há ${diffInHours}h`;
    const diffInDays = Math.round(diffInHours / 24);
    return `há ${diffInDays}d`;
  };

  return (
    <>
      {/* === CABEÇALHO E FILTROS === */}
      <header className="atletas-header dashboard-header-compact">
        <div className="atletas-header__info">
          <h1 className="pageweb__title">ESCOPO DE DADOS</h1>
        </div>
        <div className="filtros-container dashboard-filtros-inline">
          <div className="filtro-grupo">
            <select 
              value={selectedEquipe} 
              onChange={(e) => setSelectedEquipe(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Equipe: Todas</option>
              {equipes.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.nome}</option>
              ))}
            </select>
          </div>
          <div className="filtro-grupo">
            <select 
              value={selectedDias} 
              onChange={(e) => setSelectedDias(Number(e.target.value))}
            >
              <option value={7}>Período: Últimos 7 Dias</option>
              <option value={14}>Período: Últimos 14 Dias</option>
              <option value={30}>Período: Últimos 30 Dias</option>
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Carregando dados...</div>
      ) : (
        <>
          {/* === CARTÕES DE RESUMO (KPIs) === */}
          <section className="dashboard-kpi-grid">
            <div className="dashboard-kpi-card">
              <p className="dashboard-kpi-label">SESSÕES REGISTRADAS</p>
              <h2 className="dashboard-kpi-value">{dashboardData?.sessoesUltimos7Dias ?? 0}</h2>
            </div>

            <div className="dashboard-kpi-card">
              <p className="dashboard-kpi-label">PERDA MÉDIA DE MASSA %</p>
              <h2 className="dashboard-kpi-value">{dashboardData?.variacaoMediaMassa?.toFixed(2) ?? 0}<span className="dashboard-kpi-unit">%</span></h2>
            </div>

            <div className="dashboard-kpi-card">
              <p className="dashboard-kpi-label">TAXA MÉDIA DE SUDORESE</p>
              <h2 className="dashboard-kpi-value">{dashboardData?.taxaMediaSudorese?.toFixed(2) ?? 0} <span className="dashboard-kpi-unit">L/h</span></h2>
            </div>

            <div className={`dashboard-kpi-card ${(dashboardData?.atletasCriticos ?? 0) > 0 ? 'dashboard-kpi-alert' : ''}`}>
              <p className="dashboard-kpi-label">ATLETAS &gt;2% PERDA</p>
              <h2 className="dashboard-kpi-value">{dashboardData?.atletasCriticos ?? 0} {(dashboardData?.atletasCriticos ?? 0) > 0 && '⚠️'}</h2>
            </div>

            <div className={`dashboard-kpi-card ${(dashboardData?.atletasSuperingestao ?? 0) > 0 ? 'dashboard-kpi-warning' : ''}`}>
              <p className="dashboard-kpi-label">ALERTAS DE GANHO DE PESO</p>
              <h2 className="dashboard-kpi-value">{dashboardData?.atletasSuperingestao ?? 0}</h2>
            </div>

            <div className="dashboard-kpi-card">
              <p className="dashboard-kpi-label">AMBIENTE MÉDIO</p>
              <h2 className="dashboard-kpi-value dashboard-kpi-value-sm">
                {dashboardData?.temperaturaAtual ? `${Math.round(dashboardData.temperaturaAtual)}°C` : '--'}
              </h2>
              <p className="dashboard-kpi-sub">
                {dashboardData?.umidadeAtual ? `${Math.round(dashboardData.umidadeAtual)}% UR` : '--'}
              </p>
            </div>
          </section>

          {/* === ÁREA CENTRAL (Tabela + Alertas) === */}
          <div className="dashboard-middle-area">

            <section className="atletas-tabela-container">
              <h3 className="dashboard-section-title">
                📊 MAPA DE RISCO
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="atletas-table">
                  <thead>
                    <tr>
                      <th>ATLETA</th>
                      <th>% VAR MASSA</th>
                      <th>SUOR L/H</th>
                      <th>STATUS</th>
                      <th>ALERTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.mapaRisco ?? []).length > 0 ? (
                      (dashboardData?.mapaRisco ?? []).map((atleta) => (
                        <tr key={atleta.id} onClick={() => setSelectedAthleteId(atleta.id)} style={{ cursor: 'pointer' }} title="Clique para ver os detalhes do atleta">
                          <td className="td-bold">{atleta.nome}</td>
                          <td>
                            <span className={`badge-variacao ${atleta.status.toLowerCase().replace(' ', '-')}`}>
                              {atleta.variacaoMassa?.toFixed(2)}%
                            </span>
                          </td>
                          <td>{atleta.taxaSudorese?.toFixed(2)}</td>
                          <td>
                            <span className={`dot-inline ${atleta.status.toLowerCase().replace(' ', '-')}`}>●</span> {atleta.status}
                          </td>
                          <td>
                            {atleta.alerta ? <span className="alert-icon" title={atleta.alerta}>⚠️</span> : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>Nenhum dado encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="dashboard-alerts-aside">
              <h3 className="dashboard-section-title">
                ⏱️ INCONSISTÊNCIAS ATIVAS
              </h3>

              {(dashboardData?.alertasOutliers ?? []).length > 0 ? (
                (dashboardData?.alertasOutliers ?? []).map((alerta) => (
                  <div key={alerta.sessaoId} className={`dashboard-alert-card ${alerta.tipo.includes('MUITO_ALTA') || alerta.tipo.includes('MUITO_BAIXA') ? 'dashboard-alert-critico' : 'dashboard-alert-moderado'}`}>
                    <div className="dashboard-alert-header">
                      <span className="dashboard-alert-code">{alerta.nomeAtleta}</span>
                      <span className="dashboard-alert-time">{getTimeAgo(alerta.dataHora)}</span>
                    </div>
                    <p className="dashboard-alert-desc">
                      <strong>{alerta.tipo.replace(/_/g, ' ')}</strong><br />
                      {alerta.descricao}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>Nenhuma inconsistência.</div>
              )}
            </aside>

          </div>

          {/* === RANKING DE ADESÃO HÍDRICA === */}
          <section style={{ marginTop: '24px' }}>
            <h3 className="dashboard-section-title">
              🏆 RANKING — ADESÃO HÍDRICA
            </h3>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--hydro-border)', padding: '8px 24px' }}>
              {(dashboardData?.rankingPerformance ?? []).length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Sem dados suficientes para ranking</div>
              ) : (
                (dashboardData?.rankingPerformance ?? []).map((atleta, index) => (
                  <div 
                    key={atleta.id} 
                    onClick={() => setSelectedAthleteId(atleta.id)}
                    style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: index !== dashboardData!.rankingPerformance.length - 1 ? '1px solid var(--hydro-border)' : 'none', cursor: 'pointer' }}
                    className="hover-row"
                  >
                    <div style={{ width: '40px', fontWeight: 700, color: 'var(--hydro-text-muted)', fontSize: '18px' }}>
                      {index + 1}º
                    </div>
                    <img 
                      src={atleta.avatar ? (atleta.avatar.startsWith('data:image') ? atleta.avatar : `data:image/jpeg;base64,${atleta.avatar}`) : 'https://via.placeholder.com/150?text=Atleta'} 
                      alt={atleta.nome} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginRight: '16px' }} 
                    />
                    <div style={{ flex: 1, paddingRight: '24px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--hydro-text)', marginBottom: '8px', fontSize: '15px' }}>{atleta.nome}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <div style={{ height: '10px', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden', flex: 1, maxWidth: '400px', display: 'flex' }}>
                          <div style={{ 
                            height: '100%', 
                            backgroundColor: (atleta.percentualIdeal || 0) >= 80 ? '#16A34A' : (atleta.percentualIdeal || 0) >= 50 ? '#D97706' : '#DC2626', 
                            width: `${Math.min(atleta.percentualIdeal || 0, 100)}%`, 
                            borderRadius: '5px',
                            transition: 'width 0.5s ease-in-out'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--hydro-text-muted)', whiteSpace: 'nowrap' }}>{atleta.sessoesIdeais} de {atleta.totalSessoes} sessões ideais</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--hydro-text)' }}>
                      {atleta.percentualIdeal.toFixed(0)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <AthleteDetailModal 
            isOpen={!!selectedAthleteId} 
            onClose={() => setSelectedAthleteId(null)} 
            atletaId={selectedAthleteId} 
          />
        </>
      )}
    </>
  );
}