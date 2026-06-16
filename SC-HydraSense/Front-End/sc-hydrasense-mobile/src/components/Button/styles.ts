import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: theme.colors.critical, // vermelho principal do botão
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // <-- ATUALIZAMOS OS CONTAINERS DOS ÍCONES -->
  iconLeftContainer: {
    marginRight: 8, // Empurra o texto um pouco para a direita
  },
  iconRightContainer: {
    marginLeft: 12, 
  },
  // <---------------------------------------->
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabledContainer: {
    backgroundColor: '#94A3B8', 
    opacity: 0.7,
  }
});