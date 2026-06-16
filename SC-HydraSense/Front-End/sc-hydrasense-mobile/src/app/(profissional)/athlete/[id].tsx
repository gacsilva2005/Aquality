import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../components/Screen';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/global/themas';
import { styles } from './styles';
import { LineChart } from 'react-native-chart-kit';
import { RecordCard, RecordItem } from '../../../components/recordCard';
import { ModalMetaHidratacao } from '../../../components/ModalMetaHidratacao';
import Constants from 'expo-constants';

export default function AthleteDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [athleteData, setAthleteData] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [hydrationVal, setHydrationVal] = useState<number>(0);
    const [metaVolume, setMetaVolume] = useState<number>(3000);
    const [metaObservacao, setMetaObservacao] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    
    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 80);
    const fabTranslateY = diffClamp.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 80],
    });

    const calcularIdade = (dataNascimento: string) => {
        if (!dataNascimento) return '--';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return `${idade} ANOS`;
    };

    const capitalize = (str: string) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
    };

    const formatSessionTime = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        if (date.toDateString() === today.toDateString()) {
            return `HOJE, ${timeStr}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `ONTEM, ${timeStr}`;
        } else {
            const day = date.getDate().toString().padStart(2, '0');
            const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const month = months[date.getMonth()];
            return `${day}/${month}, ${timeStr}`;
        }
    };

    const getIcon = (mod: string) => {
        const lower = (mod || '').toLowerCase();
        if (lower.includes('musculação') || lower.includes('academia') || lower.includes('força') || lower.includes('peso')) {
            return 'dumbbell';
        }
        return 'run';
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const hostUri = Constants?.expoConfig?.hostUri;
                const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
                const API_URL = `http://${ip}:8080`;

                // 1. Fetch athlete details
                const athleteRes = await fetch(`${API_URL}/Atleta/${id}`);
                if (athleteRes.ok) {
                    const data = await athleteRes.json();
                    setAthleteData(data);
                }

                // 2. Fetch sessions
                const sessionsRes = await fetch(`${API_URL}/sessoes-de-treino/atleta/${id}`);
                if (sessionsRes.ok) {
                    const data = await sessionsRes.json();
                    setSessions(data);
                }

                // 3. Fetch hydration
                const hydrationRes = await fetch(`${API_URL}/hidratacao/atleta/${id}`);
                if (hydrationRes.ok) {
                    const data = await hydrationRes.json();
                    const todayStr = new Date().toDateString();
                    const totalToday = data
                        .filter((item: any) => item.dataHora && new Date(item.dataHora).toDateString() === todayStr)
                        .reduce((sum: number, item: any) => sum + item.volume, 0);
                    setHydrationVal(totalToday);
                }

                // 4. Fetch hydration goal
                const metaRes = await fetch(`${API_URL}/meta-hidratacao/atleta/${id}`);
                if (metaRes.ok) {
                    const data = await metaRes.json();
                    setMetaVolume(data.metaVolumeMl || 3000);
                    setMetaObservacao(data.observacoes || '');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do atleta:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAllData();
        }
    }, [id]);

    if (loading) {
        return (
            <Screen backgroundColor="#F7F7F7" scrollable={false}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ marginTop: 10, color: '#666' }}>Carregando dados do atleta...</Text>
                </View>
            </Screen>
        );
    }

    // Processar modalidades
    let modalitiesStr = 'Sem modalidade';
    if (athleteData?.modalidade) {
        try {
            const parsed = JSON.parse(athleteData.modalidade);
            if (Array.isArray(parsed) && parsed.length > 0) {
                modalitiesStr = parsed.join(', ');
            } else {
                modalitiesStr = athleteData.modalidade;
            }
        } catch (e) {
            modalitiesStr = athleteData.modalidade;
        }
    }

    // Foto de perfil
    const photoSource = athleteData?.fotoPerfil
        ? (athleteData.fotoPerfil.startsWith('data:image')
            ? { uri: athleteData.fotoPerfil }
            : { uri: `data:image/jpeg;base64,${athleteData.fotoPerfil}` })
        : require('../../../assets/images/anonymous_avatar.png');

    // Gráfico de Sudorese
    const finishedSessions = sessions.filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null);
    const sortedFinished = [...finishedSessions].sort((a: any, b: any) => new Date(a.dataHoraFim).getTime() - new Date(b.dataHoraFim).getTime());
    const chartData = sortedFinished.map((s: any) => s.taxaSudorese);

    const latestSweatRate = sortedFinished.length > 0 ? sortedFinished[sortedFinished.length - 1].taxaSudorese : null;

    // Mapeamento dos registros recentes
    const recentRecords: RecordItem[] = [...sessions]
        .filter((s: any) => s.dataHoraFim !== null)
        .sort((a: any, b: any) => new Date(b.dataHoraFim).getTime() - new Date(a.dataHoraFim).getTime())
        .slice(0, 5)
        .map((session: any) => {
            const start = new Date(session.dataHoraInicio);
            const end = new Date(session.dataHoraFim);
            const duracaoMin = Math.round((end.getTime() - start.getTime()) / 60000);
            const durationText = `${duracaoMin} min`;

            const sweatText = session.taxaSudorese ? ` • Sudorese: ${session.taxaSudorese.toFixed(1)} L/H` : '';
            const subtitle = `Duração: ${durationText}${sweatText}`;

            const title = capitalize(session.modalidade || 'Treino');
            const time = formatSessionTime(session.dataHoraFim || session.dataHoraInicio);
            const icon = getIcon(session.modalidade);

            const pesoPre = session.pesagemPre ? session.pesagemPre.peso : (session.pesoPre || 0);
            const pesoPos = session.pesagemPos ? session.pesagemPos.peso : (session.pesoPos || 0);
            let isAlert = false;
            if (pesoPre > 0 && pesoPos > 0) {
                const perdaPeso = pesoPre - pesoPos;
                const percentualPerda = (perdaPeso / pesoPre) * 100;
                if (percentualPerda > 2.0) {
                    isAlert = true;
                }
            }

            return {
                id: String(session.id),
                title,
                subtitle,
                time,
                icon,
                isAlert
            };
        });

    return (
        <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
            <Animated.ScrollView 
                contentContainerStyle={{ paddingBottom: 100 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Botão de Voltar */}
                <TouchableOpacity
                    style={[styles.backButton, { marginTop: 40 }]}
                    onPress={() => router.back()}
                >
                <Feather name="arrow-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>

            <View style={styles.container}>

                {/* --- HEADER DO ATLETA --- */}
                <View style={styles.header}>
                    <Image source={photoSource} style={styles.photo} />

                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{athleteData?.nome || 'Atleta'}</Text>
                        <Text style={styles.subInfo}>
                            {modalitiesStr} • #{id} • {athleteData?.dataNascimento ? calcularIdade(athleteData.dataNascimento) : '--'}
                        </Text>

                        <View style={styles.hydrationContainer}>
                            <Text style={styles.hydrationLabel}>HIDRATAÇÃO HOJE</Text>
                            <Text style={styles.hydrationValue}>{hydrationVal} / {metaVolume} ml</Text>
                        </View>
                    </View>

                    {/* Número gigante de fundo (Marca d'água) */}
                    <Text style={styles.watermarkNumber}>#{id}</Text>
                </View>

                {/* --- GRÁFICO (Taxa de Sudorese) --- */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>TAXA DE SUDORESE</Text>
                            <Text style={styles.sectionSubtitle}>Histórico de Sessões</Text>
                        </View>
                    </View>

                    <View style={styles.rateContainer}>
                        <Text style={styles.rateValue}>{latestSweatRate !== null ? latestSweatRate.toFixed(1) : '--'}</Text>
                        <Text style={styles.rateUnit}>{latestSweatRate !== null ? 'L/h' : ''}</Text>
                    </View>

                    {chartData.length > 0 ? (
                        <View style={{ marginVertical: 8 }}>
                            <LineChart
                                data={{
                                    labels: [],
                                    datasets: [{ data: chartData.length > 1 ? chartData : [...chartData, ...chartData] }],
                                }}
                                width={Dimensions.get('window').width - 64}
                                height={160}
                                withDots={true}
                                withInnerLines={false}
                                withOuterLines={false}
                                withVerticalLabels={false}
                                withHorizontalLabels={false}
                                chartConfig={{
                                    backgroundGradientFrom: '#FFFFFF',
                                    backgroundGradientTo: '#FFFFFF',
                                    color: (opacity = 1) => `rgba(217, 4, 41, ${opacity})`,
                                    strokeWidth: 2,
                                    fillShadowGradientFrom: '#D90429',
                                    fillShadowGradientTo: '#FFFFFF',
                                    fillShadowGradientFromOpacity: 0.25,
                                    fillShadowGradientToOpacity: 0.0,
                                    propsForDots: {
                                        r: '4',
                                        strokeWidth: '2',
                                        stroke: '#D90429',
                                        fill: '#FFFFFF',
                                    },
                                }}
                                bezier
                                style={{ borderRadius: 16 }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 4 }}>
                                <Text style={{ fontSize: 10, color: '#999' }}>PRIMEIRA SESSÃO</Text>
                                <Text style={{ fontSize: 10, color: '#999' }}>ÚLTIMA SESSÃO</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.graphPlaceholder}>
                            <Text style={{ color: '#999' }}>Sem dados de sudorese para exibir</Text>
                        </View>
                    )}
                </View>

                {/* --- REGISTROS RECENTES --- */}
                <View style={styles.recordsSection}>
                    <Text style={styles.recordsSectionTitle}>REGISTROS RECENTES</Text>

                    {recentRecords.length > 0 ? (
                        recentRecords.map((record) => (
                            <RecordCard key={record.id} record={record} />
                        ))
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 }}>
                            <Text style={{ color: '#999' }}>Nenhum treino registrado recente.</Text>
                        </View>
                    )}
                </View>

                </View>
            </Animated.ScrollView>

            <Animated.View style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                transform: [{ translateY: fabTranslateY }]
            }}>
                <TouchableOpacity 
                    style={{
                        backgroundColor: theme.colors.primary,
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84
                    }}
                    onPress={() => setModalVisible(true)}
                >
                    <Feather name="droplet" size={24} color="#FFF" />
                    <View style={{ position: 'absolute', top: 12, right: 12 }}>
                        <Feather name="plus" size={10} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <ModalMetaHidratacao 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                atletaNome={athleteData?.nome || 'Atleta'}
                ultimaTaxa={latestSweatRate}
                metaInicial={metaVolume}
                observacaoInicial={metaObservacao}
                onSave={async (data) => {
                    try {
                        const hostUri = Constants?.expoConfig?.hostUri;
                        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
                        const API_URL = `http://${ip}:8080`;

                        const response = await fetch(`${API_URL}/meta-hidratacao`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                atletaId: parseInt(id as string, 10),
                                metaVolumeMl: data.metaVolumeMl,
                                observacoes: data.observacoes
                            })
                        });

                        if (response.ok) {
                            const updated = await response.json();
                            setMetaVolume(updated.metaVolumeMl);
                            setMetaObservacao(updated.observacoes || '');
                        }
                    } catch (error) {
                        console.error('Erro ao salvar meta:', error);
                    }
                    setModalVisible(false);
                }}
            />
        </View>
    );
}