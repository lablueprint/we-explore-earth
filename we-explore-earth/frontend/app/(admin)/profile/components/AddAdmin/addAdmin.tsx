import React, { useEffect, useMemo, useState } from "react";
import { styles } from "./addAdmin.styles";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState("");

  const [admins, setAdmins] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoadingList(true);
      const res = await fetch(`${API_URL}/config/admins`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      setAdmins(data.admins.sort());
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to fetch admins");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return admins;
    return admins.filter((a) => a.includes(f));
  }, [admins, filter]);

  const handleAddAdmin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      Alert.alert("Invalid Email", "Enter a valid email");
      return;
    }

    try {
      setLoadingAdd(true);

      const res = await fetch(`${API_URL}/config/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);

      setEmail("");
      fetchAdmins();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to add admin");
    } finally {
      setLoadingAdd(false);
    }
  };

  const removeAdmin = async (adminEmail: string) => {
    try {
      const res = await fetch(`${API_URL}/config/admin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);

      fetchAdmins();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to remove admin");
    }
  };

  return (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Add Admin</Text>

    <TextInput
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
      keyboardType="email-address"
      placeholder="admin@example.com"
      style={styles.input}
    />

    <TouchableOpacity
      onPress={handleAddAdmin}
      disabled={loadingAdd}
      style={[
        styles.button,
        loadingAdd && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>
        {loadingAdd ? "Adding..." : "Add Admin"}
      </Text>
    </TouchableOpacity>

    <Text style={[styles.sectionTitle, styles.marginTop]}>
      Current Admins
    </Text>

    <TextInput
      value={filter}
      onChangeText={setFilter}
      placeholder="Search admins…"
      autoCapitalize="none"
      style={styles.input}
    />

    {loadingList ? (
      <ActivityIndicator />
    ) : (
      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item}</Text>

            <TouchableOpacity onPress={() => removeAdmin(item)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    )}
  </View>
);
}
