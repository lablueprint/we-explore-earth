import React from "react";
import { ScrollView } from "react-native";

import { UserForm } from "@/app/components/Profile/userForm";
import { LogoutButton } from "@/app/components/Profile/logoutButton";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <UserForm />
      <LogoutButton />
    </ScrollView>
  );
}
