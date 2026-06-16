import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../global/themas';
import { styles } from './styles';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';

export default function DashboardHidratacao() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        const API_URL = `http://${ip}:8080`;

        const res = await fetch(`${API_URL}/Equipe/${id}/dashboard`);
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        } else {
          console.error('Erro ao buscar dashboard da equipe:', res.status);
        }
      } catch (error) {
        console.error('Erro na requisição do dashboard da equipe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDashboard();
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={theme.colors.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{name ? String(name).toUpperCase() : 'CARREGANDO...'}</Text>
          <TouchableOpacity>
            <Feather name="help-circle" size={24} color={theme.colors.textWhite} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 10, color: '#666' }}>Carregando dados da equipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const chartLabels = (dashboardData?.graficoBalanco ?? []).map((p: any) => p.dia);
  const chartValues = (dashboardData?.graficoBalanco ?? []).map((p: any) => p.balanco);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name ? String(name).toUpperCase() : (dashboardData?.nome ?? 'NOME DA EQUIPE').toUpperCase()}</Text>
        <TouchableOpacity>
          <Feather name="help-circle" size={24} color={theme.colors.textWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Bloco 1: Hidratação Total */}
        <View style={styles.topStatsContainer}>
          <View>
            <Text style={styles.sectionSubtitle}>HIDRATAÇÃO TOTAL DA EQUIPE</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.hugeNumber}>{dashboardData?.hidratacaoTotalHoje ?? 0}</Text>
              <Text style={styles.unitText}> L</Text>
            </View>
            <View style={styles.trendRow}>
              <Feather 
                name={(dashboardData?.hidratacaoVariacaoOntem ?? 0) >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={(dashboardData?.hidratacaoVariacaoOntem ?? 0) >= 0 ? theme.colors.success : theme.colors.critical} 
              />
              <Text style={[styles.trendText, { color: (dashboardData?.hidratacaoVariacaoOntem ?? 0) >= 0 ? theme.colors.success : theme.colors.critical }]}>
                {" "}{(dashboardData?.hidratacaoVariacaoOntem ?? 0) >= 0 ? "+" : ""}{dashboardData?.hidratacaoVariacaoOntem ?? 0}% vs Ontem
              </Text>
            </View>
          </View>
          {/* Ícone de Gota Grande */}
          <View style={styles.waterDropContainer}>
            <MaterialCommunityIcons name="water-outline" size={64} color={theme.colors.primaryLight} />
          </View>
        </View>

        {/* Bloco 2: Métricas Secundárias */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCol}>
            <Text style={styles.sectionSubtitle}>TAXA MÉDIA SUOR</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.largeNumber}>{dashboardData?.taxaMediaSudorese ?? '--'}</Text>
              <Text style={styles.unitTextSmall}> L/h</Text>
            </View>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.sectionSubtitleCritical}>ESTADO CRÍTICO</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.largeNumberCritical}>{dashboardData?.statusCriticoCount ?? 0}</Text>
              <View style={styles.statusDistContainer}>
                <Text style={styles.statusDistText}>STATUS DIST.</Text>
                <View style={styles.progressBarWrapper}>
                  {(dashboardData?.statusDist?.otimo ?? 0) === 0 &&
                   (dashboardData?.statusDist?.atencao ?? 0) === 0 &&
                   (dashboardData?.statusDist?.critico ?? 0) === 0 ? (
                     <View style={[styles.progressSegment, { flex: 1, backgroundColor: '#E0E0E0' }]} />
                  ) : (
                    <>
                      <View style={[styles.progressSegment, { flex: dashboardData?.statusDist?.otimo ?? 0, backgroundColor: theme.colors.success }]} />
                      <View style={[styles.progressSegment, { flex: dashboardData?.statusDist?.atencao ?? 0, backgroundColor: theme.colors.warning }]} />
                      <View style={[styles.progressSegment, { flex: dashboardData?.statusDist?.critico ?? 0, backgroundColor: theme.colors.primary }]} />
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bloco 3: Gráfico de Tendência */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>TENDÊNCIA DE HIDRATAÇÃO{'\n'}DA EQUIPE</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>EXPORTAR{'\n'}RELATÓRIO</Text>
              <Feather name="upload" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {chartValues.length > 0 ? (
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, alignItems: 'center' }}>
              <LineChart
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      data: chartValues,
                    }
                  ]
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
                  fillShadowGradientFromOpacity: 0.2,
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
              <Text style={styles.chartFooterText}>BALANÇO HÍDRICO MÉDIO (KG) - ÚLTIMOS 7 DIAS</Text>
            </View>
          ) : (
            <View style={{ height: 160, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16 }}>
              <Text style={{ color: '#999' }}>Sem dados de balanço hídrico para exibir</Text>
            </View>
          )}
        </View>

        {/* Bloco 4: Desempenho Individual */}
        <View style={styles.individualSection}>
          <View style={styles.individualHeader}>
            <Text style={styles.sectionTitle}>DESEMPENHO INDIVIDUAL</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>FILTRAR</Text>
              <Feather name="filter" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Lista de Atletas */}
          {(dashboardData?.atletas ?? []).map((athlete: any) => {
            const photoSource = athlete.avatar
              ? (athlete.avatar.startsWith('data:image') || athlete.avatar.startsWith('http')
                  ? { uri: athlete.avatar }
                  : { uri: `data:image/jpeg;base64,${athlete.avatar}` })
              : require('../../../assets/images/anonymous_avatar.png');

            return (
              <TouchableOpacity 
                key={athlete.id} 
                style={styles.athleteCard}
                onPress={() => router.push(`/(profissional)/athlete/${athlete.id}`)}
              >
                <View style={styles.athleteInfoRow}>
                  <Image source={photoSource} style={styles.athleteAvatar} />
                  <View style={styles.athleteNameRole}>
                    <Text style={styles.athleteName}>{athlete.name}</Text>
                    <Text style={styles.athleteRole}>{athlete.role}</Text>
                  </View>
                  <View style={styles.athleteStats}>
                    <View style={[styles.statusBadge, { backgroundColor: `${athlete.statusColor}15` }]}>
                      <View style={[styles.statusDot, { backgroundColor: athlete.statusColor }]} />
                      <Text style={[styles.statusText, { color: athlete.statusColor }]}>{athlete.status}</Text>
                    </View>
                    <View style={styles.rowAlign}>
                      <Text style={styles.athleteVol}>{athlete.vol.toFixed(1)}</Text>
                      <Text style={styles.athleteMaxVol}> / {athlete.maxVol}</Text>
                      <Feather name="chevron-right" size={16} color={theme.colors.textSecondary} style={{marginLeft: 4}} />
                    </View>
                  </View>
                </View>
                {/* Barra de Progresso Individual */}
                <View style={styles.athleteProgressBarBg}>
                  <View 
                    style={[
                      styles.athleteProgressBarFill, 
                      { 
                        width: `${athlete.progress}%`, 
                        backgroundColor: athlete.statusColor === '#D90429' ? theme.colors.backgroundSecondary : theme.colors.textPrimary 
                      }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}

          {(dashboardData?.atletas ?? []).length === 0 && (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 }}>
              <Text style={{ color: '#999' }}>Nenhum atleta nesta equipe.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
