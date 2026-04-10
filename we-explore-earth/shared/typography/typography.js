import {StyleSheet} from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 32,
    letterSpacing: -0.5, // Mimicking that tight look from your image
    color: '#000',
  },
  body: {
    fontFamily: 'HankenGrotesk-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  }
});