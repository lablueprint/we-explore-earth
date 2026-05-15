import { StyleSheet } from 'react-native';
import { typography } from '../../../../../shared/typography/typography';


export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalOverlay: {
  flex: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  viewAllButton: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    marginRight: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  closeText: {
    ...typography.body,
    color: '#006e0d',
    fontWeight: '600',
  },
});