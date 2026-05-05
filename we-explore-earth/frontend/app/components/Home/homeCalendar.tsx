//STANDARD LIBRARY
import { useState, useMemo } from "react";

//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

//LOCAL FILES
import Calendar from "@/app/components/Calendar/calendar";
import EventView from "@/app/components/Calendar/eventView/eventView";
import EventDetails from "@/app/components/Calendar/eventDetails/eventDetails";
import type { Event } from "@shared/types/event";
import { styles, homeIcons, textStyles } from "./styles";

type Props = {
  events: Event[];
  loading: boolean;
  isAdmin?: boolean;
  displayName?: string;
  showFilters?: boolean;
  onPressFilters?: () => void;
  onRSVPChange?: () => void;
};

export default function HomeCalendar({
  events,
  loading,
  isAdmin = false,
  displayName = "there",
  showFilters = true,
  onPressFilters,
  onRSVPChange,
}: Props) {
  //REACT HOOKS
  const router = useRouter();

  //STATE VARIABLES
  const [brewingDetailsVisible, setBrewingDetailsVisible] = useState(false);
  const [brewingSelectedEvent, setBrewingSelectedEvent] = useState<Event | null>(null);

  const brewingPreviewEvent = useMemo(() => {
    if (!events.length) return null;
    return [...events].sort((a, b) => a.timeStart._seconds - b.timeStart._seconds)[0];
  }, [events]);

  //HANDLERS
  const handleBrewingEventPress = (event: Event) => {
    setBrewingSelectedEvent(event);
    setBrewingDetailsVisible(true);
  };

  //RENDER
  if (isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.adminHeader}>
          <Text style={textStyles.upcoming}>Upcoming</Text>
        </View>
        <Calendar loading={loading} events={events} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroBlock}>
        <View style={styles.heroRow}>
          <View style={styles.avatar} accessibilityLabel="Profile avatar placeholder">
            <Ionicons {...homeIcons.avatarCamera} />
          </View>
          <Text style={textStyles.trailCalling} numberOfLines={2}>
            The trail is calling, {displayName}
          </Text>
        </View>
        {showFilters && (
          <View style={styles.heroFiltersRow}>
            <TouchableOpacity
              onPress={onPressFilters}
              style={styles.filterButtonWrapper}
              accessibilityRole="button"
              accessibilityLabel="Open event filters"
            >
              <Text style={textStyles.filters}>Filters</Text>
              <Ionicons {...homeIcons.filterOptions} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.brewingSection}>
        <View style={styles.brewingHeaderRow}>
          <Text style={styles.brewingTitleLine} numberOfLines={2}>
            <Text style={textStyles.brewingLead}>Brewing</Text>
            <Text style={textStyles.brewingTail}> next...</Text>
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(users)/events" as const)}
            style={styles.viewAllButton}
            accessibilityRole="button"
            accessibilityLabel="View all my events"
          >
            <Text style={textStyles.viewAll}>VIEW ALL {">"}</Text>
          </TouchableOpacity>
        </View>
        {brewingPreviewEvent ? (
          <EventView event={brewingPreviewEvent} onPress={handleBrewingEventPress} />
        ) : null}
      </View>

      <View style={styles.upcomingHeader}>
        <Text style={textStyles.upcoming}>Upcoming</Text>
      </View>

      <Calendar embedded loading={loading} events={events} />

      <EventDetails
        visible={brewingDetailsVisible && !!brewingSelectedEvent}
        event={brewingSelectedEvent}
        onClose={() => setBrewingDetailsVisible(false)}
        onRSVPChange={onRSVPChange}
      />
    </View>
  );
}
