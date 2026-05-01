import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "expo-checkbox";

import { styles } from "../events/components/styles";

/** Hardcoded audience choices for the dropdown (expand later). */
const AUDIENCE_OPTIONS = [
  { id: "beach-cleanup", label: "Beach Cleanup" },
  { id: "hike-club", label: "Weekend Hikers" },
  { id: "everybody", label: "Everybody" },
];

/** Placeholder until recipients come from the API. */
const HARDCODED_RECIPIENTS = "124 users";

function audienceSummaryLine(
  option: (typeof AUDIENCE_OPTIONS)[number],
): string {
  if (option.id === "everybody") return "Everybody";
  return `${option.label} Attendees`;
}

export default function AdminNotificationsPage() {
  const [audienceMenuOpen, setAudienceMenuOpen] = useState(false);
  const [selectedAudienceId, setSelectedAudienceId] = useState(
    AUDIENCE_OPTIONS[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);

  const selectedAudience =
    AUDIENCE_OPTIONS.find((o) => o.id === selectedAudienceId)!;

  const formComplete =
    title.trim().length > 0 && content.trim().length > 0;
  const canSubmit = formComplete && confirmSend;

  const closeSendModal = () => {
    setSendModalVisible(false);
    setConfirmSend(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Send Notification</Text>

        <Text style={styles.label}>Audience</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setAudienceMenuOpen((open) => !open)}
          activeOpacity={0.7}
        >
          <Text>
            {selectedAudience.label}
          </Text>
        </TouchableOpacity>
        {audienceMenuOpen ? (
          <View style={localStyles.audienceOptionsWrap}>
            {AUDIENCE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.modalOptionRow}
                onPress={() => {
                  setSelectedAudienceId(opt.id);
                  setAudienceMenuOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter notification content"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, !formComplete && localStyles.sendDisabled]}
          disabled={!formComplete}
          onPress={() => {
            setConfirmSend(false);
            setSendModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={sendModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSendModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>Send Notification?</Text>

              <View style={localStyles.modalRow}>
                <Text style={localStyles.modalEmphasis}>Audience: </Text>
                <Text style={localStyles.modalMuted}>
                  {audienceSummaryLine(selectedAudience)}
                </Text>
              </View>

              <View style={localStyles.modalRow}>
                <Text style={localStyles.modalEmphasis}>Recipients: </Text>
                <Text style={localStyles.modalMuted}>
                  {HARDCODED_RECIPIENTS}
                </Text>
              </View>

              <View style={localStyles.previewSection}>
                <Text style={styles.label}>Message Preview:</Text>
                <View style={localStyles.previewDivider} />
                <Text style={localStyles.previewTitle}>
                  {title.trim() ? title : "(No title)"}
                </Text>
                <Text style={localStyles.previewBody}>
                  {content.trim() ? content : "(No content)"}
                </Text>
              </View>

              <View style={localStyles.checkboxRow}>
                <Checkbox
                  value={confirmSend}
                  onValueChange={setConfirmSend}
                  color={confirmSend ? "#007AFF" : "#ccc"}
                />
                <Text style={localStyles.checkboxLabel}>
                  I confirm I want to send this notification
                </Text>
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={closeSendModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalSaveButton,
                    !canSubmit && localStyles.sendDisabled,
                  ]}
                  disabled={!canSubmit}
                  onPress={() => {
                    /* wire send API later */
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSaveButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  audienceOptionsWrap: {
    marginTop: -8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    alignItems: "baseline",
  },
  modalEmphasis: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalMuted: {
    fontSize: 16,
    color: "#666",
    flexShrink: 1,
  },
  previewSection: {
    marginTop: 20,
  },
  previewDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  previewBody: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  sendDisabled: {
    opacity: 0.45,
  },
});
