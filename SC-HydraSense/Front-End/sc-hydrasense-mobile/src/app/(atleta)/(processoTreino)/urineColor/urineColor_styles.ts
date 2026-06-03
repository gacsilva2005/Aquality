import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../../../global/themas';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: '#0e0e0e',
    textTransform: 'uppercase',
  },
  helpButton: {
    padding: 8,
  },

  // Description
  descriptionText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
    lineHeight: 18,
  },

  // Stepper
  stepperContainer: {
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  stepperLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    height: 20,
  },
  stepperLineBackground: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#E0E0E0',
    top: 9,
  },
  stepperLineActive: {
    position: 'absolute',
    left: 10,
    width: '50%',
    height: 2,
    backgroundColor: theme.colors.primary,
    top: 9,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    zIndex: 1,
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepperLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepLabel: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 10,
    color: '#999999',
  },
  stepLabelActive: {
    color: theme.colors.primary,
  },
  stepperSubtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },

  // Toggle Section
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 24,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
  },
  toggleButtonTextActive: {
    fontFamily: theme.fonts.headingBold,
    color: theme.colors.primary,
  },

  // Estimate Button
  estimateContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  estimateButton: {
    borderWidth: 1,
    borderColor: '#FFE0E5',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  estimateButtonText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  estimateSubText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#999999',
  },

  // Counter Area
  counterCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  counterActionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterActionIconText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 24,
    color: theme.colors.primary,
  },
  counterActionSubText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: 4,
  },
  counterValueContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  counterValueText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 56,
    color: '#0e0e0e',
    lineHeight: 60,
  },
  counterUnitText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: '#666666',
    marginBottom: 8,
    marginLeft: 4,
  },

  // Quick Add Buttons
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAddButtonText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 12,
    color: '#0e0e0e',
  },

  // Checkbox Section
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 30,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxLabel: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#0e0e0e',
  },

  // Estado Basal Section
  basalSection: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  
  // Urine Colors
  colorTitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  colorGridRow: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginBottom: 30,
  },
  colorBlockItem: {
    flex: 1,
    height: '100%',
  },
  colorBlockSelected: {
    borderWidth: 2,
    borderColor: '#000000',
    transform: [{ scale: 1.05 }],
    zIndex: 1,
  },

  // Thirst Slider
  thirstHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  thirstTitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
  },
  thirstValue: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 18,
    color: theme.colors.primary,
  },
  thirstLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  thirstLabelText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#999999',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },

  // Footer Actions
  footer: {
    paddingHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  skipLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipLinkText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  skipSubText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
  },
});