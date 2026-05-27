import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
    },
    topIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 16,
    },
    title: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 18,
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 26,
    },

    // --- ESTILOS DOS CARDS (UNIFICADOS) ---
    optionCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: theme.colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.50,
        shadowRadius: 3,
        elevation: 5,
    },
    textWrapper: {
        flex: 1,
        marginLeft: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },
    cardDesc: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: theme.colors.textBrown,
        lineHeight: 16,
    },

    // --- ESTILOS DE SELEÇÃO (VERMELHO) ---
    cardSelected: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    iconBoxSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Escurece levemente o fundo do ícone
    },
    textWhite: {
        color: '#FFFFFF',
    },
    textWhiteDesc: {
        color: '#FFD6D6', // Fica um branco avermelhado suave para subtítulos
    },
    textBrown: {
        color: theme.colors.textBrown,
    },
});