import { StyleSheet } from 'react-native';
import { theme } from '../../../global/themas';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.header,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.header,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  headerTitle: {
    color: theme.colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40, // Espaço inferior
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  // Typography & Shared
  sectionSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Bloco 1
  topStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  hugeNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  unitText: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  trendText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  waterDropContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    // Arredondamento assimétrico simulando gota
    borderTopRightRadius: theme.borderRadius.full,
    borderBottomRightRadius: theme.borderRadius.full,
    borderBottomLeftRadius: theme.borderRadius.full,
    borderTopLeftRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  // Bloco 2
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  metricCol: {
    flex: 1,
  },
  largeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  unitTextSmall: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sectionSubtitleCritical: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  largeNumberCritical: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statusDistContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  statusDistText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    height: 6,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  // Bloco 3
  chartSection: {
    marginBottom: theme.spacing.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  exportButtonText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'flex-end',
  },
  chartLineMock: {
    height: 80,
    backgroundColor: theme.colors.primaryLight,
    borderTopWidth: 3,
    borderTopColor: theme.colors.primary,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    opacity: 0.5,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  chartAxisText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  chartFooterText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  // Bloco 4
  individualSection: {
    marginTop: theme.spacing.md,
  },
  individualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  athleteCard: {
    marginBottom: theme.spacing.lg,
  },
  athleteInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  athleteAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  athleteNameRole: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  athleteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  athleteRole: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  athleteStats: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  athleteVol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  athleteMaxVol: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  athleteProgressBarBg: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  athleteProgressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  // Bottom Nav removido para usar Expo Router nativo
});
