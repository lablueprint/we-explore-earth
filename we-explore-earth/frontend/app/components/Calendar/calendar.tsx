//STANDARD LIBRARY
import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';

import EventView from './eventView/eventView';
import EventDetails from './eventDetails/eventDetails';
import { styles } from './styles';
import type { Event } from '@shared/types/event';

export default function Calendar({
  loading,
  events,
  onRSVPChange,
  autoOpenEvent,
  onAutoOpenEventHandled,
}: {
  loading: boolean;
  events: Event[];
  onRSVPChange?: () => void;
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

  return (
    <View>
      {loading ? (
        <View style={styles.embeddedLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {events.filter(Boolean).map((event) => (
            <EventView key={event.id} event={event} onPress={handleEventPress} />
          ))}
          <EventDetails
            visible={detailsModalVisible && !!selectedEvent}
            event={selectedEvent}
            onClose={handleCloseDetailsModal}
            onRSVPChange={onRSVPChange}
          />
        </>
      )}
    </View>
  );
}
