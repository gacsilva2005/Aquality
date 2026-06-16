// src/components/Screen/styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    // mantenha seus paddings de scrollContainer aqui
  },
  
  // --- NOVOS ESTILOS PARA A IMAGEM ABSOLUTA ---
  absoluteImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height * 0.5, 
    overflow: 'hidden',           
  },
  absoluteImage: {
    width: '100%',
    height: '100%',
    opacity: 0.065,
    justifyContent: 'flex-start', 
  },
});