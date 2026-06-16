import React, { createContext, useContext, useState } from 'react';
import { CustomModal, SuccessModal, WarningModal } from '../components/CustomModal'; // Importando o novo modal de aviso

const AlertContext = createContext<any>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalData, setModalData] = useState({ 
    visible: false, 
    title: '', 
    message: '', 
    type: 'error' as 'error' | 'success' | 'warning', 
    onOk: () => {} 
  });

  const show = (type: 'error' | 'success' | 'warning', title: string, message: string, onOk?: () => void) => {
    setModalData({ 
      visible: true, 
      title, 
      message, 
      type, 
      onOk: () => {
        setModalData(prev => ({ ...prev, visible: false }));
        if (onOk) {
          onOk();
        }
      }
    });
  };

  return (
    <AlertContext.Provider value={{ 
      error: (t: string, m: string, cb?: () => void) => show('error', t, m, cb), 
      success: (t: string, m: string, cb?: () => void) => show('success', t, m, cb),
      warning: (t: string, m: string, cb?: () => void) => show('warning', t, m, cb) 
    }}>
      {children}
      
      {/* Modal de Erro (E-mail) */}
      <CustomModal 
        visible={modalData.type === 'error' && modalData.visible} 
        title={modalData.title} 
        message={modalData.message} 
        onOk={modalData.onOk} 
      />

      {/* Modal de Sucesso (Verde) */}
      <SuccessModal 
        visible={modalData.type === 'success' && modalData.visible} 
        title={modalData.title} 
        subtitle={modalData.message} 
        onOk={modalData.onOk} 
      />

      {/* NOVO: Modal de Atenção (Exclamação Laranja) */}
      <WarningModal 
        visible={modalData.type === 'warning' && modalData.visible} 
        title={modalData.title} 
        message={modalData.message} 
        onOk={modalData.onOk} 
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);