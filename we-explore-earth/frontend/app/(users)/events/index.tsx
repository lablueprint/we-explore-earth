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
import Ionicons from '@expo/vector-icons/Ionicons';

//LOCAL FILES
import { useUser } from '../../../hooks/useUser';
import EventDetails from '../../components/Calendar/eventDetails/eventDetails';
import type { Event, EventWithStatus } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
import { styles, eventCardActiveOpacity, activityIndicatorSize } from './styles';

type Tab = 'Upcoming' | 'Past';

const getEventDate = (e: EventWithStatus) => e.timeStart._seconds * 1000;

function formatEventDate(ms: number) {
  const date = new Date(ms);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`;
  return `${dayName} ${monthName} ${day}, ${hour12}${minuteStr}${ampm}`;
}

export default function MyEventsScreen() {
  //REACT HOOKS
  const { user } = useUser();
  const userId = user?.id ?? null;

  //STATE VARIABLES
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('Upcoming');
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
    }, [fetchMyEvents])
  );

  //FILTERING AND SORTING
  const now = Date.now();
  const list = useMemo(() => {
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

  //RENDER
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
        <Text style={styles.title}>Your Events</Text>

        <View style={styles.tabRow}>
          {(['Upcoming', 'Past'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabButton, tab === t ? styles.tabButtonActive : styles.tabButtonInactive]}
            >
              <Text style={tab === t ? styles.tabTextActive : styles.tabTextInactive}>{t}</Text>
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
              list.map((event) => {
                const status = event.status ?? null;
                //RENDER EACH EVENT CARD
                return (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                    activeOpacity={eventCardActiveOpacity}
                  >
                    <View style={styles.eventThumbnailWrap}>
                      <View style={styles.eventThumbnail} />
                    </View>
                    <View style={styles.eventCardContent}>
                      <Text style={[typography.h1, styles.eventTitle]} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <View style={styles.datePill}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#777"
                          style={styles.clockIcon}
                        />
                        <Text style={[typography.body, styles.eventDate]}>
                          {formatEventDate(getEventDate(event))}
                        </Text>
                      </View>
                      {status && (
                        <View
                          style={[
                            styles.rsvpPill,
                            status === 'YES' ? styles.rsvpGoing : styles.rsvpMaybe,
                          ]}
                        >
                          <Text style={[typography.body, styles.rsvpPillText]}>
                            {status === 'YES' ? 'Going' : 'Maybe'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
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
