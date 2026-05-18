import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { styles } from './styles';

export default function DonateButton() {
    const handlePress = async () => {
        const url = 'https://weexploreearth.com/donate';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <Image 
                    source={require('../../../../shared/icons/Donate.png')} 
                    style={styles.buttonIconImage} 
                    resizeMode="contain"
                />
                <Text style={styles.title}>Support our mission</Text>
            </View>
            
            <Text style={styles.description}>
                Your support keeps 20+ free monthly community events running, restores natural spaces, and brings people together through nature.
            </Text>

            <TouchableOpacity style={styles.buttonContainer} onPress={handlePress} activeOpacity={0.8}>
                <Image 
                    source={require('../../../../shared/icons/Donate.png')} 
                    style={styles.buttonIconImage} 
                    resizeMode="contain"
                />
                <Text style={styles.buttonText}>Donate here</Text>
            </TouchableOpacity>
        </View>
    );
}