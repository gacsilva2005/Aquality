import React from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { styles } from './styles';

interface InputProfileProps extends TextInputProps {
  label: string;
  observation?: string;
  style?: any; // Adicione o style aqui para o TS parar de reclamar
}

export function InputProfile({ 
  label, // l minúsculo para bater com a interface
  observation, 
  style, 
  editable, 
  ...rest 
}: InputProfileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* 
          Usamos o array de estilos para combinar o padrão (inputBox)
          com o que vem de fora (style) 
      */}
      <View style={[styles.inputBox, style]}> 
        <TextInput 
          editable={editable}
          style={styles.inputElement} 
          placeholderTextColor="#999"
          keyboardType="numeric"
          {...rest} 
        />
      </View>
      
      {observation && (
        <Text style={styles.observation}>{observation}</Text>
      )}
    </View>
  );
}