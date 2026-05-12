//STANDARD LIBRARY
import React from 'react';

//THIRD-PARTY LIBRARIES
import { TouchableOpacity, Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

//LOCAL FILES
import { styles, clockIconSize, clockIconColor, cardActiveOpacity } from './styles';
import type { Event } from '@shared/types/event';
import { typography } from '@shared/typography/typography';
import { useUser } from '../../../../hooks/useUser';
import { useEventSignedImageUrl } from '../../../../hooks/useEventSignedImageUrl';

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

export default function EventView({ event, onPress }: Props) {
  //REACT HOOKS
  const { userId } = useUser();
  const { url: coverUrl, loading: coverLoading } = useEventSignedImageUrl(
    event.eventImage
  );

  const rsvp = userId ? event.attendees?.find((a) => a.userID === userId) : undefined;
  const rsvpStatus = rsvp?.status ?? null;

  //RENDER
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(event)}
      activeOpacity={cardActiveOpacity}
    >
      <View style={styles.imageWrap}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            {coverLoading && event.eventImage ? (
              <ActivityIndicator />
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[typography.h1, styles.title]} numberOfLines={3}>
          {event.title}
        </Text>

        <View style={styles.datePill}>
          <Ionicons
            name="time-outline"
            size={clockIconSize}
            color={clockIconColor}
            style={styles.clockIcon}
          />
          <Text style={[typography.body, styles.dateText]}>
            {formatEventDate(event.timeStart._seconds)}
          </Text>
        </View>

        {rsvpStatus && (
          <View style={[styles.rsvpBadge, rsvpStatus === 'YES' ? styles.rsvpGoing : styles.rsvpMaybe]}>
            <Text style={[typography.body, styles.rsvpText]}>
              {rsvpStatus === 'YES' ? 'Going' : 'Maybe'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
