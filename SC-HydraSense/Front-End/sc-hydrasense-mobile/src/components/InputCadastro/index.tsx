import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importando os ícones
import { styles } from './styles';
import { theme } from '../../global/themas';

interface InputProps extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
  isPassword?: boolean; // <-- NOVA PROPRIEDADE
}

export function InputCadastro({ label, containerStyle, errorMessage, isPassword, ...rest }: InputProps) {
  // Estado para controlar se a senha está visível ou não
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, errorMessage ? styles.labelError : null]}>
        {label}
      </Text>
      
      {/* Criamos um Wrapper para posicionar o ícone em cima do TextInput */}
      <View style={styles.inputWrapper}>
        <TextInput
          // Se for senha, adicionamos um padding extra na direita para o texto não ficar embaixo do ícone
          style={[styles.input, errorMessage ? styles.inputError : null, isPassword && { paddingRight: 35 }]}
          placeholderTextColor="#B0B0B0"
          // Se for password, ele inverte o showPassword. Se não for, usa o padrão normal.
          secureTextEntry={isPassword ? !showPassword : rest.secureTextEntry}
          {...rest}
        />
        
        {/* Renderiza o botão do olhinho APENAS se isPassword for true */}
        {isPassword && (
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#B0B0B0" 
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}