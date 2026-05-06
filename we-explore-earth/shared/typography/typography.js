import {StyleSheet} from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 32,
    letterSpacing: -0.5,
    color: '#000',
  },
  h2: {
    fontFamily: 'HankenGrotesk-Regular',
    fontWeight: 500,
    fontSize: 16,
    color: '#888888',
  },
  body: {
    fontFamily: 'HankenGrotesk-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
