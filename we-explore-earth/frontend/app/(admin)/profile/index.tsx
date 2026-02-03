import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AddAdmin from "../home/components/addAdmin";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminProfile() {
  const [admins, setAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(`${API_URL}/config/admins`);
        const data = await res.json();
        setAdmins(Array.isArray(data.admins) ? data.admins : []);
      } catch (err) {
        console.log("Failed to fetch admins", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
        Admins
      </Text>
      <AddAdmin />


    </View>
  );
}
