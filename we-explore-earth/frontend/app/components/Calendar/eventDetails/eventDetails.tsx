import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter, useSegments, useFocusEffect } from "expo-router";

import { styles } from "./styles";
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

  const handleTermsPress = () => {
    setRsvpModalVisible(false);
    onClose();
    requestAnimationFrame(() => {
      router.push("/rsvp-terms-placeholder");
    });
  };

  const handleEditEvent = () => {
    if (!event?.id) return;
    onClose();
    router.push(`/(admin)/events/${event.id}` as const);
  };

  const displayRSVP = hasLocalChange ? localRSVP : currentRSVP;

  useFocusEffect(
    useCallback(() => {
      setLocalRSVP(currentRSVP);
      setHasLocalChange(false);
    }, [currentRSVP])
  );

  if (!event) return null;
  const isFull = (event.attendees?.length ?? 0) >= event.maxAttendees;

  return (
    <>
      <Modal
        visible={visible && !rsvpModalVisible}
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

              <Text style={typography.h1}>{event.title}</Text>

              <View style={styles.tagRow}>
                {Array.isArray(event.category) &&
                  event.category.map((item) => (
                    <View key={item} style={styles.categoryPill}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}

                {Array.isArray(event.accommodation) &&
                  event.accommodation.map((item) => (
                    <View key={item} style={styles.accommodationPill}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🗓️</Text>
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
                <Text style={styles.infoIcon}>📍</Text>
                <View>
                  <Text style={styles.infoTitle}>{event.location}</Text>
                </View>
              </View>

              <Text style={styles.sectionLabel}>ATTENDEES</Text>

              <View style={styles.attendeeHeader}>
                <Text style={styles.attendeeCount}>{event.attendees?.length ?? 0} People on the List</Text>

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
                      <View>
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
                <TouchableOpacity
                  onPress={handleEditEvent}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit Event</Text>
                </TouchableOpacity>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>OVERVIEW</Text>
              <Text style={styles.body}>
                {event.description || "No description provided."}
              </Text>

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
        onTermsPress={handleTermsPress}
      />
    </>
  );
}