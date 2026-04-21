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
  vectorLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.6,
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
    ...typography.h1,
    color: '#0A1207', 
    marginBottom: 8,
  },
  description: { 
    ...typography.body,
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
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});