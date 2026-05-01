import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { styles } from './styles';
import AuthInput from '../components/authInput';
import AuthButton from '../components/authButton';

export default function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    
    const [age, setAge] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/\D/g, ''); 
        let formatted = cleaned;
        if (cleaned.length > 3 && cleaned.length <= 6) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else if (cleaned.length > 6) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
        setPhoneNumber(formatted);
    };

    const isFormValid = 
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        username.trim().length > 0 &&
        email.trim().length > 0 &&
        phoneNumber.length === 12 && 
        password.length >= 8 &&
        age && 
        privacy;

    async function handleSignup() {
        if (!isFormValid) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber,
                    notifications
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }
            
            Alert.alert(
                'Success!', 
                'Please check your email for verification before logging in!',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
            );
            
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ImageBackground
            source={require('../../../assets/images/login-background.png')}
            style={styles.fullBackground}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                    style={styles.container}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView 
                        style={styles.scrollView} 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollContent}
                        bounces={true}
                    >
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Sign up</Text>
                            <Text style={styles.subtitle}>Your new journey begins here</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <AuthInput
                                placeholder="First name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <AuthInput
                                placeholder="Last name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <AuthInput
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <AuthInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <AuthInput
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChangeText={handlePhoneChange}
                                keyboardType="number-pad"
                                maxLength={12}
                            />
                            <View style={styles.passwordContainer}>
                                <AuthInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    isPassword={true}
                                />
                                <Text style={styles.helperText}>Password must be at least 8 characters</Text>
                            </View>

                            <View style={styles.checkboxGroup}>
                                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAge(!age)}>
                                    <View style={[styles.checkbox, age && styles.checkboxChecked]}>
                                        {age && <Feather name="check" size={14} color="#355E2B" />}
                                    </View>
                                    <Text style={styles.checkboxText}>I am 13 years or older</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setNotifications(!notifications)}>
                                    <View style={[styles.checkbox, notifications && styles.checkboxChecked]}>
                                        {notifications && <Feather name="check" size={14} color="#355E2B" />}
                                    </View>
                                    <Text style={styles.checkboxText}>I consent to notifications</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setPrivacy(!privacy)}>
                                    <View style={[styles.checkbox, privacy && styles.checkboxChecked]}>
                                        {privacy && <Feather name="check" size={14} color="#355E2B" />}
                                    </View>
                                    <Text style={styles.checkboxText}>I accept the Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>

                            <AuthButton
                                title="Create account"
                                onPress={handleSignup}
                                disabled={!isFormValid}
                                isLoading={isLoading}
                            />

                            <View style={styles.footerContainer}>
                                <Text style={styles.footerText}>
                                    Have an account? Log in{' '}
                                    <Text 
                                        style={styles.loginLink} 
                                        onPress={() => router.replace('/(auth)/login')}
                                    >
                                        here
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.bottomSpacer} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}