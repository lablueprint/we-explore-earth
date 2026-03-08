// STANDARD / THIRD-PARTY IMPORTS
import { useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// LOCAL COMPONENTS
import EventView from "./eventView/eventView";
import EventDetails from "./eventDetails/eventDetails";
import EventAttendees from "./eventAttendees/eventAttendees";
import RSVPModal from "./RSVPModal/RSVPModal";

// TYPES
import type { Event, RSVPStatus } from "@shared/types/event";

// HOOKS
import { useUser } from "../../../hooks/useUser";

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
  const { user } = useUser();

  // STATE VARIABLES
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [currentRSVP, setCurrentRSVP] = useState<RSVPStatus | null>(null);

  // HANDLERS
  const handleEventPress = (event: Event | null) => {
    if (!event) return;
    setSelectedEvent(event);
    const existingRSVP = user?.events?.find((e) => e.eventID === event.id);
    setCurrentRSVP(existingRSVP ? (existingRSVP.status as RSVPStatus) : null);
    setDetailsModalVisible(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
  };

  const handleRSVPPress = () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to RSVP to events.");
      return;
    }
    setDetailsModalVisible(false);
    setRsvpModalVisible(true);
  };

  const handleCloseRSVPModal = () => {
    setRsvpModalVisible(false);
    setDetailsModalVisible(true);
  };

  const handleRSVPChange = (status: RSVPStatus | null) => {
    setCurrentRSVP(status);
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
              currentRSVP={currentRSVP}
              onClose={handleCloseDetailsModal}
              onRSVPPress={handleRSVPPress}
            />

            <RSVPModal
              visible={rsvpModalVisible && !!selectedEvent}
              event={selectedEvent}
              currentRSVP={currentRSVP}
              onClose={handleCloseRSVPModal}
              onRSVPChange={handleRSVPChange}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
