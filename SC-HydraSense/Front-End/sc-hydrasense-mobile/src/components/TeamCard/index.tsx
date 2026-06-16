import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';

// --- TIPAGENS EXPORTADAS ---
export type TeamStatus = 'ALERTA' | 'IDEAL' | 'MONITORAR';

export interface Team {
    id: string;
    name: string;
    category: string;
    clube?: string;
    status: TeamStatus;
    activeAthletes: number;
    totalAthletes: number;
    adherence: string;
    sweatRate: string;
}

interface TeamCardProps {
    team: Team;
    onPress?: () => void;
}

export function TeamCard({ team, onPress }: TeamCardProps) {
    // A lógica de cores fica encapsulada no próprio card
    const getBadgeProps = (status: TeamStatus) => {
        switch (status) {
            case 'ALERTA': 
                return { bg: '#FCE4E4', text: '#C62828', icon: 'alert-outline' as const };
            case 'IDEAL': 
                return { bg: '#E8F5E9', text: '#2E7D32', icon: 'check-circle-outline' as const };
            case 'MONITORAR': 
            default:
                return { bg: '#E0E0E0', text: '#4A4A4A', icon: 'information-outline' as const };
        }
    };

    const badgeProps = getBadgeProps(team.status);

    return (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={onPress}
        >
            {/* Topo do Card: Nome, Categoria e Badge */}
            <View style={styles.cardHeader}>
                <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamCategory}>Esporte: {team.category}</Text>
                    <Text style={styles.teamCategory}>Clube: {team.clube || '-'}</Text>
                </View>
                
                <View style={[styles.badge, { backgroundColor: badgeProps.bg }]}>
                    <MaterialCommunityIcons name={badgeProps.icon} size={14} color={badgeProps.text} />
                    <Text style={[styles.badgeText, { color: badgeProps.text }]}>
                        {team.status}
                    </Text>
                </View>
            </View>

            {/* Base do Card: Métricas */}
            <View style={styles.metricsContainer}>
                
                {/* Atletas Ativos */}
                <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>ATLETAS</Text>
                    <View style={styles.metricValueRow}>
                        <Text style={styles.metricBigNumber} adjustsFontSizeToFit numberOfLines={1}>{team.activeAthletes}</Text>
                        <Text style={styles.metricSmallNumber}>/{team.totalAthletes}</Text>
                    </View>
                </View>

                {/* Aderência */}
                <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>ADERÊNCIA</Text>
                    <View style={styles.metricValueRow}>
                        <Text style={[styles.metricBigNumber, team.status === 'ALERTA' ? { color: '#C62828' } : {}]} adjustsFontSizeToFit numberOfLines={1}>
                            {team.adherence}
                        </Text>
                        <Text style={styles.metricSmallNumber}>%</Text>
                    </View>
                </View>

                {/* Taxa Média de Suor */}
                <View style={styles.metricBlock}>
                    <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>SUDORESE MÉDIA</Text>
                    <View style={styles.metricValueRow}>
                        <Text style={[styles.metricBigNumber, { color: '#C62828' }]} adjustsFontSizeToFit numberOfLines={1}>
                            {team.sweatRate}
                        </Text>
                        <Text style={styles.metricSmallNumber}>L/h</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
}