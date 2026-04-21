//STANDARD LIBRARY
import React, { useState, useEffect } from 'react';

//THIRD-PARTY LIBRARIES
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

//LOCAL FILES
import { styles } from './styles';
import type { Event, FirestoreTimestamp } from '@shared/types/event';
import EventAttendeesSummary from '../eventAttendeesSummary/eventAttendeesSummary';
import RSVPModal from '../RSVPModal/RSVPModal';
import { useUser } from '../../../../hooks/useUser';

type Props = {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  onRSVPChange?: () => void;
};

const formatTimestamp = (ts: FirestoreTimestamp) => {
  return new Date(ts._seconds * 1000).toLocaleString();
};

export default function EventDetails({ visible, event, onClose, onRSVPChange }: Props) {
  //REACT HOOKS
  const { user } = useUser();
  const router = useRouter();
  const segments = useSegments();

  //STATE VARIABLES
  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [localRSVP, setLocalRSVP] = useState<'YES' | 'MAYBE' | null>(null);

  const isAdmin = segments[0] === '(admin)';
  const currentRSVP =
    event && user?.events
      ? (user.events.find((e) => e.eventID === event.id)?.status as 'YES' | 'MAYBE' | undefined) ?? null
      : null;
  const displayRSVP = rsvpModalVisible ? localRSVP : currentRSVP;

  //HANDLERS
  const handleEdit = () => {
    if (event?.id) {
      onClose();
      router.push(`/(admin)/events/${event.id}` as const);
    }
  };

  const handleRSVPPress = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to RSVP to events.');
      return;
    }
    setRsvpModalVisible(true);
  };

  const handleCloseRSVPModal = () => {
    setRsvpModalVisible(false);
  };

  const handleRSVPChange = (status: 'YES' | 'MAYBE' | null) => {
    setLocalRSVP(status);
    onRSVPChange?.();
  };

  //EFFECTS
  useEffect(() => {
    setLocalRSVP(currentRSVP ?? null);
  }, [currentRSVP]);

  useEffect(() => {
    if (!visible) setRsvpModalVisible(false);
  }, [visible]);

  //RENDER
  return (
    <>
      <Modal
        visible={visible && !rsvpModalVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            {event ? (
              <>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.body}>{event.description}</Text>
                <Text style={styles.meta}>Location: {event.location}</Text>
                <Text style={styles.meta}>Start: {formatTimestamp(event.timeStart)}</Text>
                <Text style={styles.meta}>End: {formatTimestamp(event.timeEnd)}</Text>
                <EventAttendeesSummary selectedEvent={event} />

                {displayRSVP && (
                  <View style={styles.rsvpStatus}>
                    <Text style={styles.rsvpStatusText}>
                      Your RSVP: <Text style={styles.rsvpStatusValue}>{displayRSVP}</Text>
                    </Text>
                  </View>
                )}

                <TouchableOpacity onPress={handleRSVPPress} style={styles.rsvpButton}>
                  <Text style={styles.rsvpButtonText}>{displayRSVP ? 'Update RSVP' : 'RSVP'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.title}>No event selected.</Text>
            )}

            {isAdmin && event && (
              <TouchableOpacity onPress={handleEdit} style={styles.closeButton}>
                <Text style={styles.closeText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <RSVPModal
        visible={rsvpModalVisible && !!event}
        event={event}
        currentRSVP={localRSVP}
        onClose={handleCloseRSVPModal}
        onRSVPChange={handleRSVPChange}
      />
    </>
  );
}
