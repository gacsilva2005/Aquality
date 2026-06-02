import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../../components/Screen';
import { theme } from '../../../../global/themas';
import { styles } from './styles';

export default function ConfirmacaoKit() {
  const [preference, setPreference] = useState<'session' | 'default'>('session');
  
  // --- MOCK DE DADOS PARA TESTAR O ESTADO VAZIO ---
  // Troque para true para ver a tela preenchida com o kit selecionado.
  const [hasKit, setHasKit] = useState(true);

  // 1. CAPTURA O PARÂMETRO QUE VEM DO DASHBOARD
  const { type } = useLocalSearchParams(); 

  // 2. FUNÇÃO PARA AVANÇAR REPASSANDO O PARÂMETRO
  const handleAvancar = () => {
    router.push({
      pathname: '/pesagemPreTreino' as any,
      params: { type } // Repassa o tipo (ex: 'bike', 'corrida') para a pesagem
    });
  };

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

              <Text style={styles.kitName}>KIT BIKE PROVA</Text>

              <View style={styles.modalidadeRow}>
                <Text style={styles.modalidadeLabel}>MODALIDADE</Text>
                <View style={styles.modalidadeValueRow}>
                  <MaterialCommunityIcons name="bike" size={16} color={theme.colors.textPrimary} />
                  <Text style={styles.modalidadeValue}>{type ? type.toString().toUpperCase() : 'BIKE'}</Text>
                </View>
              </View>

              {/* Box de Peso */}
              <View style={styles.weightBox}>
                <View style={styles.weightRow}>
                  <Text style={styles.weightNumber}>1.050</Text>
                  <Text style={styles.weightUnit}>g</Text>
                </View>
                <Text style={styles.weightDescription}>serão descontados das suas pesagens</Text>
                <View style={styles.discountInfoRow}>
                  <Feather name="info" size={12} color={theme.colors.primary} />
                  <Text style={styles.discountInfoText}>DESCONTO APLICADO EM PRÉ E PÓS</Text>
                </View>
              </View>

              {/* Resumo dos Itens */}
              <Text style={styles.summaryLabel}>RESUMO DOS ITENS</Text>
              
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <MaterialCommunityIcons name="bike-helmet" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.itemName}>Capacete</Text>
                </View>
                <Text style={styles.itemWeight}>320 g</Text>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <MaterialCommunityIcons name="shoe-sneaker" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.itemName}>Sapatilha</Text>
                </View>
                <Text style={styles.itemWeight}>580 g</Text>
              </View>

              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <MaterialCommunityIcons name="dumbbell" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.itemName}>Cinto vazio</Text>
                </View>
                <Text style={styles.itemWeight}>150 g</Text>
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
              <MaterialCommunityIcons name={type === 'natação' ? 'swim' : type === 'corrida' ? 'run' : 'bike'} size={40} color="#555" />
            </View>
            <Text style={styles.emptyTitle}>NENHUM KIT PARA {type ? type.toString().toUpperCase() : 'BIKE'}</Text>
            <Text style={styles.emptyDescription}>
              Você ainda não tem kits de equipamento cadastrados para esta modalidade.
            </Text>
            <TouchableOpacity style={styles.btnCriarKit} activeOpacity={0.8} onPress={() => router.push('/kits' as any)}>
              <Text style={styles.btnCriarKitText}>CRIAR KIT AGORA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- FOOTER ACTIONS --- */}
        <View style={styles.footer}>
          {hasKit ? (
            /* Botões Ativos (Com kit) */
            <>
              <TouchableOpacity style={styles.btnTreinarSemEquipamento} onPress={handleAvancar}>
                <Text style={styles.btnTreinarSemEquipamentoText}>TREINAR SEM EQUIPAMENTO</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnConfirmar} 
                onPress={handleAvancar} 
                activeOpacity={0.9}
              >
                <Text style={styles.btnConfirmarText}>CONFIRMAR E IR PARA CHECKLIST</Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>
            </>
          ) : (
            /* Botões de Estado Vazio (Sem kit) */
            <View style={styles.emptyFooterWrapper}>
              <TouchableOpacity style={styles.btnTreinarSemEquipamentoOutline} onPress={handleAvancar}>
                <Text style={styles.btnTreinarSemEquipamentoOutlineText}>TREINAR SEM EQUIPAMENTO</Text>
              </TouchableOpacity>
              
              <Text style={styles.emptyFooterDescription}>
                Nenhum peso será descontado nesta sessão.
              </Text>

              <View style={styles.btnConfirmarDisabled}>
                <Text style={styles.btnConfirmarDisabledText}>CONFIRMAR E IR PARA CHECKLIST</Text>
                <Feather name="arrow-right" size={20} color="#999" />
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </Screen>
  );
}
