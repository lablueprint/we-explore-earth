import React, { useState } from "react";
import { ScrollView } from "react-native";

import { ProfileInfo } from "@/app/components/Profile/profileInfo";
import { UserForm } from "@/app/components/Profile/userForm";
import { LogoutButton } from "@/app/components/Profile/logoutButton";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {isEditing ? (
        <UserForm
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ProfileInfo onEdit={() => setIsEditing(true)} />
          <LogoutButton />
        </>
      )}
    </ScrollView>
  );
}
