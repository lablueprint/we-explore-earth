//STANDARD LIBRARY
import React, { useState, useEffect } from 'react';

//THIRD-PARTY LIBRARIES
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  titleTextStyle,
  getOptionTextStyle,
  termsTextStyle,
  termsLinkStyle,
  rsvpButtonTextStyle,
  cancelButtonTextStyle,
  termsBodyStyle,
  closeIconSize,
  closeIconColor,
  checkmarkIconSize,
  checkmarkIconColor,
  activityIndicatorColor,
} from "./styles";
import type { Event, RSVPStatus } from "@shared/types/event";
import { useUser } from '@/app/redux/hooks/useUser';
import { useAppDispatch } from "../../../redux/hooks";
import { updateUserState } from "../../../redux/slices/userSlice";

type Props = {
  visible: boolean;
  event: Event | null;
  currentRSVP: RSVPStatus | null;
  onClose: () => void;
  onRSVPChange: (status: RSVPStatus | null) => void;
};

export default function RSVPModal({
  visible,
  event,
  currentRSVP,
  onClose,
  onRSVPChange,
}: Props) {
  //REACT HOOKS
  const insets = useSafeAreaInsets();
  const { user, userId } = useUser();
  const dispatch = useAppDispatch();

  const attendeeRSVP = userId
    ? (event?.attendees?.find((a) => a.userID === userId)?.status ?? null)
    : null;
  const effectiveRSVP = currentRSVP ?? attendeeRSVP;

  //STATE VARIABLES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus | null>(effectiveRSVP);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedStatus(effectiveRSVP);
      setAgreedToTerms(false);
      setShowTerms(false);
    }
  }, [visible]);

  //HANDLERS
  const handleCancel = async () => {
    if (!event || !userId) return;
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      return;
    }
    setIsCancelling(true);
    try {
      const eventRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userId }),
      });
      if (!eventRes.ok) {
        Alert.alert('Error', 'Failed to cancel event RSVP.');
        return;
      }
      const userRes = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventID: event.id }),
      });
      if (!userRes.ok) {
        Alert.alert('Error', 'Failed to cancel user RSVP.');
        return;
      }

      if (user) {
        const updatedEvents = user.events.filter((e) => e.eventID !== event.id);
        dispatch(updateUserState({ ...user, events: updatedEvents }));
      }
      onRSVPChange(null);
      onClose();
    } catch {
      Alert.alert('Network Error', 'Could not cancel RSVP.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      Alert.alert("Selection Required", "Please select Yes or Maybe.");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert(
        "Terms Required",
        "Please agree to the terms and conditions.",
      );
      return;
    }
    if (!event || !userId || !user) return;

    setIsSubmitting(true);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!baseUrl) {
      Alert.alert("Config Error", "EXPO_PUBLIC_API_URL is not set.");
      setIsSubmitting(false);
      return;
    }

    try {
      const eventRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: userId, status: selectedStatus }),
      });
      if (!eventRes.ok) {
        Alert.alert("Error", "Failed to update event RSVP.");
        return;
      }

      const userRes = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventID: event.id, status: selectedStatus }),
      });
      if (!userRes.ok) {
        Alert.alert("Error", "Failed to update user RSVP.");
        return;
      }

      const updatedEvents = user.events.filter((e) => e.eventID !== event.id);
      updatedEvents.push({ eventID: event.id, status: selectedStatus });
      dispatch(updateUserState({ ...user, events: updatedEvents }));

      onRSVPChange(selectedStatus);
      onClose();
    } catch {
      Alert.alert("Network Error", "Could not submit RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //RENDER
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Ionicons
              name="close"
              size={closeIconSize}
              color={closeIconColor}
            />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + scrollPaddingTopExtra,
                paddingBottom:
                  Math.max(insets.bottom, scrollPaddingBottomMin) +
                  scrollPaddingBottomExtra,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {showTerms ? (
              <>
                <TouchableOpacity onPress={() => setShowTerms(false)} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={closeIconSize} color={closeIconColor} />
                </TouchableOpacity>
                <Text style={titleTextStyle}>Terms of Service</Text>
                <Text style={termsBodyStyle}>By participating in any We Explore Earth activity, event, experience, workshop, cleanup, hike, climb, restoration project, volunteer activity, or outdoor gathering, participants acknowledge and understand that outdoor and community-based activities involve inherent risks, including but not limited to injury, illness, property damage, wildlife encounters, environmental hazards, vehicle-related incidents, acts of nature, negligence of others, permanent disability, and death.</Text>
                <Text style={termsBodyStyle}>Participants voluntarily assume all risks associated with participation and accept full personal responsibility for their safety, well-being, equipment, transportation, and personal belongings during any We Explore Earth related activity.</Text>
                <Text style={termsBodyStyle}>By registering for or participating in any event, participants agree to release, waive, discharge, and hold harmless We Explore Earth, its directors, officers, volunteers, event leaders, organizers, affiliates, collaborators, sponsors, land agencies, property owners, partnering organizations, and representatives from any and all liability, claims, demands, damages, causes of action, or expenses arising out of or related to participation in any activity.</Text>
                <Text style={termsBodyStyle}>Participants agree to follow all instructions, posted rules, land regulations, safety guidance, and local laws during participation. We Explore Earth reserves the right to remove or deny participation to any individual acting in an unsafe, unlawful, or disruptive manner.</Text>
                <Text style={termsBodyStyle}>Participants understand that certain activities may involve strenuous physical exertion and confirm that they are physically and mentally capable of participating. Participants are encouraged to consult a medical professional before participating in strenuous outdoor activities if they have any health concerns.</Text>
                <Text style={termsBodyStyle}>By completing registration or attending an event, participants confirm that they have read, understood, and agreed to these Terms of Service and Liability Waiver.</Text>
              </>
            ) : (
            <><Text style={titleTextStyle}>Are you going?</Text>

            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedStatus === "YES" && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedStatus("YES")}
                activeOpacity={0.75}
              >
                <Text style={getOptionTextStyle(selectedStatus === "YES")}>
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedStatus === "MAYBE" && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedStatus("MAYBE")}
                activeOpacity={0.75}
              >
                <Text style={getOptionTextStyle(selectedStatus === "MAYBE")}>
                  Maybe
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsRow}>
              <TouchableOpacity
                onPress={() => setAgreedToTerms((v) => !v)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreedToTerms && (
                    <Ionicons
                      name="checkmark"
                      size={checkmarkIconSize}
                      color={checkmarkIconColor}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={termsTextStyle}>
                By selecting this check box, you agree to our{" "}
                <Text
                  style={termsLinkStyle}
                  onPress={() => setShowTerms(true)}
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
                <Text style={rsvpButtonTextStyle}>{effectiveRSVP ? 'Update RSVP' : 'RSVP'}</Text>
              </TouchableOpacity>
            )}

            {effectiveRSVP && (
              isCancelling ? (
                <ActivityIndicator
                  size="large"
                  color="#C0392B"
                  style={styles.submittingIndicator}
                />
              ) : (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.85}>
                  <Text style={cancelButtonTextStyle}>Cancel RSVP</Text>
                </TouchableOpacity>
              )
            )}
            </>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}
