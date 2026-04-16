import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { typography } from '@shared/typography/typography';

export default function RsvpTermsPlaceholderScreen() {
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

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: '#fff' },
  back: { marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 22 },
});
