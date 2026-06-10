import React from 'react';
import { View, Text, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { LinearTransition, FadeIn, FadeOut, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { theme } from '@/src/global/themas';
import { styles } from './styles';

export interface Kit {
    id: string;
    name: string;
    modality: string;
    weight: number;
    isDefault: boolean;
}

const MODALIDADES = ['CARDIO', 'MUSCULAÇÃO'];

interface KitCardProps {
    kit: Kit;
    isEditing: boolean;
    editName: string;
    setEditName: (text: string) => void;
    editModality: string;
    setEditModality: (text: string) => void;
    editWeight: string;
    setEditWeight: (text: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    onSetDefault: (id: string) => void;
    onStartEditing: (kit: Kit) => void;
    onCancelEditing: () => void;
    onSaveEditing: () => void;
    onCopy: (kit: Kit) => void;
    onDelete: (id: string, name: string) => void;
}

export function KitCard({
    kit, isEditing, editName, setEditName, editModality, setEditModality,
    editWeight, setEditWeight, showDropdown, setShowDropdown,
    onSetDefault, onStartEditing, onCancelEditing, onSaveEditing,
    onCopy, onDelete
}: KitCardProps) {

    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            borderLeftColor: withTiming(kit.isDefault ? theme.colors.success : theme.colors.primary, { 
                duration: 400 
            })
        };
    }, [kit.isDefault]);

    return (
        <Animated.View 
            layout={LinearTransition.springify().damping(14).mass(0.9).stiffness(100)}
            entering={FadeIn}
            exiting={FadeOut}
            style={[
                styles.card, 
                { 
                    zIndex: kit.isDefault ? 999 : (isEditing ? 50 : 1), 
                    elevation: kit.isDefault ? 10 : (isEditing ? 5 : 2) 
                },
                animatedBorderStyle 
            ]}
        >
            {isEditing ? (
                /* --- MODO EDIÇÃO --- */
                <View>
                    <Text style={styles.editLabel}>NOME DO KIT</Text>
                    <TextInput
                        style={styles.editInputName}
                        value={editName}
                        onChangeText={setEditName}
                        autoCapitalize="words"
                    />

                    <Text style={[styles.editLabel, { marginTop: 15 }]}>MODALIDADE</Text>
                    <View style={{ zIndex: 10 }}>
                        <TouchableOpacity 
                            style={styles.dropdownMini} 
                            onPress={() => setShowDropdown(!showDropdown)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.dropdownMiniText}>{editModality}</Text>
                            <Feather name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#666" />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={styles.dropdownMiniList}>
                                {MODALIDADES.map(mod => (
                                    <TouchableOpacity 
                                        key={mod} 
                                        style={styles.dropdownMiniOption}
                                        onPress={() => { setEditModality(mod); setShowDropdown(false); }}
                                    >
                                        <Text style={[styles.dropdownMiniOptionText, editModality === mod && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                                            {mod}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.weightContainer}>
                        <Text style={styles.editLabel}>PESO TOTAL (g)</Text>
                        <View style={styles.weightValueRow}>
                            <TextInput
                                style={styles.editInputWeight}
                                value={editWeight}
                                onChangeText={setEditWeight}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                            <Text style={styles.weightUnit}>g</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={[styles.cardActions, { justifyContent: 'flex-end', gap: 10 }]}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FCE4E4', width: 40, height: 40 }]} onPress={onCancelEditing}>
                            <Feather name="x" size={18} color="#C62828" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E8F5E9', width: 40, height: 40 }]} onPress={onSaveEditing}>
                            <Feather name="check" size={18} color="#2E7D32" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* --- MODO NORMAL --- */
                <View>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.kitName}>{kit.name}</Text>
                            <Text style={styles.kitModality}>MODALIDADE: {kit.modality}</Text>
                        </View>
                        
                        {kit.isDefault && (
                            <View style={styles.badgeDefault}>
                                <Text style={styles.badgeDefaultText}>ATIVADO</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.weightContainer}>
                        <Text style={[styles.weightLabel, kit.isDefault && { color: theme.colors.success }]}>PESO TOTAL</Text>
                        <View style={styles.weightValueRow}>
                            <Text style={styles.weightNumber}>{kit.weight.toLocaleString('pt-BR')}</Text>
                            <Text style={styles.weightUnit}>g</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardActions}>
                        <View style={styles.toggleContainer}>
                            <Text style={[styles.toggleLabel, kit.isDefault && { color: theme.colors.success, fontWeight: 'bold' }]}>
                                {kit.isDefault ? 'ATIVADO' : 'DESATIVADO'}
                            </Text>
                            <Switch
                                trackColor={{ false: "#E0E0E0", true: theme.colors.success }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={() => onSetDefault(kit.id)}
                                value={kit.isDefault}
                                style={styles.switch}
                            />
                        </View>

                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity style={styles.actionBtn} onPress={() => onStartEditing(kit)}>
                                <Feather name="edit-2" size={16} color="#1A1A1A" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionBtn} onPress={() => onCopy(kit)}>
                                <Feather name="copy" size={16} color="#1A1A1A" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(kit.id, kit.name)}>
                                <Feather name="trash-2" size={16} color="#C62828" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </Animated.View>
    );
}