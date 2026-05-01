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
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    ...typography.h1,
    fontSize: 42,
    fontWeight: 'normal',
    color: '#0A1207',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: '#8A8A8A',
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    ...typography.body,
    fontSize: 14,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  footerContainer: {
    width: '100%',
    paddingTop: 20,
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#355E2B',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    ...typography.body,
    color: '#355E2B',
    fontSize: 18,
    fontWeight: '600',
  },
});