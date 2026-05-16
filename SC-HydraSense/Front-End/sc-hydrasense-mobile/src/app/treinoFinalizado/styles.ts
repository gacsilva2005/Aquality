import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/src/global/themas';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 24,
  },

  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10, 
  },

  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 30,
    color: theme.colors.textPrimary, 
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.headingRegular,
    fontSize: 16,
    color: theme.colors.textBrown,
    textAlign: 'center',
    lineHeight: 24, 
    marginBottom: 48,
  },
  // ... (seus estilos de cima: container, content, iconContainer, title, subtitle) ...

  // --- ESTILOS DOS CARDS ADICIONADOS ---
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
    marginBottom: 40, // Espaço entre os cards e os botões
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    // Efeito de sombra leve para destacar do fundo branco
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.textBrown,
    letterSpacing: 1,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValueMain: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 28,
    color: theme.colors.textPrimary,
  },
  cardValueSub: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: theme.colors.textBrown,
    marginLeft: 2, // Descola um pouquinho os milissegundos ou o 'L' do número grande
  },
  // --- FIM DOS ESTILOS DOS CARDS ---

  // ... (seus estilos de baixo: buttonsContainer, etc.) ...

  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 2, 
    marginBottom: -40,
  },
  primaryButton: {
    width: width * 0.9,
    height: 50,
    backgroundColor: theme.colors.primary, 
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    fontFamily: theme.fonts.headingBold,
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 1,
  },
  secondaryButton: {
    width: width * 0.9,
    backgroundColor: 'transparent', 
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: theme.fonts.headingBold,
    color: theme.colors.textSecondary, 
    fontSize: 12,
    letterSpacing: 0.5,
  },

  footerText: { 
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.textBrownSoft, 
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 50,
  },
});