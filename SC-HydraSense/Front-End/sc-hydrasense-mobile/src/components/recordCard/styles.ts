import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    recordCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    recordIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recordIconAlert: {
        backgroundColor: theme.colors.primaryLight || '#FCE4E4',
    },
    recordInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    recordTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 14,
        color: '#1A1A1A',
    },
    recordSubtitle: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    recordSubtitleAlert: {
        color: '#C62828',
    },
    recordTime: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 10,
        color: '#999',
        textTransform: 'uppercase',
        marginLeft: 10,
    },
});