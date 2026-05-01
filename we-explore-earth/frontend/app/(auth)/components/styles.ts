import { StyleSheet } from 'react-native';
import { typography } from '../../../../shared/typography/typography';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonActive: {
    backgroundColor: '#355E2B',
  },
  buttonDisabled: {
    backgroundColor: '#8A8A8A',
  },
  buttonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputFocused: {
    borderColor: '#355E2B',
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  input: {
    ...typography.body,
    flex: 1,
    fontSize: 16,
    color: '#0A1207',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    ...typography.body,
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});