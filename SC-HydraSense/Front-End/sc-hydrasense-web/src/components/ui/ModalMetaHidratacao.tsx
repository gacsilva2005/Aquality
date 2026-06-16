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
  const [observacao, setObservacao] = useState('');

  const handleSave = () => {
    onSave({ meta: parseFloat(meta), observacao });
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
