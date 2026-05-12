import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native";

import {MapPinPlus,FilePenLine, Plus, DollarSign, ChartPie, AlarmClock, PenLineIcon, PersonStanding, UserRoundPlus,} from "lucide-react-native";
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

function IosDateTimePickerSheet({
  visible,
  onClose,
  value,
  mode,
  display,
  onChange,
}: {
  visible: boolean;
  onClose: () => void;
  value: Date;
  mode: "date" | "time";
  display: "inline" | "spinner";
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.iosPickerModalRoot}>
        <TouchableOpacity
          style={styles.iosPickerDismissTouch}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss date picker"
        />
        <View style={styles.iosPickerSheet}>
          <View style={styles.iosPickerDoneRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.iosPickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={value}
            mode={mode}
            display={display}
            onChange={onChange}
          />
        </View>
      </View>
    </Modal>
  );
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
  const isIOS = Platform.OS === "ios";

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

  return (

    <View style={styles.container}>

      <LinearGradient
          colors={[
            "#afc49e",
            "#F8F9F7", 
            "#afc49e",  
          ]}
          locations={[0, 0.5, 1]}
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
              <Text style={styles.dateText}>{dateStart.toLocaleDateString()} </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDateEndPicker(true)}>
              <Text style={styles.dateText}>{dateEnd.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeColumn}>
            <TouchableOpacity onPress={() => setShowTimeStartPicker(true)}>
              <Text style={styles.dateText}>{timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTimeEndPicker(true)}>
              <Text style={styles.dateText}>{timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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

      {isIOS && (
        <>
          <IosDateTimePickerSheet
            visible={showDateStartPicker}
            onClose={() => setShowDateStartPicker(false)}
            value={dateStart}
            mode="date"
            display="inline"
            onChange={handleDateStartChange}
          />
          <IosDateTimePickerSheet
            visible={showTimeStartPicker}
            onClose={() => setShowTimeStartPicker(false)}
            value={timeStart}
            mode="time"
            display="spinner"
            onChange={handleTimeStartChange}
          />
          <IosDateTimePickerSheet
            visible={showDateEndPicker}
            onClose={() => setShowDateEndPicker(false)}
            value={dateEnd}
            mode="date"
            display="inline"
            onChange={handleDateEndChange}
          />
          <IosDateTimePickerSheet
            visible={showTimeEndPicker}
            onClose={() => setShowTimeEndPicker(false)}
            value={timeEnd}
            mode="time"
            display="spinner"
            onChange={handleTimeEndChange}
          />
        </>
      )}

        <View style={styles.inputWithIcon}>
          <MapPinPlus size={20} color="#7A7A7A" />
          <TextInput
            style={[styles.input, styles.inputInsideIcon, typography.body]}
            placeholder="Add Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#6B6B6B"
          />
        </View>
        
        <View style={styles.inputWithIcon}>
          <PenLineIcon size={20} color="#7A7A7A" style={{ alignSelf: "flex-start", marginTop: 16 }} />
          <TextInput
            style={[styles.input, styles.inputInsideIcon, styles.textArea, typography.body]}
            placeholder="Add Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>
        
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

        <View style={styles.divider} />

        <View style={styles.inputWithIcon}>
          <PersonStanding size={20} color="#7A7A7A" />
          <TextInput
            style={[styles.input, styles.inputInsideIcon, typography.body]}
            placeholder="Hosted By"
            placeholderTextColor="#6B6B6B"
            value={hostedBy}
            onChangeText={setHostedBy}
          />
        </View>


        <Text style = {typography.body}> LOGISTICS</Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.dollarSign, { marginLeft: -10 } ]}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0.00"
            value={formatPriceForDisplay(price || "0")}
            onChangeText={handlePriceChange}
            keyboardType="number-pad"
          />
        </View>

        
        <View style={styles.inputWithIcon}>
          <UserRoundPlus size={20} color="#7A7A7A" />
          <TextInput
            style={[styles.input, styles.inputInsideIcon, typography.body]}
            placeholder="Maximum Capacity"
            placeholderTextColor="#6B6B6B"
            value={maxAttendees}
            onChangeText={handleMaxAttendeesChange}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.launchButton} onPress={onSubmit}>
          <Text style={styles.launchButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </View>
  );
}


