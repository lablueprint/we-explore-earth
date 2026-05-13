import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { useWindowDimensions, View } from "react-native";

import { HapticTab } from "../components/Native/haptic-tab";
import { IconSymbol } from "../components/Native/icon-symbol";
import { styles } from "./styles";

function BubbleIcon({ name, focused }: { name: React.ComponentProps<typeof IconSymbol>["name"]; focused: boolean }) {
  return (
    <View style={focused ? styles.bubbleIconFocused : undefined}>
      <IconSymbol name={name} color={focused ? "white" : "#8A8A8A"} />
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const sideMargin = Math.round(width * 0.07);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [styles.tabBar, { start: sideMargin, end: sideMargin }],
        tabBarIconStyle: styles.tabBarIcon,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView intensity={70} tint="light" style={styles.tabBarBlur} />
        ),
      }}
    >
      <Tabs.Screen
        name="about/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <BubbleIcon name="house.fill" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: "Events",
          tabBarIcon: ({ focused }) => (
            <BubbleIcon name="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <BubbleIcon name="person.circle.fill" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
