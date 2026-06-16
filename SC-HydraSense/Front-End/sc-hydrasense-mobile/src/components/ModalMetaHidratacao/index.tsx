import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../global/themas';

interface ModalMetaHidratacaoProps {
    visible: boolean;
    onClose: () => void;
    atletaNome: string;
    ultimaTaxa: number | null;
    metaInicial?: number;
    observacaoInicial?: string;
    onSave: (data: { metaVolumeMl: number; observacoes: string }) => void;
}

export function ModalMetaHidratacao({ visible, onClose, atletaNome, ultimaTaxa, metaInicial, observacaoInicial, onSave }: ModalMetaHidratacaoProps) {
    const [meta, setMeta] = useState('');
    const [observacao, setObservacao] = useState('');

    useEffect(() => {
        if (visible) {
            setMeta(metaInicial ? String(metaInicial) : '3000');
            setObservacao(observacaoInicial || '');
        }
    }, [visible, metaInicial, observacaoInicial]);

    const handleSave = () => {
        const parsedMeta = parseInt(meta, 10);
        onSave({ 
            metaVolumeMl: isNaN(parsedMeta) ? 3000 : parsedMeta, 
            observacoes: observacao 
        });
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
                        <Text style={styles.label}>Meta de Ingestão (ml)</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="droplet" size={20} color={theme.colors.primary} style={styles.icon} />
                            <TextInput 
                                style={styles.input}
                                placeholder="Ex: 3000"
                                keyboardType="numeric"
                                value={meta}
                                onChangeText={setMeta}
                            />
                        </View>
                        {ultimaTaxa !== null && (
                            <Text style={styles.helperText}>
                                ↳ Última taxa registrada: {ultimaTaxa.toFixed(2)} L/h
                            </Text>
                        )}

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
