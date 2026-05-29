// src/app/(profissional)/(tabs)/athletes/[id].tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../components/Screen';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/global/themas';
import { styles } from './styles'; // Vamos criar esse arquivo no próximo passo
import { LinearGradient } from 'expo-linear-gradient';
import { RecordCard, RecordItem } from '../../../components/recordCard';

export default function AthleteDetails() {
    const router = useRouter();
    // Captura o ID que foi passado na URL
    const { id } = useLocalSearchParams();

    // No futuro, você fará um fetch() na API usando esse 'id' para pegar os dados reais.
    // Por enquanto, vamos usar dados estáticos baseados no seu design:
    const athlete = {
        name: 'Gabriel Silva',
        sport: 'Karate',
        number: '10',
        age: '30 ANOS',
        hydration: '92%',
        photo: require('../../../assets/images/karate.jpeg') // Troque pela foto real
    };

    // --- MOCK DOS REGISTROS RECENTES ---
    const recentRecords: RecordItem[] = [
        { id: '1', title: 'Treino Tático', subtitle: 'Carga Alta • 90 min', time: 'HOJE, 09:30', icon: 'run', isAlert: false },
        { id: '2', title: 'Alerta HRV', subtitle: 'Recuperação Incompleta (42ms)', time: 'ONTEM, 22:00', icon: 'heart-pulse', isAlert: true },
        { id: '3', title: 'Força & Potência', subtitle: 'Carga Média • 45 min', time: 'ONTEM, 14:00', icon: 'dumbbell', isAlert: false },
    ];

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={true}>
            {/* Botão de Voltar */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Feather name="arrow-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>

            <View style={styles.container}>

                {/* --- HEADER DO ATLETA --- */}
                <View style={styles.header}>
                    <Image source={athlete.photo} style={styles.photo} />

                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{athlete.name}</Text>
                        <Text style={styles.subInfo}>
                            {athlete.sport} • #{athlete.number} • {athlete.age}
                        </Text>

                        <View style={styles.hydrationContainer}>
                            <Text style={styles.hydrationLabel}>HIDRATAÇÃO</Text>
                            <Text style={styles.hydrationValue}>{athlete.hydration}</Text>
                        </View>
                    </View>

                    {/* Número gigante de fundo (Marca d'água) */}
                    <Text style={styles.watermarkNumber}>#{athlete.number}</Text>
                </View>

                {/* --- GRÁFICO (Placeholder) --- */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>TAXA DE SUDORESE</Text>
                            <Text style={styles.sectionSubtitle}>Sessão Atual vs Baseline</Text>
                        </View>
                    </View>

                    <View style={styles.rateContainer}>
                        <Text style={styles.rateValue}>1.8</Text>
                        <Text style={styles.rateUnit}>L/hr</Text>
                        <Feather name="arrow-up" size={16} color="#C62828" style={{ marginLeft: 5 }} />
                    </View>

                    {/* Aqui entrará a biblioteca de gráfico no futuro (ex: react-native-chart-kit) */}
                    <View style={styles.graphPlaceholder}>
                        <Text style={{ color: '#999' }}>Gráfico entrará aqui</Text>
                    </View>
                </View>

                {/* --- PROTOCOLO DE RECUPERAÇÃO --- */}
                <View style={[styles.sectionCard, styles.protocolCard]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(204, 9, 41, 0.72)']}
                        style={styles.rightGlow}
                        pointerEvents="none"
                    />
                    <View style={styles.protocolHeader}>
                        <MaterialCommunityIcons name="water" size={16} color="#C62828" />
                        <Text style={styles.protocolTitle}>PROTOCOLO DE RECUPERAÇÃO</Text>
                    </View>

                    <View style={styles.protocolContent}>
                        <View>
                            <Text style={styles.protocolAction}>Ingerir 1.5L</Text>
                            <Text style={styles.protocolDetail}>Solução Isotônica - Próximas 2hrs</Text>
                        </View>
                        <TouchableOpacity style={styles.checkButton}>
                            <Feather name="check" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- REGISTROS RECENTES --- */}
                <View style={styles.recordsSection}>
                    <Text style={styles.recordsSectionTitle}>REGISTROS RECENTES</Text>

                    {recentRecords.map((record) => (
                        <RecordCard key={record.id} record={record} />
                    ))}
                </View>

            </View>
        </Screen>
    );
}