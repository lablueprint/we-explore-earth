import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { styles } from "./logoutButton.styles";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  clearAvatarUrl,
  clearUserState,
} from "@/app/redux/slices/userSlice";

export function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            dispatch(clearUserState());
            dispatch(clearAvatarUrl());
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.logoutCard}
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
