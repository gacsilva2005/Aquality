import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#7C7C8A',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
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
});
