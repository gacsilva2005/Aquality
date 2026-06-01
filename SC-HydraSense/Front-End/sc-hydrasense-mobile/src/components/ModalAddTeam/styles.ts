import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxHeight: '90%', // Impede que o modal seja maior que a tela!
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 20,
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },

    inputGroup: {
        marginBottom: 25,
    },
    sectionLabel: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#8D7B7B', 
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    input: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 16,
        color: '#1A1A1A',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0', // Ajuda a separar visualmente um campo do outro
    },
    dividerTop: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginBottom: 15,
    },

    // --- CHIPS DAS CATEGORIAS (NOVO) ---
    chipScroll: {
        flexDirection: 'row',
        marginTop: 5,
        // Dá um respiro para os itens não colarem nos cantos ao rolar
        marginHorizontal: -5, 
    },
    chip: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    chipActive: {
        backgroundColor: theme.colors.primary, // Vermelho principal
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 14,
        color: '#666',
    },
    chipTextActive: {
        fontFamily: theme.fonts.headingBold,
        color: '#FFFFFF',
    },

    // --- SEÇÃO DE CÓDIGO ---
    codeSection: {
        marginTop: 5,
    },
    subLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F5F5F5',
    },
    dividerText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginHorizontal: 15,
    },

    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FCE4E4', 
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 5,
        gap: 8,
    },
    generateButtonText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
    }
});