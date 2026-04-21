//STANDARD LIBRARY
import { Pressable, Text } from 'react-native';

//THIRD-PARTY LIBRARIES
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

//LOCAL FILES
import { typography } from '@shared/typography/typography';
import { styles } from './styles';

export default function RsvpTermsPlaceholderScreen() {
  //RENDER
  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => router.back()}>
        <Text style={[typography.body, styles.back]}>Back</Text>
      </Pressable>
      <Text style={[typography.body, styles.body]}>
        Discussed with Sanjay that this is a placeholder for the TOC for now until a final decision is made.
      </Text>
    </SafeAreaView>
  );
}
