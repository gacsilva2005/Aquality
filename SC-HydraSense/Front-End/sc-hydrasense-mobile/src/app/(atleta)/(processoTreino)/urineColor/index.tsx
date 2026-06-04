import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Screen } from '../../../../components/Screen';
import { styles } from './urineColor_styles';
import { theme } from '../../../../global/themas';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../../../../components/Button';
import { EstadoBasal } from '@/src/components/EstadoBasal';

// Cores originais mantidas
const URINE_LEVELS = [
  { id: 1, color: '#FEFCE8' },
  { id: 2, color: '#FEF9C3' },
  { id: 3, color: '#FEF08A' },
  { id: 4, color: '#FDE047' },
  { id: 5, color: '#EAB308' },
  { id: 6, color: '#CA8A04' },
  { id: 7, color: '#A16207' },
  { id: 8, color: '#713F12' },
];

export default function UrineColor() {
  // Parâmetros recebidos da tela de treino
  const { sessaoId, type, seconds, water } = useLocalSearchParams<{
    sessaoId: string;
    type: string;
    seconds: string;
    water: string;
  }>();

  const [moment, setMoment] = useState<'Durante' | 'Após'>('Durante');
  const [volume, setVolume] = useState<number>(0);
  const [noUrine, setNoUrine] = useState(false);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [thirst, setThirst] = useState<number>(5);

  const adjustVolume = (amount: number) => {
    if (noUrine) setNoUrine(false);
    setVolume((prev) => Math.max(0, prev + amount));
  };

  const handleToggleNoUrine = () => {
    setNoUrine(!noUrine);
    if (!noUrine) {
      setVolume(0);
    }
  };

  const handleFinalize = (isSkip = false) => {
    const finalVolume = isSkip || noUrine ? 0 : volume;
    
    // Navega para o pós-treino repassando tudo que veio do treinoAtivo + as infos da urina
    router.push({
      pathname: '/pesagemPosTreino',
      params: {
        sessaoId,
        type,
        seconds,
        water,
        urineVolume: finalVolume.toString(),
        urineMoment: moment,
        urineColor: selectedColor ? selectedColor.toString() : '',
        thirst: thirst.toString(),
      }
    });
  };

  return (
    <Screen backgroundColor={theme.colors.background}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#0e0e0e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VOLUME URINÁRIO</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Feather name="help-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.descriptionText}>
          O volume urinado é subtraído da sua perda hídrica para um cálculo mais preciso.
        </Text>

        {/* O stepper foi removido por ser considerado inútil no fluxo atual */}

        {/* TOGGLE: DURANTE / LOGO APÓS */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, moment === 'Durante' && styles.toggleButtonActive]}
            onPress={() => setMoment('Durante')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleButtonText, moment === 'Durante' && styles.toggleButtonTextActive]}>
              Durante a sessão
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, moment === 'Após' && styles.toggleButtonActive]}
            onPress={() => setMoment('Após')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleButtonText, moment === 'Após' && styles.toggleButtonTextActive]}>
              Logo após
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO ESTIMATIVA PADRÃO */}
        <View style={styles.estimateContainer}>
          <TouchableOpacity style={styles.estimateButton} onPress={() => { setVolume(300); setNoUrine(false); }}>
            <Text style={styles.estimateButtonText}>Usar estimativa padrão (300 ml)</Text>
            <Text style={styles.estimateSubText}>Baseado em dados médios da literatura</Text>
          </TouchableOpacity>
        </View>

        {/* CONTADOR DE VOLUME */}
        <View style={styles.counterCard}>
          <View style={styles.counterRow}>
            {/* Botão -50 */}
            <TouchableOpacity style={styles.counterActionButton} onPress={() => adjustVolume(-50)}>
               <MaterialCommunityIcons name="minus" size={24} color={theme.colors.primary} />
               <Text style={styles.counterActionSubText}>-50 ml</Text>
            </TouchableOpacity>
            
            {/* Valor Central */}
            <View style={styles.counterValueContainer}>
              <Text style={styles.counterValueText}>{volume}</Text>
              <Text style={styles.counterUnitText}>ml</Text>
            </View>

            {/* Botão +50 */}
            <TouchableOpacity style={styles.counterActionButton} onPress={() => adjustVolume(50)}>
               <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
               <Text style={styles.counterActionSubText}>+50 ml</Text>
            </TouchableOpacity>
          </View>

          {/* BOTÕES RÁPIDOS */}
          <View style={styles.quickAddRow}>
            <TouchableOpacity style={styles.quickAddButton} onPress={() => { setVolume(100); setNoUrine(false); }}>
              <Text style={styles.quickAddButtonText}>100 ML</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddButton} onPress={() => { setVolume(250); setNoUrine(false); }}>
              <Text style={styles.quickAddButtonText}>250 ML</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAddButton} onPress={() => { setVolume(500); setNoUrine(false); }}>
              <Text style={styles.quickAddButtonText}>500 ML</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CHECKBOX NÃO URINEI */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggleNoUrine} activeOpacity={0.8}>
          <View style={[styles.checkboxBox, noUrine && styles.checkboxChecked]}>
            {noUrine && <Feather name="check" size={16} color="#FFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Não urinei nesta sessão</Text>
        </TouchableOpacity>

        {/* SEÇÃO: ESTADO BASAL */}
        <View style={styles.basalSection}>
          <EstadoBasal 
            corUrina={selectedColor}
            setCorUrina={setSelectedColor}
            sede={thirst}
            setSede={setThirst}
          />
        </View>

        {/* RODAPÉ */}
        <View style={styles.footer}>
          <Button 
            title="SALVAR E CONTINUAR" 
            onPress={() => handleFinalize(false)} 
            style={{ backgroundColor: theme.colors.primary, height: 60 }}
          />
          <TouchableOpacity style={styles.skipLink} onPress={() => handleFinalize(true)}>
            <Text style={styles.skipLinkText}>Pular por agora</Text>
            <Text style={styles.skipSubText}>Se pular, usaremos 0 ml neste cálculo.</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Screen>
  );
}