import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../global/themas';
import { styles } from './styles';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Dados mockados baseados na imagem
const athletes = [
  { id: '1', name: 'Tiago Costa', role: 'GUARDA-REDES', status: 'CRÍTICO', statusColor: theme.colors.critical, vol: '0.8', maxVol: '2.2L', progress: 36, avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Miguel Santos', role: 'AVANÇADO', status: 'ATENÇÃO', statusColor: theme.colors.warning, vol: '1.5', maxVol: '2.8L', progress: 53, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', name: 'João Silva', role: 'MÉDIO CENTRO', status: 'ÓTIMO', statusColor: theme.colors.success, vol: '2.4', maxVol: '2.5L', progress: 96, avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '4', name: 'Pedro Martins', role: 'DEFESA CENTRAL', status: 'ÓTIMO', statusColor: theme.colors.success, vol: '2.9', maxVol: '3.0L', progress: 96, avatar: 'https://i.pravatar.cc/150?img=14' },
];

export default function DashboardHidratacao() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name ? String(name).toUpperCase() : 'NOME DA EQUIPE'}</Text>
        <TouchableOpacity>
          <Feather name="help-circle" size={24} color={theme.colors.textWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Bloco 1: Hidratação Total */}
        <View style={styles.topStatsContainer}>
          <View>
            <Text style={styles.sectionSubtitle}>HIDRATAÇÃO TOTAL DA EQUIPA</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.hugeNumber}>42</Text>
              <Text style={styles.unitText}> L</Text>
            </View>
            <View style={styles.trendRow}>
              <Feather name="trending-up" size={16} color={theme.colors.success} />
              <Text style={styles.trendText}> +15% vs Ontem</Text>
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
              <Text style={styles.largeNumber}>1.8</Text>
              <Text style={styles.unitTextSmall}> L/h</Text>
            </View>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.sectionSubtitleCritical}>ESTADO CRÍTICO</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.largeNumberCritical}>3</Text>
              <View style={styles.statusDistContainer}>
                <Text style={styles.statusDistText}>STATUS DIST.</Text>
                <View style={styles.progressBarWrapper}>
                  <View style={[styles.progressSegment, { flex: 2, backgroundColor: theme.colors.success }]} />
                  <View style={[styles.progressSegment, { flex: 1, backgroundColor: theme.colors.warning }]} />
                  <View style={[styles.progressSegment, { flex: 0.5, backgroundColor: theme.colors.primary }]} />
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
          
          {/* Placeholder do Gráfico (Aqui entraria react-native-svg ou similar) */}
          <View style={styles.chartPlaceholder}>
            {/* Imagem/SVG do gráfico curva vermelha entra aqui */}
            <View style={styles.chartLineMock} />
            <View style={styles.chartXAxis}>
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map(day => (
                <Text key={day} style={styles.chartAxisText}>{day}</Text>
              ))}
            </View>
            <Text style={styles.chartFooterText}>LAST 7 DAYS</Text>
          </View>
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
          {athletes.map((athlete) => (
            <View key={athlete.id} style={styles.athleteCard}>
              <View style={styles.athleteInfoRow}>
                <Image source={{ uri: athlete.avatar }} style={styles.athleteAvatar} />
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
                    <Text style={styles.athleteVol}>{athlete.vol}</Text>
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
                    { width: `${athlete.progress}%`, backgroundColor: athlete.statusColor === theme.colors.critical ? theme.colors.backgroundSecondary : theme.colors.textPrimary }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Mock */}
      {/* 
      Comentado para utilizar a navegação nativa do Expo Router.
      <View style={styles.bottomNav}>
        ...
      </View>
      */}
    </SafeAreaView>
  );
}
