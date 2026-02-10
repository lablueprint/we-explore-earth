import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

//LOCAL FILES
import { styles } from './styles';
import { User } from "../../types/user";
import { useUser } from '../../../hooks/useUser';
import { EnableNotifications } from '@/components/notifications/EnableNotifications';

export default function ProfileScreen() {
  const { userId } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchUser = async (id: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData: User = await response.json();
      setUser(userData);
    } catch (error: unknown) {
      console.error('Error while fetching user:', error);
    }
  };

  const handleDisableNotifications = async () => {
    if (!user || !userId) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationToken: null, wantsNotifications: false }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updated: User = await response.json();
      setUser(updated);
    } catch (error: unknown) {
      console.error('Error disabling notifications:', error);
      Alert.alert('Error', 'Failed to disable notifications.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async () => {
    if (!user || !userId) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updated: User = await response.json();
      setUser(updated);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: unknown) {
      console.error('Error while updating user:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  }

  //EFFECTS
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);


  //RENDER
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Hi @{user?.username}!</Text>
        <Text style={styles.infoText}>Email: {user?.email}</Text>
        <Text style={styles.infoText}>First Name: {user?.firstName}</Text>
        <Text style={styles.infoText}>Last Name: {user?.lastName}</Text>

        <View style={styles.notificationContainer}>
          <Text style={styles.label}>Notifications:</Text>
          {(user?.wantsNotifications ?? user?.notificationToken != null) ? (
            <>
              <Text style={styles.infoText}>Notifications enabled</Text>
              <TouchableOpacity onPress={handleDisableNotifications} disabled={isUpdating}>
                <Text style={styles.infoText}>Disable</Text>
              </TouchableOpacity>
            </>
          ) : (
            <EnableNotifications
              userId={userId!}
              wantsNotifications={false}
              onSuccess={() => fetchUser(userId!)}
            />
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
        onPress={handleUpdate}
        disabled={isUpdating}
      >
        <Text style={styles.updateButtonText}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}