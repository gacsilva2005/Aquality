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
    const [atletasSelecionados, setAtletasSelecionados] = useState<string[]>([]); 
    
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    // --- ESTADO DE ERROS ---
    const [erros, setErros] = useState<Record<string, string>>({});

    // Função para atualizar o valor e limpar o erro daquele campo simultaneamente
    const handleChange = (field: string, value: any, setter: React.Dispatch<React.SetStateAction<any>>) => {
        setter(value);
        setErros((prev) => ({ ...prev, [field]: '' }));
    };

    const handleGenerateCode = () => {
        const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        handleChange('teamCode', `${part1}-${part2}`, setTeamCode);
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

    const handleSave = () => {
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
        if (!teamCode.trim()) {
            novosErros.teamCode = 'Insira ou gere um código de acesso.';
        }
        // Opcional: Se quiser obrigar a ter pelo menos 1 atleta, descomente a linha abaixo
        // if (atletasSelecionados.length === 0) novosErros.atletas = 'Vincule pelo menos 1 atleta.';

        // Se houver algum erro, paramos por aqui e mostramos na tela
        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        // Se passou em tudo, salva com sucesso!
        console.log("Salvando equipe:", { teamName, categoria, maxAtletas, teamCode, atletasSelecionados });

        setTeamName('');
        setTeamCode('');
        setCategoria('');
        setMaxAtletas('');
        setAtletasSelecionados([]); 
        setDropdownAberto(false);
        setErros({}); // Limpa os erros para a próxima vez
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
                                        const atleta = ATLETAS_MOCK.find(a => a.id === id);
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
                                        {ATLETAS_MOCK.map((atleta) => {
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