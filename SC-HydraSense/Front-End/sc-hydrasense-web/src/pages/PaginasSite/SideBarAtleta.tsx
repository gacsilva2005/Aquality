import { useState } from 'react';
import { X, User, Activity, Droplet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModalMetaHidratacao } from '../../components/ui/ModalMetaHidratacao';

interface SideBarAtletaProps {
    aberto: boolean;
    onFechar: () => void;
    atleta: any;
}

export function SideBarAtleta({ aberto, onFechar, atleta }: SideBarAtletaProps) {
    const [modalAberto, setModalAberto] = useState(false);

    if (!aberto || !atleta) return null;

    const handleSalvarMeta = (data: any) => {
        console.log("Meta salva:", data);
        alert('Meta de hidratação atualizada com sucesso!');
        // Aqui chamaria a API
    };

    return (
        <div className="sidebar-overlay" onClick={onFechar} style={{ zIndex: 9998 }}>
            <div className={`sidebar-container ${aberto ? 'aberto' : ''}`} onClick={e => e.stopPropagation()}>
                
                {/* CABEÇALHO */}
                <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="sidebar-title">Detalhes do Atleta</h2>
                        <button className="sidebar-close-btn" onClick={onFechar}>
                            <X size={20} />
                        </button>
                    </div>
                    
                    <Button variant="primary" onClick={() => setModalAberto(true)} style={{ alignSelf: 'flex-start', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Droplet size={16} /> Definir Meta
                    </Button>
                </div>

                {/* CONTEÚDO */}
                <div className="sidebar-content">
                    <div className="perfil-avatar-container" style={{ margin: '20px 0' }}>
                        <div className="perfil-avatar-placeholder" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--hydro-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={32} color="var(--hydro-text-muted)" />
                        </div>
                    </div>

                    <div className="perfil-dados-secao">
                        <h3 className="perfil-dados-titulo">DADOS CLÍNICOS E ESPORTIVOS</h3>
                        
                        <div className="perfil-campo">
                            <span className="perfil-campo-label">NOME</span>
                            <span className="perfil-campo-valor">{atleta.nome}</span>
                        </div>
                        
                        <div className="perfil-campo">
                            <span className="perfil-campo-label">CLUBE</span>
                            <span className="perfil-campo-valor">{atleta.clube?.nome || 'Sem clube'}</span>
                        </div>

                        <div className="perfil-campo">
                            <span className="perfil-campo-label">PESO ATUAL</span>
                            <span className="perfil-campo-valor">{atleta.pesoAtual || '--'} kg</span>
                        </div>

                        <div className="perfil-campo">
                            <span className="perfil-campo-label">TAXA DE SUDORESE (ÚLTIMA)</span>
                            <span className="perfil-campo-valor" style={{ color: 'var(--hydro-action)', fontWeight: 'bold' }}>
                                <Activity size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                1.8 L/h
                            </span>
                        </div>
                    </div>
                </div>

                {/* MODAL */}
                <ModalMetaHidratacao 
                  isOpen={modalAberto} 
                  onClose={() => setModalAberto(false)} 
                  atletaNome={atleta.nome}
                  ultimaTaxa={1.8}
                  onSave={handleSalvarMeta}
                />
            </div>
        </div>
    );
}
