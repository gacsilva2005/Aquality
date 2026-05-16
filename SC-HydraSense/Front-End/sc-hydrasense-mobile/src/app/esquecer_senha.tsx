import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';
import { router } from 'expo-router';
import { Input } from '../components/Input';
import { theme } from '../global/themas';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe seu e-mail para recuperar a senha.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('E-mail Inválido', 'Insira um formato de e-mail válido.');
      return;
    }

    Alert.alert(
      'Solicitação Enviada',
      'Se este e-mail estiver em nossa base, você receberá instruções para redefinir sua senha em instantes.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <Screen bgImage={require('../assets/images/saocamilo.jpg')}
      backgroundColor="#4A0E17">

      {/* Reaproveitando o Cabeçalho */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="tint" size={16} color="#FFF" />
          <Text style={styles.logoText}>HYDRASENSE</Text>
        </View>

        <Text style={styles.mainTitle}>RECUPERAR</Text>
        <Text style={styles.subTitleHighlight}>ACESSO</Text>

        <Text style={styles.description}>
          Identifique-se para validar sua identidade{'\n'}
          e restaurar suas credenciais de performance.
        </Text>
      </View>

      {/* Card de Recuperação */}
      <View style={styles.bottomCard}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color="#7C7C8A" />
          <Text style={{ color: '#7C7C8A', marginLeft: 8, fontWeight: '500' }}>VOLTAR AO LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.cardTitle}>ESQUECEU A SENHA?</Text>
        <Text style={styles.cardSubtitle}>
          Enviaremos um código de verificação para o seu e-mail cadastrado no laboratório.
        </Text>

        {/* Input de E-mail */}
        <Input
          label="Endereço de E-mail cadastrado"
          iconName="mail"
          placeholder="Digite seu e-mail do portal"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Botão de Enviar */}
        <Button
          title="ENVIAR"
          onPress={handleResetPassword}
        />

        <View style={[styles.footerRow, { marginTop: 30 }]}>
          <Text style={styles.footerText}>Problemas com o e-mail? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Suporte Técnico</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Screen>
  );
}