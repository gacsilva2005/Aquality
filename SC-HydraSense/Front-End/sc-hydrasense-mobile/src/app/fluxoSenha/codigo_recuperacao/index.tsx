import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { theme } from '../../../global/themas';
import { Button } from '../../../components/Button';
import { useAlert } from '@/src/contexts/alertContext'; // Hook global de alertas

export default function PinVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const alert = useAlert(); 
  
  // Estado para os 6 dígitos do PIN
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

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
      // 🌟 Usando o aviso laranja (atenção)
      alert.warning('Código Incompleto', 'Por favor, insira os 6 dígitos do código.');
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
        // 🌟 Usando o erro vermelho
        alert.error(
          'PIN Incorreto', 
          'Acesso negado. Por favor, verifique suas credenciais e tente novamente.'
        );
        return;
      }

      // 🌟 Usando o sucesso verde com callback para redirecionar
      alert.success(
        'Código Validado',
        'Seu código foi verificado com sucesso. Você já pode redefinir sua senha.',
        () => router.push({
          pathname: './redefinir_senha', // Ajuste para a rota correta se necessário
          params: { email, token: fullCode }
        })
      );

    } catch (error) {
      console.log(error);
      alert.error('Erro de Conexão', 'Não foi possível conectar ao servidor.');
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
        alert.error('Erro', 'Não foi possível reenviar o código. Tente novamente.');
        return;
      }

      alert.success('Código Reenviado', 'Um novo código foi enviado para o seu e-mail.');
    } catch (error) {
      alert.error('Erro de Conexão', 'Não foi possível conectar ao servidor.');
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
    gap: 8, 
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