import React from "react";
import { TouchableOpacity, Text, View, FlatList, TextInput } from "react-native";
import { useState, useEffect} from 'react';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { styles } from './styles';

type Props = {
  eventId: string;
};

export default function EventStats({eventId}: Props){
  type Tab = "YES" | "MAYBE";
  const [tab, setTab] = useState<Tab>("YES");
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchfilteredData, setSearchFilteredData] = useState<User[]>([]);
  const [rsvpFiltered, setRsvpFiltered] = useState<User[]>([]);

  const fetchEventDetails = async (eventId: string) => {  //fetches all event details for a given event ID
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
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

  const fetchAttendees = async (ids: string[]) => { //fetches all user info for a list of user ids 
    try {
      const users = await Promise.all(ids.map(fetchAttendeeDetailsOne));
      setAttendees(users);
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

  useEffect(() => { //when event id changes it fetches new event details
    fetchEventDetails(eventId);
  }, [eventId]);

  useEffect(() => { //if attendees change then it fetches new attendee info 
    if (event?.attendees?.length) {
      const ids = event.attendees.map((rsvp) => rsvp.userID);
      fetchAttendees(ids);
    }
  }, [event?.attendees]);

  useEffect(() => { //when attendees or tab or event id changes it changes the rsvp information
    const RsvpAttendees = attendees.filter((u) => {
      const rsvp = u.events?.find((e) => e.eventID === eventId);
      return rsvp?.status === tab;
    });

    setSearchFilteredData(RsvpAttendees);
    setRsvpFiltered(RsvpAttendees);
  }, [attendees, tab, eventId]);

  useEffect(() => { //when tab changes search bar is cleared
    setSearch(""); 
  }, [tab]);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = rsvpFiltered.filter(item =>
      (item.firstName.toLowerCase().includes(text.toLowerCase()) ||
      item.lastName.toLowerCase().includes(text.toLowerCase()) ||
      item.username.toLowerCase().includes(text.toLowerCase()) ||
      item.email.toLowerCase().includes(text.toLowerCase()) ) 
    );
    setSearchFilteredData(filtered);
  };

  return (
  <View style={styles.container}>
    {event && (
      <>
        <Text style={styles.header}> {event.title}</Text>
        <Text style={styles.subheading}>RSVP List</Text>      
        <TextInput
          style={styles.searchBar}
          placeholder="Search here..."
          value={search}
          onChangeText={handleSearch}
         />

        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab("YES")}>
            <Text style={tab === "YES" ? styles.tabTextActive : styles.tabText}>
              Yes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab("MAYBE")}>
            <Text style={tab === "MAYBE" ? styles.tabTextActive : styles.tabText}>
              Maybe 
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={searchfilteredData}
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
