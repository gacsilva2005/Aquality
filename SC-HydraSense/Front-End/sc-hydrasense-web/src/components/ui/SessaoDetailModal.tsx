import { X, Activity, Droplets, Thermometer, Clock, Target, Scale, Beaker } from 'lucide-react';
import { useEffect } from 'react';

interface SessaoDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: any;
}

export function SessaoDetailModal({ isOpen, onClose, session }: SessaoDetailModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !session) return null;

    const formatTime = (dateStr: string) => {
        if (!dateStr) return '--:--';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '--/--/----';
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    };

    const URINE_COLORS = [
      '#F5F5DC',
      '#FFFACD',
      '#FFFFE0',
      '#FFD700',
      '#FFC700',
      '#FFA500',
      '#FF8C00',
      '#FF7F50',
    ];

    const getUrinaLabel = (val: number | string) => {
        if (val == null) return <span style={{ color: '#0F172A' }}>--</span>;
        const num = Number(val);
        const color = URINE_COLORS[num - 1] || '#E2E8F0';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}></div>
                <span style={{ color: '#0F172A', fontWeight: 600 }}>Nível {num}</span>
            </div>
        );
    };

    const getSedeLabel = (val: number | string | boolean) => {
        if (val == null) return '--';
        if (typeof val === 'boolean') return val ? 'Alta' : 'Normal';
        return `Nível ${val}`;
    };

    const formatSintomas = (sintomasStr: string | null | undefined) => {
        if (!sintomasStr || sintomasStr === 'Nenhum') return 'Nenhum';
        try {
            const obj = JSON.parse(sintomasStr);
            const sel = obj.selecionados || [];
            const out = obj.outros ? [obj.outros] : [];
            const all = [...sel, ...out];
            return all.length > 0 ? all.join(', ') : 'Nenhum';
        } catch {
            return sintomasStr;
        }
    };

    const kitLabel = session.usouEquipamento && session.nomeKit ? `${session.nomeKit} (${session.pesoKitKg != null ? session.pesoKitKg.toFixed(2) + ' kg' : ''})` : 'Sem Kit';

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative' }}>
                <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', padding: '20px 24px', borderBottom: '1px solid var(--hydro-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--hydro-text)', fontWeight: 700 }}>Resumo da Sessão</h2>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--hydro-text-muted)', fontSize: '14px' }}>
                            {session.modalidade || 'Treinamento'} • {formatDate(session.dataHoraInicio)}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        style={{ background: 'var(--hydro-gray-100)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hydro-text-muted)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* INFO PRINCIPAL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', marginBottom: '8px' }}>
                                <Clock size={16} /> <span style={{ fontSize: '13px', fontWeight: 700 }}>DURAÇÃO</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Início</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{formatTime(session.dataHoraInicio)}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Fim</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{formatTime(session.dataHoraFim)}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', marginBottom: '8px' }}>
                                <Activity size={16} /> <span style={{ fontSize: '13px', fontWeight: 700 }}>INDICADORES</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Kit Utilizado</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{kitLabel}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DADOS FISIOLÓGICOS (MOTOR DE SUDORESE) */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hydro-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Droplets size={18} color="var(--hydro-primary)" /> MOTOR DE SUDORESE
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ backgroundColor: 'rgba(217, 4, 41, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(217, 4, 41, 0.1)' }}>
                                <div style={{ fontSize: '12px', color: 'var(--hydro-primary)', fontWeight: 700, marginBottom: '4px' }}>TAXA DE SUDORESE</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--hydro-primary)' }}>{session.taxaSudorese != null ? session.taxaSudorese.toFixed(2) : '--'} <span style={{ fontSize: '14px', fontWeight: 600 }}>L/h</span></div>
                            </div>
                            <div style={{ backgroundColor: '#F1F5F9', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                                <div style={{ fontSize: '12px', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>BALANÇO HÍDRICO</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>{session.balancoHidrico != null ? session.balancoHidrico.toFixed(2) : '--'} <span style={{ fontSize: '14px', fontWeight: 600 }}>kg</span></div>
                            </div>
                        </div>
                    </div>

                    {/* PRÉ X PÓS SESSÃO COMPARATIVO */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hydro-text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Scale size={18} color="var(--hydro-text)" /> AVALIAÇÃO PRÉ X PÓS
                        </h3>
                        <div style={{ border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155', width: '33%' }}>MÉTRICA</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155', width: '33%' }}>PRÉ-TREINO</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#334155' }}>PÓS-TREINO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>Peso Corporal</td>
                                        <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 600 }}>{session.pesoPre != null ? `${session.pesoPre.toFixed(1)} kg` : '--'}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: session.pesoPos != null && session.pesoPre != null && session.pesoPos < session.pesoPre ? 'var(--hydro-primary)' : '#0F172A' }}>
                                            {session.pesoPos != null ? `${session.pesoPos.toFixed(1)} kg` : '--'}
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>Cor da Urina</td>
                                        <td style={{ padding: '12px 16px' }}>{getUrinaLabel(session.urinaPre)}</td>
                                        <td style={{ padding: '12px 16px' }}>{getUrinaLabel(session.urinaPos)}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>Sensação de Sede</td>
                                        <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 600 }}>{getSedeLabel(session.sedePre)}</td>
                                        <td style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 600 }}>{getSedeLabel(session.sedePos)}</td>
                                    </tr>
                                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>Sintomas</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#0F172A', fontWeight: 500 }}>{formatSintomas(session.sintomasPre)}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#0F172A', fontWeight: 500 }}>{formatSintomas(session.sintomasPos)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
