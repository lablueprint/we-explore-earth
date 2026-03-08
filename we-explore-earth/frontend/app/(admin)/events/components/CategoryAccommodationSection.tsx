import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./styles";

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
  const [activeModal, setActiveModal] = useState<"category" | "accommodation" | null>(null);
  const [tempSelections, setTempSelections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activeModal === "category") {
      setTempSelections(new Set(category));
    } else if (activeModal === "accommodation") {
      setTempSelections(new Set(accommodation));
    }
  }, [activeModal, category, accommodation]);

  const handleSave = () => {
    if (activeModal === "category") {
      onCategoryChange(Array.from(tempSelections));
    } else if (activeModal === "accommodation") {
      onAccommodationChange(Array.from(tempSelections));
    }
    setActiveModal(null);
  };

  const toggleOption = (option: string) => {
    setTempSelections((prev) => {
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
    <View style={styles.categoryAccommodationContainer}>
      <Text style={styles.categoryAccommodationTitle}>Category & Accommodations</Text>
      <View style={styles.categoryAccommodationButtons}>
        {categoryOptions.length > 0 && (
          <TouchableOpacity
            style={styles.categoryAccommodationButton}
            onPress={() => setActiveModal("category")}
          >
            <Text style={styles.categoryAccommodationButtonText}>Category</Text>
            <View style={styles.categoryAccommodationBadge}>
              <Text style={styles.categoryAccommodationBadgeText}>
                {category.length}/{categoryOptions.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {accommodationOptions.length > 0 && (
          <TouchableOpacity
            style={styles.categoryAccommodationButton}
            onPress={() => setActiveModal("accommodation")}
          >
            <Text style={styles.categoryAccommodationButtonText}>Accommodations</Text>
            <View style={styles.categoryAccommodationBadge}>
              <Text style={styles.categoryAccommodationBadgeText}>
                {accommodation.length}/{accommodationOptions.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={activeModal !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activeModal === "category" ? "Category" : "Accommodations"}
            </Text>
            <ScrollView style={styles.modalOptionsList}>
              {(activeModal === "category" ? categoryOptions : accommodationOptions).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOptionRow}
                  onPress={() => toggleOption(option)}
                >
                  <View
                    style={[
                      styles.modalCheckbox,
                      tempSelections.has(option) && styles.modalCheckboxChecked,
                    ]}
                  >
                    {tempSelections.has(option) && (
                      <Text style={styles.modalCheckmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setActiveModal(null)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave}>
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
