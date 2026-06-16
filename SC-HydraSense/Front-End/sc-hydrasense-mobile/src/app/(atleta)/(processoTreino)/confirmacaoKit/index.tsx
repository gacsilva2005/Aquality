import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../../components/Screen';
import { Button } from '../../../../components/Button';
import { theme } from '../../../../global/themas';
import { styles } from './styles';
import Constants from "expo-constants";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Kit {
    id: number;
    nome: string;
    modalidade: string;
    pesoTotal: number; // em gramas
}

const getWorkoutIcon = (type: string | string[] | undefined) => {
    const typeStr = Array.isArray(type) ? type[0] : type;
    const lower = (typeStr || '').toLowerCase();
    if (lower.includes('cardio')) return 'heart-pulse';
    if (lower.includes('musculação') || lower.includes('musculacao')) return 'dumbbell';
    if (lower.includes('futebol')) return 'soccer';
    if (lower.includes('natação') || lower.includes('natacao')) return 'swim';
    if (lower.includes('corrida')) return 'run';
    if (lower.includes('ciclismo')) return 'bike';
    return 'timer';
};

export default function ConfirmacaoKit() {
    const [preference, setPreference] = useState<'session' | 'default'>('session');
    const [kit, setKit] = useState<Kit | null>(null);
    const [loading, setLoading] = useState(true);

    // Parâmetros vindos do dashboard
    const { type, atletaId, sessaoId } = useLocalSearchParams();

    const getApiUrl = () => {
        const hostUri = Constants?.expoConfig?.hostUri;
        const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
        return `http://${ip}:8080`;
    };

    // ── Busca o kit padrão da modalidade para este atleta ──────────────────────
    useEffect(() => {
        if (!atletaId || !type) {
            setLoading(false);
            return;
        }

        const fetchKit = async () => {
            try {
                const API_URL = getApiUrl();

                console.log('API_URL:', API_URL);

                const response = await fetch(
                    `${API_URL}/sessoes-de-treino/kits/atleta/${atletaId}?modalidade=${type}`
                );

                if (!response.ok) throw new Error('Falha ao buscar kits');

                const kits: Kit[] = await response.json();

                setKit(kits.length > 0 ? kits[0] : null);
            } catch (err) {
                console.error('Erro ao carregar kit:', err);
                setKit(null);
            } finally {
                setLoading(false);
            }
        };
        fetchKit();
    }, [atletaId, type]);

    // ── Avança COM equipamento ─────────────────────────────────────────────────
    const handleConfirmarComKit = async () => {
        await iniciarSessao({ usarEquipamento: true, kitId: kit?.id });
    };

    // ── Avança SEM equipamento ─────────────────────────────────────────────────
    const handleTreinarSemEquipamento = async () => {
        await iniciarSessao({ usarEquipamento: false, kitId: undefined });
    };

    const iniciarSessao = async ({
                                     usarEquipamento,
                                     kitId,
                                 }: {
        usarEquipamento: boolean;
        kitId?: number;
    }) => {
        try {
            const API_URL = getApiUrl();

            const atletaIdNumber = Number(atletaId);

            if (!atletaId || isNaN(atletaIdNumber)) {
                console.log('atletaId inválido:', atletaId);
                return;
            }

            console.log('API_URL:', API_URL);
            console.log('URL FINAL:', `${API_URL}/sessoes-de-treino/iniciar`);
            console.log('BODY:', {
                atletaId: Number(atletaId),
                modalidade: type,
                kitId: usarEquipamento ? kitId : null,
                usarEquipamento,
            });

            const response = await fetch(
                `${API_URL}/sessoes-de-treino/iniciar`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        atletaId: atletaIdNumber,
                        modalidade: type,
                        kitId: usarEquipamento ? kitId : null,
                        usarEquipamento,
                    }),
                }
            );

            if (!response.ok) {
                const texto = await response.text();
                console.log('Erro backend:', texto);
                throw new Error('Falha ao iniciar sessão');
            }

            const sessao = await response.json();

            router.push({
                pathname: '/checklist' as any,
                params: {
                    type,
                    sessaoId: sessao.id,
                    descontoKitGramas: usarEquipamento && kit ? kit.pesoTotal : 0,
                },
            });
        } catch (err) {
            console.error('Erro ao iniciar sessão:', err);
        }
    };

    // ── Renderização ───────────────────────────────────────────────────────────

    if (loading) {
        return (
            <Screen backgroundColor="#FAFAFA">
                <ActivityIndicator style={{ flex: 1, marginTop: 80 }} color={theme.colors.primary} />
            </Screen>
        );
    }

    const hasKit = kit !== null;

    return (
        <Screen backgroundColor="#FAFAFA">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* BOTÃO VOLTAR */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={theme.colors.primary} />
                </TouchableOpacity>

                {/* --- CABEÇALHO --- */}
                <View style={styles.header}>
                    <Text style={styles.kicker}>KIT SELECTION</Text>
                    <Text style={styles.titleBlack}>CONFIRMAR</Text>
                    <Text style={styles.titleRed}>EQUIPAMENTO</Text>
                    <Text style={styles.description}>
                        O peso do equipamento será descontado automaticamente.
                    </Text>
                </View>

                {/* --- CONTEÚDO CONDICIONAL --- */}
                {hasKit ? (
                    <>
                        {/* --- CARD PRINCIPAL: KIT SELECIONADO --- */}
                        <View style={styles.card}>
                            <View style={styles.cardHeaderRow}>
                                <Text style={styles.cardLabel}>KIT SELECIONADO</Text>
                                <View style={styles.badge}>
                                    <Feather name="check-circle" size={12} color="#1E7E34" />
                                    <Text style={styles.badgeText}>PADRÃO DA MODALIDADE</Text>
                                </View>
                            </View>

                            <Text style={styles.kitName}>{kit.nome.toUpperCase()}</Text>

                            <View style={styles.modalidadeRow}>
                                <Text style={styles.modalidadeLabel}>MODALIDADE</Text>
                                <View style={styles.modalidadeValueRow}>
                                    <MaterialCommunityIcons
                                        name={getWorkoutIcon(type) as any}
                                        size={16}
                                        color={theme.colors.textPrimary}
                                    />
                                    <Text style={styles.modalidadeValue}>
                                        {kit.modalidade.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            {/* Box de Peso */}
                            <View style={styles.weightBox}>
                                <View style={styles.weightRow}>
                                    <Text style={styles.weightNumber}>
                                        {(kit.pesoTotal / 1000).toFixed(3).replace('.', ',')}
                                    </Text>
                                    <Text style={styles.weightUnit}>kg</Text>
                                </View>
                                <Text style={styles.weightDescription}>serão descontados das suas pesagens</Text>
                                <View style={styles.discountInfoRow}>
                                    <Feather name="info" size={12} color={theme.colors.primary} />
                                    <Text style={styles.discountInfoText}>DESCONTO APLICADO EM PRÉ E PÓS</Text>
                                </View>
                            </View>

                            {/* Botão Trocar Kit */}
                            <TouchableOpacity style={styles.btnTrocarKit} onPress={() => router.push('/kits' as any)}>
                                <Feather name="repeat" size={16} color={theme.colors.textPrimary} />
                                <Text style={styles.btnTrocarKitText}>TROCAR KIT</Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- BOX DE PREFERÊNCIA DE USO --- */}
                        <View style={styles.preferenceBox}>
                            <Text style={styles.preferenceLabel}>PREFERÊNCIA DE USO</Text>

                            <TouchableOpacity style={styles.radioRow} onPress={() => setPreference('session')} activeOpacity={0.8}>
                                <MaterialCommunityIcons
                                    name={preference === 'session' ? 'radiobox-marked' : 'radiobox-blank'}
                                    size={24}
                                    color={preference === 'session' ? theme.colors.primary : '#999'}
                                />
                                <Text style={styles.radioText}>Usar apenas nesta sessão</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.radioRow} onPress={() => setPreference('default')} activeOpacity={0.8}>
                                <MaterialCommunityIcons
                                    name={preference === 'default' ? 'radiobox-marked' : 'radiobox-blank'}
                                    size={24}
                                    color={preference === 'default' ? theme.colors.primary : '#999'}
                                />
                                <Text style={styles.radioText}>Definir como novo padrão</Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- AVISO --- */}
                        <View style={styles.warningBox}>
                            <Feather name="alert-triangle" size={20} color={theme.colors.primary} style={styles.warningIcon} />
                            <Text style={styles.warningText}>
                                Pese os itens <Text style={{ fontFamily: theme.fonts.bodyBold }}>vazios</Text>. Líquidos consumidos entram na etapa de Hidratação.
                            </Text>
                        </View>
                    </>
                ) : (
                    /* --- ESTADO VAZIO (NENHUM KIT) --- */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconBox}>
                            <MaterialCommunityIcons
                                name={getWorkoutIcon(type) as any}
                                size={40}
                                color="#555"
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            NENHUM KIT PARA {type ? type.toString().toUpperCase() : 'TREINO'}
                        </Text>
                        <Text style={styles.emptyDescription}>
                            Você ainda não tem kits de equipamento cadastrados para esta modalidade.
                        </Text>
                        <Button
                            title="SELECIONAR KIT"
                            onPress={() => router.push('/kits' as any)}
                            style={styles.btnCriarKit}
                        />
                    </View>
                )}

                {/* --- FOOTER ACTIONS --- */}
                <View style={styles.footer}>
                    {hasKit ? (
                        <>
                            <TouchableOpacity style={styles.btnTreinarSemEquipamento} onPress={handleTreinarSemEquipamento}>
                                <Text style={styles.btnTreinarSemEquipamentoText}>TREINAR SEM EQUIPAMENTO</Text>
                            </TouchableOpacity>

                            <Button
                                title="CONFIRMAR E IR PARA CHECKLIST"
                                onPress={handleConfirmarComKit}
                                style={styles.btnConfirmar}
                                iconRight={<Feather name="arrow-right" size={20} color="#FFF" />}
                            />
                        </>
                    ) : (
                        <View style={styles.emptyFooterWrapper}>
                            <TouchableOpacity style={styles.btnTreinarSemEquipamentoOutline} onPress={handleTreinarSemEquipamento}>
                                <Text style={styles.btnTreinarSemEquipamentoOutlineText}>TREINAR SEM EQUIPAMENTO</Text>
                            </TouchableOpacity>

                            <Text style={styles.emptyFooterDescription}>
                                Nenhum peso será descontado nesta sessão.
                            </Text>

                            <Button
                                title="CONFIRMAR E IR PARA CHECKLIST"
                                style={styles.btnConfirmarDisabled}
                                iconRight={<Feather name="arrow-right" size={20} color="#999" />}
                                disabled={true}
                                textColor="#999"
                            />
                        </View>
                    )}
                </View>

            </ScrollView>
        </Screen>
    );
}
