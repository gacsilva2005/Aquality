import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#E0B5B5', // A linha de baixo
    paddingBottom: 8,
    paddingTop: 0,
  },
  labelError: {
    color: '#C8102E', // Vermelho indicando erro
  },
  inputError: {
    borderBottomColor: '#C8102E', // A linha fica vermelha
  },
  errorText: {
    color: '#C8102E',
    fontSize: 10,
    fontFamily: theme.fonts.bodyRegular,
    marginTop: 4,
  },
  inputWrapper: {
    justifyContent: 'center', // Alinha verticalmente
    position: 'relative',     // Permite que o ícone seja posicionado absolutamente em relação a este container
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 8, 
},
}
);
