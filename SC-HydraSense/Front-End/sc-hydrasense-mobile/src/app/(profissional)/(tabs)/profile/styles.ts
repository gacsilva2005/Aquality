import { StyleSheet } from 'react-native';
import { theme } from '../../../../global/themas';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: 20,
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  titleLine: {
    fontSize: 60,
    fontFamily: theme.fonts.headingBold,
    color: theme.colors.textPrimary,
    lineHeight: 50,
    textTransform: 'uppercase',
  },
  description: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: theme.fonts.bodyRegular,
    color: theme.colors.textBrown,
    lineHeight: 24,
    marginTop: 5,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingRight: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  sectionTitleProfissional: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
  },
  inputLocked: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
    color: '#666',
  },
  inputUnlocked: {
    backgroundColor: '#FFF',
    borderColor: theme.colors.primary,
    color: theme.colors.textPrimary,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 20,
  },
  photoContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  photoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  photoTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 18,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
  },
  photoSubtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textBrown,
    marginTop: 2,
  },
  nameInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    paddingBottom: 2,
    minWidth: 150,
  },
  professionalContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 15,
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  infoLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.textBrown,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 15,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 10,
    paddingVertical: 15,
  },
  logoutText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // --- ESTILOS DOS CARDS DE PERFIL ---
  perfilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  perfilCardLocked: {
    backgroundColor: '#F0F0F0', // Fundo cinza para mostrar que está bloqueado
    elevation: 0, // Tira a sombra para parecer "desativado"
  },
  
});