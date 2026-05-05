import React, { useEffect, useState } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";

import { typography } from "@shared/typography/typography";
import { styles as sharedStyles } from "../events/components/styles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type AudienceOption = { id: string; label: string; attendeeCount: number };

async function fetchAudience(): Promise<AudienceOption[]> {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  const events: { id: string; title: string; attendees: unknown[] }[] =
    await res.json();
  const eventOptions = events.map((e) => ({
    id: e.id,
    label: e.title,
    attendeeCount: e.attendees.length || 0,
  }));
  return [{ id: "", label: "Everybody", attendeeCount: -1 }, ...eventOptions];
}

function audienceSummaryLine(option: AudienceOption): string {
  if (option.id === "") return "Everybody";
  return `${option.label} Attendees`;
}

export default function AdminNotificationsPage() {
  const [audienceMenuOpen, setAudienceMenuOpen] = useState(false);
  const [audienceOptions, setAudienceOptions] = useState<AudienceOption[]>([
    { id: "", label: "Everybody", attendeeCount: -1 },
  ]);
  const [selectedAudienceId, setSelectedAudienceId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);

  useEffect(() => {
    fetchAudience()
      .then(setAudienceOptions)
      .catch((err) => console.error("Failed to load audience options:", err));
  }, []);

  const selectedAudience =
    selectedAudienceId !== null
      ? (audienceOptions.find((o) => o.id === selectedAudienceId) ?? audienceOptions[0]!)
      : null;

  const formComplete = title.trim().length > 0 && content.trim().length > 0;
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
        <Text style={[typography.h1, styles.pageTitle]}>Send Notification</Text>

        <Text style={styles.label}>Audience</Text>
        <TouchableOpacity
          style={styles.selectRow}
          onPress={() => setAudienceMenuOpen((open) => !open)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.selectText,
              !selectedAudience && styles.placeholderText,
            ]}
          >
            {selectedAudience ? selectedAudience.label : "Who should receive this?"}
          </Text>
          <Ionicons
            name={audienceMenuOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#999"
          />
        </TouchableOpacity>
        {audienceMenuOpen ? (
          <View style={styles.dropdownWrap}>
            {audienceOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.dropdownRow}
                onPress={() => {
                  setSelectedAudienceId(opt.id);
                  setAudienceMenuOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownRowText}>{opt.label}</Text>
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
          placeholderTextColor="#bbb"
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Enter notification content"
          placeholderTextColor="#bbb"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.sendButton, !formComplete && styles.sendButtonDisabled]}
          disabled={!formComplete}
          onPress={() => {
            setConfirmSend(false);
            setSendModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>Send</Text>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={sendModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSendModal}
      >
        <View style={sharedStyles.modalOverlay}>
          <View style={sharedStyles.modalContent}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={sharedStyles.modalTitle}>Send Notification?</Text>

              <View style={modalStyles.row}>
                <Text style={modalStyles.emphasis}>Audience: </Text>
                <Text style={modalStyles.muted}>
                  {selectedAudience
                    ? audienceSummaryLine(selectedAudience)
                    : "Everybody"}
                </Text>
              </View>

              <View style={modalStyles.row}>
                <Text style={modalStyles.emphasis}>Recipients: </Text>
                <Text style={modalStyles.muted}>
                  {!selectedAudience || selectedAudience.id === ""
                    ? "All users"
                    : `${selectedAudience.attendeeCount} attendee${selectedAudience.attendeeCount === 1 ? "" : "s"}`}
                </Text>
              </View>

              <View style={modalStyles.previewSection}>
                <Text style={sharedStyles.label}>Message Preview:</Text>
                <View style={modalStyles.divider} />
                <Text style={modalStyles.previewTitle}>
                  {title.trim() ? title : "(No title)"}
                </Text>
                <Text style={modalStyles.previewBody}>
                  {content.trim() ? content : "(No content)"}
                </Text>
              </View>

              <View style={modalStyles.checkboxRow}>
                <Checkbox
                  value={confirmSend}
                  onValueChange={setConfirmSend}
                  color={confirmSend ? "#3d5a1a" : "#ccc"}
                />
                <Text style={modalStyles.checkboxLabel}>
                  I confirm I want to send this notification
                </Text>
              </View>

              <View style={sharedStyles.modalButtonRow}>
                <TouchableOpacity
                  style={sharedStyles.modalCancelButton}
                  onPress={closeSendModal}
                  activeOpacity={0.8}
                >
                  <Text style={sharedStyles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    sharedStyles.modalSaveButton,
                    styles.modalConfirmButton,
                    !canSubmit && styles.sendButtonDisabled,
                  ]}
                  disabled={!canSubmit}
                  onPress={async () => {
                    try {
                      await fetch(`${API_URL}/twilio/event-blast`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          eventID: selectedAudience?.id ?? "",
                          audience: selectedAudience?.label ?? "",
                          title,
                          content,
                        }),
                      });
                      closeSendModal();
                      setTitle("");
                      setContent("");
                      setSelectedAudienceId(null);
                    } catch (err) {
                      console.error("Failed to send notification:", err);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={sharedStyles.modalSaveButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 48,
  },
  pageTitle: {
    marginBottom: 28,
    marginTop: 4,
  },
  label: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 20,
  },
  selectText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#1a1a1a",
  },
  placeholderText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#bbb",
  },
  dropdownWrap: {
    marginTop: -16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    overflow: "hidden",
  },
  dropdownRow: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownRowText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 16,
    color: "#1a1a1a",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: "HankenGrotesk-Regular",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  textArea: {
    height: 130,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#3d5a1a",
    borderRadius: 32,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#c4c4c4",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "HankenGrotesk-Regular",
  },
  modalConfirmButton: {
    backgroundColor: "#3d5a1a",
  },
});

const modalStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    alignItems: "baseline",
  },
  emphasis: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  muted: {
    fontSize: 16,
    color: "#666",
    flexShrink: 1,
  },
  previewSection: {
    marginTop: 20,
  },
  divider: {
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
});
