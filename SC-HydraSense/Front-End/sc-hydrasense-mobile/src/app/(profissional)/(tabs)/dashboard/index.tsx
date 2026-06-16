import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';

import { theme } from '../../../../global/themas';
import { styles } from './styles';
import { Header } from "@/src/components/Header";
import { Screen } from '../../../../components/Screen';
import { useUser } from '../../../../contexts/UserContext';
import { useRouter } from 'expo-router';

interface DashboardData {
  totalAtletas: number;
  sessoesUltimos7Dias: number;
  taxaMediaSudorese: number;
  variacaoMediaMassa: number;
  temperaturaAtual: number | null;
  umidadeAtual: number | null;
  descricaoClima: string | null;
  aumentoSudoresePercent: number | null;
  aguaRecomendadaLitros: number | null;
  rankingPerformance: { id: number; nome: string; avatar: string | null; totalSessoes: number; sessoesIdeais: number; percentualIdeal: number }[];
  mapaRisco: { id: number; nome: string; avatar: string | null; status: string; statusColor: string; variacaoMassa: number; taxaSudorese: number; alerta: string }[];
  sintomasRecorrentes: { sintoma: string; ocorrencias: number; percentual: number }[];
  alertasOutliers: { sessaoId: number; atletaId: number; nomeAtleta: string; tipo: string; descricao: string; dataHora: string }[];
  tendenciaSemanal: { dia: string; mediaBalancoHidrico: number; mediaTaxaSudorese: number; totalSessoes: number }[];
  atletasCriticos: number;
  atletasAtencao: number;
  atletasIdeais: number;
  atletasSuperingestao: number;
}

