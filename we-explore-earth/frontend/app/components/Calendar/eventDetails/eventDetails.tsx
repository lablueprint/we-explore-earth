import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import type { Event, FirestoreTimestamp } from "@shared/types/event";
import RSVPModal from "../RSVPModal/RSVPModal";
import { useUser } from "../../../../hooks/useUser";
import { useEventSignedImageUrl } from "../../../../hooks/useEventSignedImageUrl";
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
  const [rsvpModalVisible, setRsvpModalVisible] = useState(false);
  const [localRSVP, setLocalRSVP] = useState<"YES" | "MAYBE" | null>(null);

  const currentRSVP =
    event && user?.events
      ? (user.events.find((e) => e.eventID === event.id)?.status as
          | "YES"
          | "MAYBE"
          | undefined) ?? null
      : null;

  useEffect(() => {
    setLocalRSVP(currentRSVP ?? null);
  }, [currentRSVP]);

  useEffect(() => {
    if (!visible) setRsvpModalVisible(false);
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
    onRSVPChange?.();
  };

  const { url: coverUrl, loading: coverLoading } = useEventSignedImageUrl(
    event?.eventImage
  );
  
  const displayRSVP = rsvpModalVisible ? localRSVP : currentRSVP;
  
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.topRow}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backArrow}>←</Text>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton}>
                  <Text style={styles.shareIcon}>↥</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imagePlaceholder}>
                {coverUrl ? (
                  <Image
                    source={{ uri: coverUrl }}
                    style={styles.coverImage}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                  />
                ) : coverLoading && event.eventImage ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.imagePlaceholderText}>Image</Text>
                )}
              </View>

              <Text style={typography.h1}>{event.title}</Text>

              <View style={styles.tagRow}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>Westwood</Text>
                </View>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>Hiking & Nature Walks</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🗓️</Text>
                <View>
                  <Text style={styles.infoTitle}>{formatDate(event.timeStart)}</Text>
                  <Text style={styles.infoSub}>
                    {formatTime(event.timeStart)} to {formatTime(event.timeEnd)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <View>
                  <Text style={styles.infoTitle}>{event.location}</Text>
                  <Text style={styles.infoSub}>1155 N Lemon St, CA 92832</Text>
                </View>
              </View>

              <Text style={styles.sectionLabel}>ATTENDEES</Text>

              <View style={styles.attendeeHeader}>
                <Text style={styles.attendeeCount}>30 People on the List</Text>
                <Text style={styles.viewAll}>View all</Text>
              </View>

              <View style={styles.avatarRow}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <View key={i} style={styles.avatar} />
                ))}
              </View>

              <TouchableOpacity onPress={handleRSVPPress} style={styles.rsvpButton}>
                <Text style={styles.rsvpButtonText}>
                  {displayRSVP ? "Update RSVP" : "RSVP"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>OVERVIEW</Text>
              <Text style={styles.body}>{event.description}</Text>

              <Text style={styles.sectionLabel}>DESCRIPTION</Text>
              <Text style={styles.body}>
                We’ll move through riparian and chaparral woodland habitats,
                stopping frequently to explore edible properties of local species.
              </Text>

              <Text style={styles.sectionLabel}>WHAT TO BRING</Text>
              <Text style={styles.body}>• Water{"\n"}• Comfortable closed-toe shoes</Text>
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