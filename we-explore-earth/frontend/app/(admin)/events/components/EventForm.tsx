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

import {MapPinPlus,FilePenLine, Plus, DollarSign, ChartPie, AlarmClock,} from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { CategoryAccommodationSection } from "./CategoryAccommodationSection";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebase.config";
import { LinearGradient } from "expo-linear-gradient";
import { typography } from "../../../../../shared/typography/typography";

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
  imageUri,
  setImageUri,
  submitButtonText,
  formTitle,
}: EventFormProps) {
  const [showDateStartPicker, setShowDateStartPicker] = useState(false);
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [showDateEndPicker, setShowDateEndPicker] = useState(false);
  const [showTimeEndPicker, setShowTimeEndPicker] = useState(false);

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

      <LinearGradient
          colors={[
            "#afc49e",  // green (top-left)
            "#F8F9F7",  // light/blank (middle)
            "#afc49e",  // green again (bottom-right)
          ]}
          locations={[0, 0.5, 1]} // controls where each color sits
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" >

      <TouchableOpacity onPress={pickImage} style={styles.coverContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.coverImage}
            resizeMode="cover"
          /> 
        ) : (
          <Text style={typography.body}>Add photo</Text>
        )}

        {imageUri && (
          <TouchableOpacity style={styles.editButton} onPress={pickImage} >
            <Text style={{ fontSize: 16 }}>✎</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity onPress={() => setImageUri(null)}>
          <Text style={styles.removeImageText}>Remove photo</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={[styles.input, typography.h2]}
        placeholder="Event title"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.dateCard}>
        <View style={styles.dateGrid}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            <View style={styles.dottedLine} />
            <View style={styles.dot} />
          </View>

          <View style={styles.dateLabels}>
            <Text style={styles.dateLabel}>From</Text>
            <Text style={styles.dateLabel}>To</Text>
          </View>

          <View style={styles.dateColumn}>
            <TouchableOpacity onPress={() => setShowDateStartPicker(true)}>
              <Text style={styles.dateText}>Start Date</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDateEndPicker(true)}>
              <Text style={styles.dateText}>End Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeColumn}>
            <TouchableOpacity onPress={() => setShowTimeStartPicker(true)}>
              <Text style={styles.dateText}>Time</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTimeEndPicker(true)}>
              <Text style={styles.dateText}>Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isAndroid && showDateStartPicker && (
        <DateTimePicker value={dateStart} mode="date" display="default" onChange={handleDateStartChange}/>
      )}

      {isAndroid && showTimeStartPicker && (
        <DateTimePicker value={timeStart} mode="time" display="default" onChange={handleTimeStartChange}/>
      )}

      {isAndroid && showDateEndPicker && (
        <DateTimePicker value={dateEnd} mode="date" display="default" onChange={handleDateEndChange} />
      )}

      {isAndroid && showTimeEndPicker && (
        <DateTimePicker value={timeEnd} mode="time" display="default" onChange={handleTimeEndChange} />
      )}
    
        <View style={styles.inputWithIcon}>
          <MapPinPlus size={20} color="#7A7A7A" />
          <TextInput
            style={[styles.input, styles.inputInsideIcon, typography.body]}
            placeholder="Add Location"
            placeholderTextColor="#6B6B6B"
          />
        </View>
      
        <TextInput
          style={[styles.input, styles.textArea, typography.body]}
          placeholder="Add Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        
        <View style= {[styles.input]}>
          <CategoryAccommodationSection
            categoryOptions={categoryOptions}
            accommodationOptions={accommodationOptions}
            category={category}
            accommodation={accommodation}
            onCategoryChange={onCategoryChange}
            onAccommodationChange={onAccommodationChange}
          />
        </View>



        {/* <Text style={styles.label}>Start Date</Text>
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
        ) : null} */}

        <View style={styles.divider} />

        <TextInput
          style={[styles.input, typography.body]}
          placeholder="Hosted By"
          value={hostedBy}
          onChangeText={setHostedBy}
        />

        <Text style = {typography.body}> LOGISTICS</Text>

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

         <TextInput
          style={[styles.input, typography.body]}
          placeholder="Maximum Capacity"
          value={maxAttendees}
          onChangeText={handleMaxAttendeesChange}
          keyboardType="number-pad" 
        />          

        <TouchableOpacity style={styles.launchButton} onPress={onSubmit}>
          <Text style={styles.launchButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </View>
  );
}


//TODO  Fix dates
//TODO Emojis