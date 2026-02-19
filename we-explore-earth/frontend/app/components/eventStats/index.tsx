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

  const sampleUsers: User[]= [
  {
    id: "u1",
    firstName: "Aarav ",
    lastName: "Mehta",
    email: "aarav.mehta@gmail.com",
    notificationToken: null,
    username: "testtest",
    isAdmin: false,
    events: [],

  
  },
  {
    id: "u2",
    firstName: "Barav ",
    lastName: "Mehta",
    email: "aarav.mehta@gmail.com",
    notificationToken: null,
    username: "testtest",
    isAdmin: false,
    events: [],
  },
  {
    id: "u3",
    firstName: "Carav ",
    lastName: "Mehta",
    email: "aarav.mehta@gmail.com",
    notificationToken: null,
    username: "testtest",
    isAdmin: false,
    events: [],
  },
];

    const [event, setEvent] = useState<Event | null>(null);
    // const [attendee, setAttendee] = useState<User | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(sampleUsers)

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

    // const fetchAttendeeDetails = async (attendeeId: string) => {
    //     try {
    //         const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${attendeeId}`, {
    //         method: 'GET', 
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },});
    //         console.log(response);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch attendee');
    //         }
    //         const attendeeData: User = await response.json();
    //         setAttendee(attendeeData);
    //     }
    //     catch (error: any) {
    //         console.error('Error while fetching attendee:', error);
    //     }
    // }

    useEffect(() => {
    fetchEventDetails(eventId);
    }, [eventId]);

    const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = sampleUsers.filter(item =>
      item.firstName.toLowerCase().includes(text.toLowerCase())
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

      {/* FlatList */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeItem}>
          <Text style={styles.attendeeName}>{item.firstName}{item.lastName}</Text>
          <Text style={styles.attendeeUsername}>{item.username}</Text>
          <Text style={styles.attendeeEmail}>{item.email}</Text>
          </View>
        )}
      />
        {sampleUsers.map((user) => (
        <View key={user.id} style={styles.attendeeItem}>
          <Text>Name: {user.firstName}{user.lastName}</Text>
          <Text>Email: {user.email}</Text>
        </View>
      ))}

        </>
    )}
  </View>
  );
}