import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../Button';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { InputCadastro } from '@/src/components/InputCadastro'; 

interface ModalAddTeamProps {
    visible: boolean;
    onClose: () => void;
}

const ESPORTES = ['Futebol', 'Natação', 'Corrida', 'Musculação', 'Ciclismo'];

const ATLETAS_MOCK = [
    { id: '1', nome: 'Gabriel Silva', numero: '10' },
    { id: '2', nome: 'Lucas Santos', numero: '08' },
    { id: '3', nome: 'Matheus Oliveira', numero: '04' },
    { id: '4', nome: 'Pedro Henrique', numero: '09' },
    { id: '5', nome: 'João Paulo', numero: '01' },
];

export function ModalAddTeam({ visible, onClose }: ModalAddTeamProps) {
    const [teamName, setTeamName] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [categoria, setCategoria] = useState('');
    const [maxAtletas, setMaxAtletas] = useState('');
    
    // --- NOVO: ESTADO DE MÚLTIPLOS ATLETAS (ARRAY) ---
    const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([]); 
    
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [erros, setErros] = useState<Record<string, string>>({});

    const handleGenerateCode = () => {
        const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        setTeamCode(`${part1}-${part2}`);
    };

    // Função que adiciona ou remove o atleta da lista de selecionados
    const toggleAtleta = (id: string) => {
        setAtletasSelecionados((prevSelecionados) => {
            if (prevSelecionados.includes(id)) {
                // Se já tem, tira da lista
                return prevSelecionados.filter(atletaId => atletaId !== id);
            } else {
                // Se não tem, adiciona na lista
                return [...prevSelecionados, id];
            }
        });
        setErros((prev) => ({ ...prev, atleta: '' }));
    };

    const handleSave = () => {
        console.log("Salvando equipe:", { teamName, categoria, maxAtletas, teamCode, atletasSelecionados });

        setTeamName('');
        setTeamCode('');
        setCategoria('');
        setMaxAtletas('');
        setAtletasSelecionados([]); // Limpa a lista
        setDropdownAberto(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>

                    <View style={styles.header}>
                        <Text style={styles.title}>ADICIONAR EQUIPE</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="x" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                        {/* NOME E CATEGORIA... (Mantidos) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>NOME DA EQUIPE</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Elite Alpha"
                                placeholderTextColor="#999"
                                value={teamName}
                                onChangeText={setTeamName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>CATEGORIA DO ESPORTE</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                {ESPORTES.map((esp) => (
                                    <TouchableOpacity
                                        key={esp}
                                        style={[styles.chip, categoria === esp && styles.chipActive]}
                                        onPress={() => setCategoria(esp)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.chipText, categoria === esp && styles.chipTextActive]}>{esp}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>MÁXIMO DE ATLETAS</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 30"
                                placeholderTextColor="#999"
                                value={maxAtletas}
                                onChangeText={setMaxAtletas}
                                keyboardType="numeric"
                                maxLength={3}
                            />
                        </View>

                        {/* 4. O CAMPO DE ATLETAS (MULTI-SELECT) */}
                        <View style={{ zIndex: 10, marginBottom: 20 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setDropdownAberto(!dropdownAberto)}
                                style={styles.dropdownInputContainer}
                            >
                                <View pointerEvents="none" style={{ flex: 1 }}>
                                    <InputCadastro
                                        label="VINCULAR ATLETAS"
                                        // O texto do input muda com base em quantos foram selecionados
                                        value={
                                            atletasSelecionados.length > 0 
                                            ? `${atletasSelecionados.length} atleta(s) selecionado(s)` 
                                            : 'Selecione os atletas...'
                                        }
                                        onChangeText={() => { }}
                                        errorMessage={erros.atleta}
                                    />
                                </View>

                                <MaterialCommunityIcons
                                    name={dropdownAberto ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#666"
                                    style={styles.dropdownIcon}
                                />
                            </TouchableOpacity>

                            {/* --- LISTA DE ATLETAS SELECIONADOS (CHIPS) --- */}
                            {atletasSelecionados.length > 0 && (
                                <View style={styles.selectedAthletesContainer}>
                                    {atletasSelecionados.map(id => {
                                        const atleta = ATLETAS_MOCK.find(a => a.id === id);
                                        if (!atleta) return null;
                                        return (
                                            <TouchableOpacity 
                                                key={`sel-${id}`} 
                                                style={styles.selectedAthleteChip}
                                                onPress={() => toggleAtleta(id)} // Clicar no chip remove o atleta
                                            >
                                                <Text style={styles.selectedAthleteChipText}>
                                                    {atleta.nome} <Text style={{fontWeight: 'bold'}}>#{atleta.numero}</Text>
                                                </Text>
                                                <Feather name="x" size={14} color="#FFF" style={{ marginLeft: 5 }} />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {/* --- MENU DROPDOWN DE OPÇÕES --- */}
                            {dropdownAberto && (
                                <View style={styles.dropdownListContainer}>
                                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                                        {ATLETAS_MOCK.map((atleta) => {
                                            const isSelected = atletasSelecionados.includes(atleta.id);
                                            
                                            return (
                                                <TouchableOpacity
                                                    key={atleta.id}
                                                    // Fica com fundo levemente diferente se já estiver selecionado
                                                    style={[styles.dropdownOption, isSelected && { backgroundColor: '#FFF5F5' }]}
                                                    onPress={() => toggleAtleta(atleta.id)}
                                                >
                                                    <Text style={[
                                                        styles.dropdownOptionText,
                                                        isSelected && styles.dropdownOptionTextSelected
                                                    ]}>
                                                        {atleta.nome} <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>#{atleta.numero}</Text>
                                                    </Text>

                                                    {/* Checkbox visual para multi-select */}
                                                    <MaterialCommunityIcons 
                                                        name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"} 
                                                        size={22} 
                                                        color={isSelected ? theme.colors.primary : "#CCC"} 
                                                    />
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                    </ScrollView>

                    <Button
                        title="SALVAR EQUIPE"
                        onPress={handleSave}
                        style={{ marginTop: 10, marginBottom: 0 }}
                    />

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}