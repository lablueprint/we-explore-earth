import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '@/app/redux/hooks/useUser';
import type { RSVPStatus } from '@shared/types/event';

type Props = {
  eventId: string;
};

export default function RsvpActions({ eventId }: Props) {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [loading, setLoading] = useState(false);

  const sendRsvp = async (status: RSVPStatus) => {
    if (!userId) {
      Alert.alert('Sign in required', 'Please sign in to RSVP.');
      return;
    }
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      Alert.alert('Config Error', 'EXPO_PUBLIC_API_URL is not set.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/users/${userId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        Alert.alert('Error', data?.error ?? `Request failed (${res.status})`);
        return;
      }
      Alert.alert('Done', 'RSVP updated.');
    } catch {
      Alert.alert('Network Error', 'Could not update RSVP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
      <TouchableOpacity
        onPress={() => sendRsvp('YES')}
        disabled={loading}
        style={{ padding: 10, backgroundColor: '#4CAF50', borderRadius: 6 }}
      >
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff' }}>Yes</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => sendRsvp('MAYBE')}
        disabled={loading}
        style={{ padding: 10, backgroundColor: '#FF9800', borderRadius: 6 }}
      >
        <Text style={{ color: '#fff' }}>Maybe</Text>
      </TouchableOpacity>
    </View>
  );
}
