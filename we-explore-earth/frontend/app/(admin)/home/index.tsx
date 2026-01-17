import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Event } from "../../../../backend/src/types/event";

export default function HomeScreen() {
  const [allEvents, setAllEvents] = useState<Array<Event>>([]);

  async function fetchEvents() {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events`, {
        method: 'GET'
      }); // TODO: Second parameter 

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.error);
      }

      setAllEvents(data);
    }
    catch(error: any) {
      console.error("Failed to get all events for home page.", error.message);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center" 
    }}>
      <Text>Sample Admin HOME Page</Text>
      {allEvents && allEvents.map((event, index) => {
        return(
        <>
          <Text key={index}>{event.title}</Text>
          <br/>
        </>
      )})}
    </View>
  );
}