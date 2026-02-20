import React from "react";
import { TouchableOpacity, Text, View, FlatList, TextInput } from "react-native";
// import { SearchBar } from 'react-native-elements';
import { useState, useEffect} from 'react';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { styles } from './styles';
import { Button } from "@react-navigation/elements";
import { Checkbox } from 'expo-checkbox';

type Props = {
  eventId: string;
};

export default function EventStats({eventId}: Props){

    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [YesAttendees, setYesAttendees] = useState<User[]>([]);
    const [MayabeAttendees, setMaybeAttendees] = useState<User[]>([]);

    const fetchEventDetails = async (eventId: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },});
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch event');
            }
            const eventData: Event = await response.json();
            setEvent(eventData);
        }
        catch (error: any) {
            console.error('Error while fetching event:', error);
        }
    }

    const fetchAttendees = async (ids: string[]) => {
      try {
        const users = await Promise.all(ids.map(fetchAttendeeDetailsOne));
        setAttendees(users);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchAttendeeDetailsOne = async (id: string): Promise<User> => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
      return res.json();
    };

    useEffect(() => {
    fetchEventDetails(eventId);
    }, [eventId]);

    useEffect(() => {
    if (event?.attendees?.length) {
      const ids = event.attendees.map((rsvp) => rsvp.userID);
      fetchAttendees(ids);
    }
  }, [event?.attendees]);

    const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = attendees.filter(item =>
      item.firstName.toLowerCase().includes(text.toLowerCase()) ||
      item.lastName.toLowerCase().includes(text.toLowerCase()) ||
      item.username.toLowerCase().includes(text.toLowerCase()) ||
      item.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };



  return (
  <View style={styles.container}>
    {event && (

        <>
        <Text style={styles.header}> {event.title}</Text>
        <Text style={styles.subheading}>Attendee List</Text>      
        <TextInput
        style={styles.searchBar}
        placeholder="Search here..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeItem}>
          <Text style={styles.attendeeName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.attendeeUsername}>{item.username}</Text>
          <Text style={styles.attendeeEmail}>{item.email}</Text>
          </View>
        )}
      />
        </>
    )}
  </View>
  );
}