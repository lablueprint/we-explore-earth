import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventFilters from './components/eventFilters/eventFilters';
import Calendar from '@/app/components/Calendar/calendar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from './styles'

export default function HomeScreen() {
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

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
          <EventFilters />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}