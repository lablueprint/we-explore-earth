//STANDARD LIBRARY
import React, { useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, Alert, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
//LOCAL FILES
import { styles } from "./styles";
import BackButton from "@/app/components/BackButton/backButton";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUserState } from "@/app/redux/slices/userSlice";

export default function LoginPage() {
    //REACT HOOKS
    
    //STATE VARIABLES
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        );
    
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        dispatch(setUserState(data));
        //console.log("DATA RIGHT NOW:", data);
        if(data.hasOnboarded) {
          if (data.isAdmin) {
            router.replace('/(admin)/home');
          } else {
            router.replace('/(users)/home');
          }
        } else {
          router.replace('/(onboarding)/about');
        }
        //router.replace('/(onboarding)/discover')
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert(
          "Login Failed",
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    }

    async function handleForgotPassword() {
      router.push('/reset' as any);
    }
    //EFFECTS
    
    //RENDER
    return (
        <ImageBackground
            source={require('../../../assets/images/login-background.png')}
            style={styles.fullBackground}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <BackButton route="/launch" />
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.topSection}>
                        <Text style={styles.title}>Log in</Text>
                        <Text style={styles.subtitle}>Welcome back to the app</Text>

                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="#8A8A8A"
                        />

                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          placeholderTextColor="#8A8A8A"
                        />

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                          <Text style={styles.buttonText}>Log in</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.forgotPasswordButton}
                          onPress={handleForgotPassword}
                        >
                          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSection}>
                        <TouchableOpacity 
                          style={styles.createAccountButton} 
                          onPress={() => router.replace('/(auth)/signup')}
                        >
                            <Text style={styles.createAccountText}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
  );
}