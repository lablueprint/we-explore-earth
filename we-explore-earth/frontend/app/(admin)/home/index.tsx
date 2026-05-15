import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import EventFiltersModal from "@/app/components/Home/components/eventFiltersModal/eventFiltersModal";
import HomeCalendar from "@/app/components/Home/homeCalendar";

import type { Event } from "@shared/types/event";
import type { Filter } from "@shared/types/filter";
import { usePendingUpdatedAdminEvent } from "../PendingUpdatedAdminEventContext";

export default function AdminHomeScreen() {
  //STATE VARIABLES
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoOpenEvent, setAutoOpenEvent] = useState<Event | null>(null);

  const { consumePendingUpdatedEvent } = usePendingUpdatedAdminEvent();

  const fetchFilteredEvents = useCallback(async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      console.log("Config Error: EXPO_PUBLIC_API_URL is not set.");
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
  }, [filters]);

  useFocusEffect(
    useCallback(() => {
      const updated = consumePendingUpdatedEvent();
      if (updated) {
        setAutoOpenEvent(updated);
      }
      void fetchFilteredEvents();
    }, [consumePendingUpdatedEvent, fetchFilteredEvents])
  );

  //RENDER
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
        onRSVPChange={fetchFilteredEvents}
        autoOpenEvent={autoOpenEvent}
        onAutoOpenEventHandled={() => setAutoOpenEvent(null)}
      />

      <EventFiltersModal
        setFilters={setFilters}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />
    </SafeAreaView>
  );
}
