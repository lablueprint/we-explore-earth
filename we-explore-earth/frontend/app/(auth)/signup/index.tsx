//STANDARD LIBRARY
import React, { useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
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
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    
    //HANDLERS
    async function handleSignup() {
        // Basic validation
        if (!email || !password || !username || !firstName || !lastName) {
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
                    username,
                    firstName,
                    lastName,
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
        <>
            <BackButton route="/launch" />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Join We Explore Earth</Text>

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

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={checkPassword}
                    onChangeText={setCheckPassword}
                    secureTextEntry
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
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
                    onPress={() => setNotifications(!notifications)}
                >
                    <View style={[styles.checkbox, notifications && styles.checkboxChecked]}>
                        {notifications && <Text style={styles.checkmark}>✓</Text>}
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
                    <Text style={styles.checkboxText}>I accept the Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}