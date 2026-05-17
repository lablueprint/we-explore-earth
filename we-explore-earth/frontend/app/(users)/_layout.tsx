import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from "../components/Native/haptic-tab";
import { HomeIcon, ProfileIcon, DonateIcon, EventIcon } from "../components/Native/tab-icons";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about/index"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <DonateIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <EventIcon size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
