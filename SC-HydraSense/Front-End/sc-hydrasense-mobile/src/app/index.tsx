import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Alert
} from 'react-native';
import { ModalTipoCadastro } from '../components/modalTipoCadastro'; // Atualizado
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { Divider } from '../components/Divider';
import { useUser } from '../contexts/UserContext';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { theme } from '../global/themas';
import { styles } from './styles';
import { router, useFocusEffect, Redirect } from 'expo-router';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // --- ESTADO DO MODAL DE CADASTRO ---
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [biometryPrompted, setBiometryPrompted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Reseta a flag sempre que a tela ganhar foco
      setBiometryPrompted(false);
    }, [])
  );

  const handleBiometricLogin = async () => {
    if (biometryPrompted) return;
    setBiometryPrompted(true);

    try {
      const isBiometriaAtiva = await SecureStore.getItemAsync('biometriaAtiva');
      if (isBiometriaAtiva !== 'true') return;

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autentique-se para entrar',
          fallbackLabel: 'Usar senha',
        });

        if (authResult.success) {
          const savedEmail = await SecureStore.getItemAsync('biometric_email');
          const savedPassword = await SecureStore.getItemAsync('biometric_password');

          if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            performLogin(savedEmail, savedPassword);
          }
        }
      }
    } catch (error) {
      console.log('Erro na biometria:', error);
    }
  };

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    const cleanEmail = loginEmail.trim();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o seu e-mail e a sua senha para acessar o portal.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail !== 'dev' && !emailRegex.test(cleanEmail)) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um formato de e-mail válido (ex: atleta@performance.com).');
      return;
    }

    setCarregando(true);
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, senha: cleanPassword }),
      });

      if (!response.ok) {
        Alert.alert('Erro de Autenticação', 'E-mail ou senha inválidos. Tente novamente.');
        setCarregando(false);
        return;
      }

      const dados = await response.json();

      console.log('Login validado com sucesso!', dados);

      setUser(dados.usuario);
      await SecureStore.setItemAsync('usuarioLogado', JSON.stringify(dados.usuario));

      if (dados.tipo === 'profissional') {
        router.replace('/(profissional)/(tabs)/dashboard');
      } else {
        router.replace('/(atleta)/(tabs)/dashboard');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogin = () => {
    performLogin(email, password);
  };

  // ==========================================
  // 🚀 ATALHO DE DESENVOLVIMENTO (TESTES)
  // Tire as duas barras (//) da linha abaixo para pular direto para a tela desejada:
  //
   return <Redirect href="/(atleta)/(tabs)/dashboard" />;
  //
  // Para voltar pro Atleta, seria: href="/(atleta)/(tabs)/dashboard"
  //    return <Redirect href="/(atleta)/(tabs)/profile" />;
  // ==========================================

  return (
    <Screen 
      bgImage={require('../assets/images/logo.png')}
      backgroundColor="#4A0E17"
      // Aqui controlamos a posição e tamanho sem esticar!
      imageStyle={{ 
        height: 500,          
        transform: [{ translateY: -20 }], 
      }} 
    >
      {/* === CABEÇALHO ESCURO === */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="tint" size={16} color="#FFF" />
          <Text style={styles.logoText}>AQUALITY</Text>
        </View>

        <Text style={styles.mainTitle}>PRECISÃO</Text>
        <Text style={styles.subTitleHighlight}>BIOMÉTRICA</Text>

        <Text style={styles.description}>
          Acesse o laboratório cinético de alta{'\n'}
          performance e monitore sua evolução{'\n'}
          em tempo real.
        </Text>
      </View>

      {/* === CARD BRANCO DE LOGIN === */}
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>ACESSO AO PORTAL</Text>
        <Text style={styles.cardSubtitle}>Insira suas credenciais técnicas para autenticação.</Text>

        {/* Input de E-mail */}
        <Input
          label="E-mail"
          iconName="mail"
          placeholder="Digite seu e-mail do portal"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          onFocus={handleBiometricLogin}
        />

        <Input
          label="Senha"
          placeholder="Sua senha de acesso"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
          onFocus={handleBiometricLogin}
        />

        {/* Opções (Lembrar / Esqueci a senha) */}
        <View style={styles.optionsRow}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? theme.colors.primary : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Lembrar sessão</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/fluxoSenha/esquecer_senha')}>
            <Text style={styles.forgotPassword}>ESQUECI MINHA SENHA</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Acesso */}
        <Button
          title="ACESSAR PORTAL"
          onPress={handleLogin}
        />

        {/* Divisor */}
        <Divider text="OU CONECTE VIA" />

        {/* Botões Sociais */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="google" size={18} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="apple" size={18} color="#000" />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Novo no AQuality? </Text>

          {/* MUDANÇA AQUI: Abrindo o modal ao invés de navegar direto */}
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.footerLink}>Criar cadastro</Text>
          </TouchableOpacity>
        </View>

        {/* --- MODAL DE ESCOLHA DE CADASTRO --- */}
        <ModalTipoCadastro
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </View>
    </Screen>
  );
}