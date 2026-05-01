import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import EventFiltersModal from "../../components/Home/components/eventFiltersModal/eventFiltersModal";
import HomeCalendar from "@/app/components/Home/homeCalendar";

import type { Event } from "@shared/types/event";
import type { Filter } from "@shared/types/filter";

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilteredEvents() {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;

      if (!baseUrl) {
        console.log("Config Error", "EXPO_PUBLIC_API_URL is not set.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${baseUrl}/events/filtered`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch filtered events.");
        }

        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.log(
          error instanceof Error
            ? error.message
            : "Failed to fetch filtered events."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredEvents();
  }, [filters]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20,
        paddingHorizontal: 20,
      }}
    >
      <HomeCalendar
        events={events}
        loading={loading}
        showFilters
        onPressFilters={() => setFilterModalVisible(true)}
      />

      <EventFiltersModal
        setFilters={setFilters}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />
    </SafeAreaView>
  );
}