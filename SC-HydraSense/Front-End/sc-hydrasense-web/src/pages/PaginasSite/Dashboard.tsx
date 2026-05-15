export function Dashboard() {
  return (
    <>
      {/* === CABEÇALHO E FILTROS === */}
      <header className="atletas-header dashboard-header-compact">
        <div className="atletas-header__info">
          <h1 className="pageweb__title">ESCOPO DE DADOS</h1>
        </div>
        <div className="filtros-container dashboard-filtros-inline">
          <div className="filtro-grupo">
            <select>
              <option>Equipe: Primeiro Esquadrão</option>
            </select>
          </div>
          <div className="filtro-grupo">
            <select>
              <option>Período: Últimos 7 Dias</option>
            </select>
          </div>
          <div className="filtro-grupo">
            <select>
              <option>Modalidade: Campo</option>
            </select>
          </div>
          <div className="filtro-grupo">
            <select>
              <option>Amb: Quente/Úmido</option>
            </select>
          </div>
        </div>
      </header>

      {/* === CARTÕES DE RESUMO (KPIs) === */}
      <section className="dashboard-kpi-grid">
        <div className="dashboard-kpi-card">
          <p className="dashboard-kpi-label">SESSÕES REGISTRADAS</p>
          <h2 className="dashboard-kpi-value">124</h2>
        </div>

        <div className="dashboard-kpi-card">
          <p className="dashboard-kpi-label">PERDA MÉDIA DE MASSA %</p>
          <h2 className="dashboard-kpi-value">1.84<span className="dashboard-kpi-unit">%</span></h2>
        </div>

        <div className="dashboard-kpi-card">
          <p className="dashboard-kpi-label">TAXA MÉDIA DE SUDORESE</p>
          <h2 className="dashboard-kpi-value">1.12 <span className="dashboard-kpi-unit">L/h</span></h2>
        </div>

        <div className="dashboard-kpi-card dashboard-kpi-alert">
          <p className="dashboard-kpi-label">ATLETAS &gt;2% PERDA</p>
          <h2 className="dashboard-kpi-value">14 ⚠️</h2>
        </div>

        <div className="dashboard-kpi-card dashboard-kpi-warning">
          <p className="dashboard-kpi-label">ALERTAS DE GANHO DE PESO</p>
          <h2 className="dashboard-kpi-value">3</h2>
        </div>

        <div className="dashboard-kpi-card">
          <p className="dashboard-kpi-label">AMBIENTE MÉDIO</p>
          <h2 className="dashboard-kpi-value dashboard-kpi-value-sm">28°C</h2>
          <p className="dashboard-kpi-sub">65% UR</p>
        </div>
      </section>

      {/* === ÁREA CENTRAL (Tabela + Alertas) === */}
      <div className="dashboard-middle-area">

        <section className="atletas-tabela-container">
          <h3 className="dashboard-section-title">
            📊 MAPA DE RISCO
          </h3>
          <table className="atletas-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>EQUIPE</th>
                <th>% VAR MASSA</th>
                <th>SUOR L/H</th>
                <th>URINA/SINT</th>
                <th>ALERTA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-bold">ATH-042</td>
                <td className="td-muted">ZAG</td>
                <td><span className="badge-variacao critico">-2.3%</span></td>
                <td>1.85</td>
                <td><span className="dot-inline moderado">●</span> 4</td>
                <td><span className="alert-icon">🛑</span></td>
              </tr>
              <tr>
                <td className="td-bold">ATH-018</td>
                <td className="td-muted">MEI</td>
                <td><span className="badge-variacao estavel">-0.8%</span></td>
                <td>0.95</td>
                <td><span className="dot-inline atencao">●</span> 2</td>
                <td>-</td>
              </tr>
              <tr>
                <td className="td-bold">ATH-009</td>
                <td className="td-muted">ATA</td>
                <td><span className="badge-variacao moderado">-1.4%</span></td>
                <td>1.40</td>
                <td><span className="dot-inline moderado">●</span> 6</td>
                <td>-</td>
              </tr>
              <tr>
                <td className="td-bold">ATH-088</td>
                <td className="td-muted">GOL</td>
                <td><span className="badge-variacao critico">-2.1%</span></td>
                <td>0.60</td>
                <td><span className="dot-inline atencao">●</span> 1</td>
                <td><span className="alert-icon">⚠️</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        <aside className="dashboard-alerts-aside">
          <h3 className="dashboard-section-title">
            ⏱️ INCONSISTÊNCIAS ATIVAS
          </h3>

          <div className="dashboard-alert-card dashboard-alert-critico">
            <div className="dashboard-alert-header">
              <span className="dashboard-alert-code">ATH-042</span>
              <span className="dashboard-alert-time">há 1d</span>
            </div>
            <p className="dashboard-alert-desc">Taxa de sudorese &gt; 2.5 L/h.<br />Outlier extremo para as condições ambientais atuais.</p>
          </div>

          <div className="dashboard-alert-card dashboard-alert-moderado">
            <div className="dashboard-alert-header">
              <span className="dashboard-alert-code">ATH-088</span>
              <span className="dashboard-alert-time">há 1d</span>
            </div>
            <p className="dashboard-alert-desc">Taxa de sudorese &gt; 2.5 L/h.<br />Outlier extremo para as condições ambientais atuais.</p>
          </div>

          <div className="dashboard-alert-card dashboard-alert-critico">
            <div className="dashboard-alert-header">
              <span className="dashboard-alert-code">ATH-012</span>
              <span className="dashboard-alert-time">há 1d</span>
            </div>
            <p className="dashboard-alert-desc">Taxa de sudorese &gt; 2.5 L/h.<br />Outlier extremo para as condições ambientais atuais.</p>
          </div>
        </aside>

      </div>

      {/* === GRÁFICOS === */}
      <section className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h4 className="dashboard-chart-title">PERDA DE MASSA VS TEMPERATURA</h4>
          <div className="dashboard-chart-placeholder">
            ÁREA DE VISUALIZAÇÃO DO GRÁFICO DE LINHA DUPLA
          </div>
        </div>

        <div className="dashboard-chart-card">
          <h4 className="dashboard-chart-title">MAPA DE CALOR — TAXA DE SUDORESE</h4>
          <div className="dashboard-chart-placeholder">
            ÁREA DO MAPA DE CALOR POR HORA DO DIA
          </div>
        </div>
      </section>

      {/* === RODAPÉ DE QUALIDADE DE DADOS === */}
      <footer className="dashboard-quality-footer">
        <div className="dashboard-quality-left">
          <div className="dashboard-quality-icon">
            📋
          </div>
          <div>
            <h4 className="dashboard-quality-title">Qualidade de Dados &amp; Adesão</h4>
            <p className="dashboard-quality-desc">Taxa de conclusão do checklist: <span className="dashboard-quality-highlight">87%</span></p>
          </div>
        </div>
        <div className="dashboard-quality-badge">
          <span className="dashboard-quality-dot">●</span> 5 Atletas ausentes &gt;7 dias
        </div>
      </footer>
    </>
  );
}