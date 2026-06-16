// src/components/Screen/index.tsx
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Image,          // Mudamos para Image normal
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
  ImageStyle
} from 'react-native';
import { styles } from './styles';

interface ScreenProps {
  children: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  scrollable?: boolean;
  bgImage?: ImageSourcePropType;
  style?: ViewStyle;
  backgroundColor?: string;
  imageStyle?: StyleProp<ImageStyle>; // Estilo para o container da imagem
}

export function Screen({
  children,
  HeaderComponent,
  scrollable = true,
  bgImage,
  backgroundColor,
  style,
  imageStyle,
}: ScreenProps) {

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      bounces={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
    >
      
      {/* --- NOVA CAMADA DE IMAGEM ABSOLUTA (BACKDROP) --- */}
      {bgImage && (
        <View style={[styles.absoluteImageContainer, imageStyle]}> 
          <Image
            source={bgImage}
            style={styles.absoluteImage}
            // resizeMode='cover' garante que ela não estique e corte as bordas se necessário
            resizeMode="cover" 
          />
        </View>
      )}
      {/* ----------------------------------------------- */}

      {/* O HeaderComponent fica FORA do ScrollView para travar no topo */}
      {HeaderComponent && <View style={{ zIndex: 10 }}>{HeaderComponent}</View>}

      {/* Conteúdo principal (agora SEMPRE é uma View normal com fundo transparente) */}
      <View style={[styles.container, style, { backgroundColor: 'transparent' }]}>
        {content}
      </View>

    </KeyboardAvoidingView>
  );
}