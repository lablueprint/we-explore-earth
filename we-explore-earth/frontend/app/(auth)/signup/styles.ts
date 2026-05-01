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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
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
    width: '100%',
  },
  passwordContainer: {
    marginBottom: 24,
  },
  helperText: {
    ...typography.body,
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: -8,
    marginLeft: 4,
  },
  checkboxGroup: {
    marginBottom: 32,
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#355E2B',
  },
  checkboxText: {
    ...typography.body,
    fontSize: 14,
    color: '#8A8A8A',
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
    color: '#8A8A8A',
  },
  loginLink: {
    color: '#355E2B',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  }
});