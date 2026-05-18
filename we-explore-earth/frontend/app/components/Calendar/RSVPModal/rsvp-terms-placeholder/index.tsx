//STANDARD LIBRARY
import { Pressable, ScrollView, Text } from "react-native";

//THIRD-PARTY LIBRARIES
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

//LOCAL FILES
import { styles } from "./styles";

export default function RsvpTermsPlaceholderScreen() {
  //RENDER
  return (
    <SafeAreaView style={[styles.root, styles.sheet]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Terms of Service</Text>

          <Text style={styles.body}>
            By participating in any We Explore Earth activity, event, experience, workshop, cleanup, hike, climb, restoration project, volunteer activity, or outdoor gathering, participants acknowledge and understand that outdoor and community-based activities involve inherent risks, including but not limited to injury, illness, property damage, wildlife encounters, environmental hazards, vehicle-related incidents, acts of nature, negligence of others, permanent disability, and death.
          </Text>
          <Text style={styles.body}>
            Participants voluntarily assume all risks associated with participation and accept full personal responsibility for their safety, well-being, equipment, transportation, and personal belongings during any We Explore Earth related activity.
          </Text>

          <Text style={styles.body}>
            By registering for or participating in any event, participants agree to release, waive, discharge, and hold harmless We Explore Earth, its directors, officers, volunteers, event leaders, organizers, affiliates, collaborators, sponsors, land agencies, property owners, partnering organizations, and representatives from any and all liability, claims, demands, damages, causes of action, or expenses arising out of or related to participation in any activity.
          </Text>

          <Text style={styles.body}>
            Participants agree to follow all instructions, posted rules, land regulations, safety guidance, and local laws during participation. We Explore Earth reserves the right to remove or deny participation to any individual acting in an unsafe, unlawful, or disruptive manner.
          </Text>

          <Text style={styles.body}>
            Participants understand that certain activities may involve strenuous physical exertion and confirm that they are physically and mentally capable of participating. Participants are encouraged to consult a medical professional before participating in strenuous outdoor activities if they have any health concerns.
          </Text>

          <Text style={styles.body}>
            By completing registration or attending an event, participants confirm that they have read, understood, and agreed to these Terms of Service and Liability Waiver.
          </Text>
        </ScrollView>
    </SafeAreaView>
  );
}
