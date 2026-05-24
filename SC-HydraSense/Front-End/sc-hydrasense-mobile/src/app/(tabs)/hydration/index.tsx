import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg'; // <-- Importação do SVG
import { Screen } from '../../../components/Screen';
import { Header } from '../../../components/Header';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { useUser } from '../../../contexts/UserContext';
import Constants from 'expo-constants';

interface HydrationRecord {
  id: string;
  amount: number;
  description: string;
  time: string;
}

// Cálculos do Círculo de Progresso
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.55;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Hydration() {
  const { user } = useUser();
  const [consumed, setConsumed] = useState(0);
  const goal = 3000; // Meta: 3000ml

  const [history, setHistory] = useState<HydrationRecord[]>([]);

  const fetchHydrationHistory = async () => {
    if (!user?.id) return;
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/hidratacao/atleta/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        
        const mapped = data.map((item: any) => {
          let timeString = '00:00';
          if (item.dataHora) {
            const d = new Date(item.dataHora);
            if (!isNaN(d.getTime())) {
              timeString = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            }
          }
          return {
            id: item.id.toString(),
            amount: item.volume,
            description: item.tipoFluido || 'ÁGUA MINERAL',
            time: timeString,
            dataHora: item.dataHora
          };
        });

        // Filtrar apenas registros de hoje para o total e histórico hoje
        const todayStr = new Date().toDateString();
        const todayRecords = mapped.filter((item: any) => {
          if (!item.dataHora) return false;
          return new Date(item.dataHora).toDateString() === todayStr;
        });

        setHistory(todayRecords);
        const totalToday = todayRecords.reduce((sum: number, item: any) => sum + item.amount, 0);
        setConsumed(totalToday);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de hidratação:', error);
    }
  };

  useEffect(() => {
    fetchHydrationHistory();
  }, [user?.id]);

  const handleAddWater = async (amountToAdd: number, description: string = 'ÁGUA MINERAL') => {
    if (!user?.id) return;
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/hidratacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          volume: amountToAdd,
          tipoFluido: description,
          atleta: {
            id: user.id
          }
        })
      });

      if (response.ok) {
        fetchHydrationHistory();
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o registro de água.');
      }
    } catch (error) {
      console.error('Erro ao salvar água:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível comunicar com o servidor.');
    }
  };

  const handleRemoveWater = (id: string, amountToRemove: number) => {
    Alert.alert(
      "Remover Registro",
      "Tem certeza que deseja apagar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const hostUri = Constants?.expoConfig?.hostUri;
              const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
              const API_URL = `http://${ip}:8080`;

              const response = await fetch(`${API_URL}/hidratacao/${id}`, {
                method: 'DELETE'
              });

              if (response.ok) {
                fetchHydrationHistory();
              } else {
                Alert.alert('Erro', 'Não foi possível remover o registro.');
              }
            } catch (error) {
              console.error('Erro ao deletar registro:', error);
              Alert.alert('Erro de Conexão', 'Não foi possível deletar.');
            }
          }
        }
      ]
    );
  };

  // --- LÓGICA DO PREENCHIMENTO ---
  // Garante que o progresso não passe de 1 (100%)
  const progressPercentage = Math.min(consumed / goal, 1);
  // Calcula quanto da linha deve ficar "vazia"
  const strokeDashoffset = CIRCUMFERENCE - (progressPercentage * CIRCUMFERENCE);

  const isGoalMet = consumed >= goal;
  // Fundo: Verde claro com transparência
  const trackColor = 'rgba(39, 174, 96, 0.15)';
  // Barra enchendo: Cor primária do app. Se bater a meta: Verde Vibrante!
  const progressColor = isGoalMet ? '#27ae60' : '#4bd38498';
  // Estados para o campo personalizado
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  // --- ESTADOS DE EDIÇÃO ---
  const [editingRecord, setEditingRecord] = useState<HydrationRecord | null>(null);
  const [editAmount, setEditAmount] = useState('');

  // --- LÓGICA DE SALVAR EDIÇÃO ---
  const handleSaveEdit = async () => {
    const newAmount = parseInt(editAmount);
    
    // Validação básica
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert("Valor Inválido", "Por favor, insira um valor maior que zero.");
      return;
    }

    if (editingRecord && user?.id) {
      try {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        const API_URL = `http://${ip}:8080`;

        const response = await fetch(`${API_URL}/hidratacao`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: parseInt(editingRecord.id, 10),
            volume: newAmount,
            tipoFluido: editingRecord.description,
            atleta: {
              id: user.id
            }
          })
        });

        if (response.ok) {
          fetchHydrationHistory();
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar o registro.');
        }
      } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        Alert.alert('Erro de Conexão', 'Não foi possível atualizar.');
      }

      setEditingRecord(null);
      setEditAmount('');
    }
  };

  return (
    <View style={{flex : 1}}>
      <Screen backgroundColor="#FAFAFA" scrollable={true} HeaderComponent={<Header />}>
        <View style={styles.container}>

          <Text style={styles.pageTitle}>CONSUMO DO DIA</Text>

          {/* --- CÍRCULO DE PROGRESSO COM SVG --- */}
          <View style={styles.progressContainer}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              {/* Círculo de Fundo (Track) */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke={trackColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              {/* Círculo de Progresso (Fill) */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke={progressColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" // Deixa a pontinha da linha arredondada
                rotation="-90" // Faz o preenchimento começar do topo (12 horas)
                originX={CIRCLE_SIZE / 2}
                originY={CIRCLE_SIZE / 2}
              />
            </Svg>

            {/* Textos que ficam no centro do círculo */}
            <View style={styles.textContainer}>
              <Text style={styles.consumedText}>
                {(consumed / 1000).toFixed(1)}<Text style={styles.unitText}>L</Text>
              </Text>
              <Text style={[styles.goalText, isGoalMet && { color: '#27ae60', fontFamily: theme.fonts.headingBold }]}>
                META: {(goal / 1000).toFixed(1)}L
              </Text>
            </View>
          </View>

          {/* ... O RESTO DOS SEUS CARDS CONTINUA IGUAL AQUI ... */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>ADICIONAR</Text>
              <MaterialCommunityIcons name="water-outline" size={20} color={theme.colors.primary} />
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.quickAddButton} onPress={() => handleAddWater(250)}>
                <Text style={styles.quickAddText}>+250ml</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAddButton} onPress={() => handleAddWater(500)}>
                <Text style={styles.quickAddText}>+500ml</Text>
              </TouchableOpacity>
            </View>

            {/* --- OPÇÃO DE VALOR PERSONALIZADO --- */}
            {showCustomInput ? (
              <View style={styles.customInputWrapper}>
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    placeholder="Ex: 150"
                    keyboardType="numeric"
                    maxLength={4}
                    autoFocus={true} // Já abre o teclado automaticamente
                  />
                  <Text style={styles.customInputUnit}>ml</Text>
                </View>

                <TouchableOpacity
                  style={styles.customAddButton}
                  onPress={() => {
                    const amount = parseInt(customAmount);
                    if (amount > 0) {
                      handleAddWater(amount, 'ÁGUA MINERAL');
                      setCustomAmount(''); // Limpa o campo
                      setShowCustomInput(false); // Esconde o input de novo
                    }
                  }}
                >
                  <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.showCustomButton}
                onPress={() => setShowCustomInput(true)}
              >
                <Text style={styles.showCustomText}>+ OUTRO VALOR</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.card, { backgroundColor: '#F4F4F4' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>FISIOLÓGICO</Text>
              <MaterialCommunityIcons name="flask-outline" size={20} color={theme.colors.primary} />
            </View>
            <TouchableOpacity style={styles.urineButton}>
              <Text style={styles.urineButtonText}>REGISTRAR URINA</Text>
            </TouchableOpacity>
          </View>

          {/* --- HISTÓRICO --- */}
          <Text style={styles.historyTitle}>HISTÓRICO HOJE</Text>
          
          <View style={styles.historyList}>
            {history.length === 0 ? (
              <Text style={styles.emptyHistoryText}>
                Nenhum registro ainda. Adicione água para começar!
              </Text>
            ) : (
              history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  
                  {/* 1. ÍCONE DA ESQUERDA */}
                  <View style={styles.historyIconContainer}>
                    <MaterialCommunityIcons name="cup-water" size={24} color={theme.colors.primary} />
                  </View>
                  
                  {/* 2. TEXTOS DO MEIO (Quantidade e Descrição) */}
                  <View style={styles.historyTextContainer}>
                    <Text style={styles.historyAmount}>
                      {item.amount >= 1000 ? `${(item.amount / 1000).toFixed(1)}L` : `${item.amount}ml`}
                    </Text>
                    {/* O numberOfLines={1} evita que o texto quebre o layout se for muito grande */}
                    <Text style={styles.historyDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>

                  {/* 3. AÇÕES DA DIREITA (Hora e Lixeira) */}
                  {/* 3. AÇÕES DA DIREITA (Hora, Editar e Lixeira) */}
                  <View style={styles.historyRightAction}>
                    <Text style={styles.historyTime}>{item.time}</Text>
                    
                    {/* BOTÃO DE EDITAR */}
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => {
                        setEditingRecord(item); // Diz qual item estamos editando
                        setEditAmount(item.amount.toString()); // Preenche o input com o valor atual
                      }}
                      activeOpacity={0.6}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* BOTÃO DE DELETAR (que você já tinha) */}
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleRemoveWater(item.id, item.amount)}
                      activeOpacity={0.6}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                </View>
              ))
            )}
          </View>

        </View>
      </Screen>
      {/* --- MODAL DE EDIÇÃO --- */}
      <Modal
        visible={editingRecord !== null}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Registro</Text>
            <Text style={styles.modalSubtitle}>{editingRecord?.description}</Text>

            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                value={editAmount}
                onChangeText={setEditAmount}
                keyboardType="numeric"
                autoFocus={true}
                maxLength={4}
              />
              <Text style={styles.modalUnit}>ml</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setEditingRecord(null)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSave]} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalBtnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}