import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof Feather.glyphMap; // Opcional, pois a senha usa o cadeado
  isPassword?: boolean; 
  errorMessage?: string; 
}

export function Input({
  label,
  iconName,
  isPassword = false,
  errorMessage,
  ...rest
}: CustomInputProps) {
  
  // Controla se o cadeado está aberto ou fechado (e a senha visível)
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, errorMessage ? styles.inputContainerError : null]}>
        
        {/* 1º VEM O INPUT: Ele ocupa a esquerda e o centro */}
        <TextInput
          style={styles.input}
          secureTextEntry={isSecure}
          placeholderTextColor="#94A3B8"
          {...rest} 
        />

        {/* 2º VEM O ÍCONE: Ele é empurrado para a direita */}
        {isPassword ? (
          // Se for senha, o ícone vira o cadeado clicável
          <TouchableOpacity 
            onPress={() => setIsSecure(!isSecure)} 
            style={styles.rightIcon}
            activeOpacity={0.7}
          >
            <Feather
              name={isSecure ? 'lock' : 'unlock'} // Cadeado fechado (seguro) ou aberto (visível)
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        ) : (
          // Se NÃO for senha, mostra o ícone de e-mail (se você tiver passado um)
          iconName && (
            <Feather 
              name={iconName} 
              size={20} 
              color={errorMessage ? "#EF4444" : "#64748B"} 
              style={styles.rightIcon} 
            />
          )
        )}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}