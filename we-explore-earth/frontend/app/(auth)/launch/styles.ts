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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    width: 140, 
    height: 140,
    marginBottom: 20,
  },
  welcomeText: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: 'normal',
    color: '#0A1207',
    marginBottom: 4,
  },
  titleText: {
    ...typography.h1,
    fontSize: 42,
    fontWeight: 'normal',
    color: '#0A1207',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitleText: {
    ...typography.body,
    fontSize: 16,
    color: '#6B7280', 
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    gap: 16,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#355E2B',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#355E2B',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    ...typography.body,
    color: '#355E2B',
    fontSize: 18,
    fontWeight: '600',
  },
});