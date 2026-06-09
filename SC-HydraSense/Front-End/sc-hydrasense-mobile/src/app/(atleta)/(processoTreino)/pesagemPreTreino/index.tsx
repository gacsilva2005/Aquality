import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { Screen } from '../../../../components/Screen';
import { Button } from '@/src/components/Button';
import Constants from 'expo-constants';
import { useUser } from '../../../../contexts/UserContext';
import { useAlert } from '@/src/contexts/alertContext';

export default function PesagemPreTreino() {
    const alert = useAlert();

    // ── Todos os params recebidos ───────────────────────────────────────────────
    const {
        type,
        sessaoId,
        corUrina,
        sede,
        descontoKitGramas,          // peso do kit em gramas
        checklistBexiga,
        checklistBalanca,
        checklistSuperficie,
        checklistVestimenta,
        checklistCalcados,
        checklistAcessorios,
    } = useLocalSearchParams<{
        type: string;
        sessaoId: string;
        corUrina?: string;
        sede?: string;
        descontoKitGramas?: string;
        checklistBexiga?: string;
        checklistBalanca?: string;
        checklistSuperficie?: string;
        checklistVestimenta?: string;
        checklistCalcados?: string;
        checklistAcessorios?: string;
    }>();

    const workoutType = type || 'Treino Livre';
    const { user } = useUser();

    const [pesoInput, setPesoInput] = useState('');
    const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([]);
    const [outrosSintomas, setOutrosSintomas] = useState('');

    const toggleSintoma = (sintoma: string) => {
        setSintomasSelecionados((prev) =>
            prev.includes(sintoma) ? prev.filter((s) => s !== sintoma) : [...prev, sintoma]
        );
    };

    const handleConfirmarPeso = async () => {
        const pesoFormatado = pesoInput.replace(',', '.');
        const pesoNumerico = parseFloat(pesoFormatado);

        if (!pesoInput || isNaN(pesoNumerico) || pesoNumerico <= 0) {
            alert.error('Atenção', 'Por favor, insira um peso válido antes de iniciar o treino.');
            return;
        }

        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const response = await fetch(
                `${API_URL}/sessoes-de-treino/${sessaoId}/pre-treino`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pesoPreTreino: pesoNumerico,
                        corUrina: corUrina ? parseInt(corUrina) : null,
                        sede: sede ? parseInt(sede) : null,

                        descontoKitGramas: descontoKitGramas ? parseFloat(descontoKitGramas) : 0,

                        checklist: {
                            bexiga:           checklistBexiga      === '1',
                            balancaCorreta:   checklistBalanca     === '1',
                            superficiePlana:  checklistSuperficie  === '1',
                            vestimentaCorreta:checklistVestimenta  === '1',
                            semCalcados:      checklistCalcados    === '1',
                            semAcessorios:    checklistAcessorios  === '1',
                        },

                        sintomas:
                            sintomasSelecionados.length > 0 || outrosSintomas.length > 0
                                ? JSON.stringify({ selecionados: sintomasSelecionados, outros: outrosSintomas })
                                : null,
                    }),
                }
            );

            const texto = await response.text();

            if (!response.ok) {
                alert.error('Erro', 'Não foi possível iniciar o treino.');
                return;
            }

            const sessao = JSON.parse(texto);
            console.log('Sessão pré-treino registrada:', sessao);

            // ── Navega para o treino, carregando descontoKitGramas ─────────────────
            router.replace({
                pathname: '/treinoAtivo',
                params: {
                    type: workoutType,
                    sessaoId,
                    corUrinaPre: corUrina,
                    sedePre: sede,
                    descontoKitGramas: descontoKitGramas ?? '0',   // ← mantém o desconto
                },
            });

        } catch (error) {
            console.error(error);
            alert.error('Erro', 'Não foi possível iniciar o treino.');
        }
    };

    return (
        <Screen style={styles.container}>
            <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.content}>

                <View style={styles.header}>
                    <Text style={styles.title}>PESAGEM PRÉ-TREINO</Text>
                    <Text style={styles.subtitle}>
                        Insira seu peso atual para calcularmos{'\n'}sua taxa de sudorese com precisão.
                    </Text>
                    {/* Lembrete do desconto do kit para o atleta */}
                    {descontoKitGramas && parseFloat(descontoKitGramas) > 0 && (
                        <Text style={{ fontSize: 12, color: theme.colors.primary, marginTop: 4 }}>
                            ⚡ {parseFloat(descontoKitGramas)}g do kit serão descontados automaticamente
                        </Text>
                    )}
                </View>

                {/* --- INPUT GIGANTE CENTRALIZADO --- */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.hugeInput}
                        keyboardType="numeric"
                        value={pesoInput}
                        onChangeText={setPesoInput}
                        placeholder="00.0"
                        placeholderTextColor="#CCC"
                        maxLength={5}
                        autoFocus
                    />
                    <Text style={styles.unitText}>KG</Text>
                </View>

                {/* --- SINTOMAS --- */}
                <View style={styles.sintomasContainer}>
                    <Text style={styles.sintomasTitle}>SINTOMAS PRÉ-TREINO</Text>
                    <View style={styles.sintomasTagsContainer}>
                        {['Vertigem', 'Enjoo', 'Cãibra'].map((sintoma) => {
                            const isSelected = sintomasSelecionados.includes(sintoma);
                            const iconName =
                                sintoma === 'Vertigem' ? 'head-sync-outline' :
                                    sintoma === 'Enjoo'    ? 'emoticon-sick-outline' :
                                        'lightning-bolt-outline';
                            return (
                                <TouchableOpacity
                                    key={sintoma}
                                    style={[styles.sintomaTag, isSelected && styles.sintomaTagSelected]}
                                    onPress={() => toggleSintoma(sintoma)}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name={iconName as any}
                                        size={16}
                                        color={isSelected ? theme.colors.primary : '#333333'}
                                    />
                                    <Text style={[styles.sintomaTagText, isSelected && styles.sintomaTagTextSelected]}>
                                        {sintoma}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Outros sintomas..."
                        placeholderTextColor="#999999"
                        multiline
                        numberOfLines={4}
                        value={outrosSintomas}
                        onChangeText={setOutrosSintomas}
                    />
                </View>

                {/* --- BOTÃO --- */}
                <View style={styles.footer}>
                    <Button
                        title="PRÓXIMO ➔"
                        onPress={handleConfirmarPeso}
                        style={{ backgroundColor: theme.colors.primary, height: 60 }}
                    />
                </View>

            </View>
        </Screen>
    );
}