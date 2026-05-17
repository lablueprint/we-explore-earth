import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgUri } from "react-native-svg";

import { styles } from "./profileInfo.styles";
import { useUser } from "@/app/redux/hooks/useUser";

interface ProfileInfoProps {
  onEdit?: () => void;
}

export function ProfileInfo({ onEdit }: ProfileInfoProps) {
  const { user, avatarUrl } = useUser();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const displayName = fullName || "—";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil-outline" size={14} color="#1A1A1A" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <SvgUri uri={avatarUrl} width={88} height={88} />
          ) : (
            <Ionicons name="person" size={48} color="#9A9A9A" />
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{displayName}</Text>
          {user?.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Display name</Text>
            <Text style={styles.rowValue}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Mail</Text>
            <Text style={styles.rowValue}>{user?.email ?? "—"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.rowLabel}>Phone number</Text>
            <Text style={styles.rowValue}>{user?.phoneNumber ?? "—"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="volume-high-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.toggleLabel}>Event announcements</Text>
          </View>
          <Switch
            value={Boolean(user?.notificationsEnabled)}
            disabled
            trackColor={{ false: "#D1D1D1", true: "#1D6400" }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D1D1"
          />
        </View>
      </View>
    </View>
  );
}
