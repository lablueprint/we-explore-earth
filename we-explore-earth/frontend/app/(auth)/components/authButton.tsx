import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styles } from './styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AuthButton({ title, onPress, disabled = false, isLoading = false }: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : styles.buttonActive]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}