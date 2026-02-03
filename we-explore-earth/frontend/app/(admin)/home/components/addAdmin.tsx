import React, { useEffect, useMemo, useState } from "react";
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
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Add Admin</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="admin@example.com"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleAddAdmin}
        disabled={loadingAdd}
        style={{
          backgroundColor: "#000",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          opacity: loadingAdd ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loadingAdd ? "Adding..." : "Add Admin"}
        </Text>
      </TouchableOpacity>


      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 16 }}>
        Current Admins
      </Text>

      <TextInput
        value={filter}
        onChangeText={setFilter}
        placeholder="Search admins…"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
        }}
      />

      {loadingList ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredAdmins}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Text>{item}</Text>

              <TouchableOpacity onPress={() => removeAdmin(item)}>
                <Text style={{ color: "red", fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
