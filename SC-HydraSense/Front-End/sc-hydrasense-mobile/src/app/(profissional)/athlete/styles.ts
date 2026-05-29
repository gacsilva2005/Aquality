// src/app/(profissional)/(tabs)/athletes/stylesDetails.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    backButton: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    // --- HEADER ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        position: 'relative',
    },
    photo: {
        width: 100,
        height: 110,
        borderRadius: 8,
        backgroundColor: '#CCC',
        marginRight: 16,
        zIndex: 2, // Fica por cima da marca d'água
    },
    headerInfo: {
        flex: 1,
        zIndex: 2,
    },
    name: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 24,
        color: '#1A1A1A',
        textTransform: 'uppercase',
    },
    subInfo: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 2,
        marginBottom: 10,
    },
    hydrationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    hydrationLabel: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#666',
    },
    hydrationValue: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 12,
        color: '#1A1A1A',
        paddingLeft: 5,
    },
    watermarkNumber: {
        position: 'absolute',
        right: -10,
        bottom: -20,
        fontSize: 100,
        fontFamily: theme.fonts.headingBold,
        color: '#F0F0F0',
        zIndex: 1, // Fica atrás de tudo
    },

    // --- CARDS GERAIS ---
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
    },
    sectionSubtitle: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    rateContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 15,
    },
    rateValue: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 40,
        color: '#1A1A1A',
    },
    rateUnit: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 16,
        color: '#1A1A1A',
        marginLeft: 4,
    },
    graphPlaceholder: {
        height: 120,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#CCC',
    },

    // --- PROTOCOLO DE RECUPERAÇÃO ---
    protocolCard: {
        backgroundColor: theme.colors.primaryLight, // Fundo avermelhado bem claro do seu design
        borderWidth: 0, 
    },
    protocolHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    protocolTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 12,
        color: '#1A1A1A',
        marginLeft: 6,
    },
    protocolContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    protocolAction: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 20,
        color: '#1A1A1A',
    },
    protocolDetail: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    checkButton: {
        backgroundColor: '#C62828',
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        opacity: 0.4,
        borderRadius: 12,
    },

    // --- REGISTROS RECENTES ---
    recordsSection: {
        marginTop: 10,
    },
    recordsSectionTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
        marginBottom: 15,
        textTransform: 'uppercase',
    },
});
