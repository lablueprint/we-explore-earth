import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeCalendar from "@/app/components/Home/homeCalendar";
import type { Event } from "@shared/types/event";

export default function AdminHomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;

      if (!baseUrl) {
        console.log("Config Error", "EXPO_PUBLIC_API_URL is not set.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/events`);
        if (!response.ok) throw new Error("Failed to fetch events.");

        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.log(error instanceof Error ? error.message : "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

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
        showFilters={false}
      />
    </SafeAreaView>
  );
}