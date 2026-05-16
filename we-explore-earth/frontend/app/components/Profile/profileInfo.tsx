import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgUri } from "react-native-svg";

import { styles } from "./profileInfo.styles";
import { useUser } from "@/app/redux/hooks/useUser";

type AccountRow = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
};

export function ProfileInfo() {
  const { user, avatarUrl } = useUser();
  const [adminAnnouncementsEnabled, setAdminAnnouncementsEnabled] = useState(true);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const displayName = fullName || "—";

  const accountRows: AccountRow[] = [
    { icon: "person-outline", label: "Display name", value: displayName },
    { icon: "mail-outline", label: "Mail", value: user?.email ?? "—" },
    { icon: "call-outline", label: "Phone number", value: user?.phoneNumber ?? "—" },
  ];

  return (
    <View style={styles.container}>
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

      <Text style={styles.sectionLabel}>ACCOUNT</Text>

      <View style={styles.card}>
        {accountRows.map((row, index) => (
          <View key={row.label}>
            <TouchableOpacity activeOpacity={0.6} style={styles.row}>
              <Ionicons name={row.icon} size={22} color="#1A1A1A" />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9A9A9A" />
            </TouchableOpacity>
            {index < accountRows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="volume-high-outline" size={22} color="#1A1A1A" />
          <View style={styles.rowTextContainer}>
            <Text style={styles.toggleLabel}>Admin event announcements</Text>
          </View>
          <Switch
            value={adminAnnouncementsEnabled}
            onValueChange={setAdminAnnouncementsEnabled}
            trackColor={{ false: "#D1D1D1", true: "#1D6400" }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D1D1"
          />
        </View>
      </View>
    </View>
  );
}
