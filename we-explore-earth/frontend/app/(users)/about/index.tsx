import React from 'react';
import ContactButton from '../../components/ContactButton/ContactButton';
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

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>WHO WE ARE</Text>
                    
                    <Text style={styles.sectionText}>
                        We Explore Earth (WEE) is a 501(c)(3) nonprofit whose mission is to provide diverse outdoor experiences and environmental education for youth and students, families and individuals of all ages, BIPOC communities, and more.
                    </Text>
                    
                    <Text style={styles.sectionText}>
                        We build stewards and explorers of the land by creating accessible pathways into nature for people of all backgrounds.
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>OUR IMPACT</Text>
                    <View style={styles.impactRow}>
                        <Image 
                            source={require('../../../../shared/images/about-impact-one.png')} 
                            style={styles.impactImage} 
                            resizeMode="cover"
                        />
                        <View style={styles.impactTextContainer}>
                            <Text style={styles.impactNumber}>32, 476 lbs</Text>
                            <Text style={styles.impactLabel}>Trash removed from nature</Text>
                        </View>
                    </View>

                    <View style={styles.impactRow}>
                        <Image 
                            source={require('../../../../shared/images/about-impact-two.png')} 
                            style={styles.impactImage} 
                            resizeMode="cover"
                        />
                        <View style={styles.impactTextContainer}>
                            <Text style={styles.impactNumber}>18, 253+</Text>
                            <Text style={styles.impactLabel}>Volunteer hours served</Text>
                        </View>
                    </View>
                    <View style={styles.impactRow}>
                        <Image 
                            source={require('../../../../shared/images/about-impact-three.png')} 
                            style={styles.impactImage} 
                            resizeMode="cover"
                        />
                        <View style={styles.impactTextContainer}>
                            <Text style={styles.impactNumber}>7,800+</Text>
                            <Text style={styles.impactLabel}>Participants per year</Text>
                        </View>
                    </View>
                    <View style={styles.impactRow}>
                        <Image 
                            source={require('../../../../shared/images/about-impact-four.png')} 
                            style={styles.impactImage} 
                            resizeMode="cover"
                        />
                        <View style={styles.impactTextContainer}>
                            <Text style={styles.impactNumber}>72%</Text>
                            <Text style={styles.impactLabel}>Women-led & attended</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>PROGRAMMING</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Group hike cleanups & conservation projects</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Backpacking experiences</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Monthly full moon hikes</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Nature walks with land acknowledgements</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Monthly hikes (co-ed & women's hikes)</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Climb & connect nights</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Bouldering & crag nature days</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Road trips to national parks & picnic lands</Text>
                  <Text style={styles.listItem}>  {'\u2022'} Forest bridges campout series</Text>
                  <Text style={styles.listItem}>{"\n"} ...plus special events, festivals, and so much more!</Text>
                </View>

                <View style={[styles.sectionContainer, styles.lastSection]}>
                    <Text style={styles.sectionHeader}>CONTACT</Text>

                    <View style={styles.contactCard}>
                        <ContactButton 
                            iconName="globe" 
                            title="Website contact form" 
                            subtitle="weexploreearth.com/contact-us" 
                            url="https://weexploreearth.com/contact-us" 
                        />
                        <View style={styles.contactDivider} />
                        <ContactButton 
                            iconName="instagram" 
                            title="Instagram" 
                            subtitle="@weexploreearth" 
                            url="https://www.instagram.com/weexploreearth/" 
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}