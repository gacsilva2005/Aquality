import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../../global/themas';

const { width } = Dimensions.get('window');

// 2 colunas com gap 12 e padding 16 de cada lado
const CARD_WIDTH = (width - theme.spacing.md * 2 - 12) / 2;
const COLOR_BLOCK_SIZE = CARD_WIDTH * 0.55; 

export const styles = StyleSheet.create({

  mainContent: {
    flex: 1,
    paddingBottom: 40,
  },

  // ── TÍTULO ──
  titleContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: 10,
    marginBottom: 16,
  },
  pageSubtitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleLine: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 32,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    lineHeight: 36,
  },
  stepText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleUnderline: {
    height: 3,
    width: 40,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    marginTop: 8,
  },

  // ── INSTRUÇÃO ──
  instructionCard: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 16,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  instructionText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  // ── GRADE ──
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: 12,
    marginBottom: theme.spacing.lg,
  },

  // ── CARD BRANCO ──
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,   
    borderRadius: theme.borderRadius.lg,      
    borderWidth: 2,
    borderColor: theme.colors.border,         
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    position: 'relative',
    // Sombra leve
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardSelected: {
    borderColor: theme.colors.primary,        
    borderWidth: 2,
  },

  // Check badge no canto superior direito do card
  checkBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,   
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  // Bloco de cor centralizado dentro do card
  colorBlock: {
    width: COLOR_BLOCK_SIZE,
    height: COLOR_BLOCK_SIZE,
    borderRadius: theme.borderRadius.md,      
    marginBottom: 12,
  },

  // Label dentro do card
  colorLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  colorLabelSelected: {
    color: theme.colors.primary,
  },

  // ── STATUS BANNER ──
  statusBanner: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statusDescription: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // ── INFO CARDS ──
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoCardText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // ── BOTÃO FINALIZAR ──
  btnFinalize: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.sm,
  },
  btnFinalizeDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  btnFinalizeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textWhite,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});