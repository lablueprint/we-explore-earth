import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventFiltersModal from './components/eventFiltersModal/eventFiltersModal';

// LOCAL COMPONENTS
import Calendar from '@/app/components/Calendar/calendar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Event } from '@shared/types/event';
import { Filter } from '@shared/types/filter';
import { styles } from './styles';

export default function HomeScreen() {
  const [events, setEvents] = useState<Array<Event>>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // for showing calendar or loading indicator

  useEffect(() => {
    async function fetchFilteredEvents() {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;

      if (!baseUrl) {
        console.log("Config Error", "EXPO_PUBLIC_API_URL is not set.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/events/filtered`, 
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
          }
        );
        if(!response.ok) {
          throw new Error("Failed to fetch filtered events.");
        }
        const data: Event[] = await response.json();
        setEvents(data);
        console.log("Successfully fetched filtered events.");
      }
      catch (error: any) {
        console.log(error instanceof Error ? error.message : "Failed to fetch filtered events.");
      }
      finally {
        setLoading(false);
      }
    }
    
    fetchFilteredEvents();

  }, [filters])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingTop: 20, paddingHorizontal: 20}}>

      {/** Home Page */}
      <View style={styles.homeHeader}>
        <Text style={styles.upcoming}>Upcoming</Text>
        <TouchableOpacity
          onPress={() => { setFilterModalVisible(true); }}
          style={styles.filterButtonWrapper}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          <Ionicons name="options-outline" size={24} color="mediumgrey" />
        </TouchableOpacity>
      </View>
      
      <Calendar
        loading={loading}
        events={events}
      />

      {/** Event filters modal */}
      <EventFiltersModal
        setFilters={setFilters}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />

    </SafeAreaView>
  );
}
