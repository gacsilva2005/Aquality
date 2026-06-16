import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../../components/Screen'; 
import { Button } from '../../../components/Button'; 
import { KitCard, Kit } from '../../../components/KitCard'; 
import { styles } from './styles';
import { useAlert } from '@/src/contexts/alertContext';
import { useUser } from '../../../contexts/UserContext';
import Constants from 'expo-constants';

export default function MeusKitsScreen() {
    const alert = useAlert();
    const router = useRouter();
    const { user, setUser } = useUser();
    
    const [kits, setKits] = useState<Kit[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingKitId, setEditingKitId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editModality, setEditModality] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Mapeamento dinâmico das modalidades do atleta
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

    const getApiUrl = () => {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        return `http://${ip}:8080`;
    };

    const fetchKits = async () => {
        if (!user?.id) return;
        try {
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/Kit/atleta/${user.id}`);
            if (!response.ok) throw new Error('Falha ao carregar kits');
            const data = await response.json();
            
            const mapped = data.map((dbKit: any) => ({
                id: String(dbKit.id),
                name: dbKit.nome,
                modality: dbKit.modalidade,
                weight: dbKit.pesoTotal,
                isDefault: dbKit.id === user.kitPrincipalId
            })).sort((a: Kit, b: Kit) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
            
            setKits(mapped);
        } catch (e) {
            console.error('Erro ao carregar kits:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKits();
    }, [user?.id, user?.kitPrincipalId]);

    const handleSetDefault = async (id: string) => {
        const isCurrentlyDefault = kits.find(k => k.id === id)?.isDefault;
        const targetKitId = isCurrentlyDefault ? 0 : Number(id);
        try {
            const API_URL = getApiUrl();
            const response = await fetch(`${API_URL}/Kit/atleta/${user?.id}/principal/${targetKitId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                const updatedAtleta = await response.json();
                setUser({ ...user, kitPrincipalId: updatedAtleta.kitPrincipalId });
            } else {
                alert.error('Erro', 'Não foi possível atualizar o kit padrão.');
            }
        } catch (e) {
            console.error(e);
            alert.error('Erro', 'Não foi possível conectar ao servidor.');
        }
    };

    const handleDelete = (id: string, name: string) => {
        alert.warning(
            "Remover Kit",
            `Tem certeza que deseja remover o ${name}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Remover", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const API_URL = getApiUrl();
                            const response = await fetch(`${API_URL}/Kit/${id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                if (Number(id) === user?.kitPrincipalId) {
                                    setUser({ ...user, kitPrincipalId: null });
                                }
                                alert.success('Sucesso', 'Kit removido com sucesso!');
                                fetchKits();
                            } else {
                                alert.error('Erro', 'Não foi possível remover o kit.');
                            }
                        } catch (e) {
                            console.error(e);
                            alert.error('Erro', 'Erro de conexão.');
                        }
                    } 
                }
            ]
        );
    };

    const handleCopy = async (kit: Kit) => {
        try {
            const API_URL = getApiUrl();
            const kitPayload = {
                nome: `${kit.name} (Cópia)`,
                modalidade: kit.modality,
                pesoTotal: kit.weight,
                atletaId: user?.id,
            };

            const response = await fetch(`${API_URL}/Kit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitPayload),
            });

            if (response.ok) {
                alert.success('Sucesso', 'Cópia criada com sucesso!');
                fetchKits();
            } else {
                alert.error('Erro', 'Não foi possível copiar o kit.');
            }
        } catch (e) {
            console.error(e);
            alert.error('Erro', 'Erro de conexão.');
        }
    };

    const startEditing = (kit: Kit) => {
        setEditingKitId(kit.id);
        setEditName(kit.name);
        setEditModality(kit.modality);
        setEditWeight(kit.weight.toString());
        setShowDropdown(false);
    };

    const cancelEditing = () => setEditingKitId(null);

    const saveEditing = async () => {
        if (!editName.trim() || !editWeight.trim()) {
            alert.error("Erro", "Preencha todos os campos para salvar.");
            return;
        }

        try {
            const API_URL = getApiUrl();
            const kitPayload = {
                nome: editName,
                modalidade: editModality,
                pesoTotal: parseFloat(editWeight),
                atletaId: user?.id,
            };

            const response = await fetch(`${API_URL}/Kit/${editingKitId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitPayload),
            });

            if (response.ok) {
                alert.success('Sucesso', 'Kit atualizado com sucesso!');
                setEditingKitId(null);
                fetchKits();
            } else {
                alert.error('Erro', 'Não foi possível atualizar o kit.');
            }
        } catch (e) {
            console.error(e);
            alert.error('Erro', 'Erro de conexão.');
        }
    };

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={false}>
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.push('../')}>
                        <Feather name="arrow-left" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerTexts}>
                        <Text style={styles.title}>MEUS KITS</Text>
                        <Text style={styles.subtitle}>Desconte o peso fixo do equipamento para um cálculo preciso.</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer} keyboardShouldPersistTaps="handled">
                    {kits.map((kit) => (
                        <KitCard 
                            key={kit.id} 
                            kit={kit}
                            isEditing={editingKitId === kit.id}
                            editName={editName} setEditName={setEditName}
                            editModality={editModality} setEditModality={setEditModality}
                            editWeight={editWeight} setEditWeight={setEditWeight}
                            showDropdown={showDropdown} setShowDropdown={setShowDropdown}
                            onSetDefault={handleSetDefault}
                            onStartEditing={startEditing}
                            onCancelEditing={cancelEditing}
                            onSaveEditing={saveEditing}
                            onCopy={handleCopy}
                            onDelete={handleDelete}
                            modalidades={modalidadesDisponiveis}
                        />
                    ))}
                </ScrollView>

                <View style={styles.bottomButtonContainer}>
                    <Button 
                        title="ADICIONAR NOVO KIT" 
                        iconLeft={<Feather name="plus" size={20} color="#FFF" />}
                        onPress={() => router.push('./kits/novo')}
                        style={{ marginBottom: 0 }}
                    />
                </View>

            </View>
        </Screen>
    );
}