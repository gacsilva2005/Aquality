// src/components/AthleteCard/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

// Exportamos as tipagens para poder usar nos mocks da tela principal
export type StatusType = 'ÓTIMO' | 'ATENÇÃO' | 'CRÍTICO';

export interface Athlete {
    id: string;
    name: string;
    number: string;
    sudorese: string;
    hidro: string;
    status: StatusType;
    photo: ImageSourcePropType;
}

interface AthleteCardProps {
    athlete: Athlete;
    onPress?: () => void;
}

export function AthleteCard({ athlete, onPress }: AthleteCardProps) {
    // A lógica de cores fica encapsulada dentro do componente!
    const getStatusColors = (status: StatusType) => {
        switch (status) {
            case 'ÓTIMO': return { bg: '#E8F5E9', text: '#2E7D32', border: '#4CAF50' };
            case 'ATENÇÃO': return { bg: '#FFF3E0', text: '#E65100', border: '#FF9800' };
            case 'CRÍTICO': return { bg: '#FFEBEE', text: '#C62828', border: '#D32F2F' };
            default: return { bg: '#F5F5F5', text: '#666', border: '#CCC' };
        }
    };

    const colors = getStatusColors(athlete.status);

    return (
        <TouchableOpacity 
            style={[styles.card, { borderRightColor: colors.border }]} 
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Image source={athlete.photo} style={styles.avatar} />

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.athleteName}>{athlete.name}</Text>
                        <Text style={styles.athleteNumber}>{athlete.number}</Text>
                    </View>
                    
                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.statusText, { color: colors.text }]}>
                            {athlete.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <MaterialCommunityIcons name="heart-pulse" size={14} color="#C62828" />
                        <View>
                            <Text style={styles.metricLabel}>SUDORESE:</Text>
                            <Text style={styles.metricValue}>{athlete.sudorese}</Text>
                        </View>
                    </View>

                    <View style={styles.metricItem}>
                        <MaterialCommunityIcons name="water-outline" size={16} color="#4CAF50" />
                        <View>
                            <Text style={styles.metricLabel}>HIDRO:</Text>
                            <Text style={styles.metricValue}>{athlete.hidro}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}