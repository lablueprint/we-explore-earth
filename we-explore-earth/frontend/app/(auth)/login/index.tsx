import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ImageBackground, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUserState } from "@/app/redux/slices/userSlice";

import { styles } from "./styles";
import BackButton from "@/app/components/BackButton/backButton";
import AuthInput from '../components/authInput';
import AuthButton from '../components/authButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const isFormValid = email.length > 0 && password.length > 0;

    async function handleLogin() {
      if (!isFormValid) return;
      
      setIsLoading(true);
      
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        dispatch(setUserState(data));
        
        if(data.hasOnboarded) {
          if (data.isAdmin) {
            router.replace('/(admin)/home');
          } else {
            router.replace('/(users)/home');
          }
        } else {
          router.replace('/(onboarding)/about');
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Login Failed", error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    function handleForgotPassword() {
      router.push('/reset' as any);
    }

    function handleCreateAccount() {
      router.replace('/(auth)/signup');
    }

    return (
      <ImageBackground
        source={require('../../../assets/images/login-background.png')}
        style={styles.fullBackground}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <BackButton route="/(auth)/launch" />
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Log in</Text>
              <Text style={styles.subtitle}>Welcome back to the app</Text>
            </View>

            <View style={styles.formContainer}>
              <AuthInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <AuthInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                isPassword={true} 
              />

              <AuthButton
                title="Log in"
                onPress={handleLogin}
                disabled={!isFormValid} 
                isLoading={isLoading}
              />

              <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
                <Text style={styles.createAccountText}>Create an account</Text>
              </TouchableOpacity>
            </View>
            
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    );
}