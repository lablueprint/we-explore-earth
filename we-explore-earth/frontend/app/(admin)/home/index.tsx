
import Calendar from "@/app/components/Calendar/calendar";
import {Text, View, StyleSheet} from 'react-native';
import { typography } from "../../../../shared/typography/typography";

export default function EventsPage() {
  //return <Calendar />;
  return (
    <View>
      <Text style={typography.h1}>Main Headline</Text>
      <Text style={typography.body}>This is your body text.</Text>
    </View>
  );
}


