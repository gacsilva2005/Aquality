import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg'; // <-- Importação do SVG
import { Screen } from '../../../components/Screen';
import { Header } from '../../../components/Header';
import { styles } from './styles';
import { theme } from '@/src/global/themas';

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
  const [consumed, setConsumed] = useState(0);
  const goal = 3000; // Meta: 3000ml

  const [history, setHistory] = useState<HydrationRecord[]>([]);

  const handleAddWater = (amountToAdd: number, description: string = 'ÁGUA MINERAL') => {
    setConsumed(prev => prev + amountToAdd);
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setHistory([{
      id: Math.random().toString(),
      amount: amountToAdd,
      description,
      time: timeString,
    }, ...history]);
  };

  const handleRemoveWater = (id: string, amountToRemove: number) => {
      Alert.alert(
        "Remover Registro",
        "Tem certeza que deseja apagar este registro?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive", // No iOS isso deixa o botão vermelho
            onPress: () => {
              // 1. Remove o item específico do histórico
              setHistory(prevHistory => prevHistory.filter(item => item.id !== id));

              // 2. Diminui o valor consumido (Math.max garante que não fique menor que 0)
              setConsumed(prevConsumed => Math.max(0, prevConsumed - amountToRemove));
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
  // ... seus estados de consumed, history, customAmount, etc.

  // --- ESTADOS DE EDIÇÃO ---
  const [editingRecord, setEditingRecord] = useState<HydrationRecord | null>(null);
  const [editAmount, setEditAmount] = useState('');

  // --- LÓGICA DE SALVAR EDIÇÃO ---
  const handleSaveEdit = () => {
    const newAmount = parseInt(editAmount);
    
    // Validação básica
    if (isNaN(newAmount) || newAmount <= 0) {
      Alert.alert("Valor Inválido", "Por favor, insira um valor maior que zero.");
      return;
    }

    if (editingRecord) {
      // 1. Calcula a diferença (pode ser positiva ou negativa)
      // Ex: Tinha 500, mudou para 200. A diferença é -300.
      const difference = newAmount - editingRecord.amount;

      // 2. Atualiza a lista do histórico
      setHistory(prevHistory => 
        prevHistory.map(item => 
          item.id === editingRecord.id 
            ? { ...item, amount: newAmount } // Substitui o valor do item editado
            : item // Mantém os outros iguais
        )
      );

      // 3. Atualiza o total consumido somando a diferença
      setConsumed(prevConsumed => Math.max(0, prevConsumed + difference));

      // 4. Limpa e fecha o modal
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