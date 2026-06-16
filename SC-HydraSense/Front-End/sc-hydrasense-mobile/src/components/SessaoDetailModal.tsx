import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../global/themas';

interface SessaoDetailModalProps {
    visible: boolean;
    onClose: () => void;
    session: any | null;
}

const URINE_COLORS = [
    '#F5F5DC', '#FFFACD', '#FFFFE0', '#FFD700',
    '#FFC700', '#FFA500', '#FF8C00', '#FF7F50'
];

export function SessaoDetailModal({ visible, onClose, session }: SessaoDetailModalProps) {
    if (!session) return null;

    const formatTime = (dateStr: string) => {
        if (!dateStr) return '--:--';
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '--/--/----';
        const d = new Date(dateStr);
        return d.toLocaleDateString();
    };

    const formatSintomas = (sintomasStr: string | null | undefined) => {
        if (!sintomasStr || sintomasStr === 'Nenhum') return 'Nenhum';
        try {
            const obj = JSON.parse(sintomasStr);
            const sel = obj.selecionados || [];
            const out = obj.outros ? [obj.outros] : [];
            const all = [...sel, ...out];
            return all.length > 0 ? all.join(', ') : 'Nenhum';
        } catch {
            return sintomasStr;
        }
    };

    const getUrinaColor = (val: number | string | null | undefined) => {
        if (val == null) return '#E2E8F0';
        return URINE_COLORS[Number(val) - 1] || '#E2E8F0';
    };

    const getSedeLabel = (val: number | string | boolean | null | undefined) => {
        if (val == null) return '--';
        if (typeof val === 'boolean') return val ? 'Alta' : 'Normal';
        return `Nível ${val}`;
    };

    const kitLabel = session.usouEquipamento && session.nomeKit ? `${session.nomeKit} (${session.pesoKitKg != null ? session.pesoKitKg.toFixed(2) + ' kg' : ''})` : 'Sem Kit';

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>RESUMO DA SESSÃO</Text>
                            <Text style={styles.subtitle}>{formatDate(session.dataHoraInicio)}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Duração & Kit */}
                        <View style={styles.rowGrid}>
                            <View style={styles.cardInfo}>
                                <View style={styles.cardHeaderRow}>
                                    <Feather name="clock" size={14} color="#334155" />
                                    <Text style={styles.cardHeaderTitle}>DURAÇÃO</Text>
                                </View>
                                <View style={styles.rowBetween}>
                                    <View>
                                        <Text style={styles.cardLabel}>Início</Text>
                                        <Text style={styles.cardValue}>{formatTime(session.dataHoraInicio)}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.cardLabel}>Fim</Text>
                                        <Text style={styles.cardValue}>{formatTime(session.dataHoraFim)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.cardInfo}>
                                <View style={styles.cardHeaderRow}>
                                    <Feather name="activity" size={14} color="#334155" />
                                    <Text style={styles.cardHeaderTitle}>INDICADORES</Text>
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Kit Utilizado</Text>
                                    <Text style={styles.cardValue} numberOfLines={2}>{kitLabel}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Sudorese & Balanço */}
                        <Text style={styles.sectionTitle}>CÁLCULO FISIOLÓGICO</Text>
                        <View style={styles.rowGrid}>
                            <View style={[styles.cardInfo, { backgroundColor: 'rgba(217, 4, 41, 0.05)', borderColor: 'rgba(217, 4, 41, 0.1)' }]}>
                                <Text style={[styles.cardHeaderTitle, { color: theme.colors.primary, marginBottom: 4 }]}>TAXA DE SUDORESE</Text>
                                <Text style={[styles.cardValueHuge, { color: theme.colors.primary }]}>
                                    {session.taxaSudorese != null ? session.taxaSudorese.toFixed(2) : '--'} <Text style={styles.unit}>L/h</Text>
                                </Text>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.cardHeaderTitle, { marginBottom: 4 }]}>BALANÇO HÍDRICO</Text>
                                <Text style={styles.cardValueHuge}>
                                    {session.balancoHidrico != null ? session.balancoHidrico.toFixed(2) : '--'} <Text style={styles.unit}>kg</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Tabela de Avaliação */}
                        <Text style={styles.sectionTitle}>AVALIAÇÃO PRÉ X PÓS</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1.3 }]}>MÉTRICA</Text>
                                <Text style={[styles.tableCell, styles.tableCellHeader]}>PRÉ</Text>
                                <Text style={[styles.tableCell, styles.tableCellHeader]}>PÓS</Text>
                            </View>
                            
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableCellLabel, { flex: 1.3 }]}>Peso Corporal</Text>
                                <Text style={styles.tableCell}>{session.pesoPre != null ? `${session.pesoPre.toFixed(1)} kg` : '--'}</Text>
                                <Text style={[styles.tableCell, { color: session.pesoPos != null && session.pesoPre != null && session.pesoPos < session.pesoPre ? theme.colors.primary : '#0F172A', fontFamily: theme.fonts.bodyBold }]}>
                                    {session.pesoPos != null ? `${session.pesoPos.toFixed(1)} kg` : '--'}
                                </Text>
                            </View>

                            <View style={[styles.tableRow, styles.tableRowBg]}>
                                <Text style={[styles.tableCell, styles.tableCellLabel, { flex: 1.3 }]}>Cor da Urina</Text>
                                <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
                                    {session.urinaPre != null ? <View style={[styles.urineBox, { backgroundColor: getUrinaColor(session.urinaPre) }]} /> : null}
                                    <Text style={styles.tableCellText}>{session.urinaPre != null ? `N${session.urinaPre}` : '--'}</Text>
                                </View>
                                <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
                                    {session.urinaPos != null ? <View style={[styles.urineBox, { backgroundColor: getUrinaColor(session.urinaPos) }]} /> : null}
                                    <Text style={styles.tableCellText}>{session.urinaPos != null ? `N${session.urinaPos}` : '--'}</Text>
                                </View>
                            </View>

                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableCellLabel, { flex: 1.3 }]}>Sede</Text>
                                <Text style={styles.tableCell}>{getSedeLabel(session.sedePre)}</Text>
                                <Text style={styles.tableCell}>{getSedeLabel(session.sedePos)}</Text>
                            </View>

                            <View style={[styles.tableRow, styles.tableRowBg, { borderBottomWidth: 0 }]}>
                                <Text style={[styles.tableCell, styles.tableCellLabel, { flex: 1.3 }]}>Sintomas</Text>
                                <Text style={[styles.tableCell, { fontSize: 11 }]}>{formatSintomas(session.sintomasPre)}</Text>
                                <Text style={[styles.tableCell, { fontSize: 11 }]}>{formatSintomas(session.sintomasPos)}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30 }} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        minHeight: '50%',
        paddingTop: 24,
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontFamily: theme.fonts.heading,
        color: '#0F172A'
    },
    subtitle: {
        fontSize: 14,
        fontFamily: theme.fonts.bodyRegular,
        color: '#64748B',
        marginTop: 4
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 20
    },
    scrollContent: {
        paddingBottom: 40
    },
    rowGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12
    },
    cardInfo: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6
    },
    cardHeaderTitle: {
        fontSize: 11,
        fontFamily: theme.fonts.bodyBold,
        color: '#475569'
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardLabel: {
        fontSize: 11,
        fontFamily: theme.fonts.bodyRegular,
        color: '#64748B',
        marginBottom: 2
    },
    cardValue: {
        fontSize: 14,
        fontFamily: theme.fonts.bodyBold,
        color: '#0F172A'
    },
    cardValueHuge: {
        fontSize: 20,
        fontFamily: theme.fonts.heading,
        color: '#0F172A'
    },
    unit: {
        fontSize: 12,
        fontFamily: theme.fonts.bodyBold
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: theme.fonts.bodyBold,
        color: '#0F172A',
        marginBottom: 12,
        marginTop: 8
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        overflow: 'hidden'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#FFFFFF'
    },
    tableRowBg: {
        backgroundColor: '#F8FAFC'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0'
    },
    tableCell: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 12,
        fontFamily: theme.fonts.bodyRegular,
        color: '#0F172A',
        justifyContent: 'center'
    },
    tableCellHeader: {
        fontFamily: theme.fonts.bodyBold,
        color: '#475569',
        fontSize: 11
    },
    tableCellLabel: {
        fontFamily: theme.fonts.bodyBold,
        color: '#0F172A'
    },
    tableCellText: {
        fontSize: 12,
        fontFamily: theme.fonts.bodyRegular,
        color: '#0F172A',
        marginLeft: 6
    },
    urineBox: {
        width: 14,
        height: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)'
    }
});
