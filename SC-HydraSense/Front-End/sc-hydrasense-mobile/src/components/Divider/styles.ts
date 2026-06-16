import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  text: {
    paddingHorizontal: 10,
    color: '#999',
    fontFamily: theme.fonts.bodyRegular,
  },
});