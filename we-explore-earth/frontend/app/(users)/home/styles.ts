import { StyleSheet } from 'react-native';
import { typography } from '@shared/typography/typography';

/* Take out once Jason integrates photos*/
export const homeIcons = {
  avatarCamera: {
    name: 'camera-outline' as const,
    size: 22,
    color: '#666',
  },
  filterOptions: {
    name: 'options-outline' as const,
    size: 22,
    color: '#666',
  },
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroBlock: {
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  heroFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brewingSection: {
    marginBottom: 22,
  },
  brewingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brewingTitleLine: {
    flexShrink: 1,
    marginRight: 8,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  upcomingHeader: {
    marginBottom: 12,
  },
  filterButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#999',
  },
});


export const homeType = StyleSheet.create({
  trailCalling: {
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#000',
    flex: 1,
    alignSelf: 'flex-start',
  },
  viewAll: {
    fontFamily: 'HankenGrotesk-Regular',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    color: '#888',
  },
  filterLabel: {
    fontFamily: 'HankenGrotesk-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export const textStyles = {
  trailCalling: homeType.trailCalling,
  filters: homeType.filterLabel,
  brewingLead: typography.h1,
  brewingTail: typography.h1,
  viewAll: homeType.viewAll,
  upcoming: typography.h1,
};
