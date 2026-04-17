import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import { useState, useEffect} from 'react';
import { useUser } from '../../../../hooks/useUser';
import EventAttendees from '../eventAttendees/eventAttendees';


// NOTE: This component currently also shows a placeholder for the profile pictures of 5 attendees, if we decide not to 
// implement that feature, we can remove the attendeesPreview state and the fetchAttendees function, and just show the total number of attendees.

type Props = {
  selectedEvent: Event | null;
};

export default function EventAttendeesSummary({ selectedEvent }: Props) {
  const { user } = useUser();
  const isAdmin = user?.isAdmin;
  const [showAll, setShowAll] = useState(false);
  
  return (
    <>
      <Text style = {styles.meta}>{selectedEvent?.attendees?.length ?? 0} attendees </Text>
      {isAdmin && 
        <TouchableOpacity style={styles.viewAllButton}  onPress={() => setShowAll(true)} >
          <Text style={styles.closeText}>View All</Text>
        </TouchableOpacity> 
      }
      <Modal visible={showAll} animationType="slide" onRequestClose={() => setShowAll(false)}>
        <View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowAll(false)}>
            <Text style={styles.closeText}>Close</Text>     
          </TouchableOpacity>
        </View>
        {selectedEvent && ( <EventAttendees eventId={selectedEvent.id} />)}
      </Modal>
    </>
  );
}

