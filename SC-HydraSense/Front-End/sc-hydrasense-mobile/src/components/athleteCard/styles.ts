// src/components/AthleteCard/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderRightWidth: 6, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#EAEAEA',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    athleteName: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 16,
        color: '#1A1A1A',
    },
    athleteNumber: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 10,
        letterSpacing: 0.5,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricLabel: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#666',
        letterSpacing: 0.5,
    },
    metricValue: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: 12,
        color: '#1A1A1A',
    }
});