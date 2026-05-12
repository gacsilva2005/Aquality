import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Screen } from '../../../components/Screen';
import { Header } from '../../../components/Header';
import { Divider } from '../../../components/Divider';
import { styles } from './styles';
import { theme } from '../../../global/themas';

export default function Dashboard() {
  const [hydrationLevel, setHydrationLevel] = useState(82);
  const [sweatRate, setSweatRate] = useState(1.2);
  const [waterBalance, setWaterBalance] = useState(-0.84);
  const [recoveryPercent, setRecoveryPercent] = useState(94);

  // API
  useEffect(() => {
    async function buscarDadosDaAPI() {
      try {

      } catch (error) {}
    }
    buscarDadosDaAPI();
  }, []);

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
            <FontAwesome5 name="robot" size={40} color="#FCE7E9" style={styles.bgIcon} />
          </View>

          <Text style={styles.strategyText}>
            Clima a <Text style={styles.textHighlightRed}>32°C</Text>. Sua taxa de
            sudorese sobe <Text style={styles.textHighlightRed}>15%</Text> nesse
            calor. Prepare <Text style={styles.textHighlightRed}>1.5L</Text> de água.
          </Text>

          <View style={styles.strategyActionRow}>
            <TouchableOpacity style={styles.btnProtocol}>
              <Text style={styles.btnProtocolText}>VER PROTOCOLO</Text>
            </TouchableOpacity>
            <Text style={styles.aiRecommendationText}>
              RECOMENDAÇÃO{'\n'}BASEADA EM IA
            </Text>
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
          {/* Header do card */}
          <View style={styles.lastWorkoutHeader}>
            <Text style={styles.cardLabel}>ÚLTIMO TREINO</Text>
            <Text style={styles.dateText}>16 DE OUT, 08:30</Text>
          </View>

          {/* Métricas empilhadas */}
          <View style={styles.metricsContainer}>

            {/* Taxa de Sudorese */}
            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>TAXA DE SUDORESE</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>{sweatRate}</Text>
                <Text style={styles.metricUnit}>L/H</Text>
              </View>
              <View style={styles.tagGreen}>
                <Text style={styles.tagGreenText}>ZONA ALTA</Text>
              </View>
            </View>

            {/* Balanço Hídrico */}
            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>BALANÇO HÍDRICO</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>{waterBalance}</Text>
                <Text style={styles.metricUnit}>L</Text>
              </View>
              <View style={styles.tagRed}>
                <Text style={styles.tagRedText}>DÉFICIT CRÍTICO</Text>
              </View>
            </View>

          </View>

          {/* Overlay de Recuperação — canto inferior direito */}
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
        <TouchableOpacity style={styles.startSessionButton}>
          <FontAwesome5 name="play" size={14} color="#FFF" />
          <Text style={styles.startSessionText}>INICIAR SESSÃO</Text>
        </TouchableOpacity>

      </View>
    </Screen>
  );
}