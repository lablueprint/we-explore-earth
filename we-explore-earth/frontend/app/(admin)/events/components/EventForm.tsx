import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Image
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { CategoryAccommodationSection } from "./CategoryAccommodationSection";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebase.config";

interface EventFormProps {
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  location: string;
  setLocation: (text: string) => void;
  dateStart: Date;
  setDateStart: (date: Date) => void;
  timeStart: Date;
  setTimeStart: (date: Date) => void;
  dateEnd: Date;
  setDateEnd: (date: Date) => void;
  timeEnd: Date;
  setTimeEnd: (date: Date) => void;
  categoryOptions: string[];
  accommodationOptions: string[];
  category: string[];
  accommodation: string[];
  onCategoryChange: (category: string[]) => void;
  onAccommodationChange: (accommodation: string[]) => void;
  price: string;
  setPrice: (text: string) => void;
  hostedBy: string;
  setHostedBy: (text: string) => void;
  maxAttendees: string;
  setMaxAttendees: (text: string) => void;
  rsvpDeadline: Date;
  setRsvpDeadline: (date: Date) => void;
  imageUri: string|null;
  setImageUri: (text: string | null) => void;
  onSubmit: () => void;
  submitButtonText: string;
  formTitle: string;
}

export function EventForm({
  title,
  setTitle,
  description,
  setDescription,
  location,
  setLocation,
  dateStart,
  setDateStart,
  timeStart,
  setTimeStart,
  dateEnd,
  setDateEnd,
  timeEnd,
  setTimeEnd,
  categoryOptions,
  accommodationOptions,
  category,
  accommodation,
  onCategoryChange,
  onAccommodationChange,
  price,
  setPrice,
  hostedBy,
  setHostedBy,
  onSubmit,
  maxAttendees,
  setMaxAttendees,
  rsvpDeadline,
  setRsvpDeadline,
  imageUri,
  setImageUri,
  submitButtonText,
  formTitle,
}: EventFormProps) {
  const [showDateStartPicker, setShowDateStartPicker] = useState(false);
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [showTimeEndPicker, setShowTimeEndPicker] = useState(false);
  const [showRsvpDeadlinePicker, setShowRsvpDeadlinePicker] = useState(false);

  const isAndroid = Platform.OS === "android";

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatPriceForDisplay = (cents: string): string => {
    const padded = cents.padStart(3, "0");
    const dollars = padded.slice(0, -2);
    const centsPart = padded.slice(-2);
    return `${parseInt(dollars, 10)}.${centsPart}`;
  };

  const handleDateStartChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (isAndroid) {
      setShowDateStartPicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (selectedDate) {
      setDateStart(selectedDate);
    }
  };

  const handleTimeStartChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (isAndroid) {
      setShowTimeStartPicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (selectedDate) {
      setTimeStart(selectedDate);
    }
  };

  const handleDateEndChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (isAndroid) {
      setShowDateEndPicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (selectedDate) {
      setDateEnd(selectedDate);
    }
  };

  const handleTimeEndChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (isAndroid) {
      setShowTimeEndPicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (selectedDate) {
      setTimeEnd(selectedDate);
    }
  };

  const handlePriceChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const trimmed = numericValue.replace(/^0+/, "") || "0";
    setPrice(trimmed);
  };

  const handleMaxAttendeesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setMaxAttendees(numericValue);
  };  

 const handleRsvpDeadlineChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (isAndroid) {
      setShowRsvpDeadlinePicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (selectedDate) {
      setRsvpDeadline(selectedDate);
    }
  };  

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

// const uploadImageAsync = async (uri: string) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();

//   const imageRef = ref(
//     storage,
//     `events/${Date.now()}.jpg`
//   );

//   await uploadBytes(imageRef, blob);
//   return await getDownloadURL(imageRef);
// };  

// const handleSubmit = async () => {
//   let imageUrl = null;
//   if (imageUri) {
//     imageUrl = await uploadImageAsync(imageUri);
//   }
//   onSubmit ();
// }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{formTitle}</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Start Date</Text>
        {isAndroid ? (
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateStartPicker(true)}
          >
            <Text>{formatDate(dateStart)}</Text>
          </TouchableOpacity>
        ) : null}
        {(isAndroid && showDateStartPicker) || !isAndroid ? (
          <DateTimePicker
            value={dateStart}
            mode="date"
            display="default"
            onChange={handleDateStartChange}
          />
        ) : null}

        <Text style={styles.label}>Start Time</Text>
        {isAndroid ? (
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimeStartPicker(true)}
          >
            <Text>{formatTime(timeStart)}</Text>
          </TouchableOpacity>
        ) : null}
        {(isAndroid && showTimeStartPicker) || !isAndroid ? (
          <DateTimePicker
            value={timeStart}
            mode="time"
            display="default"
            onChange={handleTimeStartChange}
          />
        ) : null}

        <Text style={styles.label}>End Date</Text>
        {isAndroid ? (
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDateEndPicker(true)}
          >
            <Text>{formatDate(dateEnd)}</Text>
          </TouchableOpacity>
        ) : null}
        {(isAndroid && showDateEndPicker) || !isAndroid ? (
          <DateTimePicker
            value={dateEnd}
            mode="date"
            display="default"
            onChange={handleDateEndChange}
          />
        ) : null}

        <Text style={styles.label}>End Time</Text>
        {isAndroid ? (
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimeEndPicker(true)}
          >
            <Text>{formatTime(timeEnd)}</Text>
          </TouchableOpacity>
        ) : null}
        {(isAndroid && showTimeEndPicker) || !isAndroid ? (
          <DateTimePicker
            value={timeEnd}
            mode="time"
            display="default"
            onChange={handleTimeEndChange}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Hosted By"
          value={hostedBy}
          onChangeText={setHostedBy}
        />

        <View style={styles.priceContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0.00"
            value={formatPriceForDisplay(price || "0")}
            onChangeText={handlePriceChange}
            keyboardType="number-pad"
          />
        </View>

        <CategoryAccommodationSection
          categoryOptions={categoryOptions}
          accommodationOptions={accommodationOptions}
          category={category}
          accommodation={accommodation}
          onCategoryChange={onCategoryChange}
          onAccommodationChange={onAccommodationChange}
        />
         

         <TextInput
          style={styles.input}
          placeholder="Maximum Number of Attendees"
          value={maxAttendees}
          onChangeText={handleMaxAttendeesChange}
          keyboardType="number-pad" 
        />          

        <Text style={styles.label}>RSVP Deadline</Text>
        {isAndroid ? (
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowRsvpDeadlinePicker(true)}
          >
            <Text>{formatDate(rsvpDeadline)}</Text>
          </TouchableOpacity>
        ) : null}
        {(isAndroid && showRsvpDeadlinePicker) || !isAndroid ? (
          <DateTimePicker
            value={rsvpDeadline}
            mode="date"
            display="default"
            maximumDate={dateStart}
            onChange={handleRsvpDeadlineChange}
          />
        ) : null}

        <Text style={styles.label}>Cover Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text>{imageUri ? "Change photo" : "Add photo"}</Text>
        </TouchableOpacity>
        {imageUri && (
          <>
           <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
              />
          <TouchableOpacity onPress={() => setImageUri(null)}>
           <Text style={styles.removeImageText}>Remove photo</Text>
          </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.buttonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
