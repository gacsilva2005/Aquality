import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  TouchableOpacityProps, 
  ActivityIndicator,
  View 
} from 'react-native';
import { styles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;  // <-- Ícone da esquerda
  iconRight?: React.ReactNode; // <-- Ícone da direita
  textColor?: string;
  fontSize?: number;
}

export function Button({ 
  title, 
  isLoading = false, 
  style, 
  iconLeft,   // <-- Puxamos aqui
  iconRight,  // <-- E aqui
  textColor, 
  fontSize,
  ...rest 
}: ButtonProps) {
  
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        (rest.disabled || isLoading) ? styles.disabledContainer : null,
        style 
      ]}
      activeOpacity={0.8}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor || "#FFFFFF"} size="small" />
      ) : (
        <View style={styles.content}>
          
          {/* RENDERIZA O ÍCONE DA ESQUERDA (Se existir) */}
          {iconLeft && <View style={styles.iconLeftContainer}>{iconLeft}</View>}
          
          <Text style={[
            styles.title, 
            textColor ? { color: textColor } : null,
            fontSize ? { fontSize: fontSize } : null
          ]}>
            {title}
          </Text>

          {/* RENDERIZA O ÍCONE DA DIREITA (Se existir) */}
          {iconRight && <View style={styles.iconRightContainer}>{iconRight}</View>}
          
        </View>
      )}
    </TouchableOpacity>
  );
}