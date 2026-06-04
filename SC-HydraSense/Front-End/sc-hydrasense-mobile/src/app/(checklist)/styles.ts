import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
  /* ============= CONTAINER ============= */
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  /* ============= PROGRESS BAR ============= */
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  progressStepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  progressCircleCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  progressNumber: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 16,
    color: '#7C7C8A',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: theme.colors.primary,
  },

  /* ============= CONTEÚDO ============= */
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  /* ============= SEÇÕES ============= */
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#7C7C8A',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  /* ============= KIT SELECIONADO ============= */
  kitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  kitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  kitTitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: '#7C7C8A',
    marginBottom: 4,
  },
  kitName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  badgeSelecionado: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 0.5,
  },

  /* ============= CHECKBOXES ============= */
  checkboxGroup: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },

  /* ============= ESCALAS ============= */
  scalerContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  scalerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scalerLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },

  /* --- Escala de Cores (Urina) --- */
  colorScaleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  colorBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBoxSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },

  /* --- Escala de Sede (Slider) --- */
  sedeValue: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: '#7C7C8A',
  },

  /* ============= PLACEHOLDER ============= */
  placeholderText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#7C7C8A',
    paddingVertical: 40,
    textAlign: 'center',
  },

  /* ============= FOOTER ============= */
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  exitLink: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },

  /* ============= MODAL ============= */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modalMessage: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#7C7C8A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  modalButtonConfirm: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: '#FFF',
  },
});