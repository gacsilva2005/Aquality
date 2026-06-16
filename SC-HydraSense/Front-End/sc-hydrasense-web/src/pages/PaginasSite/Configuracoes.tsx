import { useToast } from '../../context/ToastContext';

export function Configuracoes() {
  const { success } = useToast();

  const handleSave = () => {
    success('Configurações Salvas', 'Suas preferências foram atualizadas com sucesso.');
  };

  return (
    <>
      <div className="configuracoes-header">
        <h1 className="pageweb__title">CONFIGURAÇÕES</h1>
        <p style={{ color: 'var(--hydro-text-muted)', marginTop: '10px' }}>
          Personalize as preferências do seu painel e configurações de conta.
        </p>
      </div>

      <section className="configuracoes-content" style={{ marginTop: '40px' }}>
        <p>Configurações em desenvolvimento...</p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '20px' }}
          onClick={handleSave}
        >
          SALVAR CONFIGURAÇÕES
        </button>
      </section>
    </>
  );
}