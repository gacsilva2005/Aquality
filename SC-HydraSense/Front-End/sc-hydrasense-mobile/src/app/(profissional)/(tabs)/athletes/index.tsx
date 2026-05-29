import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../../components/Screen';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { AthleteCard, Athlete } from '../../../../components/athleteCard'; // Importamos o componente e a tipagem!

// Usamos a tipagem Athlete que agora vem do componente
const mockAthletes: Athlete[] = [
    { id: '1', name: 'Gabriel Silva', number: '#10', sudorese: '1.8L/HR', hidro: '92%', status: 'ÓTIMO', photo: require('../../../../assets/images/karate.jpeg') },
    { id: '2', name: 'Sergio Henrique', number: '#8', sudorese: '0.9L/HR', hidro: '74%', status: 'ATENÇÃO', photo: require('../../../../assets/images/maldade.jpeg') },
    { id: '3', name: 'Lucas Castilho', number: '#4', sudorese: '1.3L/HR', hidro: '62%', status: 'CRÍTICO', photo: require('../../../../assets/images/toalha.jpeg') },
];

export default function Athletes() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = mockAthletes.filter(athlete => 
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={true}>
            <View style={styles.container}>
                
                <Text style={styles.pageTitle}>ATLETAS</Text>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search athletes..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.listContainer}>
                    
                    {filteredAthletes.map((athlete) => (
                        <AthleteCard 
                            key={athlete.id} 
                            athlete={athlete} 
                            onPress={() => router.push({
                                // O novo caminho não tem o (tabs) no meio!
                                pathname: "/(profissional)/athlete/[id]",
                                params: { id: athlete.id }
                            })}
                        />
                    ))}

                    {filteredAthletes.length === 0 && (
                        <Text style={styles.emptyText}>Nenhum atleta encontrado.</Text>
                    )}
                </View>

            </View>
        </Screen>
    );
}