import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Screen } from '@/src/components/Screen';
import { Button } from '@/src/components/Button';
import { theme } from '@/src/global/themas';
import { styles } from './styles';

export default function ChecklistPadronizacao() {
  // --- ESTADO DAS ABAS ---
  const [currentStep, setCurrentStep] = useState(2);

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

    console.log({
      checkboxes,
      coresUrina,
      sede,
    });

    Alert.alert('Sucesso', 'Dados coletados! Navegando para pesagem...');
  };

  // Sair do fluxo com confirmação
  const handleSairFluxo = () => {
    setModalSairVisivel(false);
    router.back();
  };

  return (
    <Screen style={styles.container}>
      {/* ============= PROGRESS BAR ============= */}
      <View style={styles.progressContainer}>
  {/* PRÉ-SESSÃO */}
  <View style={styles.progressStepWrapper}>
    <View
      style={[
        styles.progressCircle,
        styles.progressCircleCompleted,
      ]}
    >
      <MaterialCommunityIcons
        name="check"
        size={16}
        color="#FFF"
      />
    </View>

    <View style={styles.progressLineCompleted} />

    <Text
      style={{
        position: 'absolute',
        top: 48,
        width: 90,
        textAlign: 'center',
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 11,
      }}
    >
      PRÉ-SESSÃO
    </Text>
  </View>

  {/* CHECKLIST */}
  <View style={styles.progressStepWrapper}>
    <View
      style={[
        styles.progressCircle,
        styles.progressCircleActive,
      ]}
    >
      <Text
        style={{
          color: '#FFF',
          fontWeight: '700',
          fontSize: 16,
        }}
      >
        2
      </Text>
    </View>

    <View style={styles.progressLine} />

    <Text
      style={{
        position: 'absolute',
        top: 48,
        width: 90,
        textAlign: 'center',
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 11,
      }}
    >
      CHECKLIST
    </Text>
  </View>

  {/* PESAGEM */}
  <View style={styles.progressStepWrapper}>
    <View style={styles.progressCircle}>
      <Text style={styles.progressNumber}>3</Text>
    </View>

    <Text
      style={{
        position: 'absolute',
        top: 48,
        width: 90,
        textAlign: 'center',
        color: '#7C7C8A',
        fontWeight: '700',
        fontSize: 11,
      }}
    >
      PESAGEM
    </Text>
  </View>
</View>

      {/* ============= CONTEÚDO DA ABA PRÉ-SESSÃO ============= */}
      {currentStep === 1 && (
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ESTADO BASAL</Text>

            {/* Cor da Urina */}
            <View style={styles.scalerContainer}>
              <View style={styles.scalerHeader}>
                <Text style={styles.scalerLabel}>COR DA URINA (1-8)</Text>
              </View>

              <View style={styles.colorScaleGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((nivel) => {
                  const cores = [
                    '#F5F5DC',
                    '#FFFACD',
                    '#FFFFE0',
                    '#FFD700',
                    '#FFC700',
                    '#FFA500',
                    '#FF8C00',
                    '#FF7F50',
                  ];

                  return (
                    <TouchableOpacity
                      key={nivel}
                      style={[
                        styles.colorBox,
                        { backgroundColor: cores[nivel - 1] },
                        coresUrina === nivel && styles.colorBoxSelected,
                      ]}
                      onPress={() => setCoresUrina(nivel)}
                    >
                      {coresUrina === nivel && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Sede */}
            <View style={styles.scalerContainer}>
              <View style={styles.scalerHeader}>
                <Text style={styles.scalerLabel}>SEDE (0-10)</Text>
                <Text style={styles.sedeValue}>{Math.round(sede)}</Text>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={sede}
                onValueChange={setSede}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#E4E4E7"
                thumbTintColor={theme.colors.primary}
              />

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Sem sede</Text>
                <Text style={styles.sliderLabel}>Muita sede</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ============= CONTEÚDO DA ABA CHECKLIST ============= */}
      {currentStep === 2 && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHECKLIST</Text>
            <Text style={styles.placeholderText}>
              Conteúdo da aba CHECKLIST virá aqui
            </Text>
          </View>
        </ScrollView>
      )}

      {/* ============= CONTEÚDO DA ABA PESAGEM ============= */}
      {currentStep === 3 && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PESAGEM</Text>
            <Text style={styles.placeholderText}>
              Conteúdo da aba PESAGEM virá aqui
            </Text>
          </View>
        </ScrollView>
      )}

      {/* ============= FOOTER COM BOTÃO ============= */}
      <View style={styles.footer}>
        <Button
          title="CONFIRMAR E PESAR AGORA"
          onPress={handleConfirmarEPesar}
          disabled={!isFormValid()}
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