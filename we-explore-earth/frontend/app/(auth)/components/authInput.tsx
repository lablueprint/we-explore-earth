import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

interface AuthInputProps extends TextInputProps {
  error?: string;
  isPassword?: boolean;
}

export default function AuthInput({ error, isPassword = false, ...props }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  return (
    <View style={styles.inputWrapper}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error ? styles.inputError : null
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#8A8A8A"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && isPasswordHidden}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
          >
            <Feather
              name={isPasswordHidden ? 'eye-off' : 'eye'}
              size={20}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}