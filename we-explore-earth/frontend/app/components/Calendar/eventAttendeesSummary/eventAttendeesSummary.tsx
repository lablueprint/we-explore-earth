//STANDARD LIBRARY
import React, { useState, useEffect } from 'react';

//THIRD-PARTY LIBRARIES
import { Modal, View, Text, TouchableOpacity } from 'react-native';

//LOCAL FILES
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { useUser } from '@/app/redux/hooks/useUser';
import EventAttendees from '../eventAttendees/eventAttendees';



// NOTE: This component currently also shows a placeholder for the profile pictures of 5 attendees, if we decide not to 
// implement that feature, we can remove the attendeesPreview state and the fetchAttendees function, and just show the total number of attendees.

type Props = {
  selectedEvent: Event | null;
};

export default function EventAttendeesSummary({ selectedEvent }: Props) {
  //REACT HOOKS
  const { user } = useUser();

  //STATE VARIABLES
  const [showAll, setShowAll] = useState(false);
  
  
  return (
    <>
      {user?.isAdmin && (
        <TouchableOpacity style={styles.viewAllButton} onPress={() => {
            console.log("View All clicked");
            setShowAll(true);
          }}
        >
          <Text style={styles.closeText}>View All</Text>
        </TouchableOpacity>
      )}

      <Modal 
        visible={showAll} 
        animationType="slide" 
        onRequestClose={() => setShowAll(false)}
      >
        <View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAll(false)}
          >
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>
        {selectedEvent && <EventAttendees eventId={selectedEvent.id} />}
      </Modal>
    </>
  );
}
