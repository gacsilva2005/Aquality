import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../components/Screen'; // Ajuste o caminho
import { Button } from '../../../components/Button'; // Ajuste o caminho
import { theme } from '@/src/global/themas';
import { styles } from './stylesNovo';
import { useUser } from '../../../contexts/UserContext';
import Constants from 'expo-constants';
import { useAlert } from '@/src/contexts/alertContext';

interface KitItem {
    id: string;
    name: string;
    weight: number;
}

export default function NovoKitScreen() {
    const router = useRouter();
    const alert = useAlert();
    const { user, setUser } = useUser();

    // --- ESTADOS DO FORMULÁRIO ---
    const [kitName, setKitName] = useState('');
    const [modality, setModality] = useState('');
    const [isDefault, setIsDefault] = useState(true);
    const [discountType, setDiscountType] = useState<'PRE_POS' | 'POS'>('PRE_POS');

    // Mapeamento dinâmico das modalidades
    const modalidadesDisponiveis = useMemo(() => {
        const list = ['Musculação', 'Cardio'];
        if (user?.modalidade) {
            let parsedList: string[] = [];
            try {
                const parsed = JSON.parse(user.modalidade);
                if (Array.isArray(parsed)) {
                    parsedList = parsed;
                } else if (typeof parsed === 'string') {
                    parsedList = [parsed];
                }
            } catch (e) {
                if (user.modalidade.includes(',')) {
                    parsedList = user.modalidade.split(',').map(m => m.trim());
                } else {
                    parsedList = [user.modalidade.trim()];
                }
            }

            parsedList.forEach(mod => {
                if (!mod) return;
                const normalized = mod.trim();
                const alreadyExists = list.some(item => item.toLowerCase() === normalized.toLowerCase());
                if (!alreadyExists) {
                    list.push(normalized);
                }
            });
        }
        return list;
    }, [user?.modalidade]);

    // Define modalidade inicial padrão
    useEffect(() => {
        if (modalidadesDisponiveis.length > 0 && !modality) {
            setModality(modalidadesDisponiveis[0]);
        }
    }, [modalidadesDisponiveis, modality]);
    
    // Dropdown da modalidade
    const [showDropdown, setShowDropdown] = useState(false);

    // --- ESTADOS DOS ITENS ---
    const [items, setItems] = useState<KitItem[]>([
        { id: '1', name: 'Capacete', weight: 320 },
        { id: '2', name: 'Sapatilha', weight: 580 },
        { id: '3', name: 'Cinto de hidratação', weight: 150 },
    ]);

    // Estados do Modal de Adicionar Item
    const [modalItemVisible, setModalItemVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemWeight, setNewItemWeight] = useState('');

    // --- CÁLCULO AUTOMÁTICO DO PESO TOTAL ---
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);

    // --- FUNÇÕES ---
    const handleDeleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleAddItem = () => {
        if (!newItemName.trim() || !newItemWeight.trim()) return;
        
        const newItem: KitItem = {
            id: Math.random().toString(),
            name: newItemName,
            weight: parseInt(newItemWeight)
        };

        setItems(prev => [...prev, newItem]);
        setNewItemName('');
        setNewItemWeight('');
        setModalItemVisible(false);
    };

    const getApiUrl = () => {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        return `http://${ip}:8080`;
    };

    const handleSaveKit = async () => {
        if (!kitName.trim()) {
            alert.error('Erro', 'Por favor, insira o nome do kit.');
            return;
        }
        if (totalWeight <= 0) {
            alert.error('Erro', 'O kit precisa ter peso total maior que zero.');
            return;
        }

        try {
            const API_URL = getApiUrl();
            const kitPayload = {
                nome: kitName,
                modalidade: modality,
                pesoTotal: totalWeight,
                atletaId: user?.id,
            };

            const response = await fetch(`${API_URL}/Kit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitPayload),
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar kit');
            }

            const savedKit = await response.json();

            // Se for padrão, marca como padrão
            if (isDefault) {
                const principalResponse = await fetch(
                    `${API_URL}/Kit/atleta/${user?.id}/principal/${savedKit.id}`,
                    { method: 'PUT' }
                );
                if (principalResponse.ok) {
                    const updatedAtleta = await principalResponse.json();
                    setUser({ ...user, kitPrincipalId: updatedAtleta.kitPrincipalId });
                }
            }

            alert.success('Sucesso', 'Kit salvo com sucesso!', () => {
                router.back();
            });
        } catch (error) {
            console.error('Erro ao salvar kit:', error);
            alert.error('Erro', 'Não foi possível salvar o kit no banco de dados.');
        }
    };

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={false}>
            {/* --- CABEÇALHO ESCURO (Fixo) --- */}
            <View style={styles.darkHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CRIAR KIT</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* --- NOME E MODALIDADE --- */}
                <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>NOME DO KIT</Text>
                    <TextInput
                        style={styles.textInput}
                        value={kitName}
                        onChangeText={setKitName}
                        placeholder="Ex: Kit Treino Leve"
                    />

                    <Text style={[styles.inputLabel, { marginTop: 20 }]}>MODALIDADE</Text>
                    <View style={{ zIndex: 10 }}>
                        <TouchableOpacity style={styles.dropdownInput} onPress={() => setShowDropdown(!showDropdown)}>
                            <Text style={styles.dropdownText}>{modality}</Text>
                            <Feather name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color="#1A1A1A" />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownList}>
                                {modalidadesDisponiveis.map(mod => (
                                    <TouchableOpacity key={mod} style={styles.dropdownOption} onPress={() => { setModality(mod); setShowDropdown(false); }}>
                                        <Text style={[styles.dropdownOptionText, modality === mod && { color: theme.colors.primary, fontWeight: 'bold' }]}>{mod}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* --- CARD PESO TOTAL ESTIMADO --- */}
                <View style={[styles.card, styles.weightCard]}>
                    <Text style={styles.weightCardLabel}>PESO TOTAL ESTIMADO</Text>
                    <View style={styles.weightValueRow}>
                        {/* Formata o número com ponto (ex: 1.050) */}
                        <Text style={styles.weightNumber}>{totalWeight.toLocaleString('pt-BR')}</Text>
                        <Text style={styles.weightUnit}>g</Text>
                    </View>
                </View>

                {/* --- ITENS DO KIT --- */}
                <View style={styles.itemsSection}>
                    <Text style={styles.sectionTitle}>ITENS DO KIT</Text>
                    
                    {items.map(item => (
                        <View key={item.id} style={styles.itemCard}>
                            <Feather name="edit-2" size={16} color="#A09E9E" style={styles.itemIcon} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemWeight}>{item.weight} g</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteItem(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Feather name="trash-2" size={18} color="#FCA5A5" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addItemBtn} onPress={() => setModalItemVisible(true)} activeOpacity={0.7}>
                        <Feather name="plus" size={16} color="#1A1A1A" />
                        <Text style={styles.addItemBtnText}>ADICIONAR ITEM</Text>
                    </TouchableOpacity>
                </View>

                {/* --- CONFIGURAÇÕES: PADRÃO --- */}
                <View style={[styles.card, styles.defaultSettingsCard]}>
                    <View style={styles.defaultSettingsText}>
                        <Text style={styles.settingsTitle}>Padrão da modalidade</Text>
                        <Text style={styles.settingsSubtitle}>Usar automaticamente em treinos de {modality}.</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#E0E0E0", true: theme.colors.primary }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#E0E0E0"
                        onValueChange={setIsDefault}
                        value={isDefault}
                    />
                </View>

                
                {/* --- CAIXA DE AVISO --- */}
                <View style={styles.warningBox}>
                    <MaterialCommunityIcons name="information" size={20} color="#C62828" style={{ marginTop: 2 }} />
                    <Text style={styles.warningText}>
                        Aviso: Pese o cinto ou garrafa vazios. O líquido consumido é registrado na aba de Hidratação.
                    </Text>
                </View>

            </ScrollView>

            {/* --- BOTÃO FIXO GUARDAR --- */}
            <View style={styles.bottomButtonContainer}>
                <Button 
                    title="SALVAR KIT" 
                    onPress={handleSaveKit}
                    style={{ marginBottom: 0 }}
                />
            </View>

            {/* --- MODAL PARA ADICIONAR NOVO ITEM --- */}
            <Modal visible={modalItemVisible} transparent={true} animationType="fade">
                <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Novo Item do Kit</Text>
                        
                        <Text style={styles.inputLabel}>NOME DO ITEM</Text>
                        <TextInput style={styles.textInput} value={newItemName} onChangeText={setNewItemName} placeholder="Ex: Garrafa" />

                        <Text style={[styles.inputLabel, { marginTop: 15 }]}>PESO (g)</Text>
                        <TextInput style={styles.textInput} value={newItemWeight} onChangeText={setNewItemWeight} keyboardType="numeric" placeholder="Ex: 50" />

                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalItemVisible(false)}>
                                <Text style={styles.modalCancelBtnText}>CANCELAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddItem}>
                                <Text style={styles.modalSaveBtnText}>ADICIONAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </Screen>
    );
}