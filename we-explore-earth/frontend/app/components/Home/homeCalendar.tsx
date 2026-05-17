//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgUri } from "react-native-svg";

//LOCAL FILES
import Calendar from "@/app/components/Calendar/calendar";
import { useUser } from "@/app/redux/hooks/useUser";
import type { Event } from "@shared/types/event";
import { styles, homeIcons, textStyles } from "./styles";

type Props = {
  events: Event[];
  loading: boolean;
  showFilters?: boolean;
  onPressFilters?: () => void;
  onRSVPChange?: () => void;
  autoOpenEvent?: Event | null;
  onAutoOpenEventHandled?: () => void;
};

export default function HomeCalendar({
  events,
  loading,
  showFilters = true,
  onPressFilters,
  onRSVPChange,
  autoOpenEvent,
  onAutoOpenEventHandled,
}: Props) {
  //REACT HOOKS
  const { user, avatarUrl } = useUser();

  const displayName = user?.firstName?.trim() || "there";

  //RENDER
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.heroBlock}>
        <View style={styles.heroRow}>
          <View
            style={styles.avatar}
            accessibilityLabel={
              avatarUrl ? "Your profile avatar" : "Profile avatar placeholder"
            }
          >
            {avatarUrl ? (
              <SvgUri uri={avatarUrl} width={48} height={48} />
            ) : (
              <Ionicons {...homeIcons.avatarCamera} />
            )}
          </View>
          <Text style={textStyles.trailCalling} numberOfLines={2}>
            The trail is calling, {displayName}
          </Text>
          {showFilters && (
            <TouchableOpacity
              onPress={onPressFilters}
              style={styles.filterButtonWrapper}
              accessibilityRole="button"
              accessibilityLabel="Open event filters"
            >
              <Ionicons {...homeIcons.filterOptions} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.upcomingHeader}>
        <Text style={textStyles.upcoming}>Explore events</Text>
      </View>

      <Calendar
        loading={loading}
        events={events}
        onRSVPChange={onRSVPChange}
        autoOpenEvent={autoOpenEvent}
        onAutoOpenEventHandled={onAutoOpenEventHandled}
      />
    </ScrollView>
  );
}
