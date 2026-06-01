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
    },
    // --- ESTILOS DO DROPDOWN INLINE ---
    dropdownInputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    dropdownIcon: {
        position: 'absolute',
        right: 15,
        // O valor do 'bottom' pode precisar de um ajuste leve dependendo de como o seu InputCadastro é desenhado por dentro
        bottom: 25,
    },
    dropdownListContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginTop: 10, // Puxa a lista um pouquinho para cima para "colar" no input
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdownScroll: {
        maxHeight: 200, // Limita a altura para mostrar uns 4 ou 5 clubes e exigir rolagem para o resto
    },
    dropdownOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownOptionText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 15,
        color: '#4A4A4A',
    },
    dropdownOptionTextSelected: {
        fontFamily: theme.fonts.headingBold,
        color: theme.colors.primary,
    },
    selectedAthletesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    selectedAthleteChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.critical, 
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    selectedAthleteChipText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#FFFFFF',
    },
    // --- ESTILOS DE ERRO (NOVOS) ---
    errorText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: theme.colors.primary, 
        marginTop: 4,
    },
    inputError: {
        borderBottomColor: theme.colors.primary, 
    },
    chipError: {
        borderColor: theme.colors.primary, 
        borderWidth: 1,
    },
});