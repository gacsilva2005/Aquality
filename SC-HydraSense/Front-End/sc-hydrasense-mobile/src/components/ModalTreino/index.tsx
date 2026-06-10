import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas'; // Ajuste o caminho se necessário

interface ModalTreinoProps {
  visible: boolean;
  onClose: () => void;
  onStart: (treinoSelecionado: string) => void;
}

// Opções de treino
const TREINOS = [
  { id: '1', nome: 'Cardio', icone: 'heart-pulse' },
  { id: '2', nome: 'Musculação', icone: 'dumbbell' },
];

export function ModalTreino({ visible, onClose, onStart }: ModalTreinoProps) {
  // Estado para guardar qual treino está selecionado no momento
  const [selected, setSelected] = useState<string | null>(null);

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

          {/* LISTA DE TREINOS */}
          <View style={styles.listContainer}>
            {TREINOS.map((treino) => {
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
          </View>

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