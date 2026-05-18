import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles';

interface ContactButtonProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    title: string;
    subtitle: string;
    url: string;
}

export default function ContactButton({ iconName, title, subtitle, url }: ContactButtonProps) {
    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <TouchableOpacity style={styles.contactRow} onPress={handlePress}>
            <Feather 
                name={iconName} 
                size={styles.iconMain.fontSize} 
                color={styles.iconMain.color} 
                style={styles.contactIcon} 
            />
            <View style={styles.contactTextContent}>
                <Text style={styles.contactTitle}>{title}</Text>
                <Text style={styles.contactSubtitle}>{subtitle}</Text>
            </View>
            <Feather 
                name="chevron-right" 
                size={styles.iconChevron.fontSize} 
                color={styles.iconChevron.color} 
            />
        </TouchableOpacity>
    );
}