// src/app/cadastro/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 40, // Pode ajustar dependendo de como o seu componente Screen lida com o topo
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: 25,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingBottom: 40, 
    paddingTop: 20,
    flex: 1
  },
  sectionTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 25,
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    marginTop: 30,
    // Use este wrapper caso precise dar um espaçamento extra em volta do seu componente Button
  },
  backButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    fontFamily: theme.fonts.bodyRegular,
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  genderContainer: {
    marginBottom: 20,
    width: '100%',
  },
  genderLabel: {
    fontFamily: theme.fonts.bodyBold, // Ou a fonte bold que você usa nos outros labels
    fontSize: 12,
    color: '#888', // Mesma cor dos outros labels
    marginBottom: 10,
    letterSpacing: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24, // Espaço entre a opção Masculino e Feminino
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 8,
    // borderRadius: 10, // Descomente esta linha se quiser que o checkbox fique REDONDO (estilo Radio Button)
  },
  checkboxText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  errorText: {
    color: '#FF4D4D', // O mesmo tom de vermelho que você usa para erros
    fontSize: 12,
    marginTop: 6,
    fontFamily: theme.fonts.bodyBold,
  },
});