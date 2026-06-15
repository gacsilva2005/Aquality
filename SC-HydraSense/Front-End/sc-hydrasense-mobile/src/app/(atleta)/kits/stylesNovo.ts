import { StyleSheet, Platform } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    // --- HEADER ESCURO ---
    darkHeader: {
        backgroundColor: '#262626', // Cinza escuro do design
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 35, 
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 20,
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },

    // --- CONTEÚDO ---
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 130, // Espaço pro botão fixo
    },

    // --- FORMULÁRIO (Inputs) ---
    formSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: '#8D7B7B',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    textInput: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        borderBottomWidth: 1,
        borderBottomColor: '#6B3838', // Linha marrom escuro
        paddingVertical: 8,
    },
    dropdownInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#6B3838',
        paddingVertical: 8,
    },
    dropdownText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
    },
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginTop: 4,
        position: 'absolute', // Faz flutuar
        top: 40,
        left: 0,
        right: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownOptionText: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 14,
        color: '#1A1A1A',
    },

    // --- CARD PESO ---
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    weightCard: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 30,
    },
    weightCardLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: '#999',
        marginBottom: 5,
    },
    weightValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    weightNumber: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 48, // Gigante como no design
        color: theme.colors.primary, // Vermelho
        letterSpacing: -1,
    },
    weightUnit: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 18,
        color: theme.colors.primary,
        marginLeft: 4,
    },

    // --- ITENS DO KIT ---
    itemsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 15,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    itemIcon: {
        marginRight: 15,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
    },
    itemWeight: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    addItemBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 8,
        padding: 15,
        marginTop: 5,
        gap: 8,
    },
    addItemBtnText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 12,
        color: '#1A1A1A',
    },

    // --- CONFIGURAÇÕES ---
    defaultSettingsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    defaultSettingsText: {
        flex: 1,
        paddingRight: 15,
    },
    settingsTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
    },
    settingsSubtitle: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    // --- ABAS DE DESCONTO ---
    discountSection: {
        marginBottom: 25,
    },
    discountHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5,
    },
    discountTitle: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        color: '#8D7B7B',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
    },
    tabActive: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 12,
        color: '#999',
    },
    tabTextActive: {
        color: theme.colors.primary,
    },

    // --- CAIXA DE AVISO ---
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF5F5',
        borderLeftWidth: 4,
        borderLeftColor: '#C62828',
        padding: 15,
        borderRadius: 4,
        alignItems: 'flex-start',
        gap: 10,
    },
    warningText: {
        flex: 1,
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#4A4A4A',
        lineHeight: 18,
    },

    // --- BOTÃO INFERIOR ---
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFFFFF', 
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 15,
    },

    // --- MODAL ADICIONAR ITEM ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 24,
    },
    modalTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 18,
        color: '#1A1A1A',
        marginBottom: 20,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 25,
        gap: 15,
    },
    modalCancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    modalCancelBtnText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#999',
    },
    modalSaveBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalSaveBtnText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#FFF',
    }
});