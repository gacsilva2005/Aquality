import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { styles } from './styles';

// 1. REMOVEMOS A INTERFACE HeaderProps. 
// O Header não precisa mais receber nada de fora.

export function Header() {
  // 2. PUXAMOS A FOTO DIRETO DO CONTEXTO GLOBAL
  const { profileImage } = useUser();

  // 3. USAMOS A profileImage NO LUGAR DO userPhoto
  const imageSource = profileImage 
    ? { uri: profileImage } 
    : require('../../assets/images/logo.png');

  return (
    <View style={styles.container}>
      <View style={styles.userArea}>
        <Image 
          source={imageSource} 
          style={styles.avatar} 
        />
        <Text style={styles.title}>HYDRASENSE</Text>
      </View>

      <TouchableOpacity activeOpacity={0.7}>
        <MaterialCommunityIcons name="cog-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}