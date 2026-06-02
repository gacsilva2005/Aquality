import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Screen } from '../../../../components/Screen';
import { Header } from '../../../../components/Header';
import { ModalTreino } from '../../../../components/ModalTreino';
import { styles } from './styles';
import { theme } from '../../../../global/themas';
import { router, useFocusEffect } from 'expo-router';
import { useUser } from '../../../../contexts/UserContext';
import Constants from 'expo-constants';

// CÁLCULOS DO CÍRCULO DE PROGRESSO
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.55;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Dashboard() {
  const { user } = useUser();
  const [hydrationLevel, setHydrationLevel] = useState(100);
  const [sweatRate, setSweatRate] = useState(0.0);
  const [waterBalance, setWaterBalance] = useState(0.0);
  const [recoveryPercent, setRecoveryPercent] = useState(100);
  const [lastWorkoutDate, setLastWorkoutDate] = useState('');

  // Modal de seleção de treino
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleStartWorkout = (treinoSelecionado: string) => {
    setIsModalVisible(false);
    router.push({
      pathname: '/confirmacaoKit' as any,
      params: { type: treinoSelecionado }
    });
  };

  // Estados do header de hidratação
  const [consumed, setConsumed] = useState(0);
  const goal = 3000;

  // Lógica do preenchimento SVG
  const progressPercentage = Math.min(consumed / goal, 1);
  const strokeDashoffset = CIRCUMFERENCE - (progressPercentage * CIRCUMFERENCE);
  const isGoalMet = consumed >= goal;

  const trackColor = theme.colors.primaryLight;
  const progressColor = isGoalMet ? theme.colors.success : theme.colors.primary;

  // API
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      // 1. Buscar registros de hidratação de hoje
      const responseHidr = await fetch(`${API_URL}/hidratacao/atleta/${user.id}`);
      if (responseHidr.ok) {
        const data = await responseHidr.json();
        const todayStr = new Date().toDateString();
        const todayRecords = data.filter((item: any) => {
          if (!item.dataHora) return false;
          return new Date(item.dataHora).toDateString() === todayStr;
        });
        const totalToday = todayRecords.reduce((sum: number, item: any) => sum + item.volume, 0);
        setConsumed(totalToday);
      }

      // 2. Buscar sessões de treino do atleta
      const responseSessoes = await fetch(`${API_URL}/sessoes-de-treino/atleta/${user.id}`);
      if (responseSessoes.ok) {
        const data = await responseSessoes.json();
        const finishedSessions = data.filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null);
        
        if (finishedSessions.length > 0) {
          finishedSessions.sort((a: any, b: any) => new Date(b.dataHoraFim).getTime() - new Date(a.dataHoraFim).getTime());
          const latest = finishedSessions[0];

          setSweatRate(latest.taxaSudorese);
          setWaterBalance(latest.balancoHidrico);

          if (latest.dataHoraFim) {
            const d = new Date(latest.dataHoraFim);
            const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const dia = d.getDate().toString().padStart(2, '0');
            const mes = meses[d.getMonth()];
            const horas = d.getHours().toString().padStart(2, '0');
            const minutos = d.getMinutes().toString().padStart(2, '0');
            setLastWorkoutDate(`${dia} DE ${mes}, ${horas}:${minutos}`);
          }

          const pesoPre = latest.pesoPre || 70.0;
          const perdaPeso = pesoPre - (latest.pesoPos || pesoPre);
          const percentualPerda = pesoPre > 0 ? (perdaPeso / pesoPre) * 100.0 : 0.0;

          const level = Math.max(50, Math.min(100, Math.round(100 - percentualPerda)));
          setHydrationLevel(level);

          const recovery = Math.max(30, Math.min(100, Math.round(100 + (latest.balancoHidrico / pesoPre) * 100)));
          setRecoveryPercent(recovery);
        } else {
          setHydrationLevel(100);
          setSweatRate(0.0);
          setWaterBalance(0.0);
          setRecoveryPercent(100);
          setLastWorkoutDate('SEM REGISTRO');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const handleUrinaClick = () => {
    console.log("Sessão encerrada");
    router.replace('./urineColor');
  };

  return (
    <Screen
      backgroundColor={theme.colors.background}
      scrollable={true}
      HeaderComponent={<Header />}
    >
      <View style={styles.mainContent}>

        {/* ── TÍTULO EDITORIAL ── */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageSubtitle}>CENTRAL DE COMANDO</Text>
          <Text style={styles.titleLine}>STATUS DO ATLETA</Text>
        </View>

        {/* ── CARD: ESTRATÉGIA DO DIA ── */}
        <View style={styles.strategyCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.redDot} />
            <Text style={styles.cardLabel}>ESTRATÉGIA DO DIA</Text>
            <FontAwesome5 name="robot" size={40} color={theme.colors.textSecondary} style={styles.bgIcon} />
          </View>

          <Text style={styles.strategyText}>
            Clima a <Text style={styles.textHighlightRed}>32°C</Text>. Sua taxa de
            sudorese sobe <Text style={styles.textHighlightRed}>15%</Text> nesse
            calor. Prepare <Text style={styles.textHighlightRed}>1.5L</Text> de água.
          </Text>

          <View style={styles.strategyActionRow}>
            {/* ── NAVEGAÇÃO PARA O ASSISTENTE IA ── */}
            <TouchableOpacity
              style={styles.btnProtocol}
              onPress={() => router.push('/assistenteIA/assistente' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnProtocolText}>RECOMENDAÇÃO BASEADA EM IA</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CARD: NÍVEL DE HIDRATAÇÃO ── */}
        <View style={styles.infoCard}>
          <Text style={styles.cardLabel}>NÍVEL DE HIDRATAÇÃO</Text>
          <View style={styles.hydrationValueRow}>
            <Text style={styles.hydrationValue}>{hydrationLevel}</Text>
            <Text style={styles.hydrationUnit}>%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${hydrationLevel}%` }]} />
          </View>
          <Text style={styles.cardSubText}>
            Otimizado para treino de alta intensidade em 2h.
          </Text>
        </View>

        {/* ── CARD: ÚLTIMO TREINO (métricas + recovery overlay) ── */}
        <View style={styles.infoCard}>
          <View style={styles.lastWorkoutHeader}>
            <Text style={styles.cardLabel}>ÚLTIMO TREINO</Text>
            <Text style={styles.dateText}>{lastWorkoutDate || "SEM REGISTRO"}</Text>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>TAXA DE SUDORESE</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>{sweatRate > 0 ? sweatRate.toFixed(1) : "0.0"}</Text>
                <Text style={styles.metricUnit}>L/H</Text>
              </View>
              <View style={styles.tagGreen}>
                <Text style={styles.tagGreenText}>
                  {sweatRate > 2.0 ? "ZONA ALTA" : sweatRate > 1.0 ? "ZONA MODERADA" : "ZONA EXCELENTE"}
                </Text>
              </View>
            </View>

            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>BALANÇO HÍDRICO</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>{(waterBalance > 0 ? "+" : "") + waterBalance.toFixed(2)}</Text>
                <Text style={styles.metricUnit}>L</Text>
              </View>
              <View style={styles.tagRed}>
                <Text style={styles.tagRedText}>
                  {waterBalance < -1.5 ? "DÉFICIT CRÍTICO" : waterBalance < 0.0 ? "DÉFICIT LEVE" : "ESTÁVEL"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.recoveryOverlay}>
            <FontAwesome5 name="bolt" size={20} color={theme.colors.primary} />
            <Text style={styles.recoveryValue}>{recoveryPercent}%</Text>
            <Text style={styles.recoveryLabel}>RECUPERAÇÃO</Text>
          </View>
        </View>

        {/* ── CARD: INSIGHTS BIO-METABÓLICOS ── */}
        <View style={styles.insightsCard}>
          <Text style={styles.cardLabel}>INSIGHTS BIO-METABÓLICOS</Text>
          <Text style={styles.insightsText}>
            Sua retenção de sódio está acima da média histórica. Reduza a ingestão
            de eletrólitos artificiais na próxima hora para evitar saturação osmótica.
          </Text>
        </View>

        {/* ── TAGS INFERIORES ── */}
        <View style={styles.bottomTagsRow}>
          <View style={styles.bottomTag}>
            <Text style={styles.bottomTagText}>ELETRÓLITOS: ESTÁVEL</Text>
          </View>
          <View style={styles.bottomTag}>
            <Text style={styles.bottomTagText}>GLICOSE: 110MG/DL</Text>
          </View>
        </View>

        {/* ── BOTÃO INICIAR SESSÃO ── */}
        <TouchableOpacity
          style={styles.startSessionButton}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="play" size={14} color={theme.colors.textWhite} />
          <Text style={styles.startSessionText}>INICIAR SESSÃO</Text>
        </TouchableOpacity>

      </View>

      {/* ── MODAL DE TREINO ── */}
      <ModalTreino
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onStart={handleStartWorkout}
      />

    </Screen>
  );
}