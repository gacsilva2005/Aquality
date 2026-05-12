import { StyleSheet } from 'react-native';
import { theme } from '../../../global/themas';

export const styles = StyleSheet.create({

  // ESTRUTURA PRINCIPAL
  mainContent: {
    paddingBottom: 40,
    flex: 1,
  },

  //TÍTULO
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
  titleLine: {
    fontSize: 32,
    fontFamily: theme.fonts.headingBold,      
    color: theme.colors.textPrimary,          
    textTransform: 'uppercase',
    lineHeight: 36,
  },

  // CARD ESTRATÉGIA
  strategyCard: {
    backgroundColor: theme.colors.surface,   
    borderWidth: 1,
    borderColor: theme.colors.border,         
    borderRadius: theme.borderRadius.md,     
    paddingVertical: 20,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,   
    marginRight: 8,
  },
  bgIcon: {
    position: 'absolute',
    right: -8,
    top: -16,
    opacity: 0.5,
  },
  strategyText: {
    fontFamily: theme.fonts.bodyRegular,      
    fontSize: 18,
    color: theme.colors.textPrimary,          
    lineHeight: 28,
    marginBottom: 24,
  },
  textHighlightRed: {
    color: theme.colors.primary,             
    fontFamily: theme.fonts.bodyBold,        
  },
  strategyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnProtocol: {
    backgroundColor: theme.colors.primary,   
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,     
    minWidth: 130,
    alignItems: 'center',
  },
  btnProtocolText: {
    color: theme.colors.textWhite,           
    fontFamily: theme.fonts.bodyBold,        
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aiRecommendationText: {
    color: theme.colors.textSecondary,       
    fontFamily: theme.fonts.bodyRegular,     
    fontSize: 10,
    lineHeight: 14,
  },

  // INFO CARD
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: theme.colors.border,        
    borderRadius: theme.borderRadius.md,     
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    position: 'relative',
  },

  // LABELS 
  cardLabel: {
    fontFamily: theme.fonts.bodyBold,        
    fontSize: 12,
    color: theme.colors.textSecondary,       
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardSubText: {
    fontFamily: theme.fonts.bodyRegular,     
    fontSize: 12,
    color: theme.colors.textLight,          
    marginTop: 6,
  },

  //HIDRATAÇÃO
  hydrationValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: 12,
  },
  hydrationValue: {
    fontFamily: theme.fonts.headingBold,     
    fontSize: 52,
    color: theme.colors.primary,            
    lineHeight: 56,
  },
  hydrationUnit: {
    fontFamily: theme.fonts.bodyBold,        
    fontSize: 22,
    color: theme.colors.textPrimary,       
    marginLeft: 4,
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.border,   
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: theme.colors.primary,  
    borderRadius: 3,
  },

  // ── ÚLTIMO TREINO ──
  lastWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontFamily: theme.fonts.bodyRegular,    
    fontSize: 10,
    color: theme.colors.textLight,         
  },

  //MÉTRICAS
  metricsContainer: {
    flexDirection: 'column',
    gap: 24,
    paddingRight: 110,   
    paddingBottom: 20,
  },
  metricBlock: {
    flexDirection: 'column',
  },
  metricLabel: {
    fontFamily: theme.fonts.bodyBold,       
    fontSize: 10,
    color: theme.colors.textSecondary,      
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  metricValue: {
    fontFamily: theme.fonts.headingBold,    
    fontSize: 38,
    color: theme.colors.textPrimary,        
    lineHeight: 42,
  },
  metricUnit: {
    fontFamily: theme.fonts.bodyBold,       
    fontSize: 16,
    color: theme.colors.primary,            
    marginLeft: 4,
    marginBottom: 2,
  },

  // ── TAGS ──
  tagGreen: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,    
  },
  tagGreenText: {
    color: theme.colors.success,            
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  tagRed: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primaryLight, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,   
  },
  tagRedText: {
    color: theme.colors.primary,            
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },

  // ── RECOVERY OVERLAY ──
  recoveryOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.colors.surface, 
    padding: 16,
    borderRadius: theme.borderRadius.lg,    
    alignItems: 'center',
    width: 90,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recoveryValue: {
    fontFamily: theme.fonts.headingBold,    
    fontSize: 20,
    color: theme.colors.textPrimary,      
    marginTop: 8,
  },
  recoveryLabel: {
    fontFamily: theme.fonts.bodyRegular,    
    fontSize: 9,
    color: theme.colors.textSecondary,     
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── INSIGHTS ──
  insightsCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: theme.colors.border,       
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,  
    borderRadius: theme.borderRadius.md,    
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  insightsText: {
    fontFamily: theme.fonts.bodyRegular,    
    fontSize: 13,
    color: theme.colors.textSecondary,      
    lineHeight: 20,
    marginTop: 8,
  },

  // TAGS INFERIORES
  bottomTagsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  bottomTag: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: theme.colors.border,     
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,    
  },
  bottomTagText: {
    fontFamily: theme.fonts.bodyBold,       
    fontSize: 10,
    color: theme.colors.textPrimary,        
    letterSpacing: 0.5,
  },

  // BOTÃO INICIAR SESSÃO
  startSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,  
    marginHorizontal: theme.spacing.md,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.sm,    
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  startSessionText: {
    color: theme.colors.textWhite,         
    fontFamily: theme.fonts.bodyBold,       
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});