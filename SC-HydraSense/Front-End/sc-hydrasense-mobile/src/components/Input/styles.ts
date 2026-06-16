import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary , 
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputContainerError: {
    borderColor: theme.colors.primary, // Fica vermelho se der erro
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingRight: 10,
  },
  rightIcon: {
    padding: 4, 
    },
  errorText: {
    color: theme.colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
});