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
    paddingBottom: 60,
  },
  title: { 
    ...typography.h1,
    fontSize: 52,
    fontWeight: 'bold',
    color: '#0A1207', 
    marginBottom: 16,
  },
  description: { 
    ...typography.h1,
    fontWeight: '300', 
    fontSize: 26,
    color: 'rgba(10, 18, 7, 0.85)', 
  },
  descriptionSmall: {
    ...typography.h1,
    fontWeight: '300', 
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(10, 18, 7, 0.85)',
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
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});