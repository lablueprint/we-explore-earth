import {StyleSheet} from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 32,
    letterSpacing: -0.5,
    color: '#000',
  },
  h2: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 20,
    letterSpacing: -0.5, // Mimicking that tight look from your image
    color: '#000',
  },
  h3: {
    fontFamily: 'HankenGrotesk-Variable',
    fontWeight: 500,
    fontSize: 16,
    color: '#888888',
  },
  body: {
    fontFamily: 'HankenGrotesk-Variable',
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 24,
    color: '#333',
  },
});
