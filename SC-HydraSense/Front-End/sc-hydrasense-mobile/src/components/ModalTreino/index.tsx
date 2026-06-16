import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas'; // Ajuste o caminho se necessário

interface ModalTreinoProps {
  visible: boolean;
  onClose: () => void;
  onStart: (treinoSelecionado: string) => void;
  modalidades?: string[];
}

const getModalityIcon = (modalidade: string): string => {
  const lower = modalidade.toLowerCase();
  if (lower.includes('cardio')) return 'heart-pulse';
  if (lower.includes('musculação') || lower.includes('musculacao')) return 'dumbbell';
  if (lower.includes('futebol')) return 'soccer';
  if (lower.includes('natação') || lower.includes('natacao')) return 'swim';
  if (lower.includes('corrida')) return 'run';
  if (lower.includes('ciclismo')) return 'bike';
  return 'timer';
};

export function ModalTreino({ visible, onClose, onStart, modalidades }: ModalTreinoProps) {
  // Estado para guardar qual treino está selecionado no momento
  const [selected, setSelected] = useState<string | null>(null);

  // Lista de treinos dinâmicos
  const treinosDisponiveis = useMemo(() => {
    const list = [
      { id: 'cardio', nome: 'Cardio', icone: 'heart-pulse' },
      { id: 'musculacao', nome: 'Musculação', icone: 'dumbbell' },
    ];

    if (modalidades && modalidades.length > 0) {
      modalidades.forEach((mod, index) => {
        if (!mod) return;
        const normalized = mod.trim();
        const alreadyExists = list.some(item => item.nome.toLowerCase() === normalized.toLowerCase());
        
        if (!alreadyExists) {
          list.push({
            id: `user-mod-${index}`,
            nome: normalized,
            icone: getModalityIcon(normalized)
          });
        }
      });
    }
    return list;
  }, [modalidades]);

  const handleStart = () => {
    if (selected) {
      onStart(selected);
      setSelected(null); // Limpa para a próxima vez
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Fecha no Android se apertar o botão de voltar
    >
      {/* O BlurView borra tudo que está atrás do Modal */}
      <BlurView intensity={20} style={styles.overlay}>
        
        <View style={styles.modalContainer}>
          
          {/* HEADER DO MODAL */}
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Treino</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* LISTA DE TREINOS COM SUPORTE A ROLAGEM SE FOR LONGA */}
          <ScrollView 
            style={{ maxHeight: 300, marginBottom: 20 }}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            {treinosDisponiveis.map((treino) => {
              const isActive = selected === treino.nome;
              return (
                <TouchableOpacity
                  key={treino.id}
                  style={[
                    styles.optionCard,
                    isActive && styles.optionCardActive
                  ]}
                  onPress={() => setSelected(treino.nome)}
                  activeOpacity={0.7}
                >
                  {/* BOLINHA VERMELHA NO CANTO SUPERIOR DIREITO */}
                  {isActive && <View style={styles.activeDot} />}

                  {/* WRAPPER PARA ALINHAR ÍCONE E TEXTO */}
                  <View style={styles.contentWrapper}>
                    <MaterialCommunityIcons 
                      name={treino.icone as any} 
                      size={36} // Ícone maior como no design
                      color={isActive ? theme.colors.primary : '#555'} 
                    />
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {treino.nome.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* BOTÃO DE COMEÇAR COM A SETINHA */}
          <TouchableOpacity 
            style={[styles.startButton, !selected && styles.startButtonDisabled]}
            disabled={!selected}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>COMEÇAR TREINO</Text>
            {/* Ícone de seta apontando para a direita */}
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        </View>

      </BlurView>
    </Modal>
  );
}