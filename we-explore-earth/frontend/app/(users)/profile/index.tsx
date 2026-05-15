import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useState, useEffect} from 'react';
import { TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';

//LOCAL FILES
import { styles } from './styles';
import { User } from "@shared/types/user";
import { useUser } from '../../../hooks/useUser';

export default function ProfileScreen() {
  //REACT HOOKS
  const { userId, avatarUrl } = useUser();
  //STATE VARIABLES
  const [user, setUser] = useState<User | null>(null);
  const [notificationTokenEnabled, setNotificationTokenEnabled] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  //HANDLERS
  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData: User = await response.json();
      setUser(userData);
      setNotificationTokenEnabled(userData.notificationToken !== null);
    } catch(error: any) {
      console.error('Error while fetching user:', error);
    }
  }

  const handleToggleNotification = () => {
    setNotificationTokenEnabled(!notificationTokenEnabled);
  }

  const handleUpdate = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const updatedUser = {
        ...user,
        notificationToken: notificationTokenEnabled ? (user.notificationToken || 'enabled') : null,
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUserData: User = await response.json();
      setUser(updatedUserData);
      setNotificationTokenEnabled(updatedUserData.notificationToken !== null);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch(error: any) {
      console.error('Error while updating user:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
        {avatarUrl ? (
          <View style={styles.avatarContainer}>
            <SvgUri uri={avatarUrl} width={100} height={100} />
          </View>
        ) : (
          <Text style={styles.infoText}>Avatar: none</Text>
        )}

        <View style={styles.notificationContainer}>
          <Text style={styles.label}>Enable Notifications:</Text>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={handleToggleNotification}
          >
            <View style={[
              styles.checkboxInner,
              notificationTokenEnabled && styles.checkboxChecked
            ]}>
              {notificationTokenEnabled && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
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