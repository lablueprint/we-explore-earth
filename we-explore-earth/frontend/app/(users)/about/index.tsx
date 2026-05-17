import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { styles } from './styles';

export default function AboutPage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                
                <Image
                    source={require('../../../../shared/images/about-main-image.png')}
                    style={styles.mainImage}
                    resizeMode="cover"
                />

                <Text style={styles.title}>We Explore Earth</Text>
                
                <Text style={styles.description}>
                    Reconnecting people with themselves, their community, and the land — through creative, inclusive outdoor experiences.
                </Text>

                <View style={styles.tagsContainer}>
                    <Text style={styles.tagText}>501(c)(3) nonprofit</Text>
                    <Text style={styles.tagText}>Est. 2017</Text>
                    <Text style={styles.tagText}>LA, OC, SF</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}