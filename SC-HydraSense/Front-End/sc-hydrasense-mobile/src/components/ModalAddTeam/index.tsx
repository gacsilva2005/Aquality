import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../Button';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import { InputCadastro } from '@/src/components/InputCadastro'; 
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

interface ModalAddTeamProps {
    visible: boolean;
    onClose: () => void;
    onTeamAdded?: () => void;
}

const ESPORTES = ['Futebol', 'Natação', 'Corrida', 'Musculação', 'Ciclismo'];

export function ModalAddTeam({ visible, onClose, onTeamAdded }: ModalAddTeamProps) {
    const [teamName, setTeamName] = useState('');
    const [categoria, setCategoria] = useState('');
    const [maxAtletas, setMaxAtletas] = useState('');
    const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([]); 
    const [atletas, setAtletas] = useState<{ id: string; nome: string; numero: string }[]>([]);
    const [clubeId, setClubeId] = useState<number | null>(null);
    
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    // --- ESTADO DE ERROS ---
    const [erros, setErros] = useState<Record<string, string>>({});

    useEffect(() => {
        if (visible) {
            buscarAtletasEClube();
        }
    }, [visible]);

    const buscarAtletasEClube = async () => {
        try {
            const usuarioSalvo = await SecureStore.getItemAsync('usuarioLogado');
            let cid = null;
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                cid = usuario?.clube?.id;
            }

            if (!cid) {
                console.log("ModalAddTeam: Nenhum profissional logado. Usando clubeId = 1 de fallback.");
                cid = 1;
            }

            setClubeId(cid);

            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const response = await fetch(`${API_URL}/Atleta/clube/${cid}`);
            if (response.ok) {
                const data = await response.json();
                const formatted = data.map((atleta: any) => ({
                    id: String(atleta.id),
                    nome: atleta.nome,
                    numero: String(atleta.id)
                }));
                setAtletas(formatted);
            }
        } catch (error) {
            console.log('Erro ao buscar atletas para o modal:', error);
        }
    };

    // Função para atualizar o valor e limpar o erro daquele campo simultaneamente
    const handleChange = (field: string, value: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
        setter(value);
        setErros((prev) => ({ ...prev, [field]: '' }));
    };

    const toggleAtleta = (id: string) => {
        setAtletasSelecionados((prevSelecionados) => {
            if (prevSelecionados.includes(id)) {
                return prevSelecionados.filter(atletaId => atletaId !== id);
            } else {
                return [...prevSelecionados, id];
            }
        });
        setErros((prev) => ({ ...prev, atletas: '' }));
    };

    const handleSave = async () => {
        console.log("handleSave pressionado");
        let novosErros: Record<string, string> = {};

        // --- VALIDAÇÕES ---
        if (!teamName.trim()) {
            novosErros.teamName = 'O nome da equipe é obrigatório.';
        }
        if (!categoria) {
            novosErros.categoria = 'Selecione uma categoria.';
        }
        if (!maxAtletas.trim() || parseInt(maxAtletas) <= 0) {
            novosErros.maxAtletas = 'Informe uma quantidade válida.';
        }

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        if (!clubeId) {
            Alert.alert(
                'Erro do Profissional',
                'O profissional atual não está vinculado a nenhum clube. Vincule-o a um clube antes de criar equipes.'
            );
            return;
        }

        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const payload = {
                nome: teamName,
                categoria: categoria,
                limiteAtletas: parseInt(maxAtletas),
                clubeId: clubeId,
                atletasIds: atletasSelecionados.map(id => parseInt(id))
            };

            console.log("Chamando salvar equipe com payload:", payload);

            const response = await fetch(`${API_URL}/Equipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro do servidor (${response.status}): ${errorText}`);
            }

            console.log("Equipe salva com sucesso!");
            Alert.alert('Sucesso', 'Equipe cadastrada com sucesso!');

            setTeamName('');
            setCategoria('');
            setMaxAtletas('');
            setAtletasSelecionados([]); 
            setDropdownAberto(false);
            setErros({}); 
            
            if (onTeamAdded) {
                onTeamAdded();
            }
            onClose();
        } catch (error: any) {
            console.log('Erro ao salvar equipe:', error);
            Alert.alert(
                'Falha ao Salvar',
                `Não foi possível salvar a equipe. Detalhes: ${error.message || error}`
            );
            setErros({ api: 'Não foi possível salvar a equipe. Tente novamente.' });
        }
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
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.title}>ADICIONAR EQUIPE</Text>
                            <Text style={styles.subtitle}>Configure os parâmetros do novo grupo de atletas.</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="x" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

                        {/* --- NOME DA EQUIPE --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>NOME DA EQUIPE</Text>
                            <TextInput
                                style={[styles.input, erros.teamName && styles.inputError]} // Borda vermelha se der erro
                                placeholder="Ex: Elite Alpha"
                                placeholderTextColor="#999"
                                value={teamName}
                                onChangeText={(text) => handleChange('teamName', text, setTeamName)}
                                autoCapitalize="words"
                            />
                            {erros.teamName && <Text style={styles.errorText}>{erros.teamName}</Text>}
                        </View>

                        {/* --- CATEGORIA --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>CATEGORIA DO ESPORTE</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                {ESPORTES.map((esp) => (
                                    <TouchableOpacity
                                        key={esp}
                                        style={[
                                            styles.chip, 
                                            categoria === esp && styles.chipActive,
                                            erros.categoria && !categoria ? styles.chipError : null // Borda vermelha nos chips se esquecer
                                        ]}
                                        onPress={() => handleChange('categoria', esp, setCategoria)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.chipText, categoria === esp && styles.chipTextActive]}>{esp}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            {erros.categoria && <Text style={styles.errorText}>{erros.categoria}</Text>}
                        </View>

                        {/* --- MÁXIMO DE ATLETAS --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.sectionLabel}>MÁXIMO DE ATLETAS</Text>
                            <TextInput
                                style={[styles.input, erros.maxAtletas && styles.inputError]}
                                placeholder="Ex: 30"
                                placeholderTextColor="#999"
                                value={maxAtletas}
                                onChangeText={(text) => handleChange('maxAtletas', text, setMaxAtletas)}
                                keyboardType="numeric"
                                maxLength={3}
                            />
                            {erros.maxAtletas && <Text style={styles.errorText}>{erros.maxAtletas}</Text>}
                        </View>

                        {/* --- VINCULAR ATLETAS --- */}
                        <View style={{ zIndex: 10, marginBottom: 20 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setDropdownAberto(!dropdownAberto)}
                                style={styles.dropdownInputContainer}
                            >
                                <View pointerEvents="none" style={{ flex: 1 }}>
                                    <InputCadastro
                                        label="VINCULAR ATLETAS"
                                        value={
                                            atletasSelecionados.length > 0 
                                            ? `${atletasSelecionados.length} atleta(s) selecionado(s)` 
                                            : 'Selecione os atletas...'
                                        }
                                        onChangeText={() => { }}
                                        errorMessage={erros.atletas} // Exibe erro se tiver (opcional)
                                    />
                                </View>

                                <MaterialCommunityIcons
                                    name={dropdownAberto ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#666"
                                    style={styles.dropdownIcon}
                                />
                            </TouchableOpacity>

                            {/* Chips de atletas selecionados */}
                            {atletasSelecionados.length > 0 && (
                                <View style={styles.selectedAthletesContainer}>
                                    {atletasSelecionados.map(id => {
                                        const atleta = atletas.find(a => a.id === id);
                                        if (!atleta) return null;
                                        return (
                                            <TouchableOpacity 
                                                key={`sel-${id}`} 
                                                style={styles.selectedAthleteChip}
                                                onPress={() => toggleAtleta(id)}
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

                            {/* Dropdown de opções */}
                            {dropdownAberto && (
                                <View style={styles.dropdownListContainer}>
                                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                                        {atletas.map((atleta) => {
                                            const isSelected = atletasSelecionados.includes(atleta.id);
                                            return (
                                                <TouchableOpacity
                                                    key={atleta.id}
                                                    style={[styles.dropdownOption, isSelected && { backgroundColor: '#FFF5F5' }]}
                                                    onPress={() => toggleAtleta(atleta.id)}
                                                >
                                                    <Text style={[
                                                        styles.dropdownOptionText,
                                                        isSelected && styles.dropdownOptionTextSelected
                                                    ]}>
                                                        {atleta.nome} <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>#{atleta.numero}</Text>
                                                    </Text>
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

                        <View style={styles.footerButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
                                <Text style={styles.cancelButtonText}>CANCELAR</Text>
                            </TouchableOpacity>
                            <View style={styles.saveButtonWrapper}>
                                <Button
                                    title="SALVAR EQUIPE"
                                    onPress={handleSave}
                                    style={{ marginTop: 0, marginBottom: 0 }}
                                />
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}