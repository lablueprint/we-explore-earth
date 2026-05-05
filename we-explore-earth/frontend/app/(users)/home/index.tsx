//STANDARD LIBRARY
import { useState, useEffect, useCallback } from "react";

//THIRD-PARTY LIBRARIES
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//LOCAL FILES
import EventFiltersModal from "../../components/Home/components/eventFiltersModal/eventFiltersModal";
import HomeCalendar from "@/app/components/Home/homeCalendar";
import { useUser } from "@/hooks/useUser";
import type { Event } from "@shared/types/event";
import type { Filter } from "@shared/types/filter";
import { styles } from "./styles";

export default function HomeScreen() {
  //REACT HOOKS
  const { user } = useUser();

  //STATE VARIABLES
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const displayName = user?.firstName?.trim() || "there";

  //HANDLERS
  const fetchFilteredEvents = useCallback(async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      console.log("Config Error", "EXPO_PUBLIC_API_URL is not set.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/events/filtered`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      if (!response.ok) throw new Error("Failed to fetch filtered events.");
      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error: unknown) {
      console.log(error instanceof Error ? error.message : "Failed to fetch filtered events.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  //EFFECTS
  useEffect(() => {
    fetchFilteredEvents();
  }, [fetchFilteredEvents]);

  //RENDER
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <HomeCalendar
          events={events}
          loading={loading}
          displayName={displayName}
          showFilters
          onPressFilters={() => setFilterModalVisible(true)}
          onRSVPChange={fetchFilteredEvents}
        />
      </ScrollView>

      <EventFiltersModal
        setFilters={setFilters}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />
    </SafeAreaView>
  );
}
