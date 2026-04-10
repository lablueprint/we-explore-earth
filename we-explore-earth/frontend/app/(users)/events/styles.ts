import { StyleSheet } from 'react-native';

export const eventCardActiveOpacity = 0.7;
export const activityIndicatorSize = 'large' as const;

export const styles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventThumbnail: {
    width: 88,
    height: 88,
    backgroundColor: '#e0e0e0',
  },
  eventCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  eventDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  rsvpPill: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  rsvpGoing: {
    backgroundColor: '#4CAF50',
  },
  rsvpMaybe: {
    backgroundColor: '#FBC02D',
  },
  rsvpPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
