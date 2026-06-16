import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { styles } from './styles';

// Herda ViewProps para você poder passar margin, padding, etc., direto na chamada
interface DividerProps extends ViewProps {
  text?: string; 
}

export function Divider({ text, style, ...rest }: DividerProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      {/* Primeira metade da linha */}
      <View style={styles.line} />
      
      {/* Se existir texto, renderiza ele no meio */}
      {text && <Text style={styles.text}>{text}</Text>}
      
      {/* Segunda metade da linha (ou a linha inteira se não houver texto) */}
      <View style={styles.line} />
    </View>
  );
}