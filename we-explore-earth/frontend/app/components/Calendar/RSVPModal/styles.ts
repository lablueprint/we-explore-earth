import { StyleSheet } from 'react-native';
import { typography } from '@shared/typography/typography';

export const closeIconSize = 18;
export const closeIconColor = '#555';
export const checkmarkIconSize = 12;
export const checkmarkIconColor = '#fff';
export const activityIndicatorColor = '#285F00';
export const gradientColors = ['#ffffff', '#eaf1e2', '#d2e6c8'] as const;
export const gradientLocations = [0, 0.42, 1] as const;
export const scrollPaddingTopExtra = 52;
export const scrollPaddingBottomMin = 24;
export const scrollPaddingBottomExtra = 12;
export const closeButtonTopExtra = 10;
export const closeButtonRightExtra = 16;

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  gradient: {
    height: '75%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 2,
    top: 20,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#d5e0cf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  submittingIndicator: {
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 36,
    backgroundColor: '#f0f4ee',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#285F00',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 28,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#888',
    borderRadius: 4,
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#285F00',
    borderColor: '#285F00',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#444',
  },
  rsvpButton: {
    backgroundColor: '#285F00',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export const titleTextStyle = [typography.h1, styles.title];

export function getOptionTextStyle(isSelected: boolean) {
  return [typography.body, styles.optionText, isSelected ? styles.optionTextSelected : null];
}

export const termsTextStyle = [typography.body, styles.termsText];
export const termsLinkStyle = [typography.body, styles.termsLink];
export const rsvpButtonTextStyle = [typography.body, styles.rsvpButtonText];
