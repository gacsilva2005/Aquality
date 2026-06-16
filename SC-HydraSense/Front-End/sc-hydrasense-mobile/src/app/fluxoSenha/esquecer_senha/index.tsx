import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../../../components/Button';
import { Screen } from '../../../components/Screen';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../../styles';
import { router } from 'expo-router';
import { Input } from '../../../components/Input';
import { theme } from '../../../global/themas';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useAlert } from '@/src/contexts/alertContext'; // Importando nosso hook global

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  
  const alert = useAlert(); 

  const handleResetPassword = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      alert.warning('Campo Obrigatório', 'Por favor, informe seu e-mail para recuperar a senha.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      alert.warning('E-mail Inválido', 'Insira um formato de e-mail válido.');
      return;
    }

    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      const response = await fetch(`${API_URL}/auth/recuperar-senha/enviar-codigo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const respostaTexto = await response.text();

      console.log("STATUS:", response.status);
      console.log("RESPOSTA:", respostaTexto);

      if (!response.ok) {
        alert.error('Erro', 'Não foi possível enviar o código. Verifique o e-mail informado.');
        return;
      }

      alert.success(
        'Código Enviado',
        'Enviamos um código de verificação para o seu e-mail.',
        () => router.push({
          pathname: './codigo_recuperacao',
          params: { email: cleanEmail },
        })
      );

    } catch (error) {
      console.log(error);
      alert.error(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor.'
      );
    }
  };

  return (
    <Screen 
      bgImage={require('../../../assets/images/logo.png')}
      backgroundColor="#4A0E17"
      imageStyle={{ 
        height: 500,          
        transform: [{ translateY: -20 }], 
      }} 
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Reaproveitando o Cabeçalho */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="tint" size={16} color="#FFF" />
          <Text style={styles.logoText}>AQUALITY</Text>
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