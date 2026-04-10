import { Tabs, useRouter, usePathname } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { EventFormDirtyProvider, useEventFormDirty } from "./EventFormDirtyContext";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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

export default function AdminLayout() {
  const colorScheme = useColorScheme();

  return (
    <EventFormDirtyProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: ConfirmLeaveEventFormTabButton,
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="events/[id]"
          options={{
            title: "New Event",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
            tabBarButton: NewEventTabButton,
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </EventFormDirtyProvider>
  );
}
