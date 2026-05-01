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

import { styles } from "../events/components/styles";

/** Hardcoded audience choices for the dropdown (expand later). */
const AUDIENCE_OPTIONS = [
  { id: "beach-cleanup", label: "Beach Cleanup" },
  { id: "hike-club", label: "Weekend Hikers" },
  { id: "everybody", label: "Everybody" },
];

export default function AdminNotificationsPage() {
  const [audienceMenuOpen, setAudienceMenuOpen] = useState(false);
  const [selectedAudienceId, setSelectedAudienceId] = useState(
    AUDIENCE_OPTIONS[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const selectedAudience =
    AUDIENCE_OPTIONS.find((o) => o.id === selectedAudienceId) ??
    AUDIENCE_OPTIONS[0];

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
            {selectedAudience?.label ?? "Who should receive this?"}
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
          style={styles.submitButton}
          onPress={() => setSendModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={sendModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setSendModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelButtonText}>Close</Text>
            </TouchableOpacity>
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
});
