//STANDARD LIBRARY
import { useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
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
            Alert.alert("Please fill in all the fields");
            return;
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.error || "An unknown error occurred");
                throw new Error(data.error || "An unknown error occurred");
            }

            Alert.alert(
                'Success!', 
                'Please check your email for the password reset link!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/login')
                    }
                ]
            );
        } catch (error) {
            console.error('Reset password error:', error);
        }
    }
    //EFFECTS
    //RENDER
    return (
        <>
            <BackButton route="/login" />
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <TouchableOpacity style={styles.resetPasswordButton} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>RESET PASSWORD</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
