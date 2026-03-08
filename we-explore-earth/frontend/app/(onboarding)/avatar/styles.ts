import { StyleSheet } from 'react-native';

const PREVIEW_SIZE = 180;
const AVATAR_SIZE = 70;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  previewCircle: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_SIZE / 2,
    backgroundColor: '#e8e8e8',
    marginTop: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_SIZE / 2,
  },
  previewPlaceholder: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: PREVIEW_SIZE / 2,
    backgroundColor: '#e0e0e0',
  },
  grid: {
    alignItems: 'center',
    marginTop: 20,
  },
  gridRow: {
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarOption: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  avatarOptionSelected: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
