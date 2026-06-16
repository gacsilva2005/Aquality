import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { Droplets, Calendar, Cloud, Activity, AlignLeft } from 'lucide-react';

interface ModalMetaHidratacaoProps {
  isOpen: boolean;
  onClose: () => void;
  atletaNome: string;
  ultimaTaxa: number | null;
  onSave: (data: any) => void;
}

export function ModalMetaHidratacao({ isOpen, onClose, atletaNome, ultimaTaxa, onSave }: ModalMetaHidratacaoProps) {
  const [meta, setMeta] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [condicao, setCondicao] = useState('Normal');
  const [tipoSessao, setTipoSessao] = useState('Treino Tático');
  const [observacao, setObservacao] = useState('');

  const handleSave = () => {
    onSave({ meta: parseFloat(meta), vigencia, condicao, tipoSessao, observacao });
    onClose();
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} style={{ padding: '10px 20px' }}>Cancelar</Button>
      <Button variant="primary" onClick={handleSave} style={{ padding: '10px 20px' }}>Salvar Meta</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Meta de Hidratação: ${atletaNome}`} footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Input 
            label="Meta de Ingestão (L/h)" 
            type="number" 
            step="0.05"
            min="0.3"
            max="3.0"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            iconLeft={<Droplets size={18} color="#6C757D" />}
            placeholder="Ex: 1.5"
          />
          {ultimaTaxa !== null && (
            <span style={{ fontSize: '12px', color: 'var(--hydro-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
              ↳ Última taxa de sudorese registrada: {ultimaTaxa.toFixed(2)} L/h
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
                <Input 
                  label="Período de Vigência" 
                  type="date"
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  iconLeft={<Calendar size={18} color="#6C757D" />}
                />
            </div>
            <div style={{ flex: 1 }}>
                <Select 
                  label="Condição Ambiental"
                  value={condicao}
                  onChange={(e) => setCondicao(e.target.value)}
                  iconLeft={<Cloud size={18} color="#6C757D" />}
                >
                  <option value="Normal">Normal</option>
                  <option value="Calor Intenso">Calor Intenso</option>
                  <option value="Frio">Frio</option>
                </Select>
            </div>
        </div>

        <Select 
          label="Tipo de Sessão"
          value={tipoSessao}
          onChange={(e) => setTipoSessao(e.target.value)}
          iconLeft={<Activity size={18} color="#6C757D" />}
        >
          <option value="Treino Tático">Treino Tático</option>
          <option value="Regenerativo">Regenerativo</option>
          <option value="Jogo Oficial">Jogo Oficial</option>
          <option value="Musculação">Musculação</option>
        </Select>

        <Input 
          label="Observação Clínica (Opcional)" 
          type="text"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          iconLeft={<AlignLeft size={18} color="#6C757D" />}
          placeholder="Ex: Atleta relatou câimbras recentes"
        />

      </div>
    </Modal>
  );
}
