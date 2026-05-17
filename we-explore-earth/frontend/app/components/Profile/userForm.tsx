import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgUri } from "react-native-svg";

import { styles } from "./userForm.styles";
import { useUser } from "@/app/redux/hooks/useUser";
import { useUpdateUser } from "@/app/redux/hooks/updateUser";
import { User } from "@shared/types/user";

function splitDisplayName(displayName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = displayName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  const [first, ...rest] = parts;
  return {
    firstName: first ?? "",
    lastName: rest.join(" "),
  };
}

function joinDisplayName(
  firstName?: string | null,
  lastName?: string | null
): string {
  return [firstName, lastName].filter(Boolean).join(" ");
}

const PHONE_NUMBER_LENGTH = 10;

function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_NUMBER_LENGTH);
}

function formatPhoneForDisplay(digits: string): string {
  const d = digits.slice(0, PHONE_NUMBER_LENGTH);
  if (d.length === 0) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

interface UserFormProps {
  onCancel?: () => void;
  onSaved?: () => void;
}

export function UserForm({ onCancel, onSaved }: UserFormProps) {
  const { user, userId, avatarUrl } = useUser();
  const { updateUser } = useUpdateUser();

  const [displayName, setDisplayName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync local form state when redux user changes (initial load, external updates)
  useEffect(() => {
    if (!user) return;
    setDisplayName(joinDisplayName(user.firstName, user.lastName));
    setPhoneNumber(sanitizePhoneInput(user.phoneNumber ?? ""));
    setNotificationsEnabled(Boolean(user.notificationsEnabled));
  }, [user]);

  const handlePhoneChange = (newText: string) => {
    const newDigits = sanitizePhoneInput(newText);
    const currentFormatted = formatPhoneForDisplay(phoneNumber);
    // If the user backspaced over a formatting character (digits unchanged but
    // the visible text got shorter), drop the trailing digit instead.
    if (
      newDigits.length === phoneNumber.length &&
      newText.length < currentFormatted.length
    ) {
      setPhoneNumber(phoneNumber.slice(0, -1));
      return;
    }
    setPhoneNumber(newDigits);
  };

  const handleSubmit = async () => {
    if (!user || !userId) {
      Alert.alert("Error", "You must be signed in to update your profile.");
      return;
    }

    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      Alert.alert("Error", "Display name cannot be empty.");
      return;
    }

    const { firstName, lastName } = splitDisplayName(trimmedDisplayName);
    const sanitizedPhoneNumber = sanitizePhoneInput(phoneNumber);
    if (sanitizedPhoneNumber.length !== PHONE_NUMBER_LENGTH) {
      Alert.alert(
        "Invalid phone number",
        `Phone number must be exactly ${PHONE_NUMBER_LENGTH} digits.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            phoneNumber: sanitizedPhoneNumber,
            notificationsEnabled,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to update profile");
      }

      const updatedUser: User = await response.json();
      updateUser(updatedUser);
      onSaved?.();
    } catch (error: any) {
      console.error("Error while updating user:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.editHeaderRow}>
        <TouchableOpacity
          onPress={onCancel}
          disabled={isSubmitting}
          hitSlop={8}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionPill,
            isSubmitting && styles.actionPillDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Ionicons name="pencil-outline" size={14} color="#1A1A1A" />
          <Text style={styles.actionPillText}>
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editAvatarWrapper}>
        <View style={styles.editAvatar}>
          {avatarUrl ? (
            <SvgUri uri={avatarUrl} width={150} height={150} />
          ) : (
            <Ionicons name="person" size={80} color="#9A9A9A" />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Display name</Text>
            <TextInput
              style={styles.rowInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#9A9A9A"
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#9A9A9A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Mail</Text>
            <Text style={[styles.rowValue, styles.rowValueDisabled]}>
              {user?.email ?? "—"}
            </Text>
          </View>
          <Ionicons name="lock-closed" size={18} color="#9A9A9A" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Phone number</Text>
            <TextInput
              style={styles.rowInput}
              value={formatPhoneForDisplay(phoneNumber)}
              onChangeText={handlePhoneChange}
              placeholder="(555) 555-5555"
              placeholderTextColor="#9A9A9A"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="volume-high-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.toggleLabel}>Event announcement</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#D1D1D1", true: "#1D6400" }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D1D1"
          />
        </View>
      </View>
    </View>
  );
}
