//STANDARD LIBRARY
import React from 'react';

//THIRD-PARTY LIBRARIES
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
//LOCAL FILES
import { styles, clockIconSize, clockIconColor, cardActiveOpacity } from './styles';
import type { Event } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
import { useUser } from '@/app/redux/hooks/useUser';
import { EventCoverImage } from '@/app/components/Calendar/eventCoverImage/eventCoverImage';

type Props = {
  event: Event;
  onPress: (event: Event) => void;
};


const isSameDay = (start: Date, end: Date) => {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
};

const formatEventDateTime = (startTs: { _seconds: number }, endTs: { _seconds: number }) => {
  const start = new Date(startTs._seconds * 1000);
  const end = new Date(endTs._seconds * 1000);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const timePart = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(start, end)) {
    if (isSameDay(start, tomorrow)) {
      return `Tomorrow at ${timePart}`;
    }
    if (start <= sevenDaysFromNow) {
      const weekday = start.toLocaleDateString("en-US", { weekday: "long" });
      return `${weekday} at ${timePart}`;
    }
    const datePart = start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return `${datePart} at ${timePart}`;
  }

  const startStr = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${startStr} - ${endStr}`;
};

export default function EventView({ event, onPress }: Props) {
  //REACT HOOKS
  const { userId } = useUser();

  const rsvp = userId ? event.attendees?.find((a) => a.userID === userId) : undefined;
  const rsvpStatus = rsvp?.status ?? null;
  //RENDER
  return (
    <TouchableOpacity
      onPress={() => onPress(event)}
      activeOpacity={cardActiveOpacity}
    >
      <View style={styles.card}>
      <View style={styles.imageWrap}>
        <View style={styles.imagePlaceholder}>
          <EventCoverImage
            imageKey={event.eventImage}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[typography.h1, styles.title]} numberOfLines={1} ellipsizeMode="tail">
          {event.title}
        </Text>

        <View style={styles.timeRow}>
          <Ionicons
            name="time-outline"
            size={clockIconSize}
            color={clockIconColor}
            style={styles.clockIcon}
          />
          <Text style={styles.timeText}>
            {formatEventDateTime(event.timeStart, event.timeEnd)}
          </Text>
        </View>

        {(rsvpStatus === 'YES' || rsvpStatus === 'MAYBE') && (
          <View style={[styles.rsvpBadge, rsvpStatus === 'YES' ? styles.rsvpGoing : styles.rsvpMaybe]}>
            <Text style={[typography.body, styles.rsvpText]}>
              {rsvpStatus === 'YES' ? 'Going' : 'Maybe'}
            </Text>
          </View>
        )}
      </View>
      </View>
    </TouchableOpacity>
  );
}
