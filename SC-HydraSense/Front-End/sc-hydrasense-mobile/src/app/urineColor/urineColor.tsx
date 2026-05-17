import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { styles } from './urineColor_styles';
import { theme } from '../../global/themas';
import { router } from 'expo-router';

const URINE_LEVELS = [
  { id: 1, label: 'NÍVEL 1', color: '#FEFCE8' },
  { id: 2, label: 'NÍVEL 2', color: '#FEF9C3' },
  { id: 3, label: 'NÍVEL 3', color: '#FEF08A' },
  { id: 4, label: 'NÍVEL 4', color: '#FDE047' },
  { id: 5, label: 'NÍVEL 5', color: '#EAB308' },
  { id: 6, label: 'NÍVEL 6', color: '#CA8A04' },
  { id: 7, label: 'NÍVEL 7', color: '#A16207' },
  { id: 8, label: 'NÍVEL 8', color: '#713F12' },
];

function getStatus(id: number): string {
  if (id <= 3) return 'ÓTIMO';
  if (id <= 6) return 'ATENÇÃO';
  return 'CRÍTICO';
}

function getStatusColor(id: number): string {
  if (id <= 3) return theme.colors.success;
  if (id <= 6) return theme.colors.warning;
  return theme.colors.primary;
}

export default function UrineColor() {
  const [selected, setSelected] = useState<number | null>(null);

  function handleFinalize() {
    if (!selected) return;
    router.replace('/(tabs)/performance' as any);
  }

  return (
    <Screen
      backgroundColor={theme.colors.background}
      scrollable={true}
      HeaderComponent={<Header />}
    >
      <View style={styles.mainContent}>

        {/* ── TÍTULO ── */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageSubtitle}>MÉTRICA DE HIDRATAÇÃO</Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleLine}>COR DA URINA</Text>
            <Text style={styles.stepText}>ETAPA 01 / 03</Text>
          </View>
          <View style={styles.titleUnderline} />
        </View>

        {/* ── INSTRUÇÃO ── */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            Selecione o bloco de cor que mais se aproxima da sua amostra de urina atual. Isso fornece uma base fisiológica imediata para o seu status de hidratação.
          </Text>
        </View>

        {/* ── GRADE DE CORES ── */}
        <View style={styles.colorGrid}>
          {URINE_LEVELS.map(level => {
            const isSelected = selected === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(level.id)}
                activeOpacity={0.8}
              >
                {/* Check no canto superior direito do card */}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Feather name="check" size={12} color={theme.colors.textWhite} />
                  </View>
                )}

                {/* Bloco de cor centralizado dentro do card */}
                <View style={[styles.colorBlock, { backgroundColor: level.color }]} />

                {/* Label embaixo dentro do card */}
                <Text style={[
                  styles.colorLabel,
                  isSelected && styles.colorLabelSelected,
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── STATUS ── */}
        {selected && (
          <View style={[styles.statusBanner, { borderLeftColor: getStatusColor(selected) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(selected) }]}>
              {getStatus(selected)}
            </Text>
            <Text style={styles.statusDescription}>
              {selected <= 3
                ? 'Hidratação ótima. Continue assim!'
                : selected <= 6
                ? 'Hidratação moderada. Aumente a ingestão de água.'
                : 'Desidratação severa. Intervenção imediata necessária.'}
            </Text>
          </View>
        )}

        {/* ── CONTEXTO DE ANÁLISE ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Feather name="info" size={14} color={theme.colors.primary} />
            <Text style={styles.infoCardTitle}>CONTEXTO DE ANÁLISE</Text>
          </View>
          <Text style={styles.infoCardText}>
            Níveis 1-3 indicam hidratação ótima. Níveis 4-6 sugerem desidratação moderada. Níveis 7-8 requerem intervenção imediata.
          </Text>
        </View>

        {/* ── PROTOCOLO DE LABORATÓRIO ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <FontAwesome5 name="flask" size={13} color={theme.colors.primary} />
            <Text style={styles.infoCardTitle}>PROTOCOLO DE LABORATÓRIO</Text>
          </View>
          <Text style={styles.infoCardText}>
            Certifique-se de avaliar a amostra sob luz natural ou luz calibrada para máxima precisão.
          </Text>
        </View>

        {/* ── BOTÃO FINALIZAR ── */}
        <TouchableOpacity
          style={[styles.btnFinalize, !selected && styles.btnFinalizeDisabled]}
          onPress={handleFinalize}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.btnFinalizeText}>FINALIZAR SESSÃO</Text>
          <Feather name="arrow-right" size={16} color={theme.colors.textWhite} />
        </TouchableOpacity>

      </View>
    </Screen>
  );
}