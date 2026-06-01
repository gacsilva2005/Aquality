import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    
    // --- CABEÇALHO ---
    header: {
        marginBottom: 20,
    },
    pageTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 24,
        color: '#1A1A1A',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    pageDescription: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },

    // --- BOTÃO ADICIONAR ---
    addButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary || '#D32F2F', // Vermelho do botão
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    addButtonText: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // --- BARRA DE PESQUISA ---
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 14,
        color: '#333',
    },

    // --- LISTA E CARDS ---
    listContainer: {
        gap: 16, // Espaço entre os cards
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        // Efeito de sombra do design
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    
    // Topo do Card
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    teamInfo: {
        flex: 1,
        paddingRight: 10,
    },
    teamName: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        textTransform: 'uppercase',
    },
    teamCategory: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#666',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Badges (Etiquetas de Status)
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        textTransform: 'uppercase',
    },

    // Base do Card (Métricas)
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricBlock: {
        flex: 1,
    },
    metricLabel: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline', // Alinha os números pela base
    },
    metricBigNumber: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 36,
        color: '#1A1A1A',
        lineHeight: 40,
    },
    metricSmallNumber: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
        marginLeft: 2,
    },

    // --- ESTADO VAZIO ---
    emptyText: {
        fontFamily: theme.fonts.bodyRegular,
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
    }
});