//STANDARD LIBRARY
import { useState } from 'react';

//THIRD-PARTY LIBRARIES
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//LOCAL FILES
import EventView from './eventView/eventView';
import EventDetails from './eventDetails/eventDetails';
import { styles } from './styles';
import type { Event } from '@shared/types/event';

export default function Calendar({
  loading,
  events,
}: {
  loading: boolean;
  events: Event[];
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

  //RENDER
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
            {events && events.length > 0
              ?
              <ScrollView>
                {events.filter(Boolean).map((event) => (
                  <EventView key={event.id} event={event} onPress={handleEventPress} />
                ))}
              </ScrollView>
              :
              <View>
                <Text style={styles.noEventsMessage}>No events found for these dates.</Text>
              </View>
            }

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
