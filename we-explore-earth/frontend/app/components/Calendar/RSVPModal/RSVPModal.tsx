import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './styles';
import type { Event, RSVPStatus } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
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
  const insets = useSafeAreaInsets();
  const { user, userId } = useUser();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus | null>(currentRSVP);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!selectedStatus) {
      Alert.alert('Selection Required', 'Please select Yes or Maybe.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions.');
      return;
    }
    if (!event || !userId || !user) return;

    setIsSubmitting(true);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      setIsSubmitting(false);
      return;
    }

    try {
      const eventRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userId, status: selectedStatus }),
      });
      if (!eventRes.ok) {
        Alert.alert('Error', 'Failed to update event RSVP.');
        return;
      }

      const userRes = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventID: event.id, status: selectedStatus }),
      });
      if (!userRes.ok) {
        Alert.alert('Error', 'Failed to update user RSVP.');
        return;
      }

      const updatedEvents = user.events.filter((e) => e.eventID !== event.id);
      updatedEvents.push({ eventID: event.id, status: selectedStatus });
      dispatch(updateUserState({ ...user, events: updatedEvents }));

      onRSVPChange(selectedStatus);
      onClose();
      Alert.alert('Success', `You have RSVPed "${selectedStatus}" to this event.`);
    } catch {
      Alert.alert('Network Error', 'Could not submit RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={['#ffffff', '#eaf1e2', '#d2e6c8']}
          locations={[0, 0.42, 1]}
          style={styles.gradient}
        >
          <TouchableOpacity
            style={[
              styles.closeButton,
              { top: insets.top + 10, right: insets.right + 16 },
            ]}
            onPress={onClose}
          >
            <Ionicons name="close" size={18} color="#555" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + 52,
                paddingBottom: Math.max(insets.bottom, 24) + 12,
                paddingHorizontal: 20,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[typography.h1, styles.title]}>Are you going?</Text>

            {/* Yes / Maybe */}
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.optionButton, selectedStatus === 'YES' && styles.optionButtonSelected]}
                onPress={() => setSelectedStatus('YES')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    typography.body,
                    styles.optionText,
                    selectedStatus === 'YES' && styles.optionTextSelected,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, selectedStatus === 'MAYBE' && styles.optionButtonSelected]}
                onPress={() => setSelectedStatus('MAYBE')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    typography.body,
                    styles.optionText,
                    selectedStatus === 'MAYBE' && styles.optionTextSelected,
                  ]}
                >
                  Maybe
                </Text>
              </TouchableOpacity>
            </View>

            {/* Attendee count */}
            <Text style={[typography.body, styles.label]}>Attendee count</Text>
            <View style={styles.countRow}>
              <TouchableOpacity
                style={styles.countButton}
                onPress={() => setAttendeeCount((c) => Math.max(0, c - 1))}
              >
                <Text style={[typography.body, styles.countButtonText]}>−</Text>
              </TouchableOpacity>
              <Text style={[typography.body, styles.countValue]}>{attendeeCount}</Text>
              <TouchableOpacity
                style={styles.countButton}
                onPress={() => setAttendeeCount((c) => c + 1)}
              >
                <Text style={[typography.body, styles.countButtonText]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Additional notes */}
            <Text style={[typography.body, styles.label]}>Additional notes</Text>
            <TextInput
              style={[typography.body, styles.notesInput]}
              placeholder="Have special needs, need a ride, bringing equipment, etc"
              placeholderTextColor="#aaa"
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedToTerms((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={[typography.body, styles.termsText]}>
                By selecting this check box, you agree to our{" "}
                <Text style={[typography.body, styles.termsLink]}>terms and conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* RSVP button */}
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#285F00" style={{ marginTop: 20 }} />
            ) : (
              <TouchableOpacity style={styles.rsvpButton} onPress={handleSubmit} activeOpacity={0.85}>
                <Text style={[typography.body, styles.rsvpButtonText]}>RSVP</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}
