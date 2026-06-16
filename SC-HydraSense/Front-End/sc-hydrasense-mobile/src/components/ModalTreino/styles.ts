import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas'; 

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 14,
    color: '#111',
  },
  closeButton: {
    padding: 4,
  },
  
  // --- GRID CONTAINER ---
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Faz os cards quebrarem para a linha de baixo
    justifyContent: 'space-between',
    gap: 12, // Espaço entre colunas e linhas
    marginBottom: 30,
  },

  // --- CARDS DE OPÇÃO ---
  optionCard: {
    width: '48%', // Garante que fiquem 2 por linha
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: '#FDECEE', // Um vermelho bem clarinho e SÓLIDO (sem rgba)
    elevation: 0, // Remove a sombra para o fundo não vazar
    shadowOpacity: 0, // Remove a sombra no iOS
  },

  // --- CONTEÚDO DO CARD (ÍCONE + TEXTO) ---
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Espaço entre o ícone e o texto
  },
  optionText: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 12,
    color: '#333',
    letterSpacing: 0.5,
  },
  optionTextActive: {
    color: theme.colors.primary,
  },

  // --- BOLINHA VERMELHA DO CANTO ---
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 10,
    // Android
    elevation: 10,
  },

  // --- BOTÃO COMEÇAR ---
  startButton: {
    flexDirection: 'row', // Para alinhar texto e seta lado a lado
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#CCC',
  },
  startButtonText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#FFF',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});