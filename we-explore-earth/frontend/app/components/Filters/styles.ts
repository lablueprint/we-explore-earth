// STANDARD / THIRD-PARTY IMPORTS
import { StyleSheet } from 'react-native';

// STYLES
export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },

  optionSelected: {
    borderColor: '#111',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '400',
  },

  optionTextSelected: {
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  resetText: {
    fontSize: 16,
  },

  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },

  applyText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },

  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },

  closeText: {
    color: '#555',
  },
});