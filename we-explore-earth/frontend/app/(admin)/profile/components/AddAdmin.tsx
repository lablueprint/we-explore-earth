import React, { useEffect, useMemo, useState } from "react";
import { styles } from "./addAdmin.styles";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AddAdmin() {
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
      <View style={styles.sectionHeader}>
        <Ionicons name="add" size={22} color="#1A1A1A" />
        <Text style={styles.sectionTitle}>Add new admin by email</Text>
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="admin@example.com"
        placeholderTextColor="#A0A0A0"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleAddAdmin}
        disabled={loadingAdd}
        style={[styles.button, loadingAdd && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>{loadingAdd ? "Adding..." : "Add admin"}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.sectionHeader}>
        <Ionicons name="list" size={22} color="#1A1A1A" />
        <Text style={styles.sectionTitle}>Current admin list</Text>
      </View>

      <View style={styles.searchInputWrapper}>
        <Ionicons name="search" size={18} color="#A0A0A0" />
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Search admins"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          style={styles.searchInput}
        />
      </View>

      {loadingList ? (
        <ActivityIndicator />
      ) : (
        filteredAdmins.map((item) => (
          <View key={item} style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>

            <TouchableOpacity onPress={() => removeAdmin(item)}>
              <Ionicons name="close" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}
