import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E6EFE1',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3, 
    zIndex: -1, 
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    gap: 8,
  },
  progressDash: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  activeDash: {
    backgroundColor: '#355E2B', 
  },
  inactiveDash: {
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', 
    width: '100%',
  },
  title: { 
    fontSize: 42, 
    fontWeight: '400', 
    color: '#0A1207', 
    marginBottom: 8,
    fontFamily: 'serif', 
  },
  description: { 
    fontSize: 18, 
    color: '#0A1207', 
    lineHeight: 26,
  },
  footerContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#355E2B', 
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#FFFFFF',
  },
});