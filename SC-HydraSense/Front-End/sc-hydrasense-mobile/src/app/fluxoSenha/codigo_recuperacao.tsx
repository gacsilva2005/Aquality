import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { theme } from '../../global/themas'; 
import { Button } from '../../components/Button'; 

export default function PinVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  
  // Estado para os 6 dígitos do PIN
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // ── Modal customizado ──
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'info' | 'error'>('info');
  const [modalOnOk, setModalOnOk] = useState<() => void>(() => () => setModalVisible(false));

  function showModal(title: string, message: string, type: 'info' | 'error' = 'info', onOk?: () => void) {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOnOk(() => () => { setModalVisible(false); onOk?.(); });
    setModalVisible(true);
  }

  // ── Lógica dos Inputs de PIN ──
  const handleCodeChange = (text: string, index: number) => {
    // Permite apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Avança para o próximo input se digitou um número
    if (numericText !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Retorna para o input anterior se apertar backspace com o input vazio
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── Validação do Código ──
  const handleValidateCode = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length < 6) {
      showModal('Código Incompleto', 'Por favor, insira os 6 dígitos do código.', 'error');
      return;
    }

    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/auth/recuperar-senha/validar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, token: fullCode }),
      });

      if (!response.ok) {
        showModal(
          'PIN INCORRETO', 
          'Acesso negado. Por favor, verifique suas credenciais e tente novamente.', 
          'error'
        );
        return;
      }

      showModal(
        'Código Validado',
        'Seu código foi verificado com sucesso. Você já pode redefinir sua senha.',
        'info',
        () => router.push({
          pathname: './redefinir_senha', // Ajuste para a rota correta
          params: { email, token: fullCode }
        })
      );

    } catch (error) {
      console.log(error);
      showModal('Erro de Conexão', 'Não foi possível conectar ao servidor.', 'error');
    }
  };


  // ── Reenvio do Código ──
  const handleResendCode = async () => {
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/auth/recuperar-senha/enviar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        showModal('Erro', 'Não foi possível reenviar o código. Tente novamente.', 'error');
        return;
      }

      showModal('Código Reenviado', 'Um novo código foi enviado para o seu e-mail.', 'info');
    } catch (error) {
      showModal('Erro de Conexão', 'Não foi possível conectar ao servidor.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* ── Cabeçalho Superior Escuro ── */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SEGURANÇA</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text style={styles.title}>VERIFICAÇÃO DE PIN</Text>
          <Text style={styles.subtitle}>
            Insira o código de 6 dígitos enviado para o seu e-mail.
          </Text>

          {/* ── Inputs do PIN ── */}
          <View style={styles.pinContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.pinInput,
                  digit ? styles.pinInputActive : null
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* ── Botão Validar ── */}
          <Button 
            title="VALIDAR CÓDIGO" 
            onPress={handleValidateCode} 
          />

          {/* ── Botão Reenviar ── */}
          <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
            <Feather name="refresh-cw" size={16} color={theme.colors.primary} />
            <Text style={styles.resendText}>REENVIAR CÓDIGO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── MODAL CUSTOMIZADO ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            
            {/* Ícone quadrado com bordas arredondadas */}
            <View style={[
              modalStyles.iconWrapper, 
              modalType === 'error' ? modalStyles.iconWrapperError : null
            ]}>
              <Feather 
                name={modalType === 'error' ? "alert-triangle" : "shield"} 
                size={32} 
                color={modalType === 'error' ? '#B91C1C' : theme.colors.primary} 
              />
            </View>

            {/* Título (Fica vermelho se for erro) */}
            <Text style={[
              modalStyles.title,
              modalType === 'error' && { color: theme.colors.primary }
            ]}>
              {modalTitle}
            </Text>

            <Text style={modalStyles.message}>{modalMessage}</Text>
            
            <TouchableOpacity 
              style={[
                modalStyles.btnOk,
                modalType === 'error' && { backgroundColor: theme.colors.critical }
              ]} 
              onPress={modalOnOk} 
              activeOpacity={0.8}
            >
              <Text style={modalStyles.btnOkText}>
                {modalType === 'error' ? 'TENTAR NOVAMENTE' : 'OK'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ── Estilos da Tela ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    backgroundColor: theme.colors.header,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 16,
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textBrownSoft,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8, // Mantém os campos juntos e uniformes
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  pinInput: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#C4C4CC',
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.fonts.headingBold,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  pinInputActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
  },
  resendText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    letterSpacing: 0.5,
  },
});

// ── Estilos do Modal ──
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapperError: {
    backgroundColor: '#FCE8E8',
  },
  title: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 15,
    color: theme.colors.textBrown,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  btnOk: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  btnOkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textWhite,
  },
});