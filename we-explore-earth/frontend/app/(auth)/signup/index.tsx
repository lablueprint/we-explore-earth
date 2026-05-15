//STANDARD LIBRARY
import React, { useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
//LOCAL FILES
import { styles } from './styles';
import BackButton from '@/app/components/BackButton/backButton'

export default function SignupPage() {
    //REACT HOOKS
    
    //STATE VARIABLES
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [age, setAge] = useState(false);

    //HANDLERS
    async function handleSignup() {
        // Basic validation
        if (!email || !password || !firstName || !lastName || !phoneNumber) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        
        if (password !== checkPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        if (!age) {
            Alert.alert('Error', 'You must be 13 years or older to create an account');
            return;
        }
        
        if (!privacy) {
            Alert.alert('Error', 'Please accept the Privacy Policy to continue');
            return;
        }
        
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    phoneNumber,
                    notificationsEnabled
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }
            
            Alert.alert(
                'Success!', 
                'Please check your email for verification before logging in!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login')
                    }
                ]
            );
            
        } catch (error : any) {
            Alert.alert(
                'Signup Failed', 
                error.message || 'Something went wrong. Please try again.'
            );
        }
    }
    
    //EFFECTS
    
    //RENDER
    return (
        <ImageBackground
            source={require('../../../../shared/images/login-background.png')}
            style={styles.fullBackground}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <BackButton route="/launch" />
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>Sign up</Text>
                        <Text style={styles.subtitle}>Your new journey begins here</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholderTextColor="#8A8A8A"
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor="#8A8A8A"
                        />

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
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            placeholderTextColor="#8A8A8A"
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="newPassword"   // tells iOS this is a new password field
                            autoComplete="new-password"     // disables AutoFill suggestion banner
                            placeholderTextColor="#8A8A8A"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={checkPassword}
                            onChangeText={setCheckPassword}
                            secureTextEntry
                            textContentType="newPassword"   // tells iOS this is a new password field
                            autoComplete="new-password"     // disables AutoFill suggestion banner
                            placeholderTextColor="#8A8A8A"
                        />

                        <TouchableOpacity 
                            style={styles.checkboxContainer} 
                            onPress={() => setAge(!age)}
                        >
                            <View style={[styles.checkbox, age && styles.checkboxChecked]}>
                                {age && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>I am 13 years or older</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.checkboxContainer} 
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                        >
                            <View style={[styles.checkbox, notificationsEnabled && styles.checkboxChecked]}>
                                {notificationsEnabled && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>I consent to notifications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.checkboxContainer} 
                            onPress={() => setPrivacy(!privacy)}
                        >
                            <View style={[styles.checkbox, privacy && styles.checkboxChecked]}>
                                {privacy && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>
                                I accept the <Text style={styles.privacyText}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Create account</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.footerContainer} onPress={() => router.replace('/(auth)/login')}>
                            <Text style={styles.footerText}>
                                Have an account? Log in <Text style={styles.footerLink}>here</Text>
                            </Text>
                        </TouchableOpacity>
                        
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}