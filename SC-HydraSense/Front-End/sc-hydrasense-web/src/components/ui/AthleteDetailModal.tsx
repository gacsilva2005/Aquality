import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Modal } from './Modal';
import { Button } from './Button';
import { ModalMetaHidratacao } from './ModalMetaHidratacao';

interface AthleteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  atletaId: number | null;
}

export function AthleteDetailModal({ isOpen, onClose, atletaId }: AthleteDetailModalProps) {
  const [athleteData, setAthleteData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [hydrationVal, setHydrationVal] = useState<number>(0);
  const [metaVolume, setMetaVolume] = useState<number>(3000);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalMetaVisible, setModalMetaVisible] = useState(false);

  useEffect(() => {
    if (!atletaId || !isOpen) return;
    
    setLoading(true);
    const API_URL = 'http://localhost:8080';

    Promise.all([
      fetch(`${API_URL}/Atleta/${atletaId}`).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/sessoes-de-treino/atleta/${atletaId}`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/hidratacao/atleta/${atletaId}`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/meta-hidratacao/atleta/${atletaId}`).then(r => r.ok ? r.json() : null)
    ]).then(([athleteRes, sessionsRes, hydrationRes, metaRes]) => {
      setAthleteData(athleteRes);
      setSessions(sessionsRes);
      
      if (hydrationRes) {
        const todayStr = new Date().toDateString();
        const totalToday = hydrationRes
            .filter((item: any) => item.dataHora && new Date(item.dataHora).toDateString() === todayStr)
            .reduce((sum: number, item: any) => sum + item.volume, 0);
        setHydrationVal(totalToday);
      } else {
        setHydrationVal(0);
      }

      if (metaRes) {
        setMetaVolume(metaRes.metaVolumeMl || 3000);
      } else {
        setMetaVolume(3000);
      }

      setLoading(false);
    }).catch(err => {
      console.error("Erro ao carregar detalhes do atleta:", err);
      setLoading(false);
    });
  }, [atletaId, isOpen]);

  if (!isOpen) return null;

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return '--';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return `${idade} ANOS`;
  };

  const photoSource = athleteData?.fotoPerfil
    ? (athleteData.fotoPerfil.startsWith('data:image')
        ? athleteData.fotoPerfil
        : `data:image/jpeg;base64,${athleteData.fotoPerfil}`)
    : 'https://via.placeholder.com/150?text=Atleta';

  const finishedSessions = sessions.filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null);
  const sortedFinished = [...finishedSessions].sort((a: any, b: any) => new Date(a.dataHoraFim).getTime() - new Date(b.dataHoraFim).getTime());
  
  const chartData = sortedFinished.map((s: any) => {
    const d = new Date(s.dataHoraFim);
    return {
      name: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      sudorese: s.taxaSudorese
    };
  });

  const latestSweatRate = sortedFinished.length > 0 ? sortedFinished[sortedFinished.length - 1].taxaSudorese : null;

  const recentRecords = [...sessions]
    .filter((s: any) => s.dataHoraFim !== null)
    .sort((a: any, b: any) => new Date(b.dataHoraFim).getTime() - new Date(a.dataHoraFim).getTime())
    .slice(0, 5);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveMeta = async (data: any) => {
    try {
      const response = await fetch(`http://localhost:8080/meta-hidratacao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              atletaId: atletaId,
              metaVolumeMl: data.meta * 1000, // converte de Litros (input do form) para ml
              observacoes: data.observacao
          })
      });

      if (response.ok) {
          const updated = await response.json();
          setMetaVolume(updated.metaVolumeMl);
      }
    } catch (error) {
        console.error('Erro ao salvar meta:', error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Atleta">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Carregando dados...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* CABEÇALHO */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img src={photoSource} alt={athleteData?.nome} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--hydro-text)' }}>{athleteData?.nome || 'Atleta'}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--hydro-text-muted)', fontSize: '14px' }}>
                  {athleteData?.modalidade || 'Sem modalidade'} • #{atletaId} • {athleteData?.dataNascimento ? calcularIdade(athleteData.dataNascimento) : '--'}
                </p>
              </div>
              <div style={{ textAlign: 'right', backgroundColor: 'var(--hydro-gray-100)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--hydro-text-muted)', fontWeight: 600 }}>HIDRATAÇÃO HOJE</div>
                <div style={{ fontSize: '18px', color: 'var(--hydro-primary)', fontWeight: 700 }}>{hydrationVal} / {metaVolume} ml</div>
              </div>
            </div>

            {/* GRÁFICO */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--hydro-border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--hydro-text)' }}>TAXA DE SUDORESE (L/h)</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--hydro-text-muted)' }}>Histórico de Sessões</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--hydro-primary)' }}>{latestSweatRate !== null ? latestSweatRate.toFixed(1) : '--'}</span>
                  <span style={{ fontSize: '14px', color: 'var(--hydro-text-muted)', marginLeft: '4px' }}>L/h</span>
                </div>
              </div>

              {chartData.length > 0 ? (
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#666' }} unit=" L/h" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="sudorese" stroke="#D90429" strokeWidth={3} dot={{ r: 4, fill: '#D90429' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                     <span style={{ fontSize: '12px', color: 'var(--hydro-text-muted)', fontWeight: 600 }}>DATA DA SESSÃO</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--hydro-text-muted)' }}>Sem dados de sudorese para exibir</div>
              )}
            </div>

            {/* SESSÕES RECENTES */}
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--hydro-text)', marginBottom: '12px' }}>REGISTROS RECENTES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                {recentRecords.length > 0 ? recentRecords.map((session: any) => {
                  const start = new Date(session.dataHoraInicio);
                  const end = new Date(session.dataHoraFim);
                  const duracaoMin = Math.round((end.getTime() - start.getTime()) / 60000);

                  return (
                    <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--hydro-border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--hydro-text)' }}>{session.modalidade || 'Treino'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--hydro-text-muted)' }}>{formatTime(session.dataHoraFim)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: 'var(--hydro-text)' }}>{duracaoMin} min</div>
                        <div style={{ fontSize: '12px', color: 'var(--hydro-primary)', fontWeight: 600 }}>
                          {session.taxaSudorese ? `${session.taxaSudorese.toFixed(1)} L/h` : '--'}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--hydro-text-muted)', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>Nenhum treino registrado.</div>
                )}
              </div>
            </div>

            {/* BOTÃO NOVA META */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => setModalMetaVisible(true)}>
                Definir Nova Meta de Hidratação
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ModalMetaHidratacao 
        isOpen={modalMetaVisible}
        onClose={() => setModalMetaVisible(false)}
        atletaNome={athleteData?.nome || 'Atleta'}
        ultimaTaxa={latestSweatRate}
        onSave={handleSaveMeta}
      />
    </>
  );
}
