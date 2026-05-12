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
  onRSVPChange?: () => void;
};

export default function HomeCalendar({
  title = "Upcoming",
  events,
  loading,
  showFilters = true,
  onPressFilters,
  onRSVPChange,
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
            <Text style={styles.filterButtonText}>Filters</Text>
            <Ionicons name="options-outline" size={24} color="mediumgrey" />
          </TouchableOpacity>
        )} 
      </View>

      <Calendar loading={loading} events={events} onRSVPChange={onRSVPChange} />
    </View>
  );
}