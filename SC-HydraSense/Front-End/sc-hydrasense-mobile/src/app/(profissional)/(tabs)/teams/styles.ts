import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        // Move levemente para cima para compensar visualmente o espaço do bottom tab
        marginTop: -50, 
    },
    title: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 22,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    description: {
        fontFamily: theme.fonts.bodyRegular,
        fontSize: 15,
        color: theme.colors.textBrown,
        textAlign: 'center',
        lineHeight: 24,
    }
});