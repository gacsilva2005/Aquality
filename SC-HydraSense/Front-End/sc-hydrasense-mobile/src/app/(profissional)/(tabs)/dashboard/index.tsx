import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Importando as bibliotecas
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';

// Importando os estilos e o tema
import { theme } from '../../../../global/themas';
import { styles } from './styles';
import {Header} from "@/src/components/Header";
import { Screen } from '../../../../components/Screen';

export default function ReportsScreen() {

  // 1. Criando os estados para controlar o Pop-up
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    isError: false,
  });

  // Novos estados para o fluxo do PDF
  const [loading, setLoading] = useState(false);

  // Em um cenário real, viria do AuthContext (ex: const { user } = useAuth(); const clubeId = user.clubeId;)
  const clubeId = "1";

  // Função auxiliar para chamar o pop-up facilmente
  const showPopUp = (title: string, message: string, isError: boolean = false) => {
    setModalConfig({ title, message, isError });
    setModalVisible(true);
  };

  const handleExport = async () => {
    if (!clubeId) {
        showPopUp("Erro", "Clube ID não encontrado no contexto.", true);
        return;
    }
    
    setLoading(true);
    try {
      const hostIp = Constants.expoConfig?.hostUri?.split(':')[0] || '10.0.2.2';
      const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${hostIp}:8080`;
      const url = `${API_URL}/api/relatorios/geral/${clubeId}/pdf`;
      const destino = new File(Paths.document, `relatorio_geral_${clubeId}.pdf`);
      
      const resultFile = await File.downloadFileAsync(url, destino, { idempotent: true });
      
      if (resultFile.size === 0) {
        Alert.alert("Aviso", "Sem dados no período");
        setLoading(false);
        return;
      }

      setLoading(false);
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
          await Sharing.shareAsync(resultFile.uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Relatório Geral' });
      } else {
          showPopUp('Não Suportado', 'O compartilhamento não está disponível neste dispositivo.', true);
      }

    } catch (error) {
      console.error(error);
      showPopUp('Ops, algo deu errado', 'Não foi possível gerar o arquivo para exportação.', true);
      setLoading(false);
    }
  };



    return (
      <Screen
          backgroundColor={theme.colors.background}
          scrollable={true}
          HeaderComponent={<Header />}
      >
          <SafeAreaView style={styles.container}>
              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* HEADER */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.headerTitle}>RELATÓRIOS</Text>
                <Text style={styles.headerSubtitle}>Visão Geral da Equipe</Text>
              </View>
              <TouchableOpacity style={styles.exportButton} onPress={handleExport} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={theme.colors.textWhite} />
                ) : (
                    <>
                        <Feather name="download" size={16} color={theme.colors.textWhite} />
                        <Text style={styles.exportButtonText}>EXPORTAR</Text>
                    </>
                )}
              </TouchableOpacity>
            </View>

            {/* PRONTIDÃO DA EQUIPE */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Prontidão da Equipe</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLarge}>84</Text>
                <Text style={styles.scoreLabel}>% MÉDIA</Text>
              </View>
              <View style={styles.badgeSuccess}>
                <Feather name="trending-up" size={14} color={theme.colors.success} />
                <Text style={styles.badgeSuccessText}>+2.4% vs Semana Passada</Text>
              </View>
            </View>

            {/* TENDÊNCIAS DA SEMANA */}
            <Text style={styles.sectionTitle}>TENDÊNCIAS DA SEMANA</Text>
            <View style={styles.row}>
              <View style={[styles.card, styles.halfCard]}>
                <View style={styles.iconRow}>
                  <MaterialCommunityIcons name="fire" size={24} color={theme.colors.critical} />
                  <MaterialCommunityIcons name="fire" size={24} color={theme.colors.border} />
                </View>
                <Text style={styles.cardSubtitle}>CARGA AGUDA</Text>
                <Text style={styles.statValue}>4.2<Text style={styles.statUnit}>k</Text></Text>
              </View>

              <View style={[styles.card, styles.halfCard]}>
                <View style={styles.iconRow}>
                  <MaterialCommunityIcons name="heart" size={24} color={theme.colors.primary} />
                  <MaterialCommunityIcons name="heart" size={24} color={theme.colors.border} />
                </View>
                <Text style={styles.cardSubtitle}>FADIGA (RPE)</Text>
                <Text style={styles.statValue}>7.8</Text>
              </View>
            </View>

            {/* MAPA DE RISCO */}
            <View style={styles.riskHeader}>
              <Text style={styles.sectionTitle}>MAPA DE RISCO</Text>
              <View style={styles.riskBadge}>
                <Text style={styles.riskBadgeText}>3 CRÍTICOS</Text>
              </View>
            </View>

            {/* Lista de Atletas */}
            <View style={styles.athleteList}>
              {/* Atleta 1 - Crítico */}
              <View style={[styles.athleteCard, { borderLeftColor: theme.colors.critical }]}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=11' }} style={styles.avatar} />
                <View style={styles.athleteInfo}>
                  <Text style={styles.athleteName}>Silva, L.</Text>
                  <View style={styles.alertRow}>
                    <Feather name="alert-triangle" size={12} color={theme.colors.critical} />
                    <Text style={[styles.alertText, { color: theme.colors.critical }]}>SOBRECARGA AGUDA</Text>
                  </View>
                </View>
                <Text style={[styles.athleteScore, { color: theme.colors.critical }]}>92<Text style={styles.scoreUnit}>%</Text></Text>
              </View>

              {/* Atleta 2 - Alerta Primário */}
              <View style={[styles.athleteCard, { borderLeftColor: theme.colors.primary }]}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={styles.avatar} />
                <View style={styles.athleteInfo}>
                  <Text style={styles.athleteName}>Costa, M.</Text>
                  <View style={styles.alertRow}>
                    <Feather name="trending-up" size={12} color={theme.colors.primary} />
                    <Text style={[styles.alertText, { color: theme.colors.primary }]}>FADIGA ALTA</Text>
                  </View>
                </View>
                <Text style={[styles.athleteScore, { color: theme.colors.primary }]}>85<Text style={styles.scoreUnit}>%</Text></Text>
              </View>

              {/* Atleta 3 - Aviso (Warning) */}
              <View style={[styles.athleteCard, { borderLeftColor: theme.colors.warning }]}>
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.avatar} />
                <View style={styles.athleteInfo}>
                  <Text style={styles.athleteName}>Santos, P.</Text>
                  <View style={styles.alertRow}>
                    <Feather name="moon" size={12} color={theme.colors.warning} />
                    <Text style={[styles.alertText, { color: theme.colors.warning }]}>DÉFICIT DE SONO</Text>
                  </View>
                </View>
                <Text style={[styles.athleteScore, { color: theme.colors.warning }]}>78<Text style={styles.scoreUnit}>%</Text></Text>
              </View>
            </View>

            <View style={{ height: 40 }} />

          {/* POP-UP ESTILIZADO  */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // Para o botão de voltar do Android
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>

                {/* Ícone dinâmico: Muda de cor/formato se for erro ou sucesso */}
                <View style={[styles.modalIconContainer, { backgroundColor: modalConfig.isError ? theme.colors.primaryLight : 'rgba(22, 163, 74, 0.1)' }]}>
                  <Feather
                    name={modalConfig.isError ? "alert-circle" : "check-circle"}
                    size={32}
                    color={modalConfig.isError ? theme.colors.primary : theme.colors.success}
                  />
                </View>

                <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                <Text style={styles.modalMessage}>{modalConfig.message}</Text>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: modalConfig.isError ? theme.colors.primary : theme.colors.success }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>ENTENDI</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>
              </ScrollView>

          </SafeAreaView>
      </Screen>
  );
}