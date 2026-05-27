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
    flex: 1,
    gap: 1,
  },
  sectionTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 30,
    color: '#333',
    marginTop: 30,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  sectionDescription: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: 30,
    marginTop: 15,
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
  errorText: {
    color: '#FF4D4D', // O mesmo tom de vermelho que você usa para erros
    fontSize: 12,
    marginTop: 6,
    fontFamily: theme.fonts.bodyBold,
  },

  // --- ESTILOS DOS CARDS DE PERFIL ---
  perfilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12, // Espaço entre os cards
  },
  perfilCard: {
    flex: 1, // Faz os três cards dividirem o espaço igualmente
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent', // Transparente por padrão
    // Efeito de sombra leve
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  perfilCardActive: {
    borderColor: theme.colors.primary, // Borda fica vermelha quando selecionado
    backgroundColor: '#FFFFFF', 
  },
  perfilText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 11, // Fonte pequenininha para caber na caixa
    color: '#333333',
    marginTop: 10,
  },
});

