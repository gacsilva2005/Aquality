import { StyleSheet } from 'react-native';
import { theme } from '@/src/global/themas';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
    },
    pageTitle: {
        fontFamily: theme.fonts.headingBold,
        fontSize: 32,
        color: '#1A1A1A',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
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
        fontSize: 16,
        color: '#333',
    },
    listContainer: {
        gap: 16, 
    },
    emptyText: {
        fontFamily: theme.fonts.bodyRegular,
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
    }
});