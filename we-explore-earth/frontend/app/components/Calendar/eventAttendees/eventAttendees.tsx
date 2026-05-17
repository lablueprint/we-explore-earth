import React from "react";
import { TouchableOpacity, Text, View, FlatList, TextInput } from "react-native";
import { useState, useEffect} from 'react';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { styles } from './styles';
import {Search} from "lucide-react-native";
type Props = {
  eventId: string;
};

export default function EventAttendees({eventId}: Props){
  type Tab = "ALL" | "YES" | "MAYBE";
  const [tab, setTab] = useState<Tab>("ALL");
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

  useEffect(() => {
  const RsvpAttendees =
      tab === "ALL"
        ? attendees
        : attendees.filter((u) => {
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
      item.email.toLowerCase().includes(text.toLowerCase()) ) 
    );
    setSearchFilteredData(filtered);
  };
  const toggleCheckIn = async (userId: string, currentCheckedIn: boolean) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}/check-in`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          checkedIn: !currentCheckedIn,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update check-in");
    }

    fetchEventDetails(eventId);
  } catch (error) {
    console.error("Error checking in attendee:", error);
  }
};

  return (
  <View style={styles.container}>
    {event && (
      <>
        <Text style={ styles.header}> {event.title}</Text>
        <Text style={styles.subheading}>RSVP List</Text>      
        <View style={styles.searchWrapper}>
          <Search size={16} color="#8e8e93" strokeWidth={3} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search attendees"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab("ALL")}>
            <Text style={tab === "ALL" ? styles.tabTextActive : styles.tabText}>
              All ({attendees.length})
            </Text>
          </TouchableOpacity> 
          
          <TouchableOpacity onPress={() => setTab("YES")}>
            <Text style={tab === "YES" ? styles.tabTextActive : styles.tabText}>
              Yes ({attendees.filter(u => u.events?.find(e => e.eventID === eventId)?.status === "YES").length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab("MAYBE")}>
            <Text style={tab === "MAYBE" ? styles.tabTextActive : styles.tabText}>
              Maybe ({attendees.filter(u => u.events?.find(e => e.eventID === eventId)?.status === "MAYBE").length})
            </Text>
          </TouchableOpacity>
        </View>

       {searchfilteredData.length === 0 ? (
        <Text style={styles.attendeeName}>No attendees that meet this criteria</Text>
        ) : ( 
        <FlatList
          style={styles.listCard}
          data={searchfilteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const rsvp = event?.attendees?.find((r) => r.userID === item.id);
            const isCheckedIn = rsvp?.checkedIn === true;

            return (
              <View style={styles.attendeeItem}>
                <View>
                  <Text style={styles.attendeeName}>
                    {item.firstName} {item.lastName}
                  </Text>

                  <Text style={styles.attendeeEmail}>
                    {item.email}
                  </Text>
                </View>

                <TouchableOpacity
                  style={isCheckedIn ? styles.checkedInButton : styles.checkInButton}
                  onPress={() => toggleCheckIn(item.id, isCheckedIn)}
                >
                  <Text style={isCheckedIn ? styles.checkedInText : styles.checkInText}>
                    {isCheckedIn ? "✓" : "Check in"}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
        )}
      </>
    )}
  </View>
  );
}
