import { useCallback, useState, useEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import { Alert } from "react-native";
import type { EventFormState, FirestoreTimestamp } from "@shared/types/event";
import { useEventFormDirty } from "../../EventFormDirtyContext";
import {
  apiResponseToEvent,
  combineDateAndTime,
  timestampToDate,
} from "@/utils/eventUtils";
import { usePendingUpdatedAdminEvent } from "../../PendingUpdatedAdminEventContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getEmptyFormState(): EventFormState {
  const now = new Date();
  return {
    title: "",
    description: "",
    dateStart: now,
    timeStart: now,
    dateEnd: now,
    timeEnd: now,
    location: "",
    price: "",
    hostedBy: "",
    category: [],
    accommodation: [],
    maxAttendees: "",
    imageUri: null,
  };
}

function splitTimestamp(
  timestamp: FirestoreTimestamp | Date | string | number | null | undefined
): { date: Date; time: Date } {
  const d = timestampToDate(timestamp);
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const time = new Date(d);
  time.setFullYear(1970, 0, 1);
  return { date, time };
}

export function useEventFormPage(id: string | undefined) {
  const router = useRouter();
  const navigation = useNavigation();
  const { setEventFormDirty, isEventFormDirty } = useEventFormDirty();
  const { setPendingUpdatedEvent } = usePendingUpdatedAdminEvent();

  const isCreate = id === "new" || !id;
  const eventId = isCreate ? null : (id as string);

  const [form, setForm] = useState<EventFormState>(getEmptyFormState);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [accommodationOptions, setAccommodationOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isCreate);

  const resetForm = useCallback(() => {
    setEventFormDirty(false);
    setForm(getEmptyFormState());
    setLoading(false);
  }, [setEventFormDirty]);

  const markDirty = useCallback(() => {
    if (isCreate) setEventFormDirty(true);
  }, [isCreate, setEventFormDirty]);

  const withDirty = useCallback(
    <T,>(setter: (value: T) => void) =>
      (value: T) => {
        setter(value);
        markDirty();
      },
    [markDirty]
  );

  // --- Navigation effects: confirm leave, reset on blur, reset when switching to create ---
  useEffect(() => {
    const unsubBeforeRemove = navigation.addListener("beforeRemove", (e) => {
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
    return unsubBeforeRemove;
  }, [navigation, isCreate, isEventFormDirty]);

  useEffect(() => {
    const unsubBlur = navigation.addListener("blur", resetForm);
    return unsubBlur;
  }, [navigation, resetForm]);

  useEffect(() => {
    if (id === "new" || !id) resetForm();
  }, [id, resetForm]);

  // --- Fetch event when editing ---
  useEffect(() => {
    if (isCreate || !eventId) return;

    (async () => {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
          method: "GET",
        });

        if (!response.ok) {
          Alert.alert(
            "Error",
            response.status === 404 ? "Event not found" : "Failed to fetch event"
          );
          setLoading(false);
          return;
        }

        const event: Record<string, unknown> = await response.json();

        if (!event || (!event.title && !event.id)) {
          Alert.alert("Error", "Invalid event data received");
          setLoading(false);
          return;
        }

        const missing: string[] = [];
        if (!event.timeStart) missing.push("timeStart");
        if (!event.timeEnd) missing.push("timeEnd");
        if ((event.maxAttendees as number) == null) missing.push("maxAttendees");

        if (missing.length > 0) {
          Alert.alert(
            "Error",
            `Event data is missing required fields: ${missing.join(", ")}. Cannot edit this event.`
          );
          setLoading(false);
          return;
        }

        const start = splitTimestamp(event.timeStart as FirestoreTimestamp | number);
        const end = splitTimestamp(event.timeEnd as FirestoreTimestamp | number);

        setForm({
          title: (event.title as string) || "",
          description: (event.description as string) || "",
          location: (event.location as string) || "",
          dateStart: start.date,
          timeStart: start.time,
          dateEnd: end.date,
          timeEnd: end.time,
          price:
            event.price != null ? String(event.price) : "0",
          hostedBy: (event.hostedBy as string) || "",
          maxAttendees:
            event.maxAttendees != null ? String(event.maxAttendees) : "",
          category: Array.isArray(event.category) ? event.category : [],
          accommodation: Array.isArray(event.accommodation)
            ? event.accommodation
            : [],
          imageUri: null,
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        Alert.alert(
          "Error",
          error instanceof Error ? error.message : "Failed to fetch event"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId, isCreate]);

  // --- Fetch categories and accommodations ---
  useEffect(() => {
    (async () => {
      try {
        const [categoriesRes, accommodationsRes] = await Promise.all([
          fetch(`${API_URL}/config/categories`, { method: "GET" }),
          fetch(`${API_URL}/config/accommodations`, { method: "GET" }),
        ]);
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategoryOptions(Array.isArray(data.category) ? data.category : []);
        } else {
          console.error("Failed to fetch categories");
        }
        if (accommodationsRes.ok) {
          const data = await accommodationsRes.json();
          setAccommodationOptions(
            Array.isArray(data.accommodation) ? data.accommodation : []
          );
        } else {
          console.error("Failed to fetch accommodations");
        }
      } catch (e) {
        console.error("Unable to get categories/accommodations", e);
      }
    })();
  }, []);

  // --- Submit handlers ---
  const handleSubmit = useCallback(async () => {
    const { title, description, location } = form;
    if (!title || !description || !location) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const timeStart = combineDateAndTime(form.dateStart, form.timeStart);
    const timeEnd = combineDateAndTime(form.dateEnd, form.timeEnd);
    const payload = {
      title,
      description,
      location,
      timeStart: timeStart.toISOString(),
      timeEnd: timeEnd.toISOString(),
      price: form.price,
      hostedBy: form.hostedBy,
      category: form.category,
      accommodation: form.accommodation,
      maxAttendees: form.maxAttendees,
    };

    const onCreateSuccess = () => {
      setEventFormDirty(false);
      Alert.alert("Success", "Event created successfully!", [
        { text: "OK", onPress: () => router.replace("/(admin)/home" as const) },
      ]);
      setForm(getEmptyFormState());
    };

    const onError = (msg: string) => Alert.alert("Error", msg);

    try {
      if (isCreate) {
        const response = await fetch(`${API_URL}/events/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          onError((data.error as string) || "Failed to create event");
          return;
        }
        onCreateSuccess();
      } else if (eventId) {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          onError((data.error as string) || "Failed to update event");
          return;
        }
        setEventFormDirty(false);
        const updated = apiResponseToEvent(data as Record<string, unknown>);
        if (updated) {
          setPendingUpdatedEvent(updated);
          router.replace("/(admin)/home" as const);
        } else {
          Alert.alert("Success", "Event updated successfully!", [
            { text: "OK", onPress: () => router.replace("/(admin)/home" as const) },
          ]);
        }
      }
    } catch (error) {
      console.error(
        isCreate ? "Error creating event:" : "Error updating event:",
        error
      );
      onError(
        error instanceof Error
          ? error.message
          : isCreate
            ? "Failed to create event"
            : "Failed to update event"
      );
    }
  }, [
    form,
    isCreate,
    eventId,
    setEventFormDirty,
    router,
    setPendingUpdatedEvent,
  ]);

  const updateField = useCallback(<K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    form,
    updateField,
    withDirty,
    categoryOptions,
    accommodationOptions,
    loading,
    isCreate,
    handleSubmit,
  };
}
