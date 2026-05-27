// src/app/index.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../global/themas';

export const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#FFF',
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 2,
    marginLeft: 8,
  },
  mainTitle: {
    color: '#FFF',
    fontFamily: theme.fonts.headingBold,
    fontSize: 55,
    lineHeight: 60,
  },
  subTitleHighlight: {
    color: '#D90429',
    fontFamily: theme.fonts.headingBold,
    fontSize: 55,
    lineHeight: 44,
    marginBottom: 30,
  },
  description: {
    color: '#E0E0E0',
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 40,
  },
  partnerContainer: {
    marginTop: 20,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 50,
  },
  cardTitle: {
    color: theme.colors.critical,
    fontFamily: theme.fonts.headingBold,
    fontSize: 26,
    letterSpacing: 1,
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#7C7C8A',
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    marginBottom: 32,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderRadius: 4,
    width: 18,
    height: 18,
    marginRight: 8,
  },
  checkboxLabel: {
    color: '#7C7C8A',
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
  },
  forgotPassword: {
    color: '#D90429',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    flex: 0.48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  socialButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#7C7C8A',
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
  },
  footerLink: {
    color: '#6E111E',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
  },
});