import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Screen } from '../../../../components/Screen';
import { Button } from '../../../../components/Button'; // Seu botão que agora aceita ícones!
import { TeamCard, Team } from '../../../../components/TeamCard'; // Nosso novo card
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { Header } from '@/src/components/Header';
import { ModalAddTeam } from '@/src/components/ModalAddTeam';

const mockTeams: Team[] = [
    { id: '1', name: 'FUTEBOL MASCULINO A', category: 'CATEGORIA PRINCIPAL', status: 'ALERTA', activeAthletes: 24, totalAthletes: 28, sweatRate: '1.8' },
    { id: '2', name: 'BASQUETE SUB-20', category: 'DESENVOLVIMENTO', status: 'IDEAL', activeAthletes: 12, totalAthletes: 12, sweatRate: '1.1' },
    { id: '3', name: 'VÔLEI FEMININO B', category: 'CATEGORIA BASE', status: 'MONITORAR', activeAthletes: 14, totalAthletes: 16, sweatRate: '1.4' },
];

export default function TeamsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const filteredTeams = mockTeams.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={true} HeaderComponent={<Header />}>
            <View style={styles.container}>
                
                {/* --- CABEÇALHO --- */}
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>EQUIPES MONITORADAS</Text>
                    <Text style={styles.pageDescription}>
                        Gerencie os elencos, monitore cargas de treinamento e analise o desempenho geral das equipes da organização.
                    </Text>
                </View>

                {/* --- BOTÃO ADICIONAR --- */}
                {/* Substituímos a TouchableOpacity nativa pelo seu componente genérico e passamos o ícone */}
                <Button 
                    title="ADICIONAR EQUIPE" 
                    icon={<MaterialCommunityIcons name="account-multiple-plus-outline" size={20} color="#FFF" />}
                    onPress={() => setModalVisible(true)}
                />

                {/* --- BARRA DE PESQUISA --- */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar equipe..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                    />
                </View>

                {/* --- LISTA DE EQUIPES --- */}
                <View style={styles.listContainer}>
                    {filteredTeams.map((team) => (
                        <TeamCard 
                            key={team.id} 
                            team={team} 
                            onPress={() => console.log('Navegar para a equipe', team.id)} 
                        />
                    ))}

                    {filteredTeams.length === 0 && (
                        <Text style={styles.emptyText}>Nenhuma equipe encontrada.</Text>
                    )}
                </View>
                <ModalAddTeam 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)} 
            />
            </View>
        </Screen>
    );
}