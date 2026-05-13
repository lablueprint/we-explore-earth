//STANDARD LIBRARY
import { useState, useCallback, useMemo } from 'react';
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
import { useFocusEffect } from 'expo-router';

//LOCAL FILES
import { useUser } from '../../../hooks/useUser';
import EventView from '../../components/Calendar/eventView/eventView';
import EventDetails from '../../components/Calendar/eventDetails/eventDetails';
import type { Event, EventWithStatus } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
import {
  styles,
  activityIndicatorSize,
} from './styles';

type Tab = 'Upcoming' | 'Past';

const getEventDate = (e: EventWithStatus) => e.timeStart._seconds * 1000;

export default function MyEventsScreen() {
  //REACT HOOKS
  const { user } = useUser();

  //STATE VARIABLES
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('Upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userId = user?.id ?? null;

  const list = useMemo(() => {
    const now = Date.now();
    const filtered =
      tab === 'Upcoming'
        ? events.filter((e) => getEventDate(e) >= now)
        : events.filter((e) => getEventDate(e) < now);
    return [...filtered].sort((a, b) => {
      const ta = getEventDate(a);
      const tb = getEventDate(b);
      if (tab === 'Upcoming') return ta - tb;
      return tb - ta;
    });
  }, [events, tab]);

  //HANDLERS
  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

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

  //EFFECTS
  useFocusEffect(
    useCallback(() => {
      fetchMyEvents();
    }, [fetchMyEvents]),
  );

  //RENDER
  if (!userId) {
    return (
      <SafeAreaView style={styles.screenCenter}>
        <Text style={styles.signInMessage}>Sign in to see your events.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[typography.h1, styles.title]}>Your Events</Text>

        <View style={styles.tabRow}>
          {(['Upcoming', 'Past'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text
                style={[
                  typography.body,
                  styles.tabLabel,
                  tab === t && styles.tabLabelActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={activityIndicatorSize} />
          </View>
        ) : (
          <ScrollView style={styles.scroll}>
            {list.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {tab === 'Upcoming'
                    ? "You don't have any upcoming events."
                    : "You don't have any past events."}
                </Text>
              </View>
            ) : (
              list.map((event) => (
                <EventView key={event.id} event={event} onPress={handleEventPress} />
              ))
            )}
          </ScrollView>
        )}

        <EventDetails
          visible={modalVisible && !!selectedEvent}
          event={selectedEvent}
          onClose={handleCloseModal}
          onRSVPChange={fetchMyEvents}
        />
      </View>
    </SafeAreaView>
  );
}
