import { StyleSheet } from 'react-native';
import { theme } from '../../../../global/themas';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },

  // ═══ HEADER ═══
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  // ═══ KPI GRID ═══
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  kpiCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  kpiValue: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 26,
    color: theme.colors.textPrimary,
    marginTop: 6,
  },
  kpiLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },

  // ═══ GENERIC CARD ═══
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 13,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },

  // ═══ CLIMA ═══
  climaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  climaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  climaValue: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  climaDesc: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // ═══ SECTION TITLE ═══
  sectionTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },

  // ═══ RANKING ═══
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rankingPosition: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: theme.colors.primary,
    width: 30,
    textAlign: 'center',
  },
  rankingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  rankingName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  rankingPercent: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    minWidth: 40,
    textAlign: 'right',
  },

  // ═══ MAPA DE RISCO ═══
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  riskDistRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  riskDistBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
  },
  riskDistText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
  },

  // ═══ ATHLETE CARDS (RISCO) ═══
  athleteCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 10,
    marginLeft: theme.spacing.xs,
  },
  athleteScore: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 18,
  },
  athleteSubScore: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },

  // ═══ SINTOMAS ═══
  sintomaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sintomaName: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    color: theme.colors.textPrimary,
    width: 100,
  },
  sintomaBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  sintomaBarFill: {
    height: 8,
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  sintomaPercent: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 13,
    color: theme.colors.textPrimary,
    minWidth: 36,
    textAlign: 'right',
  },

  // ═══ OUTLIERS ═══
  outlierCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  outlierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  outlierTipo: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: theme.colors.primary,
  },
  outlierDesc: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  outlierMeta: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },

  // ═══ ACLIMATAÇÃO ═══
  aclimatacaoSummary: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  aclimatacaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
  },
  aclimatacaoText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
  },
  aclimatacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  aclimatacaoNome: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  aclimatacaoStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
  },
  aclimatacaoStatusText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
  },

  // ═══ GRÁFICO ═══
  chartFooter: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },

  // ═══ EMPTY STATE ═══
  emptyText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});