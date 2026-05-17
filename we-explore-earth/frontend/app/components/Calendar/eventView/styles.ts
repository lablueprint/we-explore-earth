import { StyleSheet } from 'react-native';

export const clockIconSize = 13;
export const clockIconColor = '#777';
export const cardActiveOpacity = 0.85;

export const cardGradient = {
  colors: ['#fbfbfb', '#f7f7f7', '#ffffff'] as const,
  locations: [0, 0.55, 1] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    gap: 10,
    height: 120,
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
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  
  timeText: {
    fontSize: 14,
    color: "#8C8C86",
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
