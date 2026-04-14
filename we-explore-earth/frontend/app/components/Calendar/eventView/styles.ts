import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  imageWrap: {
    flexShrink: 0,
    width: '42%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d0d0d0',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: '#1a1a1a',
    lineHeight: 24,
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
    paddingVertical: 5,
  },
  clockIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666',
  },
  rsvpBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  rsvpGoing: {
    backgroundColor: '#285F00',
  },
  rsvpMaybe: {
    backgroundColor: '#E6AB34',
  },
  rsvpText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
