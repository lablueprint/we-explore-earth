import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles';

interface OnboardingPageProps {
  title: string;
  description?: string;
  nextRoute: string;
  buttonText?: string;
  onFinish?: () => Promise<void>;
  currentPage?: number;
  totalPages?: number;
  isParagraph?: boolean;
}

export default function OnboardingPage({ 
  title, 
  description, 
  nextRoute, 
  buttonText = "Continue",
  onFinish,
  currentPage,
  totalPages,
  isParagraph
}: OnboardingPageProps) {
  
  async function handleNext() {
    if(onFinish) {
      await onFinish();
    }
    router.push(nextRoute as any);
  }
  
  return (
    <ImageBackground 
      source={require('../../../../shared/images/onboarding-gradient.png')} 
      style={styles.fullBackground}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        
        <Image 
          source={require('../../../../shared/images/lines.png')} 
          style={styles.vectorLines}
          resizeMode="cover"
        />

        <View style={styles.container}>
          
          {totalPages && currentPage ? (
            <View style={styles.progressContainer}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.progressDash, 
                    currentPage === index + 1 ? styles.activeDash : styles.inactiveDash
                  ]} 
                />
              ))}
            </View>
          ) : (
            <View style={{ marginTop: 24 }} />
          )}

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={[styles.description, isParagraph && styles.descriptionSmall]}>
                {description}
              </Text>
            )}
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}