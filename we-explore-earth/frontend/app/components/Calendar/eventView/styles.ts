import { StyleSheet } from 'react-native';

export const clockIconSize = 13;
export const clockIconColor = '#777';
export const cardActiveOpacity = 0.85;

export const cardGradient = {
  colors: ['#FFFFFF', '#FAFAFA', '#F2F2F2'] as const,
  locations: [0, 0.55, 1] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const glossOverlay = {
  colors: [
    'rgba(255,255,255,0.75)',
    'rgba(255,255,255,0.28)',
    'rgba(255,255,255,0.06)',
    'rgba(255,255,255,0)',
  ] as const,
  locations: [0, 0.22, 0.48, 1] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    gap: 10,
    height: 110,
    overflow: 'hidden',
  },
  imageWrap: {
    alignSelf: 'stretch',
    flexShrink: 0,
    width: '32%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#d0d0d0',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    paddingTop: 2,
  },
  title: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clockIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666',
  },
  rsvpBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rsvpGoing: {
    backgroundColor: '#285F00',
  },
  rsvpMaybe: {
    backgroundColor: '#E6AB34',
  },
  rsvpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
