import {StyleSheet} from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 36,
    lineHeight:39.6,
    color: '#000',
  },
  smaller_h1: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 28,
    lineHeight: 30.8, // Mimicking that tight look from your image
    color: '#000',
  },
  h2: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 20,
    lineHeight: 22,
    color: '#000',
  },
  h3: {
    fontFamily: 'HankenGrotesk-Variable',
    fontSize: 14,
    fontWeight: 500,
    color: '#666666',
    textTransform: 'uppercase',
  },
  h4: { 
    fontFamily: 'HankenGrotesk-Variable',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 18.2,
    color: '#000',
  },
  body: {
    fontFamily: 'HankenGrotesk-Variable',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 20.8,
    color: '#000',
  },
});
