import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 120,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  checkbox: {
    padding: 5,
  },
  checkboxInner: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 12,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
