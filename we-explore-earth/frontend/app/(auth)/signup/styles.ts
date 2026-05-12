import { StyleSheet } from 'react-native';
import { typography } from '../../../../shared/typography/typography';

export const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 80, 
    paddingBottom: 40, 
  },
  title: {
    ...typography.h1,
    fontSize: 42,
    color: '#0A1207',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: '#8A8A8A',
    marginBottom: 30, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 16, 
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'transparent', 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#355E2B',
    borderColor: '#355E2B',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  checkboxText: {
    ...typography.body,
    fontSize: 15,
    color: '#8A8A8A',
  },
  privacyText: {
    color: '#355E2B',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#8A8A8A', 
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    ...typography.body,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    ...typography.body,
    fontSize: 16,
    color: '#8A8A8A',
  },
  footerLink: {
    color: '#355E2B',
    fontWeight: '600',
  }
});