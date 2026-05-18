import { StyleSheet } from 'react-native';
import { typography } from '@shared/typography/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F6F2',
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  backText: {
    ...typography.body,
    color: '#285F00',
  },
  title: {
    ...typography.h1,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: '#1D1D1B',
    marginBottom: 24,
  },
  body: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 29,
    color: '#262622',
    marginBottom: 14,
  },
});
