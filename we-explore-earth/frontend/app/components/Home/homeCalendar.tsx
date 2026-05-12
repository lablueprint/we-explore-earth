//STANDARD LIBRARY
import { useState, useMemo, useEffect } from "react";

//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { SvgUri } from "react-native-svg";

//LOCAL FILES
import Calendar from "@/app/components/Calendar/calendar";
import EventView from "@/app/components/Calendar/eventView/eventView";
import { useUser } from "@/hooks/useUser";
import type { Event } from "@shared/types/event";
import { styles, homeIcons, textStyles } from "./styles";

type Props = {
  events: Event[];
  loading: boolean;
  showFilters?: boolean;
  onPressFilters?: () => void;
  onRSVPChange?: () => void;
  /** After an admin saves an edit, open this event in the details sheet. */
  autoOpenEvent?: Event | null;
  onAutoOpenEventHandled?: () => void;
};

export default function HomeCalendar({
  events,
  loading,
  showFilters = true,
  onPressFilters,
  onRSVPChange,
  autoOpenEvent,
  onAutoOpenEventHandled,
}: Props) {
  //REACT HOOKS
  const router = useRouter();
  const { user } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const displayName = user?.firstName?.trim() || "there";

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

  useEffect(() => {
    if (!user?.avatar) {
      setAvatarUrl(null);
      return;
    }

    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/avatars/signed-url?key=${encodeURIComponent(user.avatar)}`
    )
      .then((res) => res.json())
      .then((data) => setAvatarUrl(data.url))
      .catch((err) => {
        console.error("Failed to fetch avatar URL:", err);
        setAvatarUrl(null);
      });
  }, [user?.avatar]);

  //RENDER
  if (user?.isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.adminHeader}>
          <Text style={textStyles.upcoming}>Upcoming</Text>
        </View>
        <Calendar
          loading={loading}
          events={events}
          embedded
          autoOpenEvent={autoOpenEvent}
          onAutoOpenEventHandled={onAutoOpenEventHandled}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroBlock}>
        <View style={styles.heroRow}>
          <View style={styles.avatar} accessibilityLabel="Profile avatar placeholder">
            {avatarUrl ? (
              <SvgUri uri={avatarUrl} width={46} height={46} />
            ) : (
              <Ionicons {...homeIcons.avatarCamera} />
            )}
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

      <Calendar
        loading={loading}
        events={events}
        onRSVPChange={onRSVPChange}
        autoOpenEvent={autoOpenEvent}
        onAutoOpenEventHandled={onAutoOpenEventHandled}
      />
    </View>
  );
}
