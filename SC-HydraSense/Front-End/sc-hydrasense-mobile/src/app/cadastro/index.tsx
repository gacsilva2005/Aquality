import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useRouter, Stack } from 'expo-router'; 
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { InputCadastro } from '../../components/InputCadastro';
import { styles } from './styles';

export default function Cadastro() {
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [time, setTime] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado para armazenar os erros de cada campo
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleCreateAccount = async () => {
    // 1. Limpamos os erros antigos
    let novosErros: Record<string, string> = {};

    // 2. Validações
    if (!nome.trim()) {
      novosErros.nome = 'Preencha o nome completo.';
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
        email: email.trim(),
        senha: senha.trim(),
        dataNascimento: dataNascimentoStr,
        pesoAtual: parseFloat(peso),
        altura: parseFloat(altura),
        clube: time.trim(),
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
        Alert.alert('Sucesso!', 'Conta criada com sucesso. Um código foi enviado ao seu e-mail.');
        router.back(); 
      } else {
        const errorText = await response.text();
        Alert.alert('Erro no Cadastro', 'Não foi possível criar a conta. Verifique os dados ou se o e-mail já existe.');
        console.error('Erro na API:', errorText);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
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