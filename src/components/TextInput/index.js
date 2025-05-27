import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

const TextInput = ({ 
  label,
  value,
  onChangeText,
  placeholder,
  style,
  mode = "outlined",
  error,
  ...props 
}) => {
  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      mode={mode}
      style={[styles.textInput, style]}
      error={error}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    // Removido marginVertical para usar apenas o spacing do container pai
  },
});

export default TextInput;