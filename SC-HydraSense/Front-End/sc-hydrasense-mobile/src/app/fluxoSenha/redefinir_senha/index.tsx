import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { theme } from '../../../global/themas'; 
import { Button } from '../../../components/Button'; 
import { useAlert } from '@/src/contexts/alertContext'; 

export default function ResetPasswordScreen() {
  const { email, token } = useLocalSearchParams<{ email: string, token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const alert = useAlert();

  // ── Lógica de Validação dos Requisitos ──
  const hasMinChars = password.length >= 8;
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleConfirmReset = async () => {
    // Só prossegue se os requisitos forem atendidos e as senhas baterem
    if (password !== confirmPassword) {
      alert.warning("Atenção", "As senhas inseridas não coincidem!");
      return;
    }

   try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/auth/recuperar-senha/alterar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          token: token, 
          novaSenha: password 
        }),
      });

      if (response.ok) {
        alert.success(
          "PARABÉNS!", 
          "NOVA SENHA SALVA", 
          () => router.replace('/')
        );
      } else {
        alert.error("Erro", "Erro ao redefinir. O tempo do código pode ter expirado.");
      }
    } catch (error) {
      alert.error("Erro de Conexão", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* 1. O KeyboardAvoidingView fica por FORA abraçando tudo */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* 2. O Touchable garante que clicar em qualquer lugar vazio fecha o teclado */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
 
            <View style={styles.header}>
              <Text style={styles.mainTitle}>REDEFINIR SENHA</Text>
              <Text style={styles.description}>
                Insira sua nova senha abaixo. Certifique-se de que ela atenda aos requisitos de segurança do laboratório.
              </Text>
            </View>

            {/* Transformamos o antigo KeyboardAvoidingView em uma View normal */}
            <View style={styles.content}>
              <View style={styles.formCard}>
                
                {/* Campo Nova Senha */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>NOVA SENHA</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.input}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="********"
                      placeholderTextColor="#C4C4CC"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#7C7C8A" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Campo Confirmar Senha */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>CONFIRMAR NOVA SENHA</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="********"
                    placeholderTextColor="#C4C4CC"
                  />
                </View>

                {/* Lista de Requisitos */}
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>REQUISITOS DE SEGURANÇA</Text>
                  
                  <RequirementItem label="Mínimo de 8 caracteres" active={hasMinChars} />
                  <RequirementItem label="Contém números" active={hasNumbers} />
                  <RequirementItem label="Contém símbolos (ex: @, #, $)" active={hasSymbols} />
                </View>

                <Button 
                  title="REDEFINIR" 
                  onPress={handleConfirmReset}
                  disabled={!(hasMinChars && hasNumbers && hasSymbols && password === confirmPassword)}
                />

                <TouchableOpacity 
                  style={styles.backLink} 
                  onPress={() => router.replace('/')}
                >
                  <Feather name="arrow-left" size={18} color="#7C7C8A" />
                  <Text style={styles.backLinkText}>VOLTAR AO LOGIN</Text>
                </TouchableOpacity>

              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Sub-componente para os requisitos
function RequirementItem({ label, active }: { label: string, active: boolean }) {
  return (
    <View style={styles.reqRow}>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active && <Feather name="check" size={12} color={theme.colors.success} />}
      </View>
      <Text style={[styles.reqText, active && styles.reqTextActive]}>
        {label}
      </Text>
    </View>
  );
}

// ── ESTILOS DA TELA PRINCIPAL ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 30,
  },
  mainTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 28,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 28,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.border,
    paddingBottom: 8,
  },
  inputLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.bodyRegular,
    color: theme.colors.textPrimary,
    paddingVertical: 4,
  },
  requirementsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  requirementsTitle: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB', 
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  radioActive: {
    borderColor: theme.colors.success,
    backgroundColor: '#ECFDF5',
  },
  reqText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  reqTextActive: {
    color: theme.colors.textPrimary,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingVertical: 8,
  },
  backLinkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
});