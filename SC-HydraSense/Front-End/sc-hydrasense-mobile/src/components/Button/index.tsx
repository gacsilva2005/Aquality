import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  TouchableOpacityProps, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  View // <-- Não esqueça de importar o View
} from 'react-native';
import { styles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  icon?: React.ReactNode; // <-- 1. Nova propriedade opcional para o ícone
}

export function Button({ 
  title, 
  isLoading = false, 
  style, 
  icon, // <-- 2. Puxamos o ícone aqui
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
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        // 3. Container para deixar o ícone e o texto lado a lado
        <View style={styles.content}>
          {/* Se o ícone for passado, ele é renderizado aqui com um margem */}
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}