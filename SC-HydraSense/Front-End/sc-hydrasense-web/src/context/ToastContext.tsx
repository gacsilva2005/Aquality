import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'warning';

interface ToastState {
    visible: boolean;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextData {
    showToast: (type: ToastType, title: string, message: string) => void;
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    warning: (title: string, message: string) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const globalToast = {
    success: (_title: string, _message: string) => {},
    error: (_title: string, _message: string) => {},
    warning: (_title: string, _message: string) => {},
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState>({
        visible: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        if (toast.visible) {
            setToast(prev => ({ ...prev, visible: false }));
            setTimeout(() => {
                setToast({ visible: true, type, title, message });
            }, 100);
        } else {
            setToast({ visible: true, type, title, message });
        }
    }, [toast.visible]);

    const success = useCallback((title: string, message: string) => {
        showToast('success', title, message);
    }, [showToast]);

    const error = useCallback((title: string, message: string) => {
        showToast('error', title, message);
    }, [showToast]);

    const warning = useCallback((title: string, message: string) => {
        showToast('warning', title, message);
    }, [showToast]);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    // Atualiza a referência global sempre que as funções mudarem
    useEffect(() => {
        globalToast.success = success;
        globalToast.error = error;
        globalToast.warning = warning;
    }, [success, error, warning]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={24} />;
            case 'error': return <AlertCircle size={24} />;
            case 'warning': return <Info size={24} />;
            default: return <Info size={24} />;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, hideToast }}>
            {children}
            
            <div className={`toast-notification ${toast.visible ? 'show' : ''} ${toast.type}`}>
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-content">
                    <span className="toast-title">{toast.title}</span>
                    <span className="toast-message">{toast.message}</span>
                </div>
                <button className="toast-close" onClick={hideToast} aria-label="Fechar notificação">
                    <X size={18} />
                </button>
                <div className="toast-progress-bar" key={toast.visible ? 'visible' : 'hidden'}></div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    return context;
}
