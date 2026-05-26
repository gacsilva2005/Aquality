import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../components/Screen';
import { Button } from '@/src/components/Button';
import Constants from 'expo-constants';

export default function PesagemPreTreino() {
  // Captura o tipo de treino se você estiver passando pelo router.push('/pesagemPreTreino?type=Corrida')
  const { type } = useLocalSearchParams<{ type: string }>();
  const workoutType = type || 'Treino Livre';

  const [pesoInput, setPesoInput] = useState('');

    const handleConfirmarPeso = async () => {

        const pesoFormatado = pesoInput.replace(',', '.');
        const pesoNumerico = parseFloat(pesoFormatado);

        if (!pesoInput || isNaN(pesoNumerico) || pesoNumerico <= 0) {
            Alert.alert('Atenção', 'Por favor, insira um peso válido antes de iniciar o treino.');
            return;
        }

        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            console.log("URL:", `${API_URL}/sessoes-de-treino/iniciar`);
            const response = await fetch(`${API_URL}/sessoes-de-treino/iniciar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    atletaId: 1,
                    modalidade: workoutType,
                    pesoPreTreino: pesoNumerico,
                }),
            });

            const texto = await response.text();

            console.log("STATUS:", response.status);
            if (!response.ok) {
                Alert.alert('Erro', 'Não foi possível iniciar o treino.');
                return;
            }

            const sessao = JSON.parse(texto);

            if (!response.ok) {
                throw new Error('Erro ao iniciar treino');
            }

            console.log("Sessão criada:", sessao);

            // Navega para o treino
            router.replace({
                pathname: '/treinoAtivo',
                params: {
                    type: workoutType,
                    sessaoId: sessao.id.toString(),
                },
            });

        } catch (error) {
            console.error(error);

            Alert.alert(
                'Erro',
                'Não foi possível iniciar o treino.'
            );
        }
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