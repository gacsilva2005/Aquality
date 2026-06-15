import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Screen } from '../../../../components/Screen';
import { Button } from '../../../../components/Button'; // Seu botão que agora aceita ícones!
import { TeamCard, Team, TeamStatus } from '../../../../components/TeamCard'; // Nosso novo card
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { Header } from '@/src/components/Header';
import { ModalAddTeam } from '@/src/components/ModalAddTeam';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const mockTeams: Team[] = [
    { id: '1', name: 'FUTEBOL MASCULINO A', category: 'CATEGORIA PRINCIPAL', clube: 'HYDRASENSE F.C.', status: 'ALERTA', activeAthletes: 24, totalAthletes: 28, adherence: '96', sweatRate: '1.8' },
    { id: '2', name: 'BASQUETE SUB-20', category: 'DESENVOLVIMENTO', clube: 'HYDRASENSE BASKET', status: 'IDEAL', activeAthletes: 12, totalAthletes: 12, adherence: '88', sweatRate: '1.1' },
    { id: '3', name: 'VÔLEI FEMININO B', category: 'CATEGORIA BASE', clube: 'HYDRASENSE VOLEY', status: 'MONITORAR', activeAthletes: 14, totalAthletes: 16, adherence: '92', sweatRate: '1.4' },
];

export default function TeamsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [teams, setTeams] = useState<Team[]>(mockTeams);

    useEffect(() => {
        carregarEquipes();
    }, []);

    const carregarEquipes = async () => {
        try {
            const usuarioSalvo = await SecureStore.getItemAsync('usuarioLogado');
            let clubeId = null;
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                clubeId = usuario?.clube?.id;
            }

            if (!clubeId) {
                console.log("teams/index: Nenhum profissional logado. Usando clubeId = 1 de fallback.");
                clubeId = 1;
            }

            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const response = await fetch(`${API_URL}/Equipe/clube/${clubeId}`);
            if (response.ok) {
                const data = await response.json();
                
                const equipesFormatadas: Team[] = data.map((equipe: any) => {
                    const adherenceVal = Math.round((equipe.adherence || 0.0) * 100);
                    
                    let status: TeamStatus = 'IDEAL';
                    if (adherenceVal < 50) {
                        status = 'ALERTA';
                    } else if (adherenceVal < 80) {
                        status = 'MONITORAR';
                    }

                    const sweatRateVal = equipe.sweatRate > 0 
                        ? equipe.sweatRate.toFixed(1) 
                        : '0.0';

                    return {
                        id: String(equipe.id),
                        name: equipe.nome,
                        category: equipe.categoria ? equipe.categoria.toUpperCase() : 'CATEGORIA PRINCIPAL',
                        clube: equipe.clube?.nome || 'NÃO DEFINIDO',
                        status: status,
                        activeAthletes: equipe.activeAthletes || 0,
                        totalAthletes: equipe.limiteAtletas || (equipe.activeAthletes || 0),
                        adherence: String(adherenceVal),
                        sweatRate: sweatRateVal
                    };
                });

                setTeams(equipesFormatadas);
            }
        } catch (error) {
            console.log('Erro ao carregar equipes:', error);
        }
    };

    const filteredTeams = teams.filter(team => 
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
                    iconLeft={<MaterialCommunityIcons name="account-multiple-plus-outline" size={20} color="#FFF" />}
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
                    onTeamAdded={carregarEquipes}
                />
            </View>
        </Screen>
    );
}