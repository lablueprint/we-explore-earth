import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import Ionicons from "@expo/vector-icons/Ionicons";

import { typography } from "@shared/typography/typography";
import { styles as sharedStyles } from "../events/components/styles";
import { styles, modalStyles } from "./styles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type AudienceOption = { id: string; label: string; attendeeCount: number };

async function fetchAudience(): Promise<AudienceOption[]> {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 1);
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 1000);

  const res = await fetch(`${API_URL}/events/filtered`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
  });
  if (!res.ok) throw new Error("Failed to fetch events");

  const events: { id: string; title: string; attendees: unknown[]; timeStart: { _seconds: number } }[] =
    await res.json();

  const eventOptions = [...events].reverse().map((e) => ({
    id: e.id,
    label: e.title,
    attendeeCount: e.attendees.length || 0,
  }));

  return eventOptions;
}

function audienceSummaryLine(option: AudienceOption): string {
  if (option.id === "") return "Everybody";
  return `${option.label} Attendees`;
}

export default function AdminNotificationsPage() {
  const [audienceMenuOpen, setAudienceMenuOpen] = useState(false);
  const [audienceSearch, setAudienceSearch] = useState("");
  const [audienceOptions, setAudienceOptions] = useState<AudienceOption[]>([]);
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

  const EVERYBODY: AudienceOption = { id: "", label: "Everybody", attendeeCount: -1 };

  const filteredAudienceOptions = audienceSearch.trim()
    ? audienceOptions.filter((o) =>
        o.label.toLowerCase().includes(audienceSearch.toLowerCase())
      )
    : audienceOptions;

  const selectedAudience =
    selectedAudienceId === ""
      ? EVERYBODY
      : selectedAudienceId !== null
      ? (audienceOptions.find((o) => o.id === selectedAudienceId) ?? null)
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
        <Text style={[typography.smaller_h1, styles.pageTitle]}>Send Announcement</Text>

        <Text style={styles.label}>Audience</Text>
        <TouchableOpacity
          style={styles.selectRow}
          onPress={() => {
            setAudienceMenuOpen((open) => !open);
            setAudienceSearch("");
          }}
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
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => {
                setSelectedAudienceId("");
                setAudienceMenuOpen(false);
                setAudienceSearch("");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownRowText}>Everybody</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TextInput
              style={styles.dropdownSearch}
              value={audienceSearch}
              onChangeText={setAudienceSearch}
              placeholder="Search events…"
              placeholderTextColor="#bbb"
              autoCorrect={false}
            />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.dropdownScroll}
            >
              {filteredAudienceOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.dropdownRow}
                  onPress={() => {
                    setSelectedAudienceId(opt.id);
                    setAudienceMenuOpen(false);
                    setAudienceSearch("");
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownRowText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