export default function DashboardProfissional() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const clubeId = user?.clube?.id || 1;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${ip}:8080`;
        const res = await fetch(`${API_URL}/api/dashboard/profissional/${clubeId}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error('Erro ao buscar dashboard profissional:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [clubeId]);

  if (loading) {
    return (
      <Screen backgroundColor={theme.colors.background} scrollable={false} HeaderComponent={<Header />}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 12, color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyRegular }}>Carregando dashboard...</Text>
        </View>
      </Screen>
    );
  }

  const chartLabels = (data?.tendenciaSemanal ?? []).map(t => t.dia);
  const chartBalanco = (data?.tendenciaSemanal ?? []).map(t => t.mediaBalancoHidrico);

  const getAvatarSource = (avatar: string | null) => {
    if (!avatar) return require('../../../../assets/images/anonymous_avatar.png');
    if (avatar.startsWith('data:image') || avatar.startsWith('http')) return { uri: avatar };
    return { uri: `data:image/jpeg;base64,${avatar}` };
  };

  return (
    <Screen backgroundColor={theme.colors.background} scrollable={true} HeaderComponent={<Header />}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ═══ HEADER ═══ */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerTitle}>DASHBOARD</Text>
              <Text style={styles.headerSubtitle}>Monitoramento Fisiológico</Text>
            </View>
          </View>

          {/* ═══ SEÇÃO 1: VISÃO GERAL — KPIs ═══ */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.primary} />
              <Text style={styles.kpiValue}>{data?.totalAtletas ?? 0}</Text>
              <Text style={styles.kpiLabel}>ATLETAS</Text>
            </View>
            <View style={styles.kpiCard}>
              <Feather name="activity" size={20} color={theme.colors.primary} />
              <Text style={styles.kpiValue}>{data?.sessoesUltimos7Dias ?? 0}</Text>
              <Text style={styles.kpiLabel}>SESSÕES 7D</Text>
            </View>
            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="water" size={20} color={theme.colors.primary} />
              <Text style={styles.kpiValue}>{data?.taxaMediaSudorese?.toFixed(1) ?? '—'}</Text>
              <Text style={styles.kpiLabel}>SUOR L/h</Text>
            </View>
            <View style={styles.kpiCard}>
              <Feather name="percent" size={20} color={theme.colors.primary} />
              <Text style={styles.kpiValue}>{data?.variacaoMediaMassa?.toFixed(1) ?? '—'}%</Text>
              <Text style={styles.kpiLabel}>Δ MASSA</Text>
            </View>
          </View>

          {/* ═══ SEÇÃO 2: CLIMA ATUAL ═══ */}
          {data?.temperaturaAtual != null && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="weather-partly-cloudy" size={22} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>CONDIÇÕES AMBIENTAIS</Text>
              </View>
              <View style={styles.climaRow}>
                <View style={styles.climaItem}>
                  <Feather name="thermometer" size={16} color={theme.colors.critical} />
                  <Text style={styles.climaValue}>{data.temperaturaAtual?.toFixed(0)}°C</Text>
                </View>
                <View style={styles.climaItem}>
                  <MaterialCommunityIcons name="water-percent" size={16} color="#3B82F6" />
                  <Text style={styles.climaValue}>{data.umidadeAtual?.toFixed(0)}%</Text>
                </View>
                <View style={styles.climaItem}>
                  <Feather name="trending-up" size={16} color={theme.colors.warning} />
                  <Text style={styles.climaValue}>+{data.aumentoSudoresePercent?.toFixed(0)}% suor</Text>
                </View>
              </View>
              <Text style={styles.climaDesc}>{data.descricaoClima} • Recomendação: +{data.aguaRecomendadaLitros?.toFixed(1)}L/dia</Text>
            </View>
          )}

          {/* ═══ SEÇÃO 3: RANKING DE PERFORMANCE ═══ */}
          <Text style={styles.sectionTitle}>🏆 RANKING — ADESÃO HÍDRICA</Text>
          <View style={styles.card}>
            {(data?.rankingPerformance ?? []).length === 0 ? (
              <Text style={styles.emptyText}>Sem dados suficientes para ranking</Text>
            ) : (
              (data?.rankingPerformance ?? []).map((atleta, index) => (
                <TouchableOpacity
                  key={atleta.id}
                  style={styles.rankingRow}
                  onPress={() => router.push(`/(profissional)/athlete/${atleta.id}` as any)}
                >
                  <Text style={styles.rankingPosition}>{index + 1}º</Text>
                  <Image source={getAvatarSource(atleta.avatar)} style={styles.rankingAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rankingName}>{atleta.nome}</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(atleta.percentualIdeal, 100)}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.rankingPercent}>{atleta.percentualIdeal.toFixed(0)}%</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* ═══ SEÇÃO 4: MAPA DE RISCO ═══ */}
          <View style={styles.riskHeader}>
            <Text style={styles.sectionTitle}>⚠️ MAPA DE RISCO</Text>
          </View>

          {/* Distribuição de status */}
          <View style={styles.riskDistRow}>
            <View style={[styles.riskDistBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.riskDistText, { color: '#16A34A' }]}>✓ {data?.atletasIdeais ?? 0} Ideal</Text>
            </View>
            <View style={[styles.riskDistBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.riskDistText, { color: '#D97706' }]}>⚡ {data?.atletasAtencao ?? 0} Atenção</Text>
            </View>
            <View style={[styles.riskDistBadge, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.riskDistText, { color: '#DC2626' }]}>🔴 {data?.atletasCriticos ?? 0} Crítico</Text>
            </View>
            {(data?.atletasSuperingestao ?? 0) > 0 && (
              <View style={[styles.riskDistBadge, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.riskDistText, { color: '#7C3AED' }]}>💧 {data?.atletasSuperingestao} Super</Text>
              </View>
            )}
          </View>

          {/* Lista de atletas de risco (só não-ideais) */}
          {(data?.mapaRisco ?? []).filter(a => a.status !== 'IDEAL').map(atleta => (
            <TouchableOpacity
              key={atleta.id}
              style={[styles.athleteCard, { borderLeftColor: atleta.statusColor }]}
              onPress={() => router.push(`/(profissional)/athlete/${atleta.id}` as any)}
            >
              <Image source={getAvatarSource(atleta.avatar)} style={styles.avatar} />
              <View style={styles.athleteInfo}>
                <Text style={styles.athleteName}>{atleta.nome}</Text>
                <View style={styles.alertRow}>
                  <Feather name="alert-triangle" size={12} color={atleta.statusColor} />
                  <Text style={[styles.alertText, { color: atleta.statusColor }]}>{atleta.alerta}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.athleteScore, { color: atleta.statusColor }]}>{atleta.variacaoMassa?.toFixed(1)}%</Text>
                <Text style={styles.athleteSubScore}>{atleta.taxaSudorese?.toFixed(1)} L/h</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* ═══ SEÇÃO 5: SINTOMAS RECORRENTES ═══ */}
          {(data?.sintomasRecorrentes ?? []).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>🩺 SINTOMAS RECORRENTES (14 DIAS)</Text>
              <View style={styles.card}>
                {data!.sintomasRecorrentes.map((s, i) => (
                  <View key={i} style={styles.sintomaRow}>
                    <Text style={styles.sintomaName}>{s.sintoma}</Text>
                    <View style={styles.sintomaBarBg}>
                      <View style={[styles.sintomaBarFill, { width: `${Math.min(s.percentual, 100)}%` }]} />
                    </View>
                    <Text style={styles.sintomaPercent}>{s.percentual.toFixed(0)}%</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ═══ SEÇÃO 6: ALERTAS DE OUTLIERS ═══ */}
          {(data?.alertasOutliers ?? []).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>🚨 ALERTAS DE INCONSISTÊNCIA</Text>
              {data!.alertasOutliers.map((alerta, i) => (
                <View key={i} style={styles.outlierCard}>
                  <View style={styles.outlierHeader}>
                    <Feather name="alert-circle" size={18} color={theme.colors.primary} />
                    <Text style={styles.outlierTipo}>
                      {alerta.tipo === 'TAXA_MUITO_ALTA' ? 'Taxa Muito Alta' : alerta.tipo === 'TAXA_MUITO_BAIXA' ? 'Taxa Muito Baixa' : 'Variação Excessiva'}
                    </Text>
                  </View>
                  <Text style={styles.outlierDesc}>{alerta.descricao}</Text>
                  <Text style={styles.outlierMeta}>{alerta.nomeAtleta} • {alerta.dataHora}</Text>
                </View>
              ))}
            </>
          )}


          {/* ═══ SEÇÃO 8: TENDÊNCIA SEMANAL ═══ */}
          <Text style={styles.sectionTitle}>📈 TENDÊNCIA SEMANAL</Text>
          {chartBalanco.length > 0 && chartBalanco.some(v => v !== 0) ? (
            <View style={styles.card}>
              <LineChart
                data={{
                  labels: chartLabels,
                  datasets: [{ data: chartBalanco.length > 0 ? chartBalanco : [0] }],
                }}
                width={Dimensions.get('window').width - 64}
                height={160}
                chartConfig={{
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  color: (opacity = 1) => `rgba(217, 4, 41, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  strokeWidth: 2,
                  fillShadowGradientFrom: '#D90429',
                  fillShadowGradientTo: '#FFFFFF',
                  fillShadowGradientFromOpacity: 0.15,
                  fillShadowGradientToOpacity: 0.0,
                  propsForDots: { r: '4', strokeWidth: '2', stroke: '#D90429', fill: '#FFFFFF' },
                }}
                bezier
                style={{ borderRadius: 16 }}
              />
              <Text style={styles.chartFooter}>BALANÇO HÍDRICO MÉDIO (KG) — ÚLTIMOS 7 DIAS</Text>
            </View>
          ) : (
            <View style={[styles.card, { alignItems: 'center', padding: 24 }]}>
              <Text style={styles.emptyText}>Sem dados de tendência para exibir</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}