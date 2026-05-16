import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../components/Screen';
import { Button } from '@/src/components/Button';

export default function TreinoFinalizado() {
    const handleRegistrarUrina = () => {
        // Futuramente, aqui vai navegar para a tela de registro de urina
        console.log("Navegar para registro de urina");
    };

    const handlePerfoarmance = () => {
        // Navega para a tela de desempenho
        router.push('/performance');
    };

    const handlePularEtapa = () => {
        // Volta direto para o Dashboard
        router.replace('/dashboard');
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
                
                <Stack.Screen options={{ headerShown: false, animation: 'fade'}} />

                <View style={styles.content}>

                    <Animated.View style={[styles.iconContainer, { backgroundColor: animatedBackgroundColor }]}>
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={90}
                            color={theme.colors.primary}
                        />
                    </Animated.View>

                    <Text style={styles.title}>TREINO FINALIZADO!</Text>
                    <Text style={styles.subtitle}>
                        Deseja registrar sua urina agora{'\n'}para precisão máxima na{'\n'}recuperação?
                    </Text>

                    {/* --- ADICIONADO: CARDS DE RESUMO --- */}
                    <Animated.View style={[styles.summaryCardsContainer, { backgroundColor: animatedBackgroundColor }]}>
                        {/* Card Tempo */}
                        <View style={styles.summaryCard}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="timer-outline" size={16} color={theme.colors.primary} />
                                <Text style={styles.cardTitle}>TEMPO{'\n'}TOTAL</Text>
                            </View>
                            <View style={styles.cardValueRow}>
                                {/* Valores fictícios por enquanto. Depois você puxa do estado! */}
                                <Text style={styles.cardValueMain}>01:24</Text>
                                <Text style={styles.cardValueSub}>:05</Text>
                            </View>
                        </View>

                        {/* Card Água */}
                        <View style={styles.summaryCard}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="water-outline" size={16} color={theme.colors.primary} />
                                <Text style={styles.cardTitle}>ÁGUA{'\n'}CONSUMIDA</Text>
                            </View>
                            <View style={styles.cardValueRow}>
                                <Text style={styles.cardValueMain}>1.2</Text>
                                <Text style={styles.cardValueSub}>L</Text>
                            </View>
                        </View>
                    </Animated.View>
                    {/* ---------------------------------- */}

                    <Animated.View style={[styles.buttonsContainer, {backgroundColor: animatedBackgroundColor}]}>
                        <Button
                            onPress={handleRegistrarUrina}
                            title="REGISTRAR URINA"
                            style= {{ backgroundColor: theme.colors.primary, height: 60}}
                        />

                        <Button
                            onPress={handlePerfoarmance}
                            title="VER DESEMPENHO EM PERFORMANCE"
                            style= {{ backgroundColor: theme.colors.primary, height: 60}}
                        />

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handlePularEtapa}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>PULAR ETAPA</Text>
                            <MaterialCommunityIcons name="arrow-right" size={15} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={styles.footerText}>
                        SESSÃO GRAVADA • DATA LOG #676767
                    </Text>

                </View>
            </Screen>
        </Animated.View>
    );
}