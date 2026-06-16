import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';
export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: theme.spacing.md, 
  },
  label: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  inputBox: {
    height: 65,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  inputElement: { // Adicione exatamente esse nome aqui
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 24,
    color: '#444',
  },
  observation: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: 6,
    textTransform: 'uppercase',
  },
});