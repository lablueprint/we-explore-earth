import { useState, useEffect } from "react";
import { Plus} from "lucide-react-native";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./styles";
import { typography } from "../../../../../shared/typography/typography";
export interface CategoryAccommodationSectionProps {
  categoryOptions: string[];
  accommodationOptions: string[];
  category: string[];
  accommodation: string[];
  onCategoryChange: (category: string[]) => void;
  onAccommodationChange: (accommodation: string[]) => void;
}

export function CategoryAccommodationSection({
  categoryOptions,
  accommodationOptions,
  category,
  accommodation,
  onCategoryChange,
  onAccommodationChange,
}: CategoryAccommodationSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempCategories, setTempCategories] = useState<Set<string>>(new Set(category));
  const [tempAccommodations, setTempAccommodations] = useState<Set<string>>(new Set(accommodation));

  useEffect(() => {
    if (modalVisible) {
      setTempCategories(new Set(category));
      setTempAccommodations(new Set(accommodation));
    }
  }, [modalVisible, category, accommodation]);

  const handleSave = () => {
    onCategoryChange(Array.from(tempCategories));
    onAccommodationChange(Array.from(tempAccommodations));
    setModalVisible(false);
  };

  const toggleCategory = (option: string) => {
    setTempCategories((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const toggleAccommodation = (option: string) => {
    setTempAccommodations((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  if (categoryOptions.length === 0 && accommodationOptions.length === 0) {
    return null;
  }

return (
  <>

  <TouchableOpacity onPress={() => setModalVisible(true)} >
    <View style={styles.addEventTagWrapper}>
      {/** Header: + Add event tags */}
      <View style={styles.addEventTagHeader} >
        <Plus size={20} color="#7A7A7A" />
        <Text style={[styles.input, styles.inputInsideIcon, typography.body, { color: "#6B6B6B" }]}>
          Add event tags
        </Text>
      </View>
      
      {/** Selected tag pills */}
      {(category.length > 0 || accommodation.length > 0) && (
        <View style={styles.tagContainer}>
          {[...category, ...accommodation].map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </TouchableOpacity>

    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
           <ScrollView >
          <Text style={[styles.modalTitle, typography.h3]}> Category </Text>
         
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOptionRow}
                onPress={() => toggleCategory(option)}
              >
                <View
                  style={[
                    styles.modalCheckbox,
                    tempCategories.has(option) && styles.modalCheckboxChecked,
                  ]}
                >
                  {tempCategories.has(option) && (
                    <Text style={styles.modalCheckmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            

            <Text style={[styles.modalTitle, typography.h3]}> Accommodations</Text>
         
            {accommodationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOptionRow}
                onPress={() => toggleAccommodation(option)}
              >
                <View
                  style={[
                    styles.modalCheckbox,
                    tempAccommodations.has(option) && styles.modalCheckboxChecked,
                  ]}
                >
                  {tempAccommodations.has(option) && (
                    <Text style={styles.modalCheckmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>
);

}
