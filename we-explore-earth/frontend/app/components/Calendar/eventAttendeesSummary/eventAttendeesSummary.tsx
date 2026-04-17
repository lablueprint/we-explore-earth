//STANDARD LIBRARY
import React, { useState, useEffect } from 'react';

//THIRD-PARTY LIBRARIES
import { Modal, View, Text, TouchableOpacity } from 'react-native';

//LOCAL FILES
import { styles } from './styles';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { useUser } from '../../../../hooks/useUser';
import EventAttendees from '../eventAttendees/eventAttendees';

type Props = {
  selectedEvent: Event | null;
};

export default function EventAttendeesSummary({ selectedEvent }: Props) {
  //REACT HOOKS
  const { user } = useUser();

  //STATE VARIABLES
  const [showAll, setShowAll] = useState(false);
  const [attendeesPreview, setAttendeesPreview] = useState<User[]>([]);

  const isAdmin = user?.isAdmin;

  //HANDLERS
  const fetchAttendeeDetailsOne = async (id: string): Promise<User> => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user ${id}`);
    }
    return res.json();
  };

  const fetchAttendees = async (ids: string[]) => {
    try {
      const users = await Promise.all(ids.map(fetchAttendeeDetailsOne));
      setAttendeesPreview(users);
    } catch (e) {
      console.error(e);
    }
  };

  //EFFECTS
  useEffect(() => {
    if (!selectedEvent?.attendees?.length) {
      setAttendeesPreview([]);
      return;
    }
    const yesUserIds = selectedEvent.attendees
      .filter((rsvp) => rsvp.status === 'YES')
      .slice(0, 5)
      .map((rsvp) => rsvp.userID);

    if (yesUserIds.length === 0) {
      setAttendeesPreview([]);
      return;
    }
    fetchAttendees(yesUserIds);
  }, [selectedEvent]);

  //RENDER
  return (
    <>
      <Text style={styles.meta}>{selectedEvent?.attendees?.length ?? 0} attendees </Text>
      {attendeesPreview.map((u) => (
        <Text key={u.id}>
          {u.firstName} {u.lastName}
        </Text>
      ))}
      {isAdmin && (
        <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowAll(true)}>
          <Text style={styles.closeText}>View All</Text>
        </TouchableOpacity>
      )}
      <Modal visible={showAll} animationType="slide" onRequestClose={() => setShowAll(false)}>
        <View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowAll(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
        {selectedEvent && <EventAttendees eventId={selectedEvent.id} />}
      </Modal>
    </>
  );
}
