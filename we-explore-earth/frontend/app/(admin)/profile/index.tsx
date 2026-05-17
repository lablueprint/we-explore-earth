import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import { AddAdmin } from "./components/AddAdmin";
import { UserForm } from "@/app/components/Profile/userForm";
import { LogoutButton } from "@/app/components/Profile/logoutButton";
import { styles as profileInfoStyles } from "@/app/components/Profile/profileInfo.styles";

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
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <UserForm />

      <Text style={profileInfoStyles.sectionLabel}>ADMIN</Text>
      <AddAdmin />
      <LogoutButton />
    </ScrollView>
  );
}
