// STANDARD / THIRD-PARTY IMPORTS
import { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, Alert, SafeAreaView, ScrollView} from 'react-native';

// LOCAL COMPONENTS
import EventView from './eventView/eventView';
import EventDetails from './eventDetails/eventDetails';

// TYPES
import type { Event } from '@shared/types/event';

export default function Calendar() {
  // STATE VARIABLES
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // TIME FILTERING - only upcoming events
  const timeFiltering = useMemo(() => {
    const now = Date.now();
    return allEvents.filter((event) => {
      const eventTime = event.timeStart._seconds * 1000; // Convert seconds to milliseconds
      return eventTime >= now;
    });
  }, [allEvents]);

  // Update currentEvents when timeFiltering changes
  useEffect(() => {
    setCurrentEvents(timeFiltering);
  }, [timeFiltering]);

  // DATA FETCHING
  const fetchEvents = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${baseUrl}/events`);

      if (!res.ok) {
        Alert.alert('Error', `Failed to fetch events (status ${res.status})`);
        return;
      }

      const data: Event[] = await res.json();
      setAllEvents(data);
    } catch {
      Alert.alert('Network Error', 'Could not fetch events.');
    } finally {
      setLoading(false);
    }
  };

  // HANDLERS
  const handleEventPress = (event: Event | null) => {
    if (!event) return;
    setSelectedEvent(event);
    setDetailsModalVisible(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
  };

  // EFFECTS
  useEffect(() => {
    console.log("Fetching all events");
    fetchEvents();
  }, []);

  // RENDER
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
              Events
            </Text>

            <ScrollView>
              {currentEvents.filter(Boolean).map((event) => (
                <EventView key={event.id} event={event} onPress={handleEventPress} />
              ))}
            </ScrollView>

            <EventDetails
              visible={detailsModalVisible && !!selectedEvent}
              event={selectedEvent}
              onClose={handleCloseDetailsModal}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
