import { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventFilters from './components/eventFilters/eventFilters';
import Calendar from '@/app/components/Calendar/calendar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Event } from '@shared/types/event';
import { Filter } from '@shared/types/filter';
import { styles } from './styles';

export default function HomeScreen() {
  const [filters, setFilters] = useState<Filter>({});
  const [events, setEvents] = useState<Array<Event>>([]); // TODO: Use events to populate the home page (calendar component)
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFilteredEvents() {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/filtered`, 
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
          }
        );
        const data = await response.json();
        if(!response.ok) {
          throw new Error(data.error || "Failed to fetch filtered events.");
        }
        setEvents(data);
      }
      catch (error: any) {
        console.log(error instanceof Error ? error.message : "Failed to fetch filtered events.");
      }
    }
    
    fetchFilteredEvents();

  }, [filters])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingTop: 20, paddingHorizontal: 20}}>
      {/** TODO: Update padding and margin of safe area */}

      {/** Home Page */}
      <View style={styles.homeHeader}>
        <Text style={styles.upcoming}>Upcoming</Text>
        <TouchableOpacity
          onPress={() => { setFilterVisible(true); }}
          style={styles.filterButtonWrapper}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          <Ionicons name="options-outline" size={24} color="mediumgrey" />
        </TouchableOpacity>
      </View>
      
      <Calendar />

      {/** Filters modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => { setFilterVisible(false); }}
      >
        {/** TODO: Update padding and margin of safe area style={{flex: 1, paddingTop: 20, marginTop: 40}} */}
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            style={{marginLeft: 20}}
            onPress={() => { setFilterVisible(false); }}
          >
            <Text>CLOSE</Text>
          </TouchableOpacity>
          <EventFilters setFilters={setFilters}/>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}