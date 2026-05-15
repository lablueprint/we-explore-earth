//STANDARD LIBRARY
import { useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, Alert, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
//LOCAL FILES
import { styles } from './styles';
import BackButton from '@/app/components/BackButton/backButton';

export default function ResetPage() {
    //REACT HOOKS
    //STATE VARIABLES
    const [email, setEmail] = useState('');
    //HANDLERS
    async function handleResetPassword() {
        if (!email) {
            Alert.alert('Please fill in all the fields');
            return;
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.error || 'An unknown error occurred');
                throw new Error(data.error || 'An unknown error occurred');
            }

            Alert.alert(
                'Success!',
                'Please check your email for the password reset link!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login'),
                    },
                ]
            );
        } catch (error) {
            console.error('Reset password error:', error);
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
                <BackButton route="/login" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.topSection}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter your email to receive a reset link.</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#8A8A8A"
                        />

                        <TouchableOpacity style={styles.resetPasswordButton} onPress={handleResetPassword}>
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}
