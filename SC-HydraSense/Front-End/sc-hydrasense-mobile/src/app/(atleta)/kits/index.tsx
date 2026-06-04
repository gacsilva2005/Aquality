import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Screen } from '../../../components/Screen'; 
import { Button } from '../../../components/Button'; 
import { KitCard, Kit } from '../../../components/KitCard'; 
import { styles } from './styles';
import { useAlert } from '@/src/contexts/alertContext';

const INITIAL_KITS: Kit[] = [
    { id: '1', name: 'KIT BIKE PROVA', modality: 'BIKE', weight: 1050, isDefault: true },
    { id: '2', name: 'KIT CORRIDA LEVE', modality: 'CORRIDA', weight: 320, isDefault: false },
    { id: '3', name: 'KIT NATAÇÃO TREINO', modality: 'NATAÇÃO', weight: 150, isDefault: false },
];

export default function MeusKitsScreen() {
    const alert = useAlert();
    const router = useRouter();
    
    const [kits, setKits] = useState<Kit[]>(() => {
        return [...INITIAL_KITS].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
    });

    const [editingKitId, setEditingKitId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editModality, setEditModality] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSetDefault = (id: string) => {
        const isCurrentlyDefault = kits.find(k => k.id === id)?.isDefault;

        setKits(prevKits => 
            prevKits.map(kit => ({
                ...kit,
                isDefault: kit.id === id ? !isCurrentlyDefault : false
            }))
        );

        setTimeout(() => {
            setKits(prevKits => {
                return [...prevKits].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
            });
        }, 400); 
    };

    const handleDelete = (id: string, name: string) => {
        alert.warning(
            "Remover Kit",
            `Tem certeza que deseja remover o ${name}?`,
            [{ text: "Cancelar", style: "cancel" }, { text: "Remover", style: "destructive", onPress: () => setKits(prev => prev.filter(k => k.id !== id)) }]
        );
    };

    const handleCopy = (kit: Kit) => {
        const newKit: Kit = {
            ...kit,
            id: Math.random().toString(36).substring(2, 9),
            name: `${kit.name} (Cópia)`,
            isDefault: false
        };
        setKits(prev => [...prev, newKit]);
    };

    const startEditing = (kit: Kit) => {
        setEditingKitId(kit.id);
        setEditName(kit.name);
        setEditModality(kit.modality);
        setEditWeight(kit.weight.toString());
        setShowDropdown(false);
    };

    const cancelEditing = () => setEditingKitId(null);

    const saveEditing = () => {
        if (!editName.trim() || !editWeight.trim()) {
            alert.error("Erro", "Preencha todos os campos para salvar.");
            return;
        }

        setKits(prev => prev.map(k => k.id === editingKitId ? {
            ...k, name: editName, modality: editModality, weight: parseInt(editWeight)
        } : k));
        
        setEditingKitId(null);
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
                        />
                    ))}
                </ScrollView>

                <View style={styles.bottomButtonContainer}>
                    <Button 
                        title="ADICIONAR NOVO KIT" 
                        iconLeft={<Feather name="plus" size={20} color="#FFF" />}
                        onPress={() => alert.error("Novo Kit", "Abrir modal de criação")}
                        style={{ marginBottom: 0 }}
                    />
                </View>

            </View>
        </Screen>
    );
}