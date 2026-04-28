//STANDARD LIBRARY
import { useState } from 'react';

//THIRD-PARTY LIBRARIES
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//LOCAL FILES
import EventView from './eventView/eventView';
import EventDetails from './eventDetails/eventDetails';
import { styles } from './styles';
import type { Event } from '@shared/types/event';

export default function Calendar({
  loading,
  events,
  embedded = false,
}: {
  loading: boolean;
  events: Event[];
  embedded?: boolean;
}) {
  //STATE VARIABLES
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  //HANDLERS
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
            {/* Set up calendar to group events by MONTH. Label groups with MONTH. Add filters to the calendar when ready. */}
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
            {/** TODO: Group events by MONTH. Label groups with MONTH. */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {eventList}
            </ScrollView>
            {details}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
