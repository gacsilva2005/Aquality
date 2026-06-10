import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../../components/Screen';
import { Header } from '../../../../components/Header';
import { ModalTreino } from '../../../../components/ModalTreino';
import { styles } from './styles';
import { theme } from '../../../../global/themas';
import { router, useFocusEffect } from 'expo-router';
import { useUser } from '../../../../contexts/UserContext';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

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
  const [weatherTemp, setWeatherTemp]           = useState<number | null>(null);
  const [weatherSudorese, setWeatherSudorese]   = useState<number>(0);
  const [weatherAgua, setWeatherAgua]           = useState<number>(0);
  const [weatherDescricao, setWeatherDescricao] = useState<string>('');

  // Modal de seleção de treino
  const [isModalVisible, setIsModalVisible] = useState(false);
    const handleStartWorkout = async (treinoSelecionado: string) => {
        const usuarioSalvo = await SecureStore.getItemAsync('usuarioLogado');

        if (!usuarioSalvo) {
            console.log('Nenhum usuário salvo no SecureStore');
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        if (!usuario?.id) {
            console.log('Usuário salvo sem id:', usuario);
            return;
        }

        setIsModalVisible(false);

        router.push({
            pathname: '/confirmacaoKit' as any,
            params: {
                type: treinoSelecionado,
                atletaId: usuario.id.toString(),
            },
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

      const safeFetch = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`[${res.status}] ${url} → ${text.slice(0, 200)}`);
        }
        return res.json();
      };

      // Hidratação
      try {
        const data = await safeFetch(`${API_URL}/hidratacao/atleta/${user.id}`);
        const todayStr = new Date().toDateString();
        const todayRecords = data.filter((item: any) =>
          item.dataHora && new Date(item.dataHora).toDateString() === todayStr
        );
        const totalToday = todayRecords.reduce((sum: number, item: any) => sum + item.volume, 0);
        setConsumed(totalToday);
      } catch (e) {
        console.warn('Hidratação:', e);
      }

      // Sessões de treino
      try {
        const data = await safeFetch(`${API_URL}/sessoes-de-treino/atleta/${user.id}`);
        const finished = data
          .filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null)
          .sort((a: any, b: any) =>
            new Date(b.dataHoraFim).getTime() - new Date(a.dataHoraFim).getTime()
          );

        if (finished.length > 0) {
          const latest = finished[0];
          setSweatRate(latest.taxaSudorese);
          setWaterBalance(latest.balancoHidrico);

          const d = new Date(latest.dataHoraFim);
          const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
          setLastWorkoutDate(
            `${d.getDate().toString().padStart(2,'0')} DE ${meses[d.getMonth()]}, ` +
            `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
          );

          const pesoPre = latest.pesoPre || 70.0;
          const perdaPeso = pesoPre - (latest.pesoPos || pesoPre);
          const percentualPerda = pesoPre > 0 ? (perdaPeso / pesoPre) * 100 : 0;
          setHydrationLevel(Math.max(50, Math.min(100, Math.round(100 - percentualPerda))));
          setRecoveryPercent(Math.max(30, Math.min(100, Math.round(100 + (latest.balancoHidrico / pesoPre) * 100))));
        } else {
          setLastWorkoutDate('SEM REGISTRO');
        }
      } catch (e) {
        console.warn('Sessões:', e);
      }

      // Clima
      try {
        const LAT = -23.55;
        const LON = -46.63;
        const clima = await safeFetch(`${API_URL}/clima/atual?lat=${LAT}&lon=${LON}`);
        setWeatherTemp(clima.temperatura);
        setWeatherSudorese(clima.aumentoSudoresePercent);
        setWeatherAgua(clima.aguaRecomendadaLitros);
        setWeatherDescricao(clima.descricao);
      } catch (e) {
        console.warn('Clima:', e);
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

        {/* ── AÇÃO PRINCIPAL: INICIAR SESSÃO ── */}
        <View style={styles.callToActionContainer}>
          <View style={styles.callToActionHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={theme.colors.primary} />
            <Text style={styles.callToActionTitle}>PRONTO PARA TREINAR</Text>
          </View>
          <Text style={styles.callToActionSubtitle}>
            Tudo pronto para o próximo treino. Inicie sua sessão e ative o monitoramento.
          </Text>
          <TouchableOpacity
            style={[styles.startSessionButton, { marginHorizontal: 0, marginBottom: 0 }]}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="play" size={14} color={theme.colors.textWhite} />
            <Text style={styles.startSessionText}>INICIAR SESSÃO</Text>
          </TouchableOpacity>
        </View>

        {/* ── CARD: ESTRATÉGIA DO DIA ── */}
        <View style={styles.strategyCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.redDot} />
            <Text style={styles.cardLabel}>ESTRATÉGIA DO DIA</Text>
            <FontAwesome5
              name="robot"
              size={40}
              color={theme.colors.textSecondary}
              style={styles.bgIcon}
            />
          </View>

          {weatherTemp !== null ? (
            <Text style={styles.strategyText}>
              Clima a{' '}
              <Text style={styles.textHighlightRed}>{Math.round(weatherTemp)}°C</Text>
              {weatherDescricao ? ` (${weatherDescricao})` : ''}.
              {weatherSudorese > 0
                ? ` Sua taxa de sudorese sobe `
                : ' Condições normais de temperatura. '}
              {weatherSudorese > 0 && (
                <Text style={styles.textHighlightRed}>{weatherSudorese}%</Text>
              )}
              {weatherSudorese > 0 ? ' nesse calor. Prepare ' : 'Prepare '}
              <Text style={styles.textHighlightRed}>{weatherAgua.toFixed(1)}L</Text>
              {' de água extra.'}
            </Text>
          ) : (
            <Text style={styles.strategyText}>Carregando dados climáticos...</Text>
          )}

          <View style={styles.strategyActionRow}>
            <TouchableOpacity
              style={styles.btnProtocol}
              onPress={() => router.push('/assistenteIA/assistente' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnProtocolText}>RECOMENDAÇÃO BASEADA EM IA</Text>
            </TouchableOpacity>
          </View>
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

        {/* Botão de iniciar sessão foi movido para o topo */}

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