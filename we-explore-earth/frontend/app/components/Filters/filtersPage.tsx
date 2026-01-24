// STANDARD / THIRD-PARTY IMPORTS
import { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

// LOCAL STYLES
import { styles } from './styles';

// TYPES
type FilterOption = 'All' | 'Upcoming' | 'Past';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FiltersPage({ visible, onClose }: Props) {
  // STATE VARIABLES
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');

  // HANDLERS
  const handleReset = () => {
    setSelectedFilter('All');
  };

  const handleApply = () => {
    // Dummy apply for now (later: pass selectedFilter back to parent)
    onClose();
  };

  // RENDER
  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* FILTER SHEET */}
      <View style={styles.sheet}>
        <Text style={styles.title}>Filters</Text>
        <Text style={styles.subtitle}>Dummy filters (not applied yet)</Text>

        {/* FILTER OPTIONS */}
        {(['All', 'Upcoming', 'Past'] as FilterOption[]).map((option) => {
          const isSelected = selectedFilter === option;

          return (
            <Pressable
              key={option}
              onPress={() => setSelectedFilter(option)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}

        {/* ACTION BUTTONS */}
        <View style={styles.actionsRow}>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>

          <Pressable onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>

        {/* CLOSE */}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}