import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../Button';
import { styles } from './styles';

interface ModalAddTeamProps {
    visible: boolean;
    onClose: () => void;
}

const ESPORTES = ['Futebol', 'Natação', 'Corrida', 'Musculação', 'Ciclismo'];

export function ModalAddTeam({ visible, onClose }: ModalAddTeamProps) {
    const [teamName, setTeamName] = useState('');
    const [teamCode, setTeamCode] = useState('');
    
    // Novos Estados
    const [categoria, setCategoria] = useState('');
    const [maxAtletas, setMaxAtletas] = useState('');

    const handleGenerateCode = () => {
        const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        setTeamCode(`${part1}-${part2}`);
    };

    const handleSave = () => {
        console.log("Salvando equipe:", { teamName, categoria, maxAtletas, teamCode });
        
        // Limpa os campos e fecha
        setTeamName('');
        setTeamCode('');
        setCategoria('');
        setMaxAtletas('');
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
                    
                    {/* --- CABEÇALHO (Fixo no topo) --- */}
                    <View style={styles.header}>
                        <Text style={styles.title}>ADICIONAR EQUIPE</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="x" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    {/* --- ROLAGEM DO FORMULÁRIO --- */}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        
                        {/* 1. NOME DA EQUIPE */}
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

                        {/* 2. CATEGORIA / ESPORTE */}
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
                                        <Text style={[styles.chipText, categoria === esp && styles.chipTextActive]}>
                                            {esp}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* 3. CAPACIDADE DE ATLETAS */}
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

                        {/* 4. CÓDIGO DE ACESSO */}
                        <Text style={styles.sectionLabel}>CÓDIGO DE ACESSO</Text>
                        <View style={styles.dividerTop} />

                        <View style={styles.codeSection}>
                            <Text style={styles.subLabel}>Inserir Código Existente</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="XXXX-XXXX"
                                placeholderTextColor="#999"
                                autoCapitalize="characters"
                                value={teamCode}
                                onChangeText={setTeamCode}
                                maxLength={9} 
                            />

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OU</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <Text style={styles.subLabel}>Gerar Novo Código</Text>
                            <TouchableOpacity 
                                style={styles.generateButton} 
                                onPress={handleGenerateCode} 
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons name="refresh" size={20} color="#C62828" />
                                <Text style={styles.generateButtonText}>GERAR CÓDIGO</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* --- BOTÃO SALVAR (Fixo na base) --- */}
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