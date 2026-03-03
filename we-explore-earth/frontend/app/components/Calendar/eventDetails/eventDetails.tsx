import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import EventAttendees from '../eventAttendees/eventAttendees';
import EventAttendeesSummary from '../eventAttendeesSummary/eventAttendeesSummary';


type Props = {
  visible: boolean;
  event: Event | null;
  currentRSVP: 'YES' | 'MAYBE' | null;
  onClose: () => void;
  onRSVPPress: () => void;
};

const formatTimestamp = (ts: { _seconds: number; _nanoseconds: number }) => {
  return new Date(ts._seconds * 1000).toLocaleString();
};

export default function EventDetails({ visible, event, currentRSVP, onClose, onRSVPPress }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {event ? (
            <>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.body}>{event.description}</Text>
              <Text style={styles.meta}>Location: {event.location}</Text>
              <Text style={styles.meta}>Start: {formatTimestamp(event.timeStart)}</Text>
              <Text style={styles.meta}>End: {formatTimestamp(event.timeEnd)}</Text>
              <EventAttendeesSummary
                selectedEvent={event} 
              />
              


              {currentRSVP && (
                <View style={styles.rsvpStatus}>
                  <Text style={styles.rsvpStatusText}>
                    Your RSVP: <Text style={styles.rsvpStatusValue}>{currentRSVP}</Text>
                  </Text>
                </View>
              )}

              <TouchableOpacity onPress={onRSVPPress} style={styles.rsvpButton}>
                <Text style={styles.rsvpButtonText}>
                  {currentRSVP ? 'Update RSVP' : 'RSVP'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.title}>No event selected.</Text>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
