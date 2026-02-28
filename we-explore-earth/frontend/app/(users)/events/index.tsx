//STANDARD LIBRARY
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

//THIRD-PARTY LIBRARIES

//LOCAL FILES
import { useUser } from '../../../hooks/useUser';
import EventView from '../../components/Calendar/eventView/eventView';
import EventDetails from '../../components/Calendar/eventDetails/eventDetails';
import type { Event, EventWithStatus } from '@shared/types/event';
import { styles } from './styles';

type Filter = 'All' | 'Yes' | 'Maybe';

export default function MyEventsScreen() {

  //REACT HOOKS
  const { user } = useUser();
  const userId = user?.id ?? null;

  //STATE VARIABLES
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  //HANDLERS
  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  //EFFECTS
  const fetchMyEvents = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/users/${userId}/events`);
      if (!res.ok) {
        Alert.alert('Error', `Failed to fetch events (${res.status})`);
        return;
      }

      const data: EventWithStatus[] = await res.json();
      setEvents(data);
    } catch {
      Alert.alert('Network Error', 'Could not fetch your events.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  //RENDER
  const filtered = events.filter((e) => {
    const s = (e.status ?? '').toUpperCase();
    if (filter === 'All') return true;
    if (filter === 'Yes') return s === 'YES';
    if (filter === 'Maybe') return s === 'MAYBE';
    return true;
  });

  if (!userId) {
    return (
      <SafeAreaView style={styles.screenCenter}>
        <Text>Sign in to see your events.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Your Events
        </Text>

        <View style={styles.filterRow}>
          {(['All', 'Yes', 'Maybe'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                filter === f ? styles.filterButtonActive : styles.filterButtonInactive,
              ]}
            >
              <Text style={filter === f ? styles.filterTextActive : styles.filterTextInactive}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView>
            {filtered.map((event) => (
              <EventView
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))}
          </ScrollView>
        )}

        <EventDetails
          visible={modalVisible && !!selectedEvent}
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      </View>
    </SafeAreaView>
  );
}
