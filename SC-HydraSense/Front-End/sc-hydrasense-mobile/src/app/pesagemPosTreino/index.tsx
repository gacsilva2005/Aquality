import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../components/Screen';
import { Button } from '@/src/components/Button';

export default function PesagemPosTreino() {
    const [pesoInput, setPesoInput] = useState('');

    const handleConfirmarPeso = () => {
        // Troca vírgula por ponto para evitar erros
        const pesoFormatado = pesoInput.replace(',', '.');
        const pesoNumerico = parseFloat(pesoFormatado);

        if (!pesoInput || isNaN(pesoNumerico) || pesoNumerico <= 0) {
            Alert.alert('Atenção', 'Por favor, insira um peso válido para finalizar a sessão.');
            return;
        }

        // Futuramente, aqui você salva o peso final e aciona o cálculo da taxa de sudorese
        console.log("Peso final registrado:", pesoNumerico);

        // Navega para a tela de resumo final (Treino Finalizado)
        router.replace('/treinoFinalizado');
    };

    // --- ANIMAÇÃO: ACENDER DAS LUZES (LIGHTS ON) ---
    const themeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(themeAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();
    }, []);

    const animatedBackgroundColor = themeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#0e0e0e', theme.colors.background] // Sai do preto e vai para o branco
    });

    return (
        <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor }}>
            <Screen style={styles.container}>
                <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

                {/* Botão de voltar discreto no topo */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.content}>

                    <View style={styles.header}>
                        <Text style={styles.title}>PESAGEM PÓS-TREINO</Text>
                        <Text style={styles.subtitle}>
                            Insira seu peso final para calcularmos{'\n'}a sua perda de líquidos exata.
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
                            maxLength={5}
                            autoFocus={true} // Teclado sobe automaticamente
                        />
                        <Text style={styles.unitText}>KG</Text>
                    </View>

                    {/* --- BOTÃO DE CONFIRMAR --- */}
                    <View style={styles.footer}>
                        <Button
                            title="VER RESULTADOS"
                            onPress={handleConfirmarPeso}
                            style={{ backgroundColor: theme.colors.primary, height: 60 }}
                        />
                    </View>

                </View>
            </Screen>
        </Animated.View>
    );
}