import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/src/global/themas';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    // sombra vermelha no topo e base da tela
    topGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100, // Aumentamos muito a altura para dar o efeito de degrade
        zIndex: 0,
        opacity: 0.4,
    },
    bottomGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100, // Aumentamos para subir bastante da base
        zIndex: 0,
        opacity: 0.4,
    },

    // --- CABEÇALHO (BADGE) ---
    badgeContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 100,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 15,
        gap: 8,
        elevation: 3,
        shadowColor: theme.colors.surface,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    badgeText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },

    // --- CRONÓMETRO NÉON ---
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    timerText: {
        fontFamily: theme.fonts.headingBold, // Certifique-se de que esta fonte é grossa
        fontSize: 72,
        color: theme.colors.primary,
        // EFEITO NÉON
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    timerPaused: {
        color: '#e0dddddc',
        textShadowColor: 'transparent', // Desliga o néon quando pausa
    },
    timerSubtitle: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 12,
        color: '#888',
        letterSpacing: 2,
        marginTop: -5,
    },

    // --- CONTROLOS (PLAY / PAUSE) ---
    controlsContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    controlButton: {
        width: 80,
        height: 80,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: '#0e0e0e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation: 20,
    },
    controlButtonPlay: {
        backgroundColor: theme.colors.primary, // Fica vermelho quando está pausado para chamar a atenção
    },

    // --- CARD DE HIDRATAÇÃO (DARK MODE) ---
    hydrationCard: {
        width: width * 0.9, 
        borderRadius: 16,
        overflow: 'hidden',
        padding: 24,
        marginBottom: 40,
        alignItems: 'center', // Centraliza o título e o footer
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    hydrationHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    hydrationTitle: {
        fontFamily: theme.fonts.bodyBold, // Usa uma fonte um pouco mais fina que o boldão
        fontSize: 14,
        color: theme.colors.textLight,
        letterSpacing: 1.5, // Espaçamento entre as letras para dar aquele ar premium
    },
    hydrationButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        marginBottom: 24,
    },
    waterButtonRed: {
        flex: 1, // Faz os 3 botões dividirem o espaço igualmente
        backgroundColor: theme.colors.primary, // Vermelho do tema
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterButtonManual: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#333', // Borda cinza escura
    },
    waterButtonText: {
        fontFamily: theme.fonts.headingBold,
        color: '#FFF',
        fontSize: 16,
    },
    waterButtonTextManual: {
        fontFamily: theme.fonts.bodyBold,
        color: '#CCC',
        fontSize: 12, // Um pouco menor para caber "MANUAL"
    },
    hydrationFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    hydrationTotalText: {
        fontFamily: theme.fonts.bodyBold,
        color: '#AAA',
        fontSize: 14,
    },
    hydrationTotalBold: {
        fontFamily: theme.fonts.headingBold,
        color: '#FFF',
    },
    cardBottomGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 130,
        zIndex: 0,
        opacity: 0.4,
    },

    // --- FOOTER (BOTÃO DE ENCERRAR HOLD TO CONFIRM) ---
    footer: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
    },
    finishButtonContainer: {
        width: '100%',
        height: 60,
        backgroundColor: '#0e0e0e', // Fundo bem clarinho só para marcar o botão
        borderWidth: 2,
        borderColor: theme.colors.primary, // Borda vermelha forte
        borderRadius: 12,
        overflow: 'hidden', // MÁGICA: não deixa a barra de progresso vazar da borda arredondada!
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishButtonFill: {
        ...StyleSheet.absoluteFillObject, // Preenche a altura toda
        backgroundColor: theme.colors.primary, // O vermelho forte que vai enchendo
    },
    finishButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        zIndex: 1, // Garante que o texto e ícone fiquem POR CIMA da barra enchendo
    },
    finishButtonText: {
        fontFamily: theme.fonts.headingBold,
        color: theme.colors.primary,
        fontSize: 19,
        letterSpacing: 1,
    },
    holdText: {
        fontFamily: theme.fonts.bodyBold,
        color: '#888',
        fontSize: 12,
        marginTop: 10,
    },

    // --- MODAL MANUAL ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escurecido transparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: '#1E1E1E', // Mesma cor do card de hidratação
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    modalTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 18,
        color: '#FFF',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        backgroundColor: '#2A2A2A', // Um pouco mais claro que o fundo do modal
        borderRadius: 12,
        color: '#FFF',
        fontFamily: theme.fonts.headingBold,
        fontSize: 24,
        textAlign: 'center',
        paddingVertical: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#444',
    },
    modalButtonsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    modalButtonCancel: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#444',
        alignItems: 'center',
    },
    modalButtonCancelText: {
        fontFamily: theme.fonts.bodyBold,
        color: '#AAA',
        fontSize: 14,
    },
    modalButtonConfirm: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
    },
    modalButtonConfirmText: {
        fontFamily: theme.fonts.headingBold,
        color: '#FFF',
        fontSize: 14,
    },
});