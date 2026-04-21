import { StyleSheet } from 'react-native';

export const eventCardActiveOpacity = 0.85;
export const activityIndicatorSize = 'large' as const;
export const clockIconSize = 16;
export const clockIconColor = '#777';

export const styles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInMessage: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2196F3',
  },
  tabButtonInactive: {
    backgroundColor: '#eee',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    gap: 14,
  },
  eventThumbnailWrap: {
    alignSelf: 'flex-start',
    flexShrink: 0,
    width: '40%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventThumbnail: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
  },
  eventCardContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-start',
    gap: 14,
    paddingTop: 2,
  },
  eventTitle: {
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clockIcon: {
    marginRight: 6,
  },
  eventDate: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666',
  },
  rsvpPill: {
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  rsvpGoing: {
    backgroundColor: '#3d5a1a',
  },
  rsvpMaybe: {
    backgroundColor: '#b8860b',
  },
  rsvpPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
