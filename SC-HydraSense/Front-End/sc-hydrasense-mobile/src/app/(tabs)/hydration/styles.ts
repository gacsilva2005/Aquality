// src/app/(tabs)/hydration/styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/src/global/themas';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Espaço para o FAB não cobrir o conteúdo final
  },
  pageTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    letterSpacing: 1,
  },

  // --- CÍRCULO DE PROGRESSO ---
  // Substitua a partir do progressContainer no seu styles.ts
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative', // Importante para o textContainer ficar por cima
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 48,
    color: '#333',
  },
  unitText: {
    fontSize: 24,
    color: '#666',
  },
  goalText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#999', // Fica cinza enquanto não bate a meta
    marginTop: 5,
  },

  // --- CARDS ---
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 12,
    color: '#555',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  quickAddButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickAddText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: '#333',
  },

  // --- BOTÃO REGISTRAR URINA ---
  urineButton: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  urineButtonText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#333',
  },

  // --- HISTÓRICO ---
  historyTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    marginBottom: 15,
    letterSpacing: 1,
  },
  historyList: {
    flexDirection: 'column',
    gap: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
  },
  historyIconContainer: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginRight: 15,
  },
  historyTextContainer: {
    flex: 1,
  },
  historyAmount: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: '#333',
  },
  historyDescription: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  historyTime: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: '#555',
  },
  emptyHistoryText: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  historyRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Dá um espacinho entre a hora e a lixeira
  },
  actionButton: {
    padding: 4, // Facilita o clique do dedo na tela
  },

  // --- MODAL DE EDIÇÃO ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escuro transparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    width: '60%',
    marginBottom: 25,
  },
  modalInput: {
    flex: 1,
    fontFamily: theme.fonts.headingBold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalUnit: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    color: '#999',
    marginLeft: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F4F4F4',
  },
  modalBtnCancelText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#666',
  },
  modalBtnSave: {
    backgroundColor: '#27ae60',
  },
  modalBtnSaveText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#FFF',
  },

  // --- VALOR PERSONALIZADO ---
  showCustomButton: {
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 8,
  },
  showCustomText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  customInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
  },
  customInput: {
    flex: 1,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 16,
    color: '#333',
  },
  customInputUnit: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  customAddButton: {
    backgroundColor: '#27ae60', // Verde para indicar sucesso/confirmação
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});