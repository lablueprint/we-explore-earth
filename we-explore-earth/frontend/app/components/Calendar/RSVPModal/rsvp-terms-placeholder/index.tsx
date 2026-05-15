//STANDARD LIBRARY
import { Pressable, Text } from "react-native";

//THIRD-PARTY LIBRARIES
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

//LOCAL FILES
import { typography } from "@shared/typography/typography";
import { styles } from "./styles";

export default function RsvpTermsPlaceholderScreen() {
  //RENDER
  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => router.back()}>
        <Text style={[typography.body, styles.back]}>Back</Text>
      </Pressable>
      <Text style={[typography.body, styles.body]}>
        DISCLAIMER: Liability: By participating in the We Explore Earth
        Activity, you acknowledge and understand that there are inherent risks
        involved, including but not limited to injury, illness, death, property
        damage, and other losses. You are responsible for your own safety and
        the safety of those under your care, and you agree to comply with all
        instructions and safety guidelines provided by We Explore Earth and its
        representatives. You also assume full responsibility for any injuries,
        damages, or losses that may occur as a result of your participation in
        the Activity, and release and hold harmless We Explore Earth and its
        employees, volunteers, and representatives from any and all liabilities,
        claims, demands, actions, and causes of action arising out of or related
        to your participation. By signing this disclaimer and liability waiver,
        you confirm that you have read and understood its terms and agree to be
        bound by them.
      </Text>
    </SafeAreaView>
  );
}
