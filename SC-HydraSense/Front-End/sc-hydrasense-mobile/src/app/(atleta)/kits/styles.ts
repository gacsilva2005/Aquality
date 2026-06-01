import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    
    // --- CABEÇALHO ---
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15, // Diminuímos o espaço abaixo dele para a lista começar antes
        alignItems: 'center', // Garante que a setinha fique perfeitamente alinhada com o texto
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#EFEFEF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTexts: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 22,
        color: '#1A1A1A',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },

    // --- LISTA ---
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 130, // Aumentamos o respiro final para os cards passarem por cima do botão flutuante
        gap: 16,
    },

    // --- CARD DE KIT ---
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 4, // A borda espessa na esquerda
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    kitName: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    kitModality: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#999',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    badgeDefault: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeDefaultText: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: '#FFFFFF',
    },

    // --- PESO ---
    weightContainer: {
        marginTop: 15,
    },
    weightLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: theme.colors.primary, // O label do peso é vermelhinho no seu design
        marginBottom: 2,
    },
    weightValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    weightNumber: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 36,
        color: '#1A1A1A',
    },
    weightUnit: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },

    // --- DIVISOR ---
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginVertical: 15,
    },

    // --- AÇÕES DO CARD ---
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    toggleLabel: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#666',
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Diminui o toggle um pouquinho pra ficar delicado
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- BOTÃO FIXO NA BASE ---
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F7F7F7', // Mesma cor do fundo da tela para mesclar bem
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 35, // Espaço extra para não encostar na barrinha preta de navegação do iPhone/Android
        
        // Removemos a borda e adicionamos uma sombra suave projetada para CIMA
        borderTopWidth: 0, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 }, // O número negativo (-4) joga a sombra pra cima
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 15, // Elevação forte no Android para garantir a sombra superior
    },
    // ... estilos existentes ...

    // =====================================
    // --- ESTILOS DO MODO DE EDIÇÃO ---
    // =====================================
    editLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: '#999',
        marginBottom: 4,
    },
    editInputName: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 5,
    },
    editInputWeight: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 36,
        color: '#1A1A1A',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        minWidth: 80, // Garante que caiba números grandes
        padding: 0,
    },
    
    // --- MINI DROPDOWN DA MODALIDADE ---
    dropdownMini: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 2,
    },
    dropdownMiniText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#1A1A1A',
    },
    dropdownMiniList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginTop: 4,
        // Ocultar sombras e usar overflow pode resolver problemas de layout dentro de animated views
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 10,
    },
    dropdownMiniOption: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownMiniOptionText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#4A4A4A',
    }
});