import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../../components/Screen';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { AthleteCard, Athlete } from '../../../../components/athleteCard';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Header } from '@/src/components/Header';

export default function Athletes() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [athletes, setAthletes] = useState<Athlete[]>([]);

    useEffect(() => {
        buscarAtletasDoClube();
    }, []);

    const buscarAtletasDoClube = async () => {
        try {
            const usuarioSalvo = await SecureStore.getItemAsync('usuarioLogado');

            if (!usuarioSalvo) {
                console.log('Nenhum usuário logado');
                return;
            }

            const usuario = JSON.parse(usuarioSalvo);
            const clubeId = usuario?.clube?.id;

            if (!clubeId) {
                console.log('Usuário sem clube');
                return;
            }

            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const response = await fetch(`${API_URL}/Atleta/clube/${clubeId}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar atletas');
            }

            const data = await response.json();

            const atletasFormatados: Athlete[] = await Promise.all(
                data.map(async (atleta: any) => {
                    let sudoreseVal = '--';
                    let hidroVal = '0ml';

                    try {
                        const sessaoRes = await fetch(`${API_URL}/sessoes-de-treino/atleta/${atleta.id}`);
                        if (sessaoRes.ok) {
                            const sessoes = await sessaoRes.json();
                            const finished = sessoes
                                .filter((s: any) => s.dataHoraFim !== null && s.taxaSudorese !== null)
                                .sort((a: any, b: any) => new Date(b.dataHoraFim).getTime() - new Date(a.dataHoraFim).getTime());

                            if (finished.length > 0) {
                                sudoreseVal = `${finished[0].taxaSudorese.toFixed(1)} L/H`;
                            }
                        }
                    } catch (error) {
                        console.log(`Erro ao buscar sessões para atleta ${atleta.id}:`, error);
                    }

                    try {
                        const hidroRes = await fetch(`${API_URL}/hidratacao/atleta/${atleta.id}`);
                        if (hidroRes.ok) {
                            const registros = await hidroRes.json();
                            const todayStr = new Date().toDateString();
                            const totalToday = registros
                                .filter((item: any) => item.dataHora && new Date(item.dataHora).toDateString() === todayStr)
                                .reduce((sum: number, item: any) => sum + item.volume, 0);

                            hidroVal = `${totalToday}ml`;
                        }
                    } catch (error) {
                        console.log(`Erro ao buscar hidratação para atleta ${atleta.id}:`, error);
                    }

                    return {
                        id: String(atleta.id),
                        name: atleta.nome,
                        number: `#${atleta.id}`,
                        sudorese: sudoreseVal,
                        hidro: hidroVal,
                        status: 'ÓTIMO',
                        photo: atleta.fotoPerfil
                            ? (atleta.fotoPerfil.startsWith('data:image')
                                ? { uri: atleta.fotoPerfil }
                                : { uri: `data:image/jpeg;base64,${atleta.fotoPerfil}` })
                            : require('../../../../assets/images/karate.jpeg')
                    };
                })
            );

            setAthletes(atletasFormatados);

        } catch (error) {
            console.log(error);
        }
    };

    const filteredAthletes = athletes.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={true} HeaderComponent={<Header />}>
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