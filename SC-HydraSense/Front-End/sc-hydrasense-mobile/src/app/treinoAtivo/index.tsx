import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable, Animated, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router'; // Adicionado o Stack aqui
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { LinearGradient } from 'expo-linear-gradient';

// Importando o seu componente de Screen (ajuste o caminho se for diferente)
import { Screen } from '../../components/Screen';

const getWorkoutIcon = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'corrida': return 'run';
        case 'ciclismo': return 'bike';
        case 'natação': return 'swim';
        case 'futebol': return 'soccer';
        case 'musculação': return 'dumbbell';
        default: return 'timer';
    }
};

export default function TreinoAtivo() {
    const { type } = useLocalSearchParams<{ type: string }>();
    const workoutType = type || 'Treino Livre';
    const iconName = getWorkoutIcon(workoutType);

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [waterConsumed, setWaterConsumed] = useState(0);
    // --- ESTADOS DO MODAL MANUAL ---
    const [isManualModalVisible, setIsManualModalVisible] = useState(false);
    const [manualInputValue, setManualInputValue] = useState('');

    useEffect(() => {
      // Pedimos para o TS pegar o tipo de retorno exato da função nativa
      let interval: ReturnType<typeof setInterval>; 

      if (isActive) {
          interval = setInterval(() => {
              setSeconds((prev) => prev + 1);
          }, 1000);
      }
      
      // Colocamos um 'if' por segurança, para ele só limpar se o intervalo existir
      return () => {
          if (interval) clearInterval(interval);
      };
  }, [isActive]);
    
    // --- ANIMAÇÃO DO BOTÃO ENCERRAR ---
    // Começa em 0 (vazio)
    const fillAnimation = useRef(new Animated.Value(0)).current;
    const TEMPO_PRESSAO = 1500; // 1.5 segundos segurando para encerrar

    const handlePressIn = () => {
        // Quando o usuário encosta o dedo, a barra começa a encher até o 1
        Animated.timing(fillAnimation, {
            toValue: 1,
            duration: TEMPO_PRESSAO,
            useNativeDriver: false, // Falso porque vamos animar a largura (width)
        }).start(({ finished }) => {
            // Se a animação chegou até o final (o usuário não soltou o dedo)
            if (finished) {
                router.replace({
                    pathname: './treinoFinalizado',
                    params: {
                        esporte: workoutType,
                        tempoSegundos: seconds.toString(),
                        hidratacaoMl: waterConsumed.toString(),
                    }
                }); // Volta para o Dashboard!
            }
        });
    };

    const handlePressOut = () => {
        // Se ele soltar o dedo antes do tempo, a barra esvazia rapidamente de volta pro 0
        Animated.timing(fillAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    // --- NOVA ANIMAÇÃO: APAGAR DAS LUZES (LIGHTS OUT) ---
    const themeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Dispara a animação de cor assim que a tela abre
        Animated.timing(themeAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false, // PRECISA ser false quando animamos cores
        }).start();
    }, []);

    // Interpolação: Transforma o 0 e 1 em Branco e Preto
    const animatedBackgroundColor = themeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FAFAFA', '#0e0e0e']
    });

    // Transforma o número de 0 a 1 em uma porcentagem de 0% a 100% para a largura
    const widthInterpolate = fillAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // (PODE APAGAR AQUELA FUNÇÃO ANTIGA handleFinishWorkout QUE TINHA O ALERT)

    // --- FUNÇÕES DE HIDRATAÇÃO ---
    const handleAddWater = (amount: number) => {
        setWaterConsumed(prev => prev + amount);
    };

    const handleManualWater = () => {
        setIsManualModalVisible(true);
    };

    const confirmManualWater = () => {
        const amount = parseInt(manualInputValue, 10);
        // Só adiciona se for um número válido e maior que zero
        if (!isNaN(amount) && amount > 0) {
            handleAddWater(amount);
        }
        // Limpa o input e fecha o modal
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
        // 1. A View principal agora assume a cor de fundo do app
        <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor }}>
            <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

            {/* 2. OS GRADIENTES FUGIRAM DA SCREEN E AGORA PEGAM A TELA TODA */}
            {/* O height deles nós vamos aumentar lá no styles.ts */}
            <LinearGradient
                colors={['rgba(200, 16, 46, 0.4)', 'transparent']}
                style={styles.topGlow}
                pointerEvents="none"
            />
            <LinearGradient
                colors={['transparent', 'rgba(200, 16, 46, 0.4)']}
                style={styles.bottomGlow}
                pointerEvents="none"
            />

            <Screen style={styles.container}>

                {/* 1. CABEÇALHO (Badge Escura) */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name={iconName as any} size={20} color={theme.colors.primary} />
                        <Text style={styles.badgeText}>{workoutType.toUpperCase()}</Text>
                    </View>
                </View>

                {/* 2. CRONÓMETRO NÉON */}
                <View style={styles.timerContainer}>
                    <Text style={[styles.timerText, !isActive && styles.timerPaused]}>
                        {formatTime(seconds)}
                    </Text>
                    <Text style={styles.timerSubtitle}>TEMPO DECORRIDO</Text>
                </View>

                {/* 3. BOTÕES DE CONTROLO (Play/Pause) */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.controlButton, !isActive && styles.controlButtonPlay]}
                        onPress={handleToggleTimer}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons
                            name={isActive ? "pause" : "play"}
                            size={50}
                            color={isActive ? theme.colors.primary : '#0e0e0e'}
                        />
                    </TouchableOpacity>
                </View>

                {/* 4. CARD DE HIDRATAÇÃO (Dark Mode) */}
                <Animated.View style={{ ...styles.hydrationCard, backgroundColor: animatedBackgroundColor + 'rgb(17, 17, 17)' }}>
                    <LinearGradient
                        colors={['transparent', 'rgba(204, 9, 41, 0.72)']}
                        style={styles.bottomGlow}
                        pointerEvents="none"
                    />
                    <View style={styles.hydrationHeader}>
                        <MaterialCommunityIcons name="cup-water" size={16} color={theme.colors.textLight} />
                        <Text style={styles.hydrationTitle}>REGISTRAR HIDRATAÇÃO</Text>
                    </View>
                    <View style={styles.hydrationButtonsRow}>

                        <TouchableOpacity
                            style={styles.waterButtonRed}
                            onPress={() => handleAddWater(250)}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="water-outline" size={40} color="#FFF" />
                            <Text style={styles.waterButtonText}>+250</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.waterButtonRed}
                            onPress={() => handleAddWater(500)}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="water-outline" size={40} color="#FFF" />
                            <Text style={styles.waterButtonText}>+500</Text>
                        </TouchableOpacity>

                        {/* Botão Manual */}
                        <TouchableOpacity
                            style={styles.waterButtonManual}
                            onPress={handleManualWater}
                            activeOpacity={0.8}
                        >
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

                {/* 5. BOTÃO DE ENCERRAR TREINO (Hold to Confirm) */}
                <View style={styles.footer}>
                    <Pressable
                        style={styles.finishButtonContainer}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        {/* Esta é a barra vermelha que vai encher por trás do texto */}
                        <Animated.View style={[styles.finishButtonFill, { width: widthInterpolate }]} />

                        {/* O conteúdo do botão (Texto e Ícone) */}
                        <View style={styles.finishButtonContent}>
                            <MaterialCommunityIcons name="stop-circle-outline" size={30} color={theme.colors.primary} />
                            <Text style={styles.finishButtonText}>ENCERRAR TREINO</Text>
                        </View>
                    </Pressable>

                    <Text style={styles.holdText}>Pressione e segure para encerrar</Text>
                </View>

                {/* --- MODAL DE HIDRATAÇÃO MANUAL --- */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isManualModalVisible}
                    onRequestClose={cancelManualWater}
                >
                    {/* O overlay escuro que fica por trás */}
                    <View style={styles.modalOverlay}>
                        {/* A caixinha do Modal */}
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
                                maxLength={4} // Evita que a pessoa digite 100000 ml
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
