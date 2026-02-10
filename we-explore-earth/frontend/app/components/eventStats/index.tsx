import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useState, useEffect} from 'react';
import type { Event } from '@shared/types/event';
import type { User } from '@shared/types/user';
import { styles } from './styles';
type Props = {
  eventId: string;
};

export default function EventStats({eventId}: Props){

    const [event, setEvent] = useState<Event | null>(null);
    // const [attendee, setAttendee] = useState<User | null>(null);

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

    const attendeeInfo = ["Saab", "Volvo", "BMW"];

  return (
  <View style={styles.container}>
    {event && (
        <>
        <Text style={styles.header}> {event.title}</Text>
        <Text style={styles.subheading}>Attendee List</Text>      
        <Text>
            {JSON.stringify(event.attendees, null, 2)}
        </Text>
        </>
    )}
  </View>
  );
}