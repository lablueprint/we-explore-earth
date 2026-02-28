import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import RSVPModal from '../RSVPModal/RSVPModal';
import { useUser } from '../../../../hooks/useUser';

type Props = {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  /** Optional for backward compat (e.g. My Events); when not provided, RSVP is derived from user */
  currentRSVP?: 'YES' | 'MAYBE' | null;
  onRSVPPress?: () => void;
  onRSVPChange?: (status: 'YES' | 'MAYBE' | null) => void;
};

const formatTimestamp = (ts: { _seconds: number; _nanoseconds: number }) => {
  return new Date(ts._seconds * 1000).toLocaleString();
};

export default function EventDetails({ visible, event, onClose, currentRSVP: currentRSVPProp, onRSVPPress, onRSVPChange: onRSVPChangeProp }: Props) {
  const { user } = useUser();
  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [localRSVP, setLocalRSVP] = useState<'YES' | 'MAYBE' | null>(null);

  // Derive current RSVP from user.events when event or user changes (so parent doesn't need to pass it)
  const derivedRSVP = event && user?.events
    ? (user.events.find((e) => e.eventID === event.id)?.status as 'YES' | 'MAYBE' | undefined) ?? null
    : null;
  const currentRSVP = currentRSVPProp ?? derivedRSVP;

  useEffect(() => {
    setLocalRSVP(currentRSVP ?? null);
  }, [currentRSVP]);

  // When details close, reset RSVP modal so next open is clean
  useEffect(() => {
    if (!visible) setRsvpModalVisible(false);
  }, [visible]);

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
    onRSVPChangeProp?.(status);
  };

  const displayRSVP = rsvpModalVisible ? localRSVP : currentRSVP;

  return (
    <>
      <Modal visible={visible && !rsvpModalVisible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            {event ? (
              <>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.body}>{event.description}</Text>
                <Text style={styles.meta}>Location: {event.location}</Text>
                <Text style={styles.meta}>Start: {formatTimestamp(event.timeStart)}</Text>
                <Text style={styles.meta}>End: {formatTimestamp(event.timeEnd)}</Text>

                {displayRSVP && (
                  <View style={styles.rsvpStatus}>
                    <Text style={styles.rsvpStatusText}>
                      Your RSVP: <Text style={styles.rsvpStatusValue}>{displayRSVP}</Text>
                    </Text>
                  </View>
                )}

                <TouchableOpacity onPress={handleRSVPPress} style={styles.rsvpButton}>
                  <Text style={styles.rsvpButtonText}>
                    {displayRSVP ? 'Update RSVP' : 'RSVP'}
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
