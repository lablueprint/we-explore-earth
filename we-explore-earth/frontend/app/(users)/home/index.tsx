// STANDARD / THIRD-PARTY IMPORTS
import { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, Alert, SafeAreaView, ScrollView, Pressable, } from 'react-native';

// LOCAL COMPONENTS
import EventView from '../../components/Calendar/eventView/eventView';
import EventDetails from '../../components/Calendar/eventDetails/eventDetails';
import FiltersPage from '../../components/Filters/filtersPage';

// TYPES
import type { Event } from '../../components/Calendar/calendar';

export default function HomeScreen() {
  // STATE VARIABLES
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
        const text = await res.text().catch(() => '');
        Alert.alert(
          'Error',
          `Failed to fetch events (status ${res.status})${text ? `\n${text}` : ''}`
        );
        return;
      }

      const data: Event[] = await res.json();
      setEvents(data);
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
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  const handleOpenFilters = () => {
    setFilterVisible(true);
  };

  const handleCloseFilters = () => {
    setFilterVisible(false);
  };

  // EFFECTS
  useEffect(() => {
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
            {/* HEADER */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Events</Text>

              <Pressable
                onPress={handleOpenFilters}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}
              >
                <Text style={{ fontWeight: '600' }}>Filter</Text>
              </Pressable>
            </View>

            {/* EVENT LIST */}
            <ScrollView>
              {events.filter(Boolean).map((event) => (
                <EventView key={event.id} event={event} onPress={handleEventPress} />
              ))}
            </ScrollView>

            {/* EVENT DETAILS MODAL */}
            <EventDetails
              visible={modalVisible && !!selectedEvent}
              event={selectedEvent}
              onClose={handleCloseModal}
            />

            {/* FILTERS MODAL (DUMMY) */}
            <FiltersPage visible={filterVisible} onClose={handleCloseFilters} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}