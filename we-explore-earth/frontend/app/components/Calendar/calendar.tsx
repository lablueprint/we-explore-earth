//STANDARD LIBRARY
import React, { useState, useEffect, useRef } from 'react';

//THIRD-PARTY LIBRARIES
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// LOCAL COMPONENTS
import EventView from "./eventView/eventView";
import EventDetails from "./eventDetails/eventDetails";

// TYPES
import type { Event } from "@shared/types/event";

// LOCAL STYLES
import { styles } from "./styles";

type CalendarProps = {
  loading: boolean;
  events?: Array<Event | null | undefined>;
  embedded?: boolean;
  onRSVPChange?: () => void;
  /** When set, opens details for this event once (e.g. after admin edit). */
  autoOpenEvent?: Event | null;
  onAutoOpenEventHandled?: () => void;
};

export default function Calendar({
  loading,
  events = [],
  embedded = false,
  onRSVPChange,
  autoOpenEvent,
  onAutoOpenEventHandled,
}: CalendarProps) {
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

  const visibleEvents = events.filter((e): e is Event => Boolean(e));

  const eventList = visibleEvents.map((event) => (
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

  const Container = embedded ? View : SafeAreaView;

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
    <Container style={styles.screen}>
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
    </Container>
  );
}
