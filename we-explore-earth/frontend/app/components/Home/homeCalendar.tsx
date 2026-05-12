import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Calendar from "@/app/components/Calendar/calendar";
import type { Event } from "@shared/types/event";
import { styles } from "./styles";

type Props = {
  title?: string;
  events: Event[];
  loading: boolean;
  showFilters?: boolean;
  onPressFilters?: () => void;
};

export default function HomeCalendar({
  title = "Upcoming",
  events,
  loading,
  showFilters = true,
  onPressFilters,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <Text style={styles.upcoming}>{title}</Text>

        {showFilters && (
          <TouchableOpacity
            onPress={onPressFilters}
            style={styles.filterButtonWrapper}
          >
            <Ionicons name="options-outline" size={21} color="#181818" />
          </TouchableOpacity>
        )} 
      </View>

      <Calendar loading={loading} events={events} />
    </View>
  );
}