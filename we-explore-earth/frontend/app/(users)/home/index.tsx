//STANDARD LIBRARY
import { useState, useEffect, useCallback, useMemo } from 'react';

//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

//LOCAL FILES
import EventFiltersModal from './components/eventFiltersModal/eventFiltersModal';
import Calendar from '@/app/components/Calendar/calendar';
import EventView from '@/app/components/Calendar/eventView/eventView';
import EventDetails from '@/app/components/Calendar/eventDetails/eventDetails';
import { Event } from '@shared/types/event';
import { Filter } from '@shared/types/filter';
import { styles, homeIcons, textStyles } from './styles';
import { useUser } from '@/hooks/useUser';

export default function HomeScreen() {
  //REACT HOOKS
  const { user } = useUser();
  const router = useRouter();

  //STATE VARIABLES
  const [events, setEvents] = useState<Array<Event>>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // for showing calendar or loading indicator
  const [brewingDetailsVisible, setBrewingDetailsVisible] = useState(false);
  const [brewingSelectedEvent, setBrewingSelectedEvent] = useState<Event | null>(null);

  const displayName = (user?.firstName?.trim() || 'there');

  //HANDLERS
  const fetchFilteredEvents = useCallback(async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      console.log("Config Error", "EXPO_PUBLIC_API_URL is not set.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/events/filtered`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        }
      );
      if(!response.ok) {
        throw new Error("Failed to fetch filtered events.");
      }
      const data: Event[] = await response.json();
      setEvents(data);
      console.log("Successfully fetched filtered events.");
    }
    catch (error: unknown) {
      console.log(error instanceof Error ? error.message : "Failed to fetch filtered events.");
    }
    finally {
      setLoading(false);
    }
  }, [filters]);

  //EFFECTS
  useEffect(() => {
    fetchFilteredEvents();
  }, [fetchFilteredEvents]);

  const brewingPreviewEvent = useMemo(() => {
    if (!events.length) return null;
    return [...events].sort(
      (a, b) => a.timeStart._seconds - b.timeStart._seconds
    )[0];
  }, [events]);

  const handleBrewingEventPress = (event: Event) => {
    setBrewingSelectedEvent(event);
    setBrewingDetailsVisible(true);
  };

  const handleCloseBrewingDetails = () => {
    setBrewingDetailsVisible(false);
  };

  const goToMyEvents = () => {
    router.push('/(users)/events' as const);
  };

  //RENDER
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {!user?.isAdmin && (
          <>
            <View style={styles.heroBlock}>
              <View style={styles.heroRow}>
                <View style={styles.avatar} accessibilityLabel="Profile avatar placeholder">
                  <Ionicons {...homeIcons.avatarCamera} />
                </View>
                <Text style={textStyles.trailCalling} numberOfLines={2}>
                  The trail is calling, {displayName}
                </Text>
              </View>
              <View style={styles.heroFiltersRow}>
                <TouchableOpacity
                  onPress={() => { setFilterModalVisible(true); }}
                  style={styles.filterButtonWrapper}
                  accessibilityRole="button"
                  accessibilityLabel="Open event filters"
                >
                  <Text style={textStyles.filters}>Filters</Text>
                  <Ionicons {...homeIcons.filterOptions} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.brewingSection}>
              <View style={styles.brewingHeaderRow}>
                <Text style={styles.brewingTitleLine} numberOfLines={2}>
                  <Text style={textStyles.brewingLead}>Brewing</Text>
                  <Text style={textStyles.brewingTail}> next...</Text>
                </Text>
                <TouchableOpacity
                  onPress={goToMyEvents}
                  style={styles.viewAllButton}
                  accessibilityRole="button"
                  accessibilityLabel="View all my events"
                >
                  <Text style={textStyles.viewAll}>VIEW ALL {'>'}</Text>
                </TouchableOpacity>
              </View>
              {brewingPreviewEvent ? (
                <EventView event={brewingPreviewEvent} onPress={handleBrewingEventPress} />
              ) : null}
            </View>

            {/** Home Page */}
            <View style={styles.upcomingHeader}>
              <Text style={textStyles.upcoming}>Upcoming</Text>
            </View>

            <Calendar embedded loading={loading} events={events} />
          </>
        )}
      </ScrollView>

      <EventDetails
        visible={brewingDetailsVisible && !!brewingSelectedEvent}
        event={brewingSelectedEvent}
        onClose={handleCloseBrewingDetails}
        onRSVPChange={fetchFilteredEvents}
      />

      {/** Event filters modal */}
      <EventFiltersModal
        setFilters={setFilters}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />

    </SafeAreaView>
  );
}
