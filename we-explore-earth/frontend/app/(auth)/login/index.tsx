//STANDARD LIBRARY
import { useState } from "react";
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { router } from "expo-router";
//LOCAL FILES
import { styles } from "./styles";
import BackButton from "@/app/components/BackButton/backButton";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUserState } from "@/app/redux/slices/userSlice";
import { registerForPushNotificationsAsync } from "@/lib/notifications/registerForPushNotifications";

export default function LoginPage() {
  //REACT HOOKS

  //STATE VARIABLES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  //HANDLERS
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Please fill in all the fields");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.error || "An unknown error occurred");
        throw new Error(data.error || "Login failed");
      }

      dispatch(setUserState(data));

      // Re-register push token on login if user has opted in (tokens can change)
      if (data.wantsNotifications && data.id) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationToken: token, wantsNotifications: true }),
          });
        }
      }

      router.replace("(admin)/home" as any);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async function handleForgotPassword() {
    router.push("/reset" as any);
  }
  //EFFECTS

  //RENDER
  return (
    <>
      <BackButton route="/launch" />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to We Explore Earth</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.buttonText}>Forgot you password?</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
