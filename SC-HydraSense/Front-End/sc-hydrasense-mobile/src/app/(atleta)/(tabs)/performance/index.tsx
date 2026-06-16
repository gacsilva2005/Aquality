import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView, // <-- Importação adicionada
} from 'react-native';
import { Screen } from '../../../../components/Screen';
import { Header } from '../../../../components/Header';
import { styles } from './styles';
import { theme } from '../../../../global/themas';
import { LineChart } from 'react-native-chart-kit';
import { useUser } from '../../../../contexts/UserContext';
import { useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';

// TIPOS
type FilterType = string;

type StatusType = 'OPTIMAL' | 'WARNING' | 'CRITICAL';

interface Session {
  id: string;
  day: string;
  month: string;
  type: string;
  sweatRate: number; 
  status: StatusType;
}

// HELPERS
const STATUS_COLOR: Record<StatusType, string> = {
  OPTIMAL:  theme.colors.success,   // #16A34A
  WARNING:  theme.colors.warning,   // #F59E0B
  CRITICAL: theme.colors.primary,   // #D90429
};

function getTrend(data: number[]): string {
  if (data.length < 2) return 'ESTÁVEL';
  const last  = data[data.length - 1];
  const prev  = data[data.length - 2];
  if (last > prev) return 'RISING';
  if (last < prev) return 'FALLING';
  return 'STABLE';
}

// DADOS MOCK (utilizados como fallback inicial caso não haja treinos)
const MOCK_SESSIONS: Session[] = [
  { id: '1', day: '12', month: 'JAN', type: 'CARDIO',  sweatRate: 1.1, status: 'OPTIMAL'  },
  { id: '2', day: '10', month: 'JAN', type: 'CARDIO',  sweatRate: 1.4, status: 'WARNING'  },
  { id: '3', day: '08', month: 'JAN', type: 'CARDIO',  sweatRate: 1.9, status: 'CRITICAL' },
  { id: '4', day: '05', month: 'JAN', type: 'MUSCULAÇÃO', sweatRate: 0.8, status: 'OPTIMAL'  },
];

function getAvgRate(sessions: Session[]): string {
  if (!sessions.length) return '0.0';
  const avg = sessions.reduce((sum, s) => sum + s.sweatRate, 0) / sessions.length;
  return avg.toFixed(1);
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Performance() {
  const { user } = useUser();
  const [filter, setFilter]       = useState<FilterType>('TODOS');
  const [sessions, setSessions]   = useState<Session[]>([]);

  // Obter modalidades únicas registradas nas sessões do atleta
  const filterOptions = useMemo(() => {
    if (sessions.length === 0) {
      return ['TODOS', 'CARDIO', 'MUSCULAÇÃO'];
    }
    const uniqueMods = new Set<string>();
    sessions.forEach(s => {
      if (s.type) {
        uniqueMods.add(s.type.toUpperCase());
      }
    });
    return ['TODOS', ...Array.from(uniqueMods)];
  }, [sessions]);

  // ── Buscar dados da API ──
  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/sessoes-de-treino/atleta/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar treinos finalizados (dataHoraFim e taxaSudorese preenchidos)
        const finishedSessions = data.filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null);

        // Mapear para a estrutura da tela
        const mappedSessions: Session[] = finishedSessions.map((s: any) => {
          const d = new Date(s.dataHoraFim || s.dataHoraInicio);
          const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
          const day = d.getDate().toString().padStart(2, '0');
          const month = meses[d.getMonth()];

          const typeStr = s.modalidade ? s.modalidade.toUpperCase() : 'CARDIO';

          const pesoPre = s.pesoPre || 70.0;
          const perdaPeso = pesoPre - (s.pesoPos || pesoPre);
          const percentualPerda = pesoPre > 0 ? (perdaPeso / pesoPre) * 100.0 : 0.0;

          let status: StatusType = 'OPTIMAL';
          if (percentualPerda > 2.0) {
            status = 'CRITICAL';
          } else if (percentualPerda > 1.0) {
            status = 'WARNING';
          }

          return {
            id: s.id.toString(),
            day,
            month,
            type: typeStr as any,
            sweatRate: s.taxaSudorese,
            status
          };
        });

        // Ordenar sessões da mais recente para a mais antiga na lista
        mappedSessions.sort((a, b) => {
          // Usar id ou construir datas para ordenar
          return parseInt(b.id) - parseInt(a.id);
        });

        setSessions(mappedSessions);
      }
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  // Sessões filtradas 
  const filtered = filter === 'TODOS'
    ? sessions
    : sessions.filter(s => s.type === filter);

  //Dados do gráfico (mais antiga → mais recente)
  const chartData = [...filtered].reverse().map(s => s.sweatRate);
  const trend     = getTrend(chartData);
  const avgRate   = getAvgRate(filtered);

  return (
    <Screen
      backgroundColor={theme.colors.background}
      scrollable={true}
      HeaderComponent={<Header />}
    >
      <View style={styles.mainContent}>

        {/* ── TÍTULO EDITORIAL ── */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageSubtitle}>EVOLUTION LAB</Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleLine}>PERFORMANCE</Text>
            <View style={styles.avgRateContainer}>
              <Text style={styles.avgRateLabel}>AVG. RATE</Text>
              <View style={styles.avgRateValueRow}>
                <Text style={styles.avgRateValue}>{avgRate}</Text>
                <Text style={styles.avgRateUnit}>L/h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── CARD DO GRÁFICO ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>TAXA DE SUDORESE (L/H)</Text>
          <Text style={styles.chartTitle}>HISTÓRICO</Text>

          {/* Badge de tendência */}
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>TREND: {trend}</Text>
          </View>

          {chartData.length > 0 ? (
            <LineChart
              data={{
                labels: [],
                datasets: [{ data: chartData.length > 1 ? chartData : [...chartData, ...chartData] }],
              }}
              width={SCREEN_WIDTH - theme.spacing.md * 2 - 32}
              height={160}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo:   theme.colors.surface,
                color: (opacity = 1) => `rgba(217, 4, 41, ${opacity})`,
                strokeWidth: 2,
                fillShadowGradientFrom: theme.colors.primary,
                fillShadowGradientTo:   theme.colors.surface,
                fillShadowGradientFromOpacity: 0.25,
                fillShadowGradientToOpacity:   0.0,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: theme.colors.primary,
                  fill: theme.colors.surface,
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Sem dados para exibir</Text>
            </View>
          )}

          {/* Eixo X manual */}
          <View style={styles.chartXAxis}>
            <Text style={styles.chartAxisLabel}>SESSION 01</Text>
            <Text style={styles.chartAxisLabel}>LATEST SESSION</Text>
          </View>
        </View>

        {/* ── FILTROS ── */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterRow}
          >
            {filterOptions.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── LISTA DE SESSÕES ── */}
        <View style={styles.sessionList}>
          {filtered.map(session => (
            <View key={session.id} style={styles.sessionCard}>

              {/* Data */}
              <View style={styles.sessionDate}>
                <Text style={styles.sessionDay}>{session.day}</Text>
                <Text style={styles.sessionMonth}>{session.month}</Text>
              </View>

              {/* Info */}
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionType}>{session.type}</Text>
                <Text style={styles.sessionSweat}>
                  SUDORESE: {session.sweatRate.toFixed(1)} L/H
                </Text>
              </View>

              {/* Status */}
              <View style={styles.sessionStatus}>
                <Text style={styles.sessionStatusLabel}>STATUS</Text>
                <View style={styles.sessionStatusRow}>
                  <Text style={[styles.sessionStatusValue, { color: STATUS_COLOR[session.status] }]}>
                    {session.status}
                  </Text>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[session.status] }]} />
                </View>
              </View>

            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma sessão encontrada.</Text>
            </View>
          )}
        </View>

      </View>
    </Screen>
  );
}