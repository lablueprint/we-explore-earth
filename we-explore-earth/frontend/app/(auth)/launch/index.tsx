import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles';

export default function LaunchPage() {
    function handleLogin() {
        router.push('/(auth)/login');
    }

    function handleSignup() {
        router.push('/(auth)/signup');
    }
    
    return (
        <ImageBackground 
            source={require('../../../../shared/images/login-background.png')} 
            style={styles.fullBackground}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.centerSection}>
                        <Image 
                            source={require('../../../../shared/images/login-triangle.png')} 
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        <Text style={styles.titleText}>We Explore Earth</Text>
                        <Text style={styles.subtitleText}>
                            We're excited to help you explore, connect, and make the most of every adventure around you.
                        </Text>
                    </View>

                    <View style={styles.buttonSection}>
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Log in</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                            <Text style={styles.signupButtonText}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}