import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../../contexts/UserContext';
import { Screen } from '../../../../components/Screen';

const getWorkoutIcon = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'cardio': return 'heart-pulse';
        case 'musculação': return 'dumbbell';
        default:           return 'timer';
    }
};

export default function TreinoAtivo() {
    const { type, sessaoId, descontoKitGramas } = useLocalSearchParams<{
        type: string;
        sessaoId: string;
        descontoKitGramas?: string;
    }>();
    const workoutType = type || 'Treino Livre';
    const iconName = getWorkoutIcon(workoutType);

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [waterConsumed, setWaterConsumed] = useState(0);
    const [isManualModalVisible, setIsManualModalVisible] = useState(false);
    const [manualInputValue, setManualInputValue] = useState('');

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive) {
            interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isActive]);

    // --- ANIMAÇÃO ENCERRAR ---
    const fillAnimation = useRef(new Animated.Value(0)).current;
    const TEMPO_PRESSAO = 1500;

    const handlePressIn = () => {
        Animated.timing(fillAnimation, {
            toValue: 1,
            duration: TEMPO_PRESSAO,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                if (!sessaoId) {
                    console.error('Sessão não encontrada no TreinoAtivo');
                    return;
                }

                router.push({
                    pathname: '/urineColor',
                    params: {
                        sessaoId:          sessaoId.toString(),
                        type:              workoutType,
                        seconds:           seconds.toString(),
                        water:             waterConsumed.toString(),
                        descontoKitGramas: descontoKitGramas ?? '0',
                    },
                });
            }
        });
    };

    const handlePressOut = () => {
        Animated.timing(fillAnimation, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    };

    // --- ANIMAÇÃO LIGHTS OUT ---
    const themeAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(themeAnimation, { toValue: 1, duration: 1000, useNativeDriver: false }).start();
    }, []);

    const animatedBackgroundColor = themeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FAFAFA', '#0e0e0e'],
    });

    const widthInterpolate = fillAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // --- HIDRATAÇÃO ---
    const handleAddWater = (amount: number) => setWaterConsumed((prev) => prev + amount);

    const handleManualWater = () => setIsManualModalVisible(true);

    const confirmManualWater = () => {
        const amount = parseInt(manualInputValue, 10);
        if (!isNaN(amount) && amount > 0) handleAddWater(amount);
        setManualInputValue('');
        setIsManualModalVisible(false);
    };

    const cancelManualWater = () => {
        setManualInputValue('');
        setIsManualModalVisible(false);
    };

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleToggleTimer = () => setIsActive(!isActive);

    return (
        <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor }}>
            <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

            <LinearGradient colors={['rgba(200, 16, 46, 0.4)', 'transparent']} style={styles.topGlow} pointerEvents="none" />
            <LinearGradient colors={['transparent', 'rgba(200, 16, 46, 0.4)']} style={styles.bottomGlow} pointerEvents="none" />

            <Screen style={styles.container}>

                {/* BADGE */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name={iconName as any} size={20} color={theme.colors.primary} />
                        <Text style={styles.badgeText}>{workoutType.toUpperCase()}</Text>
                    </View>
                </View>

                {/* CRONÔMETRO */}
                <View style={styles.timerContainer}>
                    <Text style={[styles.timerText, !isActive && styles.timerPaused]}>
                        {formatTime(seconds)}
                    </Text>
                    <Text style={styles.timerSubtitle}>TEMPO DECORRIDO</Text>
                </View>

                {/* CONTROLES */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.controlButton, !isActive && styles.controlButtonPlay]}
                        onPress={handleToggleTimer}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons
                            name={isActive ? 'pause' : 'play'}
                            size={50}
                            color={isActive ? theme.colors.primary : '#0e0e0e'}
                        />
                    </TouchableOpacity>
                </View>

                {/* HIDRATAÇÃO */}
                <Animated.View style={{ ...styles.hydrationCard, backgroundColor: animatedBackgroundColor + 'rgb(17, 17, 17)' }}>
                    <LinearGradient colors={['transparent', 'rgba(204, 9, 41, 0.72)']} style={styles.bottomGlow} pointerEvents="none" />
                    <View style={styles.hydrationHeader}>
                        <MaterialCommunityIcons name="cup-water" size={16} color={theme.colors.textLight} />
                        <Text style={styles.hydrationTitle}>REGISTRAR HIDRATAÇÃO</Text>
                    </View>
                    <View style={styles.hydrationButtonsRow}>
                        <TouchableOpacity style={styles.waterButtonRed} onPress={() => handleAddWater(250)} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="water-outline" size={40} color="#FFF" />
                            <Text style={styles.waterButtonText}>+250</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.waterButtonRed} onPress={() => handleAddWater(500)} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="water-outline" size={40} color="#FFF" />
                            <Text style={styles.waterButtonText}>+500</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.waterButtonManual} onPress={handleManualWater} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="pencil-outline" size={40} color="#CCC" />
                            <Text style={styles.waterButtonTextManual}>MANUAL</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.hydrationFooter}>
                        <MaterialCommunityIcons name="water-outline" size={16} color="#CCC" />
                        <Text style={styles.hydrationTotalText}>
                            Total Ingerido: <Text style={styles.hydrationTotalBold}>{waterConsumed} ml</Text>
                        </Text>
                    </View>
                </Animated.View>

                {/* ENCERRAR */}
                <View style={styles.footer}>
                    <Pressable style={styles.finishButtonContainer} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                        <Animated.View style={[styles.finishButtonFill, { width: widthInterpolate }]} />
                        <View style={styles.finishButtonContent}>
                            <MaterialCommunityIcons name="stop-circle-outline" size={30} color={theme.colors.primary} />
                            <Text style={styles.finishButtonText}>ENCERRAR TREINO</Text>
                        </View>
                    </Pressable>
                    <Text style={styles.holdText}>Pressione e segure para encerrar</Text>
                </View>

                {/* MODAL MANUAL */}
                <Modal animationType="fade" transparent visible={isManualModalVisible} onRequestClose={cancelManualWater}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Hidratação Manual</Text>
                            <Text style={styles.modalSubtitle}>Digite a quantidade exata em ml</Text>
                            <TextInput
                                style={styles.modalInput}
                                keyboardType="numeric"
                                placeholder="Ex: 350"
                                placeholderTextColor="#666"
                                value={manualInputValue}
                                onChangeText={setManualInputValue}
                                maxLength={4}
                            />
                            <View style={styles.modalButtonsRow}>
                                <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelManualWater}>
                                    <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmManualWater}>
                                    <Text style={styles.modalButtonConfirmText}>Adicionar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </Screen>
        </Animated.View>
    );
}