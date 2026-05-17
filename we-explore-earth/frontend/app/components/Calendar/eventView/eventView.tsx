//STANDARD LIBRARY
import React from 'react';

//THIRD-PARTY LIBRARIES
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

//LOCAL FILES
import { styles, cardGradient, glossOverlay, clockIconSize, clockIconColor, cardActiveOpacity } from './styles';
import type { Event } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
import { useUser } from '@/app/redux/hooks/useUser';
import { EventCoverImage } from '@/app/components/Calendar/eventCoverImage/eventCoverImage';

type Props = {
  event: Event;
  onPress: (event: Event) => void;
};

function formatEventDate(seconds: number): string {
  const date = new Date(seconds * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`;
  return `${dayName} ${monthName} ${day}, ${hour12}${minuteStr}${ampm}`;
}

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

  if (isSameDay(start, end)) {
    const datePart = start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const timePart = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${datePart}, ${timePart}`;
  }

  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

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
      <LinearGradient
        colors={cardGradient.colors}
        locations={cardGradient.locations}
        start={cardGradient.start}
        end={cardGradient.end}
        style={styles.card}
      >
      <LinearGradient
        pointerEvents="none"
        colors={glossOverlay.colors}
        locations={glossOverlay.locations}
        start={glossOverlay.start}
        end={glossOverlay.end}
        style={StyleSheet.absoluteFillObject}
      />

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
      </LinearGradient>
    </TouchableOpacity>
  );
}
