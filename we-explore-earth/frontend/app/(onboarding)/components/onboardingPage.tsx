import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { styles } from './styles';

interface OnboardingPageProps {
  title: string;
  description?: string;
  nextRoute: string;
  buttonText?: string;
  onFinish?: () => Promise<void>;
}

export default function OnboardingPage({ 
  title, 
  description, 
  nextRoute, 
  buttonText = "Continue",
  onFinish
}: OnboardingPageProps) {

  async function handleNext() {
    if(onFinish) {
      await onFinish();
    }
    router.push(nextRoute as any);
  }

  return (
    <View style={styles.container}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>[Image Placeholder]</Text>
      </View>

      {/* Text Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

