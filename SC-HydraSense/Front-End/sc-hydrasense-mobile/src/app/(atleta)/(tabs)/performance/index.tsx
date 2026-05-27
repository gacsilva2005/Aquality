import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Screen } from '../../../../components/Screen';
import { Header } from '../../../../components/Header';
import { styles } from './styles';
import { theme } from '../../../../global/themas';
import { LineChart } from 'react-native-chart-kit';

// TIPOS
type FilterType = 'TODOS' | 'CORRIDA' | 'CICLISMO';

type StatusType = 'OPTIMAL' | 'WARNING' | 'CRITICAL';

interface Session {
  id: string;
  day: string;
  month: string;
  type: 'CORRIDA' | 'CICLISMO';
  sweatRate: number; 
  status: StatusType;
}

// DADOS MOCK (substituir por API depois)
const MOCK_SESSIONS: Session[] = [
  { id: '1', day: '12', month: 'JAN', type: 'CORRIDA',  sweatRate: 1.1, status: 'OPTIMAL'  },
  { id: '2', day: '10', month: 'JAN', type: 'CORRIDA',  sweatRate: 1.4, status: 'WARNING'  },
  { id: '3', day: '08', month: 'JAN', type: 'CORRIDA',  sweatRate: 1.9, status: 'CRITICAL' },
  { id: '4', day: '05', month: 'JAN', type: 'CICLISMO', sweatRate: 0.8, status: 'OPTIMAL'  },
  { id: '5', day: '02', month: 'JAN', type: 'CORRIDA',  sweatRate: 1.3, status: 'WARNING'  },
  { id: '6', day: '28', month: 'DEZ', type: 'CICLISMO', sweatRate: 1.0, status: 'OPTIMAL'  },
];

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

function getAvgRate(sessions: Session[]): string {
  if (!sessions.length) return '0.0';
  const avg = sessions.reduce((sum, s) => sum + s.sweatRate, 0) / sessions.length;
  return avg.toFixed(1);
}

const SCREEN_WIDTH = Dimensions.get('window').width;


export default function Performance() {
  const [filter, setFilter]       = useState<FilterType>('TODOS');
  const [sessions, setSessions]   = useState<Session[]>(MOCK_SESSIONS);

  // ── Buscar dados da API ──
  useEffect(() => {
    async function fetchSessions() {
      try {
        // TODO: substituir pela chamada real
        // const response = await fetch('https://sua-api.com/sessions');
        // const data = await response.json();
        // setSessions(data);
      } catch (error) {
        console.error('Erro ao buscar sessões:', error);
      }
    }
    fetchSessions();
  }, []);

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
        <View style={styles.filterRow}>
          {(['TODOS', 'CORRIDA', 'CICLISMO'] as FilterType[]).map(f => (
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