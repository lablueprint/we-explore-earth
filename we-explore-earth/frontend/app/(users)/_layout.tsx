import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HomeIcon, ProfileIcon, DonateIcon, EventIcon } from "../components/NavBar/tab-icons";

const TAB_BAR_WIDTH = 254;
const screenWidth = Dimensions.get('window').width;

const ACTIVE_COLOR = '#FFFFFF';
const INACTIVE_COLOR = '#9E9E9E';
const ACTIVE_BG = '#2D5A1B';

const TAB_ICONS = [HomeIcon, EventIcon, DonateIcon, ProfileIcon];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const Icon = TAB_ICONS[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {isFocused ? (
              <View style={styles.activeCircle}>
                <Icon size={20} color={ACTIVE_COLOR} />
              </View>
            ) : (
              <Icon size={24} color={INACTIVE_COLOR} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: (screenWidth - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeCircle: {
    backgroundColor: ACTIVE_BG,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="events/index" />
      <Tabs.Screen name="about/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
