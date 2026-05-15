//STANDARD LIBRARY
import { useState, useMemo, useEffect } from "react";

//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgUri } from "react-native-svg";
import { useRouter } from "expo-router";

//LOCAL FILES
import Calendar from "@/app/components/Calendar/calendar";
import EventView from "@/app/components/Calendar/eventView/eventView";
import EventDetails from "@/app/components/Calendar/eventDetails/eventDetails";
import { useUser } from "@/hooks/useUser";
import type { Event } from "@shared/types/event";
import { styles, homeIcons, textStyles } from "./styles";

type Props = {
  events: Event[];
  loading: boolean;
  showFilters?: boolean;
  onPressFilters?: () => void;
  onRSVPChange?: () => void;
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
  const { user, userId } = useUser();

  const displayName = user?.firstName?.trim() || "there";

  //STATE VARIABLES
  const [brewingDetailsVisible, setBrewingDetailsVisible] = useState(false);
  const [brewingSelectedEvent, setBrewingSelectedEvent] = useState<Event | null>(null);

  const brewingPreviewEvent = useMemo(() => {
    if (!events.length) return null;
    return [...events]
      .filter((e) => e.attendees?.some((a) => a.userID === userId && (a.status === 'YES' || a.status === 'MAYBE')))
      .sort((a, b) => a.timeStart._seconds - b.timeStart._seconds)[0] ?? null;
  }, [events, userId]);

  const avatarKey = user?.avatar ?? null;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(null);

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!avatarKey || !baseUrl) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${baseUrl}/users/avatars/signed-url?key=${encodeURIComponent(avatarKey)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Avatar URL request failed: ${res.status}`);

        const { url } = (await res.json()) as { url?: string };
        if (url) setAvatarUrl(url);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load avatar URL:", err);
      }
    })();

    return () => controller.abort();
  }, [avatarKey]);

  //HANDLERS
  const handleBrewingEventPress = (event: Event) => {
    setBrewingSelectedEvent(event);
    setBrewingDetailsVisible(true);
  };

  //RENDER
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.heroBlock}>
        <View style={styles.heroRow}>
          <View
            style={styles.avatar}
            accessibilityLabel={
              avatarUrl ? "Your profile avatar" : "Profile avatar placeholder"
            }
          >
            {avatarUrl ? (
              <SvgUri uri={avatarUrl} width={48} height={48} />
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
              <Ionicons {...homeIcons.filterOptions} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!user?.isAdmin && (
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
      )}

      <View style={[styles.upcomingHeader, user?.isAdmin && { marginTop: -16 }]}>
        <Text style={textStyles.upcoming}>Explore events</Text>
      </View>

      <Calendar
        loading={loading}
        events={events}
        onRSVPChange={onRSVPChange}
        autoOpenEvent={autoOpenEvent}
        onAutoOpenEventHandled={onAutoOpenEventHandled}
      />

      {!user?.isAdmin && (
        <EventDetails
          visible={brewingDetailsVisible && !!brewingSelectedEvent}
          event={brewingSelectedEvent}
          onClose={() => setBrewingDetailsVisible(false)}
          onRSVPChange={onRSVPChange}
        />
      )}
    </ScrollView>
  );
}
