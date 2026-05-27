import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Fundo claro padrão do app
  },
  backButton: {
    position: 'absolute',
    top: 60, // Ajuste dependendo da safe area do seu aparelho
    left: 24,
    zIndex: 10,
    padding: 8, // Aumenta a área de clique
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 200, // Dá espaço para o botão de voltar não encostar no texto
    paddingBottom: 20,
  },
  
  // --- TEXTOS DO TOPO ---
  header: {
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 100,
  },

  // --- INPUT GIGANTE ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: -40, // Sobe um pouco para ficar perfeitamente centralizado no visual
  },
  hugeInput: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 80, // Tamanho gigante igual ao design
    color: theme.colors.primary, // Vermelho chamativo
    textAlign: 'center',
    minWidth: 150, // Garante que não fique tremendo muito quando digita
  },
  unitText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 24,
    color: '#999999',
    marginLeft: 8,
  },

  // --- FOOTER ---
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
});