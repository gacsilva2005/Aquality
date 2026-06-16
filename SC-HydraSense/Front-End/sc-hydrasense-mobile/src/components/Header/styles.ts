import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100, // Ajuste conforme a altura que você deseja para a barra do topo
    backgroundColor: theme.colors.textPrimary, // Ou a cor que você definiu para o Header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingTop: 30, 
  },
  headerBar: {
    backgroundColor: theme.colors.headersoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, 
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espaço entre a foto e o texto
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: theme.fonts.bodyBold,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: '#FFF',
    letterSpacing: 1.5, // Dá um estilo mais moderno ao nome
  }
  
});