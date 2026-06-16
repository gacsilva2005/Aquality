import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

// Tipagem dos dados do registro
export interface RecordItem {
    id: string;
    title: string;
    subtitle: string;
    time: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap; // Garante que o ícone exista na biblioteca
    isAlert: boolean;
    session?: any;
}

interface RecordCardProps {
    record: RecordItem;
    onPress?: () => void;
}

export function RecordCard({ record, onPress }: RecordCardProps) {
    return (
        <TouchableOpacity 
            style={styles.recordCard} 
            activeOpacity={onPress ? 0.7 : 1} // Só dá o efeitinho de clique se tiver a função onPress
            onPress={onPress}
            disabled={!onPress}
        >
            {/* Caixa do Ícone (Muda de cor se for alerta) */}
            <View style={[styles.recordIconContainer, record.isAlert && styles.recordIconAlert]}>
                <MaterialCommunityIcons 
                    name={record.icon} 
                    size={24} 
                    color={record.isAlert ? '#C62828' : '#4A4A4A'} 
                />
            </View>

            {/* Textos do Meio */}
            <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={[styles.recordSubtitle, record.isAlert && styles.recordSubtitleAlert]}>
                    {record.subtitle}
                </Text>
            </View>

            {/* Data/Hora na Direita */}
            <Text style={styles.recordTime}>{record.time}</Text>
        </TouchableOpacity>
    );
}