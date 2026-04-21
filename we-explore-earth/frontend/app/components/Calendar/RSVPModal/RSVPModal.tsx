//STANDARD LIBRARY
import React, { useState } from 'react';

//THIRD-PARTY LIBRARIES
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
import { router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

//LOCAL FILES
import {
  styles,
  gradientColors,
  gradientLocations,
  scrollPaddingTopExtra,
  scrollPaddingBottomMin,
  scrollPaddingBottomExtra,
  closeButtonTopExtra,
  closeButtonRightExtra,
  closeIconSize,
  closeIconColor,
  checkmarkIconSize,
  checkmarkIconColor,
  activityIndicatorColor,
  notesPlaceholderColor,
} from './styles';
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
  //REACT HOOKS
  const insets = useSafeAreaInsets();
  const { user, userId } = useUser();
  const dispatch = useAppDispatch();

  //STATE VARIABLES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus | null>(currentRSVP);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  //HANDLERS
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

  //RENDER
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          style={styles.gradient}
        >
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                top: insets.top + closeButtonTopExtra,
                right: insets.right + closeButtonRightExtra,
              },
            ]}
            onPress={onClose}
          >
            <Ionicons name="close" size={closeIconSize} color={closeIconColor} />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + scrollPaddingTopExtra,
                paddingBottom: Math.max(insets.bottom, scrollPaddingBottomMin) + scrollPaddingBottomExtra,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[typography.h1, styles.title]}>Are you going?</Text>

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

            <Text style={[typography.body, styles.label]}>Additional notes</Text>
            <TextInput
              style={[typography.body, styles.notesInput]}
              placeholder="Have special needs, need a ride, bringing equipment, etc"
              placeholderTextColor={notesPlaceholderColor}
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.termsRow}>
              <TouchableOpacity onPress={() => setAgreedToTerms((v) => !v)} activeOpacity={0.7}>
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && (
                    <Ionicons name="checkmark" size={checkmarkIconSize} color={checkmarkIconColor} />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={[typography.body, styles.termsText]}>
                By selecting this check box, you agree to our{' '}
                <Text
                  style={[typography.body, styles.termsLink]}
                  onPress={() => {
                    onClose();
                    setTimeout(() => router.push('/rsvp-terms-placeholder' as Href), 0);
                  }}
                >
                  terms and conditions
                </Text>
              </Text>
            </View>

            {isSubmitting ? (
              <ActivityIndicator
                size="large"
                color={activityIndicatorColor}
                style={styles.submittingIndicator}
              />
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
