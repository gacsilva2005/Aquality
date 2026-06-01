import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
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
        alignItems: 'baseline',
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
    }
});