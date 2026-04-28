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
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  tabLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: '#888',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#000',
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
    backgroundColor: '#285F00',
  },
  rsvpMaybe: {
    backgroundColor: '#E6AB34',
  },
  rsvpPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
