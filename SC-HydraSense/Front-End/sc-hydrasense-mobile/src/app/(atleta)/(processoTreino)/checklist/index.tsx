import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Screen } from '@/src/components/Screen';
import { Button } from '@/src/components/Button';
import { EstadoBasal } from '@/src/components/EstadoBasal';
import { theme } from '@/src/global/themas';
import { styles } from './styles';

export default function ChecklistPadronizacao() {
  const { type, sessaoId, descontoKitGramas } = useLocalSearchParams();
  // --- ESTADO DAS ABAS ---
  const [currentStep, setCurrentStep] = useState(1);

  // --- ESTADO DOS CHECKBOXES ---
  const [checkboxes, setCheckboxes] = useState({
    bexiga: false,
    balanca: false,
    superficiePlan: false,
    vestimenta: false,
    calcados: false,
    acessorios: false,
  });

  // --- ESTADO DA ESCALA DE URINA (1-8) ---
  const [coresUrina, setCoresUrina] = useState<number | null>(null);

  // --- ESTADO DA ESCALA DE SEDE (0-10) ---
  const [sede, setSede] = useState<number>(5);

  // --- ESTADO DO MODAL DE CONFIRMAÇÃO ---
  const [modalSairVisivel, setModalSairVisivel] = useState(false);

  // Atualizar checkbox
  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Validar se tudo está preenchido
  const isFormValid = () => {
    const todosChecados = Object.values(checkboxes).every((v) => v);
    const urinaSelected = coresUrina !== null;
    return todosChecados && urinaSelected;
  };

  // Validar antes de confirmar
  const handleConfirmarEPesar = () => {
    if (!isFormValid()) {
      Alert.alert(
        'Atenção',
        'Por favor, confirme todos os itens obrigatórios para prosseguir.'
      );
      return;
    }

    router.push({
      pathname: '/pesagemPreTreino' as any,
      params: {
        type,
        sessaoId,
        descontoKitGramas,
        corUrina: coresUrina,
        sede: sede,
      },
    });
  };

  // Sair do fluxo com confirmação
  const handleSairFluxo = () => {
    setModalSairVisivel(false);
    router.back();
  };

  return (
    <Screen style={styles.container}>
      {/* ============= HEADER ============= */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
        <TouchableOpacity style={{ marginRight: 16 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#0e0e0e" />
        </TouchableOpacity>
        <Text style={{ fontFamily: theme.fonts.headingBold, fontSize: 20, color: theme.colors.textPrimary }}>
          PRÉ-SESSÃO
        </Text>
      </View>

      {/* ============= CONTEÚDO ============= */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* --- KIT SELECIONADO --- */}
          <View style={styles.section}>
            <View style={styles.kitCard}>
              <MaterialCommunityIcons
                name="checkbox-marked-circle"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.kitInfo}>
                <Text style={styles.kitTitle}>KIT SELECIONADO</Text>
                <Text style={styles.kitName}>Kit Corrida Leve — 320g</Text>
              </View>
              <View style={styles.badgeSelecionado}>
                <Text style={styles.badgeText}>SELECIONADO</Text>
              </View>
            </View>
          </View>

          {/* --- OBRIGATÓRIO PARA COLETA --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OBRIGATÓRIO PARA COLETA</Text>

            <View style={styles.checkboxGroup}>
              {/* Checkbox 1 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.bexiga}
                  onValueChange={() => handleCheckboxChange('bexiga')}
                  color={
                    checkboxes.bexiga ? theme.colors.primary : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Esvaziou a bexiga</Text>
              </View>

              {/* Checkbox 2 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.balanca}
                  onValueChange={() => handleCheckboxChange('balanca')}
                  color={
                    checkboxes.balanca ? theme.colors.primary : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>
                  Estou na mesma balança de sempre
                </Text>
              </View>

              {/* Checkbox 3 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.superficiePlan}
                  onValueChange={() =>
                    handleCheckboxChange('superficiePlan')
                  }
                  color={
                    checkboxes.superficiePlan
                      ? theme.colors.primary
                      : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>
                  Balança em superfície plana e nivelada
                </Text>
              </View>

              {/* Checkbox 4 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.vestimenta}
                  onValueChange={() => handleCheckboxChange('vestimenta')}
                  color={
                    checkboxes.vestimenta ? theme.colors.primary : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>
                  Vestimenta mínima é igual ao protocolo
                </Text>
              </View>

              {/* Checkbox 5 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.calcados}
                  onValueChange={() => handleCheckboxChange('calcados')}
                  color={
                    checkboxes.calcados ? theme.colors.primary : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>
                  Sem calçados/tênis
                </Text>
              </View>

              {/* Checkbox 6 */}
              <View style={styles.checkboxItem}>
                <Checkbox
                  value={checkboxes.acessorios}
                  onValueChange={() => handleCheckboxChange('acessorios')}
                  color={
                    checkboxes.acessorios ? theme.colors.primary : '#CCC'
                  }
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>
                  Sem acessórios: relógio, pulseira, brincos
                </Text>
              </View>
            </View>
          </View>

          {/* --- ESTADO BASAL --- */}
          {/* --- ESTADO BASAL --- */}
          <View style={styles.section}>
            <EstadoBasal
              corUrina={coresUrina}
              setCorUrina={setCoresUrina}
              sede={sede}
              setSede={setSede}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

      {/* ============= FOOTER COM BOTÃO ============= */}
      <View style={styles.footer}>
        <Button
          title="CONFIRMAR E PESAR AGORA"
          onPress={handleConfirmarEPesar}
        />

        <TouchableOpacity onPress={() => setModalSairVisivel(true)}>
          <Text style={styles.exitLink}>Sair do fluxo</Text>
        </TouchableOpacity>
      </View>

      {/* ============= MODAL DE CONFIRMAÇÃO ============= */}
      <Modal
        visible={modalSairVisivel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalSairVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={styles.modalMessage}>
              Você está prestes a sair do fluxo de preparação. Deseja continuar?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalSairVisivel(false)}
              >
                <Text style={styles.modalButtonCancelText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleSairFluxo}
              >
                <Text style={styles.modalButtonConfirmText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}