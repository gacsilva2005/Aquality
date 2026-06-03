import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../../../components/Screen';
import { Button } from '@/src/components/Button';

export default function PesagemPosTreino() {
    const [pesoInput, setPesoInput] = useState('');
    const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
    const [outrosSintomas, setOutrosSintomas] = useState('');

    const toggleSintoma = (sintoma: string) => {
        if (sintomasSelecionados.includes(sintoma)) {
            setSintomasSelecionados(sintomasSelecionados.filter(s => s !== sintoma));
        } else {
            setSintomasSelecionados([...sintomasSelecionados, sintoma]);
        }
    };

    const { sessaoId, type, seconds, water } = useLocalSearchParams<{
        sessaoId: string;
        type: string;
        seconds: string;
        water: string;
    }>();

    const handleConfirmarPeso = async () => {
        const pesoFormatado = pesoInput.replace(',', '.');
        const pesoNumerico = parseFloat(pesoFormatado);

        if (!pesoInput || isNaN(pesoNumerico) || pesoNumerico <= 0) {
            Alert.alert('Atenção', 'Por favor, insira um peso válido para finalizar a sessão.');
            return;
        }

        if (!sessaoId) {
            Alert.alert('Erro', 'Sessão de treino não encontrada.');
            return;
        }

        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const response = await fetch(`${API_URL}/sessoes-de-treino/${sessaoId}/finalizar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pesoPosTreino: pesoNumerico,
                    hidratacaoMl: Number(water || 0),
                    duracaoSegundos: Number(seconds || 0),
                    sintomas: sintomasSelecionados.length > 0 || outrosSintomas.length > 0 
                        ? JSON.stringify({ selecionados: sintomasSelecionados, outros: outrosSintomas }) 
                        : null,
                }),
            });

            const texto = await response.text();

            if (!response.ok) {
                console.log('Erro backend:', texto);
                Alert.alert('Erro', 'Não foi possível finalizar a sessão de treino.');
                return;
            }

            const resumo = JSON.parse(texto);

            router.replace({
                pathname: '/treinoFinalizado',
                params: {
                    sessaoId,
                    type,
                    seconds,
                    water,
                    pesoPosTreino: pesoNumerico.toString(),
                    taxaSudorese: resumo.taxaSudorese.toString(),
                    balancoHidrico: resumo.balancoHidrico.toString(),
                    statusHidratacao: resumo.statusHidratacao,
                },
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        }
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

                    {/* --- SINTOMAS --- */}
                    <View style={styles.sintomasContainer}>
                        <Text style={styles.sintomasTitle}>SINTOMAS PÓS-TREINO</Text>
                        <View style={styles.sintomasTagsContainer}>
                            {['Vertigem', 'Enjoo', 'Cãibra'].map((sintoma) => {
                                const isSelected = sintomasSelecionados.includes(sintoma);
                                let iconName = 'alert-circle-outline';
                                if (sintoma === 'Vertigem') iconName = 'head-sync-outline';
                                if (sintoma === 'Enjoo') iconName = 'emoticon-sick-outline';
                                if (sintoma === 'Cãibra') iconName = 'lightning-bolt-outline';

                                return (
                                    <TouchableOpacity
                                        key={sintoma}
                                        style={[styles.sintomaTag, isSelected && styles.sintomaTagSelected]}
                                        onPress={() => toggleSintoma(sintoma)}
                                        activeOpacity={0.7}
                                    >
                                        <MaterialCommunityIcons 
                                            name={iconName as any} 
                                            size={16} 
                                            color={isSelected ? theme.colors.primary : '#333333'} 
                                        />
                                        <Text style={[styles.sintomaTagText, isSelected && styles.sintomaTagTextSelected]}>
                                            {sintoma}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        
                        <TextInput
                            style={styles.textArea}
                            placeholder="Outros sintomas..."
                            placeholderTextColor="#999999"
                            multiline
                            numberOfLines={4}
                            value={outrosSintomas}
                            onChangeText={setOutrosSintomas}
                        />
                    </View>

                    {/* --- BOTÃO DE CONFIRMAR --- */}
                    <View style={styles.footer}>
                        <Button
                            title="PRÓXIMO ➔"
                            onPress={handleConfirmarPeso}
                            style={{ backgroundColor: theme.colors.primary, height: 60 }}
                        />
                    </View>

                </View>
            </Screen>
        </Animated.View>
    );
}