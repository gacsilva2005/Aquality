// src/app/fluxoSenha/codigo_recuperacao/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../../global/themas';

export const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: theme.colors.textWhite,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 2,
    marginLeft: 8,
  },
  mainTitle: {
    color: theme.colors.textWhite,
    fontFamily: theme.fonts.headingBold,
    fontSize: 55,
    lineHeight: 60,
  },
  subTitleHighlight: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.headingBold,
    fontSize: 55,
    lineHeight: 44,
    marginBottom: 30,
  },
  description: {
    color: '#E0E0E0',
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 40,
  },

  bottomCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    marginLeft: 8,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
  },
  cardTitle: {
    color: theme.colors.critical,
    fontFamily: theme.fonts.headingBold,
    fontSize: 26,
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
  },

  // ── ESPECÍFICO PARA CÓDIGO ──
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E4E4E7',
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.fonts.headingBold,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background || '#F4F4F5',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
  },
  footerLink: {
    color: '#6E111E',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
  },

  // ── MODAL ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  modalIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 18,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalMessage: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  modalBtnOk: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  modalBtnOkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textWhite,
    letterSpacing: 1,
  },
});