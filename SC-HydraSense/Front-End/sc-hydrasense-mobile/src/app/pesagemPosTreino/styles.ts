import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
  },
  
  header: {
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: -40,
  },
  hugeInput: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 80,
    color: theme.colors.primary,
    textAlign: 'center',
    minWidth: 150,
  },
  unitText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 24,
    color: '#999999',
    marginLeft: 8,
  },

  footer: {
    width: '100%',
    alignItems: 'center',
  },
});