import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import type { Event, RSVPStatus } from '@shared/types/event';
import { useUser } from '../../../../hooks/useUser';
import { useAppDispatch } from '../../../redux/hooks';
import { updateUserState } from '../../../redux/slices/userSlice';

type Props = {
  visible: boolean;
  event: Event | null;
  currentRSVP: RSVPStatus | null;
  onClose: () => void;
  onRSVPChange: (status: RSVPStatus | null) => void;
};

export default function RSVPModal({ visible, event, currentRSVP, onClose, onRSVPChange }: Props) {
  const { user, userId } = useUser();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRSVPSelect = async (status: RSVPStatus) => {
    if (!event || !userId || !user) return;

    setIsSubmitting(true);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Update event attendees
      const eventRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userId, status }),
      });
      if (!eventRes.ok) {
        Alert.alert('Error', 'Failed to update event RSVP.');
        return;
      }

      // Update user events
      const userRes = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventID: event.id, status }),
      });
      if (!userRes.ok) {
        Alert.alert('Error', 'Failed to update user RSVP.');
        return;
      }

      // Update user state in Redux
      const updatedEvents = user.events.filter((e) => e.eventID !== event.id);
      updatedEvents.push({ eventID: event.id, status });
      dispatch(updateUserState({ ...user, events: updatedEvents }));

      onRSVPChange(status);
      onClose();
      Alert.alert('Success', `You have RSVPed "${status}" to this event.`);
    } catch {
      Alert.alert('Network Error', 'Could not submit RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmAndRemoveRSVP = () => {
    Alert.alert(
      'Cancel RSVP',
      'Do you want to cancel your RSVP for this event?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: handleRemoveRSVP },
      ]
    );
  };

  const handleRemoveRSVP = async () => {
    if (!event || !userId || !user) return;

    setIsSubmitting(true);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Remove from event attendees
      const eventRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userId }),
      });
      if (!eventRes.ok) {
        Alert.alert('Error', 'Failed to remove event RSVP.');
        return;
      }

      // Remove from user events
      const userRes = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventID: event.id }),
      });
      if (!userRes.ok) {
        Alert.alert('Error', 'Failed to remove user RSVP.');
        return;
      }

      // Update user state in Redux
      const updatedEvents = user.events.filter((e) => e.eventID !== event.id);
      dispatch(updateUserState({ ...user, events: updatedEvents }));

      onRSVPChange(null);
      onClose();
      Alert.alert('Success', 'Your RSVP has been removed.');
    } catch {
      Alert.alert('Network Error', 'Could not remove RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>RSVP to Event</Text>
          <Text style={styles.subtitle}>{event?.title}</Text>

          {isSubmitting ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => handleRSVPSelect('YES')}
                style={[styles.optionButton, currentRSVP === 'YES' && styles.optionButtonSelected]}
              >
                <Text style={[styles.optionText, currentRSVP === 'YES' && styles.optionTextSelected]}>
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRSVPSelect('MAYBE')}
                style={[styles.optionButton, currentRSVP === 'MAYBE' && styles.optionButtonSelected]}
              >
                <Text style={[styles.optionText, currentRSVP === 'MAYBE' && styles.optionTextSelected]}>
                  Maybe
                </Text>
              </TouchableOpacity>

              {currentRSVP && (
                <TouchableOpacity onPress={confirmAndRemoveRSVP} style={styles.removeButton}>
                  <Text style={styles.removeText}>Remove RSVP</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity onPress={onClose} style={styles.cancelButton} disabled={isSubmitting}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
