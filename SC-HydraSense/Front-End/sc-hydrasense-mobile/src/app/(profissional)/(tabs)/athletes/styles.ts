import { StyleSheet } from 'react-native';
import { theme } from '../../../../global/themas';

export const styles = StyleSheet.create({

  //ESTRUTURA PRINCIPAL
  mainContent: {
    paddingBottom: 40,
    flex: 1,
  },

  //TÍTULO EDITORIAL
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
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleLine: {
    fontSize: 32,
    fontFamily: theme.fonts.headingBold,    
    color: theme.colors.textPrimary,        
    textTransform: 'uppercase',
    lineHeight: 36,
  },

  // AVG RATE 
  avgRateContainer: {
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  avgRateLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.textSecondary,      
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  avgRateValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  avgRateValue: {
    fontFamily: theme.fonts.headingBold,    
    fontSize: 24,
    color: theme.colors.primary,            
    lineHeight: 28,
  },
  avgRateUnit: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
    marginBottom: 2,
  },

  //CARD DO GRÁFICO 
  chartCard: {
    backgroundColor: theme.colors.surface, 
    borderWidth: 1,
    borderColor: theme.colors.border,       
    borderRadius: theme.borderRadius.md,    
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  chartLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.textSecondary,      
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  chartTitle: {
    fontFamily: theme.fonts.headingBold,    
    fontSize: 28,
    color: theme.colors.textPrimary,        
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  trendBadge: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,    
  },
  trendText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.textWhite,          
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chart: {
    marginLeft: -16,
    marginRight: -16,
    marginTop: 8,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,    
  },
  chartAxisLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.textLight,         
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  emptyChart: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 13,
    color: theme.colors.textLight,
  },

  // ── FILTROS ──
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,                  
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,    
    borderWidth: 1,
    borderColor: theme.colors.border,       
    backgroundColor: theme.colors.surface, 
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary, 
    borderColor: theme.colors.primary,
  },
  filterBtnText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.textSecondary,     
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterBtnTextActive: {
    color: theme.colors.textWhite,          
  },

  // ── LISTA DE SESSÕES ──
  sessionList: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,                  
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, 
    borderWidth: 1,
    borderColor: theme.colors.border,       
    borderRadius: theme.borderRadius.md,    
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },

  // Data
  sessionDate: {
    alignItems: 'center',
    minWidth: 32,
  },
  sessionDay: {
    fontFamily: theme.fonts.headingBold,    
    fontSize: 22,
    color: theme.colors.textPrimary,        
    lineHeight: 24,
  },
  sessionMonth: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.textSecondary,      
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Info
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,        
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sessionSweat: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 11,
    color: theme.colors.textSecondary,     
    letterSpacing: 0.5,
  },

  // Status
  sessionStatus: {
    alignItems: 'flex-end',
  },
  sessionStatusLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.textLight,          
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sessionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionStatusValue: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ── ESTADO VAZIO ──
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textLight,
  },
});