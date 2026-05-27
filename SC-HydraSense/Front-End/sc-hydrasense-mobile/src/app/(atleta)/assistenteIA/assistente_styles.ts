import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../../global/themas';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ── HEADER ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBack: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: theme.colors.textPrimary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerMore: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── SCROLL ──
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 20,
  },

  // ── LOGO CENTRAL ──
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoSubtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 11,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logoTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 26,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── BALÃO DO USUÁRIO ──
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.sm,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  userBubbleText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },

  // ── RESPOSTA DO ASSISTENTE ──
  assistantWrapper: {
    gap: 0,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  assistantContent: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 16,
    gap: 4,
  },

  // ── TEXTO DA RESPOSTA ──
  msgText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  msgSectionTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
  },

  // ── LISTA ──
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 4,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
    flexShrink: 0,
  },
  listText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    flex: 1,
  },

  // ── FONTES CITADAS ──
  sourcesContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sourcesLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  sourceText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // ── DIGITANDO ──
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  // ── BANNER DE GRAVAÇÃO ──
  recordingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.primaryLight,  
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,        
  },
  recordingText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: theme.colors.primary,
  },

  // ── INPUT FIXO ──
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  // ── BOTÃO MICROFONE ──
  micButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  micButtonActive: {
    backgroundColor: theme.colors.primaryLight,   
    borderColor: theme.colors.primary,            
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textLight,
  },
});