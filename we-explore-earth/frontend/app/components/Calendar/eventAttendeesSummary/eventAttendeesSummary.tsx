import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import { useState, useEffect} from 'react';
import { useUser } from '../../../../hooks/useUser';
import EventAttendees from '../eventAttendees/eventAttendees';
import type { User } from '@shared/types/user';

// NOTE: This component currently also shows a placeholder for the profile pictures of 5 attendees, if we decide not to 
// implement that feature, we can remove the attendeesPreview state and the fetchAttendees function, and just show the total number of attendees.

type Props = {
  selectedEvent: Event | null;
};

export default function EventAttendeesSummary({ selectedEvent }: Props) {
  const { user } = useUser();
  const isAdmin = user?.isAdmin;
  const [showAll, setShowAll] = useState(false);
  const [attendeesPreview, setAttendeesPreview] = useState<User[]>([]);

  const fetchAttendees = async (ids: string[]) => { //fetches all user info for a list of user ids 
    try {
      const users = await Promise.all(ids.map(fetchAttendeeDetailsOne));
      setAttendeesPreview(users);
    }
      catch (e) {
        console.error(e);
      }
    };
  
    const fetchAttendeeDetailsOne = async (id: string): Promise<User> => { //fetches user info for a given user id 
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`);
      if (!res.ok){
        throw new Error(`Failed to fetch user ${id}`);
      } 
      return res.json();
    };

  useEffect(() => {
    if (!selectedEvent?.attendees?.length) {
      setAttendeesPreview([]);
      return;
    }
    const yesUserIds = selectedEvent.attendees
      .filter((rsvp) => rsvp.status === "YES") 
      .slice(0, 5)                              
      .map((rsvp) => rsvp.userID);         
      
    if (yesUserIds.length === 0) {
      setAttendeesPreview([]);
      return;
    }
    fetchAttendees(yesUserIds);
  }, [selectedEvent]);

  return (
    <>
      <Text style = {styles.meta}>{selectedEvent?.attendees?.length ?? 0} attendees </Text>
      {attendeesPreview.map((user) => (
        <Text key={user.id}>
          {user.firstName} {user.lastName}
        </Text>
      ))}
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

