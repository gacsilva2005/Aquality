import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../components/Screen';
import { Button } from '@/src/components/Button';

export default function PesagemPreTreino() {
  // Captura o tipo de treino se você estiver passando pelo router.push('/pesagemPreTreino?type=Corrida')
  const { type } = useLocalSearchParams<{ type: string }>();
  const workoutType = type || 'Treino Livre';

  const [pesoInput, setPesoInput] = useState('');

  const handleConfirmarPeso = () => {
    // Troca vírgula por ponto para evitar erros de cálculo
    const pesoFormatado = pesoInput.replace(',', '.');
    const pesoNumerico = parseFloat(pesoFormatado);

    if (!pesoInput || isNaN(pesoNumerico) || pesoNumerico <= 0) {
      Alert.alert('Atenção', 'Por favor, insira um peso válido antes de iniciar o treino.');
      return;
    }

    // Aqui você pode futuramente salvar o peso num Contexto ou AsyncStorage
    console.log("Peso inicial registrado:", pesoNumerico);

    // Navega para a tela do cronômetro, repassando o tipo de treino
    router.replace(`/treinoAtivo?type=${workoutType}`);
  };

  return (
    <Screen style={styles.container}>
      {/* Transição suave vindo do modal */}
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* Botão de voltar discreto no topo */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.title}>PESAGEM PRÉ-TREINO</Text>
          <Text style={styles.subtitle}>
            Insira seu peso atual para calcularmos{'\n'}sua taxa de sudorese com precisão.
          </Text>
        </View>

        {/* --- INPUT GIGANTE CENTRALIZADO --- */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.hugeInput}
            keyboardType="numeric"
            value={pesoInput}
            onChangeText={setPesoInput}
            placeholder="00.0"
            placeholderTextColor="#CCC"
            maxLength={5} // Limita para não ficar um número infinito (ex: 120.5)
            autoFocus={true} // Já abre o teclado automaticamente!
          />
          <Text style={styles.unitText}>KG</Text>
        </View>

        {/* --- BOTÃO DE CONFIRMAR --- */}
        <View style={styles.footer}>
          <Button 
            title="INICIAR TREINO" 
            onPress={handleConfirmarPeso} 
            style={{ backgroundColor: theme.colors.primary, height: 60 }}
          />
        </View>

      </View>
    </Screen>
  );
}