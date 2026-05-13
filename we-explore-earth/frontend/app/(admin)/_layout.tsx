import { BlurView } from "expo-blur";
import { Tabs, useRouter, usePathname } from "expo-router";
import React from "react";
import { Alert, useWindowDimensions, View } from "react-native";

import { EventFormDirtyProvider, useEventFormDirty } from "./EventFormDirtyContext";
import { HapticTab } from "../components/Native/haptic-tab";
import { IconSymbol } from "../components/Native/icon-symbol";
import { styles } from "./styles";

const NEW_EVENT_HREF = "/(admin)/events/new";

/** Use for any tab that should confirm before leaving the event form (new/edit). */
function ConfirmLeaveEventFormTabButton(
  props: React.ComponentProps<typeof HapticTab>,
) {
  const pathname = usePathname();
  const { isEventFormDirty } = useEventFormDirty();
  const isOnEventForm =
    typeof pathname === "string" && pathname.includes("/events/");
  const isOnNewEvent =
    typeof pathname === "string" && pathname.includes("/events/new");
  const shouldConfirm =
    isOnEventForm &&
    (isOnNewEvent ? isEventFormDirty : true);

  return (
    <HapticTab
      {...props}
      onPress={(e) => {
        if (shouldConfirm) {
          Alert.alert(
            "Leave event?",
            "Your changes have not been saved. Are you sure you want to go back?",
            [
              { text: "Stay", style: "cancel", onPress: () => {} },
              {
                text: "Leave",
                style: "destructive",
                onPress: () => props.onPress?.(e),
              },
            ]
          );
        } else {
          props.onPress?.(e);
        }
      }}
    />
  );
}

function NewEventTabButton(
  props: React.ComponentProps<typeof HapticTab>,
) {
  const router = useRouter();
  return (
    <HapticTab
      {...props}
      onPress={() => {
        router.replace(NEW_EVENT_HREF as any);
      }}
    />
  );
}

function BubbleIcon({ name, focused }: { name: React.ComponentProps<typeof IconSymbol>["name"]; focused: boolean }) {
  return (
    <View style={focused ? styles.bubbleIconFocused : undefined}>
      <IconSymbol name={name} color={focused ? "white" : "#8A8A8A"} />
    </View>
  );
}

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const sideMargin = Math.round(width * 0.07);

  return (
    <EventFormDirtyProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: ConfirmLeaveEventFormTabButton,
          tabBarStyle: [styles.tabBar, { start: sideMargin, end: sideMargin }],
          tabBarIconStyle: styles.tabBarIcon,
          tabBarShowLabel: false,
          tabBarBackground: () => (
            <BlurView intensity={70} tint="light" style={styles.tabBarBlur} />
          ),
        }}
      >
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
          name="events/[id]"
          options={{
            title: "New Event",
            tabBarIcon: ({ focused }) => (
              <BubbleIcon name="plus" focused={focused} />
            ),
            tabBarButton: NewEventTabButton,
          }}
        />
        <Tabs.Screen
          name="notifications/index"
          options={{
            title: "Notify",
            tabBarIcon: ({ focused }) => (
              <BubbleIcon name="bell.fill" focused={focused} />
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
    </EventFormDirtyProvider>
  );
}
