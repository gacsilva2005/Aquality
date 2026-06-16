import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../global/themas';

interface ModalMetaHidratacaoProps {
    visible: boolean;
    onClose: () => void;
    atletaNome: string;
    ultimaTaxa: number | null;
    onSave: (data: any) => void;
}

export function ModalMetaHidratacao({ visible, onClose, atletaNome, ultimaTaxa, onSave }: ModalMetaHidratacaoProps) {
    const [meta, setMeta] = useState('');
    const [condicao, setCondicao] = useState('Normal');
    const [tipoSessao, setTipoSessao] = useState('Treino Tático');
    const [observacao, setObservacao] = useState('');

    const handleSave = () => {
        onSave({ meta: parseFloat(meta), condicao, tipoSessao, observacao });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <KeyboardAvoidingView 
                style={styles.overlay} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.modalContent}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Meta de Hidratação</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subtitle}>Atleta: {atletaNome}</Text>

                    {/* BODY */}
                    <View style={styles.body}>
                        <Text style={styles.label}>Meta de Ingestão (L/h)</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="droplet" size={20} color={theme.colors.primary} style={styles.icon} />
                            <TextInput 
                                style={styles.input}
                                placeholder="Ex: 1.5"
                                keyboardType="decimal-pad"
                                value={meta}
                                onChangeText={setMeta}
                            />
                        </View>
                        {ultimaTaxa !== null && (
                            <Text style={styles.helperText}>
                                ↳ Última taxa registrada: {ultimaTaxa.toFixed(2)} L/h
                            </Text>
                        )}

                        <Text style={[styles.label, { marginTop: 16 }]}>Condição Ambiental</Text>
                        <View style={styles.buttonGroup}>
                            {['Frio', 'Normal', 'Calor Intenso'].map(opt => (
                                <TouchableOpacity 
                                    key={opt} 
                                    style={[styles.chip, condicao === opt && styles.chipActive]}
                                    onPress={() => setCondicao(opt)}
                                >
                                    <Text style={[styles.chipText, condicao === opt && styles.chipTextActive]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { marginTop: 16 }]}>Tipo de Sessão</Text>
                        <View style={styles.buttonGroup}>
                            {['Tático', 'Regenerativo', 'Oficial', 'Força'].map(opt => (
                                <TouchableOpacity 
                                    key={opt} 
                                    style={[styles.chip, tipoSessao === opt && styles.chipActive]}
                                    onPress={() => setTipoSessao(opt)}
                                >
                                    <Text style={[styles.chipText, tipoSessao === opt && styles.chipTextActive]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { marginTop: 16 }]}>Observação (Opcional)</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="align-left" size={20} color="#999" style={styles.icon} />
                            <TextInput 
                                style={styles.input}
                                placeholder="Notas clínicas..."
                                value={observacao}
                                onChangeText={setObservacao}
                            />
                        </View>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
                            <Text style={styles.btnGhostText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
                            <Text style={styles.btnPrimaryText}>Salvar Meta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#121212' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },
    closeBtn: { padding: 4 },
    body: {},
    label: { fontSize: 12, fontWeight: 'bold', color: '#1A1A1A', textTransform: 'uppercase', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: 8 },
    icon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#121212' },
    helperText: { fontSize: 12, color: '#6C757D', marginTop: 6, fontStyle: 'italic' },
    buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5E5', backgroundColor: '#FFF' },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { fontSize: 14, color: '#666', fontWeight: '500' },
    chipTextActive: { color: '#FFF' },
    footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 32, gap: 16 },
    btnGhost: { paddingVertical: 12, paddingHorizontal: 20 },
    btnGhostText: { fontSize: 16, color: '#666', fontWeight: '600' },
    btnPrimary: { backgroundColor: theme.colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    btnPrimaryText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
});
