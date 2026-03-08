import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { EventForm } from "./components/EventForm";
import { useEventFormPage } from "./hooks/useEventFormPage";

export default function EventFormPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    form,
    updateField,
    withDirty,
    categoryOptions,
    accommodationOptions,
    loading,
    isCreate,
    handleSubmit,
  } = useEventFormPage(id);

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
      title={form.title}
      setTitle={withDirty((v) => updateField("title", v))}
      description={form.description}
      setDescription={withDirty((v) => updateField("description", v))}
      location={form.location}
      setLocation={withDirty((v) => updateField("location", v))}
      dateStart={form.dateStart}
      setDateStart={withDirty((v) => updateField("dateStart", v))}
      timeStart={form.timeStart}
      setTimeStart={withDirty((v) => updateField("timeStart", v))}
      dateEnd={form.dateEnd}
      setDateEnd={withDirty((v) => updateField("dateEnd", v))}
      timeEnd={form.timeEnd}
      setTimeEnd={withDirty((v) => updateField("timeEnd", v))}
      categoryOptions={categoryOptions}
      accommodationOptions={accommodationOptions}
      category={form.category}
      accommodation={form.accommodation}
      onCategoryChange={withDirty((v) => updateField("category", v))}
      onAccommodationChange={withDirty((v) => updateField("accommodation", v))}
      price={form.price}
      setPrice={withDirty((v) => updateField("price", v))}
      hostedBy={form.hostedBy}
      setHostedBy={withDirty((v) => updateField("hostedBy", v))}
      maxAttendees={form.maxAttendees}
      setMaxAttendees={withDirty((v) => updateField("maxAttendees", v))}
      imageUri={form.imageUri}
      setImageUri={withDirty((v) => updateField("imageUri", v))}
      onSubmit={handleSubmit}
      submitButtonText={isCreate ? "Create Event" : "Update Event"}
      formTitle={isCreate ? "Create New Event" : "Edit Event"}
    />
  );
}
