//STANDARD LIBRARY
import React, { useState, useEffect, useRef } from 'react';

//THIRD-PARTY LIBRARIES
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EventView from './eventView/eventView';
import EventDetails from './eventDetails/eventDetails';
import { styles } from './styles';
import type { Event } from '@shared/types/event';

export default function Calendar({
  loading,
  events,
  embedded = false,
  onRSVPChange,
  autoOpenEvent,
  onAutoOpenEventHandled,
}: {
  loading: boolean;
  events: Event[];
  embedded?: boolean;
  onRSVPChange?: () => void;
  /** When set, opens details for this event once (e.g. after admin edit). */
  autoOpenEvent?: Event | null;
  onAutoOpenEventHandled?: () => void;
}) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const lastAutoOpenedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!autoOpenEvent) {
      lastAutoOpenedIdRef.current = null;
      return;
    }
    if (lastAutoOpenedIdRef.current === autoOpenEvent.id) return;
    lastAutoOpenedIdRef.current = autoOpenEvent.id;
    setSelectedEvent(autoOpenEvent);
    setDetailsModalVisible(true);
    queueMicrotask(() => onAutoOpenEventHandled?.());
  }, [autoOpenEvent, onAutoOpenEventHandled]);

  const handleEventPress = (event: Event | null) => {
    if (!event) return;
    setSelectedEvent(event);
    setDetailsModalVisible(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
  };

  const eventList = events.filter(Boolean).map((event) => (
    <EventView key={event.id} event={event} onPress={handleEventPress} />
  ));

  const details = (
    <EventDetails
      visible={detailsModalVisible && !!selectedEvent}
      event={selectedEvent}
      onClose={handleCloseDetailsModal}
      onRSVPChange={onRSVPChange}
    />
  );

  if (embedded) {
    return (
      <View>
        {loading ? (
          <View style={styles.embeddedLoading}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {eventList}
            {details}
          </>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.flexFill}>
        {loading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {events && events.length > 0
              ?
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {eventList}
              </ScrollView>
              :
              <View>
                <Text style={styles.noEventsMessage}>No events found for these dates.</Text>
              </View>
            }

            {details}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}