//STANDARD LIBRARY
import React, { useEffect, useState } from 'react';
//THIRD-PARTY LIBRARIES
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';
//LOCAL FILES
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateUserState } from '@/app/redux/slices/userSlice';
import { styles } from './styles';

interface AvatarOption {
  key: string;
  url: string;
}

export default function AvatarPage() {
  //REACT HOOKS
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  //STATE VARIABLES
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(null);
  const [loading, setLoading] = useState(true);

  //HANDLERS
  async function fetchAvatars() {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/avatars`);
      const data = await res.json();
      setAvatars(data);
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue() {
    if (!selectedAvatar) {
      Alert.alert("Please select an avatar to continue");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}/avatar`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarKey: selectedAvatar.key }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save avatar");
      }

      const onboardingRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasOnboarded: true }),
        }
      );

      if (!onboardingRes.ok) {
        throw new Error('Failed to update onboarding status');
      }

      const nextRoute = user.isAdmin ? '/(admin)/home' : '/(users)/home';
      dispatch(
        updateUserState({
          ...user,
          avatar: selectedAvatar.key,
          hasOnboarded: true,
        })
      );
      router.replace(nextRoute as any);
    } catch (error) {
      console.error("Error saving avatar:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to save avatar");
    }
  }

  //EFFECTS
  useEffect(() => {
    fetchAvatars();
  }, []);

  //RENDER
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Choose an avatar!</Text>
        <Text style={styles.description}>Find one that represents you</Text>

        <View style={styles.previewCircle}>
          {selectedAvatar ? (
            <SvgUri uri={selectedAvatar.url} width={180} height={180} />
          ) : (
            <View style={styles.previewPlaceholder} />
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={avatars}
          keyExtractor={(item) => item.key}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.avatarOption,
                selectedAvatar?.key === item.key && styles.avatarOptionSelected,
              ]}
              onPress={() => setSelectedAvatar(item)}
            >
              <SvgUri uri={item.url} width={70} height={70} />
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
