import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image
} from "react-native";
import { useRouter, useSegments, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { styles, trashIconSize, trashIconColor } from "./styles";
import type { Event, FirestoreTimestamp } from "@shared/types/event";
import RSVPModal from "../RSVPModal/RSVPModal";
import { useUser } from '@/app/redux/hooks/useUser';
import { typography } from "../../../../../shared/typography/typography";
import { EventCoverImage } from "@/app/components/Calendar/eventCoverImage/eventCoverImage";
import EventAttendees from '../eventAttendees/eventAttendees';

type Props = {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  onRSVPChange?: () => void;
};

const formatDate = (ts: FirestoreTimestamp) => {
  return new Date(ts._seconds * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (ts: FirestoreTimestamp) => {
  return new Date(ts._seconds * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const isSameDay = (start: Date, end: Date) =>
  start.getFullYear() === end.getFullYear() &&
  start.getMonth() === end.getMonth() &&
  start.getDate() === end.getDate();

const formatEventDateLine = (startTs: FirestoreTimestamp, endTs: FirestoreTimestamp) => {
  const start = new Date(startTs._seconds * 1000);
  const end = new Date(endTs._seconds * 1000);

  if (isSameDay(start, end)) {
    return formatDate(startTs);
  }

  const startDate = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  const endDate = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const startTime = formatTime(startTs);
  const endTime = formatTime(endTs);

  return `${startDate} • ${startTime} - ${endDate} • ${endTime}`;
};

const formatEventSubLine = (startTs: FirestoreTimestamp, endTs: FirestoreTimestamp) => {
  const start = new Date(startTs._seconds * 1000);
  const end = new Date(endTs._seconds * 1000);

  if (isSameDay(start, end)) {
    return `${formatTime(startTs)} to ${formatTime(endTs)}`;
  }

  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return `${days} Days`;
};

export default function EventDetails({
  visible,
  event,
  onClose,
  onRSVPChange,
}: Props) {
  const { user } = useUser();
  const router = useRouter();
  const segments = useSegments();

  const isAdmin = segments[0] === "(admin)";

  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [localRSVP, setLocalRSVP] = useState<"YES" | "MAYBE" | null>(null);
  const [hasLocalChange, setHasLocalChange] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const currentRSVP =
    event && user?.events
      ? (user.events.find((e) => e.eventID === event.id)?.status as
          | "YES"
          | "MAYBE"
          | undefined) ?? null
      : null;

  useEffect(() => {
    if (visible) {
      setLocalRSVP(null);
      setHasLocalChange(false);
    } else {
      setRsvpModalVisible(false);
    }
  }, [visible]);

  const handleRSVPPress = () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to RSVP to events.");
      return;
    }
    setRsvpModalVisible(true);
  };

  const handleRSVPChange = (status: "YES" | "MAYBE" | null) => {
    setLocalRSVP(status);
    setHasLocalChange(true);
    onRSVPChange?.();
  };

  const handleEditEvent = () => {
    if (!event?.id) return;
    onClose();
    router.push(`/(admin)/events/${event.id}` as const);
  };

  const handleDeleteEvent = () => {
    if (!event?.id) return;
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmVisible(false);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl || !event?.id) return;
    try {
      const res = await fetch(`${baseUrl}/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) {
        Alert.alert("Error", "Failed to delete event.");
        return;
      }
      Alert.alert("Success", "Event deleted successfully.", [
        { text: "OK", onPress: () => { onClose(); onRSVPChange?.(); } }
      ]);
    } catch {
      Alert.alert("Network Error", "Could not delete event.");
    }
  };

  const displayRSVP = hasLocalChange ? localRSVP : currentRSVP;

  useFocusEffect(
    useCallback(() => {
      setLocalRSVP(currentRSVP);
      setHasLocalChange(false);
    }, [currentRSVP])
  );

  const formatPrice = (price?: number | null) => {
    if (price == null || price === 0) return "Free";
    return `${price}`;
  };

  if (!event) return null;
  const isFull = (event.attendees?.length ?? 0) >= event.maxAttendees;

  return (
    <>
      <Modal
        visible={visible && !rsvpModalVisible && !deleteConfirmVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.topRow}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.backButton}
                  hitSlop={15}
                >
                  <Text style={styles.backArrow}>←</Text>
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imagePlaceholder}>
                <EventCoverImage
                  imageKey={event.eventImage}
                  style={StyleSheet.absoluteFill}
                  fallback={
                    <Text style={styles.imagePlaceholderText}>Image</Text>
                  }
                />
              </View>

              <Text style={[typography.smaller_h1, { paddingLeft: 5 }]}>
                {event.title}
              </Text>

              <View style={styles.tagRow}>
                {Array.isArray(event.category) &&
                  event.category.map((item) => (
                    <View key={item} style={styles.tagPill}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}

                {Array.isArray(event.accommodation) &&
                  event.accommodation.map((item) => (
                    <View key={item} style={styles.tagPill}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
              </View>

              <View style={styles.infoRow}>
                <Image
                      source={require("../../../../../shared/images/calendar.png")}
                      style={styles.logisticsIcon}
                    />
                <View>
                  <Text style={styles.infoTitle}>
                  {formatEventDateLine(event.timeStart, event.timeEnd)}
                  </Text>
                  <Text style={styles.infoSub}>
                    {formatEventSubLine(event.timeStart, event.timeEnd)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Image
                      source={require("../../../../../shared/images/location.png")}
                      style={styles.logisticsIcon}
                    />
                <View>
                  <Text style={styles.infoTitle}>{event.location}</Text>
                </View>
              </View>

              <Text style={styles.sectionLabel}>ATTENDEES</Text>
              <View style={styles.attendeeHeader}>
              <Text style={styles.attendeeCount}>
                {(event.attendees?.length ?? 0) === 1
                  ? "1 Person on the List"
                  : `${event.attendees?.length ?? 0} People on the List`}
              </Text>

                {isAdmin && (
                  <>
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowAll(true)}>
                      <Text style={styles.backText}>View All</Text>
                    </TouchableOpacity>

                    <Modal
                      visible={showAll}
                      animationType="slide"
                      onRequestClose={() => setShowAll(false)}
                    >
                      <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowAll(false)}>
                          <Text style={styles.backText}>Close</Text>
                        </TouchableOpacity>
                      </View>
                      <EventAttendees eventId={event.id} />
                    </Modal>
                  </>
                )}
              
               
              </View>

              {!isAdmin && (
                <TouchableOpacity
                  onPress={isFull ? undefined : handleRSVPPress}
                  style={isFull ? styles.eventFullButton : styles.rsvpButton}
                  disabled={isFull}
                >
                  <Text style={isFull ? styles.eventFullText : styles.rsvpButtonText}>
                    {isFull ? "Event Full" : displayRSVP ? "Update RSVP" : "RSVP"}
                  </Text>
                </TouchableOpacity>
              )}
              

              {isAdmin && (
                <View style={styles.adminButtonRow}>
                  <TouchableOpacity style={styles.editButton} onPress={handleEditEvent}>
                    <View style={styles.editButtonContent}>
                      <Image
                        source={require("../../../../../shared/images/gear.png")}
                        style={styles.editButtonIcon}
                      />
                      <Text style={styles.editButtonText}>Manage</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeleteEvent} style={styles.deleteIconButton}>
                    <Ionicons name="trash-outline" size={trashIconSize} color={trashIconColor} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>OVERVIEW</Text>
              <Text style={styles.body}>
                {event.description || "No description provided."}
              </Text>

              <Text style={styles.sectionLabel}>HOST</Text>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardText}>
                  {event.hostedBy}
                </Text>
              </View>


              <Text style={styles.sectionLabel}>LOGISTICS</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>
                  Maximum capacity
                </Text>

                <View style={styles.logisticsRow}>
                  <Image
                    source={require("../../../../../shared/images/clock_loader_40.png")}
                    style={styles.logisticsIcon}
                  />

                  <Text style={styles.infoCardText}>
                    {event.maxAttendees} {event.maxAttendees === 1 ? "person" : "people"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardLabel}>
                  Price per person
                </Text>

                <View style={styles.logisticsRow}>
                  <Image
                    source={require("../../../../../shared/images/attach_money.png")}
                    style={styles.logisticsIcon}
                  />

                  <Text style={styles.infoCardText}>
                    {formatPrice(event.price)} 
                  </Text>
                </View>
              </View>


            </ScrollView>
          </View>
        </View>
      </Modal>

      <RSVPModal
        visible={rsvpModalVisible && !!event}
        event={event}
        currentRSVP={localRSVP}
        onClose={() => setRsvpModalVisible(false)}
        onRSVPChange={handleRSVPChange}
      />

      <Modal visible={deleteConfirmVisible} transparent animationType="fade" onRequestClose={() => setDeleteConfirmVisible(false)}>
        <View style={styles.deleteModalBackdrop}>
          <View style={styles.deleteModalCard}>
            <Text style={[typography.h2, styles.deleteModalTitle]}>Delete Event?</Text>
            <Text style={[typography.body, styles.deleteModalMessage]}>Are you sure you want to delete this event? This cannot be undone.</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.deleteModalCancel} onPress={() => setDeleteConfirmVisible(false)}>
                <Text style={[typography.body, styles.deleteModalCancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteModalConfirm} onPress={handleConfirmDelete}>
                <Text style={[typography.body, styles.deleteModalConfirmText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}