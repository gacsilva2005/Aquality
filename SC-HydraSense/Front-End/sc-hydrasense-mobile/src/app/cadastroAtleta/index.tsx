import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useRouter, Stack } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import { theme } from '../../global/themas';
import { InputCadastro } from '../../components/InputCadastro';
import { styles } from './styles';
import { useAlert } from '@/src/contexts/alertContext';
 
export default function Cadastro() {
  const alert = useAlert();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [time, setTime] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [habilitarBiometria, setHabilitarBiometria] = useState(false);

  // Estado para armazenar os erros de cada campo
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleCreateAccount = async () => {
    // 1. Limpamos os erros antigos
    let novosErros: Record<string, string> = {};

    // 2. Validações
    if (!nome.trim()) {
      novosErros.nome = 'Preencha o nome completo.';
    }

    if (!sexo.trim()) {
      novosErros.sexo = 'Informe o sexo.';
    }

    // Validação de E-mail (verifica se tem @ e .)
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      novosErros.email = 'Informe um e-mail válido.';
    }

    // Validação de Senha (mínimo 6 caracteres)
    if (!senha.trim() || senha.length < 6) {
      novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }

    // Idade não pode ser vazia e tem que ser maior que 0
    if (!idade.trim() || parseInt(idade) <= 0) {
      novosErros.idade = 'Informe uma idade válida.';
    }

    // Peso não pode ser vazio e tem que ser maior que 0
    if (!peso.trim() || parseFloat(peso) <= 0) {
      novosErros.peso = 'O peso não pode ser zero.';
    }

    // Altura não pode ser vazia e tem que ser maior que 0
    if (!altura.trim() || parseInt(altura) <= 0) {
      novosErros.altura = 'A altura não pode ser zero.';
    }

    if (!time.trim()) {
      novosErros.time = 'Informe a qual time pertence.';
    }

    if (!codigo.trim()) {
      novosErros.codigo = 'Informe o código da equipe.';
    }

    // 3. Se o objeto novosErros tiver algo, barra o cadastro e mostra os erros
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return; // Interrompe a função aqui!
    }

    setErros({}); // Limpa os erros

    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8080`;

      // Transformando a idade em um ano de nascimento aproximado para o backend
      const anoNascimento = new Date().getFullYear() - parseInt(idade);
      const dataNascimentoStr = `${anoNascimento}-01-01`;

      const atletaPayload = {
        nome: nome.trim(),
        sexo: sexo.trim(),
        email: email.trim(),
        senha: senha.trim(),
        dataNascimento: dataNascimentoStr,
        pesoAtual: parseFloat(peso),
        altura: parseFloat(altura),
        modalidade: time.trim(),
        codigoEquipe: codigo.trim(),
        modalidadePrincipal: "Geral" // Padrão caso não haja o campo
      };

      const response = await fetch(`${API_URL}/Atleta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(atletaPayload)
      });

      if (response.ok) {
        // Se o usuário marcou para habilitar biometria
        if (habilitarBiometria) {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();

          if (hasHardware && isEnrolled) {
            const authResult = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Confirme sua identidade para habilitar a biometria',
              fallbackLabel: 'Usar senha',
            });

            if (authResult.success) {
              await SecureStore.setItemAsync('biometriaAtiva', 'true');
              await SecureStore.setItemAsync('biometric_email', email.trim());
              await SecureStore.setItemAsync('biometric_password', senha.trim());
              alert.success('Sucesso!', 'Conta criada e biometria habilitada com sucesso. Um código foi enviado ao seu e-mail.');
              router.back();
              return;
            } else {
              alert.warning('Aviso', 'Biometria não confirmada. Você poderá tentar habilitar depois.');
            }
          } else {
            alert.warning('Aviso', 'Seu dispositivo não suporta ou não tem biometria cadastrada.');
          }
        } else {
          // Se ele não marcou, garantimos que qualquer biometria anterior deste aparelho seja apagada
          await SecureStore.deleteItemAsync('biometriaAtiva');
          await SecureStore.deleteItemAsync('biometric_email');
          await SecureStore.deleteItemAsync('biometric_password');
        }

        alert.success('Sucesso!', 'Conta criada com sucesso. Um código foi enviado ao seu e-mail.');
        router.back();
      } else {
        try {
          const errorData = await response.json();
          alert.error('Erro no Cadastro', errorData.message || 'Não foi possível criar a conta.');
        } catch (e) {
          alert.error('Erro no Cadastro', 'Verifique os dados ou se o código de equipe está correto.');
        }
      }
    } catch (error) {
      console.error(error);
      alert.error('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
    }
  };

  // Função auxiliar para limpar o erro quando o usuário começa a digitar novamente
  const handleChange = (field: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    // Remove o erro daquele campo específico assim que a pessoa digita algo
    setErros((prevErros) => ({ ...prevErros, [field]: '' }));
  };

  return (
    <Screen backgroundColor="#FFFFFF" scrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.formContainer}>

        {/* --- DADOS DE ACESSO --- */}
        <Text style={styles.sectionTitle}>DADOS DE ACESSO</Text>

        <InputCadastro
          label="E-MAIL"
          value={email}
          onChangeText={(text) => handleChange('email', text, setEmail)}
          placeholder="Ex: atleta@saocamilo.com"
          keyboardType="email-address"
          autoCapitalize="none" // Importante: não deixa a primeira letra maiúscula no e-mail
          autoCorrect={false}
          errorMessage={erros.email}
        />

        <InputCadastro
          label="SENHA"
          value={senha}
          onChangeText={(text) => handleChange('senha', text, setSenha)}
          placeholder="Mínimo 6 caracteres"
          isPassword={true}
          autoCapitalize="none"
          errorMessage={erros.senha}
        />

        <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>

        <InputCadastro
          label="NOME COMPLETO"
          value={nome}
          // Usamos o handleChange para limpar o erro ao digitar
          onChangeText={(text) => handleChange('nome', text, setNome)}
          placeholder="Ex: João da Silva"
          autoCapitalize="words"
          autoCorrect={false}
          errorMessage={erros.nome} // Passa o erro para o componente
        />

        <InputCadastro
          label="IDADE"
          value={idade}
          onChangeText={(text) => handleChange('idade', text, setIdade)}
          placeholder="Ex: 25"
          keyboardType="numeric"
          errorMessage={erros.idade}
        />

        {/* --- CAMPO SEXO BIOLÓGICO (Checkboxes) --- */}
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>SEXO BIOLÓGICO</Text>

          <View style={styles.checkboxRow}>
            {/* Opção Masculino */}
            <TouchableOpacity
              style={styles.checkboxItem}
              activeOpacity={0.7}
              onPress={() => {
                setSexo('Masculino');
                setErros((prev) => ({ ...prev, sexo: '' })); // Limpa o erro ao clicar
              }}
            >
              <Checkbox
                value={sexo === 'Masculino'}
                onValueChange={() => {
                  setSexo('Masculino');
                  setErros((prev) => ({ ...prev, sexo: '' }));
                }}
                color={sexo === 'Masculino' ? theme.colors.primary : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxText}>Masculino</Text>
            </TouchableOpacity>

            {/* Opção Feminino */}
            <TouchableOpacity
              style={styles.checkboxItem}
              activeOpacity={0.7}
              onPress={() => {
                setSexo('Feminino');
                setErros((prev) => ({ ...prev, sexo: '' })); // Limpa o erro ao clicar
              }}
            >
              <Checkbox
                value={sexo === 'Feminino'}
                onValueChange={() => {
                  setSexo('Feminino');
                  setErros((prev) => ({ ...prev, sexo: '' }));
                }}
                color={sexo === 'Feminino' ? theme.colors.primary : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxText}>Feminino</Text>
            </TouchableOpacity>
          </View>

          {/* Exibição da mensagem de erro caso o usuário tente avançar sem preencher */}
          {erros.sexo ? <Text style={styles.errorText}>{erros.sexo}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>PERFIL FÍSICO</Text>

        <View style={styles.row}>
          <InputCadastro
            label="PESO BASE (KG)"
            value={peso}
            onChangeText={(text) => handleChange('peso', text, setPeso)}
            placeholder="0.0"
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginRight: 10 }}
            errorMessage={erros.peso}
          />
          <InputCadastro
            label="ALTURA (CM)"
            value={altura}
            onChangeText={(text) => handleChange('altura', text, setAltura)}
            placeholder="0"
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginLeft: 10 }}
            errorMessage={erros.altura}
          />
        </View>

        <Text style={styles.sectionTitle}>VÍNCULO COM A EQUIPE</Text>

        <InputCadastro
          label="TIME (CATEGORIA)"
          value={time}
          onChangeText={(text) => handleChange('time', text, setTime)}
          placeholder="Ex: Futebol Sub-20"
          autoCapitalize="words"
          errorMessage={erros.time}
        />

        <InputCadastro
          label="CÓDIGO DA EQUIPE"
          value={codigo}
          onChangeText={(text) => handleChange('codigo', text, setCodigo)}
          placeholder="Ex: SQUAD-2024"
          autoCapitalize="characters"
          autoCorrect={false}
          errorMessage={erros.codigo}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
          <Checkbox
            value={habilitarBiometria}
            onValueChange={setHabilitarBiometria}
            color={habilitarBiometria ? theme.colors.primary : undefined}
            style={{ marginRight: 10, width: 20, height: 20 }}
          />
          <Text style={{ color: '#4A4A4A', fontSize: 14, fontFamily: 'Inter_400Regular' }}>
            Habilitar Login por Biometria
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="CRIAR CONTA" onPress={handleCreateAccount} />
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>

      </View>
    </Screen>
  );
}