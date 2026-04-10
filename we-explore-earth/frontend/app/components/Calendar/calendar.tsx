// STANDARD / THIRD-PARTY IMPORTS
import { useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// LOCAL COMPONENTS
import EventView from "./eventView/eventView";
import EventDetails from "./eventDetails/eventDetails";

// TYPES
import type { Event } from "@shared/types/event";

export default function Calendar(
  {
    loading,
    events
  }
  :
  {
    loading: boolean,
    events: Event[]
  }
) {
  // STATE VARIABLES
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // HANDLERS
  const handleEventPress = (event: Event | null) => {
    if (!event) return;
    setSelectedEvent(event);
    setDetailsModalVisible(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
  };

  // RENDER
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {/** TODO: Group events by MONTH. Label groups with MONTH. */}
            <ScrollView>
              {events.filter(Boolean).map((event) => (
                <EventView
                  key={event.id}
                  event={event}
                  onPress={handleEventPress}
                />
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
