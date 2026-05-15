import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { router, useRouter, useSegments } from "expo-router";

import { styles } from "./styles";
import type { Event, FirestoreTimestamp } from "@shared/types/event";
import RSVPModal from "../RSVPModal/RSVPModal";
import { useUser } from "../../../../hooks/useUser";
import { typography } from "../../../../../shared/typography/typography";

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

  const displayRSVP = hasLocalChange ? localRSVP : currentRSVP;

  if (!event) return null;

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
                <Text style={styles.imagePlaceholderText}>Image</Text>
              </View>

              <Text style={typography.h1}>{event.title}</Text>

              <View style={styles.tagRow}>
                {event.category?.map((item) => (
                  <View key={item} style={styles.categoryPill}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                ))}

                {event.accommodation?.map((item) => (
                  <View key={item} style={styles.accommodationPill}>
                    <Text style={styles.tagText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🗓️</Text>
                <View>
                  <Text style={styles.infoTitle}>
                    {formatDate(event.timeStart)}
                  </Text>
                  <Text style={styles.infoSub}>
                    {formatTime(event.timeStart)} to{" "}
                    {formatTime(event.timeEnd)}
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
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => {
                      if (event?.id) {
                        router.push(
                          `/(admin)/events/${event.id}/attendees` as const
                        );
                      }
                    }}
                  >
                    <Text style={styles.backText}>View All</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={handleRSVPPress}
                style={styles.rsvpButton}
              >
                <Text style={styles.rsvpButtonText}>
                  {displayRSVP ? "Update RSVP" : "RSVP"}
                </Text>
              </TouchableOpacity>

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
      />
    </>
  );
}