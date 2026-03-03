import { useCallback, useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Alert, View, Text, ActivityIndicator } from "react-native";
import { useEventFormDirty } from "../EventFormDirtyContext";
import { EventForm } from "./components/EventForm";
import { combineDateAndTime, timestampToDate } from "@/utils/eventUtils";

export default function EventFormPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setEventFormDirty, isEventFormDirty } = useEventFormDirty();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = id === "new" || !id;
  const eventId = isCreate ? null : (id as string);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState(new Date());
  const [timeStart, setTimeStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [hostedBy, setHostedBy] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [accommodationOptions, setAccommodationOptions] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState<string[]>([]);
  const [maxAttendees, setMaxAttendees] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isCreate);

  const markDirty = useCallback(() => {
    if (isCreate) setEventFormDirty(true);
  }, [isCreate, setEventFormDirty]);

  const withDirty = useCallback(
    <T,>(setter: (value: T) => void) =>
      (value: T) => {
        setter(value);
        markDirty();
      },
    [markDirty],
  );

  // Confirm before leaving when navigation removes this screen (e.g. Android back button)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const shouldConfirm = !isCreate || isEventFormDirty;
      if (!shouldConfirm) return;
      e.preventDefault();
      Alert.alert(
        "Leave event?",
        "Your changes have not been saved. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel", onPress: () => {} },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isCreate, isEventFormDirty]);

  // When user navigates away (e.g. taps another tab), reset form to blank so they get a fresh form when they return
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setEventFormDirty(false);
      const now = new Date();
      setTitle("");
      setDescription("");
      setLocation("");
      setHostedBy("");
      setDateStart(now);
      setTimeStart(now);
      setDateEnd(now);
      setTimeEnd(now);
      setPrice("");
      setMaxAttendees("");
      setRsvpDeadline(now);
      setImageUri(null);
      setLoading(false);
      setCategory([]);
      setAccommodation([]);
    });
    return unsubscribe;
  }, [navigation, setEventFormDirty]);

  // Reset form when navigating to create (e.g. from navbar) so we don't keep edit data
  useEffect(() => {
    if (id === "new" || !id) {
      setEventFormDirty(false);
      const now = new Date();
      setTitle("");
      setDescription("");
      setLocation("");
      setHostedBy("");
      setDateStart(now);
      setTimeStart(now);
      setDateEnd(now);
      setTimeEnd(now);
      setPrice("");
      setMaxAttendees("");
      setRsvpDeadline(now);
      setImageUri(null);
      setLoading(false);
      setCategory([]);
      setAccommodation([]);
    }
  }, [id, setEventFormDirty]);

  // Fetch event when editing
  useEffect(() => {
    if (isCreate || !eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`,
          { method: "GET" },
        );

        if (!response.ok) {
          if (response.status === 404) {
            Alert.alert("Error", "Event not found");
          } else {
            Alert.alert("Error", "Failed to fetch event");
          }
          setLoading(false);
          return;
        }

        const event: any = await response.json();

        if (!event || (!event.title && !event.id)) {
          Alert.alert("Error", "Invalid event data received");
          setLoading(false);
          return;
        }

        const missingFields: string[] = [];
        if (!event.timeStart) missingFields.push("timeStart");
        if (!event.timeEnd) missingFields.push("timeEnd");
        if (!event.rsvpDeadline) missingFields.push("rsvpDeadline");
        if (event.maxAttendees == null) missingFields.push("maxAttendees");

        if (missingFields.length > 0) {
          Alert.alert(
            "Error",
            `Event data is missing required fields: ${missingFields.join(", ")}. Cannot edit this event.`,
          );
          setLoading(false);
          return;
        }

        const timeStartDate = timestampToDate(event.timeStart);
        const timeEndDate = timestampToDate(event.timeEnd);
        const rsvpDeadlineDate = timestampToDate(event.rsvpDeadline);

        const startDate = new Date(timeStartDate);
        startDate.setHours(0, 0, 0, 0);
        const startTime = new Date(timeStartDate);
        startTime.setFullYear(1970, 0, 1);

        const endDate = new Date(timeEndDate);
        endDate.setHours(0, 0, 0, 0);
        const endTime = new Date(timeEndDate);
        endTime.setFullYear(1970, 0, 1);

        setTitle(event.title || "");
        setDescription(event.description || "");
        setLocation(event.location || "");
        setDateStart(startDate);
        setTimeStart(startTime);
        setDateEnd(endDate);
        setTimeEnd(endTime);
        setPrice(event.price != null ? event.price.toString() : "0");
        setHostedBy(event.hostedBy || "");
        setMaxAttendees(
          event.maxAttendees != null ? event.maxAttendees.toString() : "",
        );
        setRsvpDeadline(rsvpDeadlineDate);
        setCategory(Array.isArray(event.category) ? event.category : []);
        setAccommodation(Array.isArray(event.accommodation) ? event.accommodation : []);
      } catch (error) {
        console.error("Error fetching event:", error);
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "Failed to fetch event",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, isCreate]);

  const getEventOptions = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/config/event-options`,
        { method: "GET" },
      );

      if (!response.ok) {
        console.error("Failed to fetch event options");
        return;
      }

      const data = await response.json();
      setCategoryOptions(Array.isArray(data.category) ? data.category : []);
      setAccommodationOptions(Array.isArray(data.accommodations) ? data.accommodations : []);
    } catch (e) {
      console.error("Unable to get event options", e);
    }
  };

  useEffect(() => {
    getEventOptions();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const combinedTimeStart = combineDateAndTime(dateStart, timeStart);
    const combinedTimeEnd = combineDateAndTime(dateEnd, timeEnd);
    const payload = {
      title,
      description,
      location,
      timeStart: combinedTimeStart.toISOString(),
      timeEnd: combinedTimeEnd.toISOString(),
      price,
      hostedBy,
      category,
      accommodation,
      maxAttendees,
      rsvpDeadline: rsvpDeadline.toISOString(),
    };

    try {
      if (isCreate) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/events/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          Alert.alert("Error", data.error || "Failed to create event");
          return;
        }

        setEventFormDirty(false);
        Alert.alert("Success", "Event created successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(admin)/home" as const),
          },
        ]);

        const now = new Date();
        setTitle("");
        setDescription("");
        setLocation("");
        setHostedBy("");
        setDateStart(now);
        setTimeStart(now);
        setDateEnd(now);
        setTimeEnd(now);
        setPrice("");
        setCategory([]);
        setAccommodation([]);
        setMaxAttendees("");
        setRsvpDeadline(now);
        setImageUri(null);
      } else if (eventId) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          Alert.alert("Error", data.error || "Failed to update event");
          return;
        }

        setEventFormDirty(false);
        Alert.alert("Success", "Event updated successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(admin)/home" as const),
          },
        ]);
      }
    } catch (error) {
      console.error(
        isCreate ? "Error creating event:" : "Error updating event:",
        error,
      );
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : isCreate
            ? "Failed to create event"
            : "Failed to update event",
      );
    }
  };

  if (!isCreate && loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading event...</Text>
      </View>
    );
  }

  return (
    <EventForm
      title={title}
      setTitle={withDirty(setTitle)}
      description={description}
      setDescription={withDirty(setDescription)}
      location={location}
      setLocation={withDirty(setLocation)}
      dateStart={dateStart}
      setDateStart={withDirty(setDateStart)}
      timeStart={timeStart}
      setTimeStart={withDirty(setTimeStart)}
      dateEnd={dateEnd}
      setDateEnd={withDirty(setDateEnd)}
      timeEnd={timeEnd}
      setTimeEnd={withDirty(setTimeEnd)}
      categoryOptions={categoryOptions}
      accommodationOptions={accommodationOptions}
      category={category}
      accommodation={accommodation}
      onCategoryChange={withDirty(setCategory)}
      onAccommodationChange={withDirty(setAccommodation)}
      price={price}
      setPrice={withDirty(setPrice)}
      hostedBy={hostedBy}
      setHostedBy={withDirty(setHostedBy)}
      maxAttendees={maxAttendees}
      setMaxAttendees={withDirty(setMaxAttendees)}
      rsvpDeadline={rsvpDeadline}
      setRsvpDeadline={withDirty(setRsvpDeadline)}
      imageUri={imageUri}
      setImageUri={withDirty(setImageUri)}
      onSubmit={handleSubmit}
      submitButtonText={isCreate ? "Create Event" : "Update Event"}
      formTitle={isCreate ? "Create New Event" : "Edit Event"}
    />
  );
}
