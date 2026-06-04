import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useRouter, Stack } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import { theme } from '../../global/themas';
import { InputCadastro } from '../../components/InputCadastro';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // <-- IMPORTANTE ADICIONAR ISSO
import { styles } from './styles';
import { useAlert } from '@/src/contexts/alertContext';

export default function CadastroProfissional() {
    const alert = useAlert();
    const router = useRouter();

    // --- NOVO ESTADO PARA O PERFIL ---
    const [perfil, setPerfil] = useState(''); 

    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [time, setTime] = useState('');
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [modalClubesVisivel, setModalClubesVisivel] = useState(false);
    const [habilitarBiometria, setHabilitarBiometria] = useState(false);

    const [erros, setErros] = useState<Record<string, string>>({});

    const handleCreateAccount = async () => {
        let novosErros: Record<string, string> = {};

        // --- VALIDAÇÃO DO PERFIL ---
        if (!perfil) {
            novosErros.perfil = 'Por favor, selecione o seu perfil profissional.';
        }
        if (!nome.trim()) novosErros.nome = 'Preencha o nome completo.';
        if (!email.trim() || !email.includes('@') || !email.includes('.')) novosErros.email = 'Informe um e-mail válido.';
        if (!senha.trim() || senha.length < 6) novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.';
        if (!idade.trim() || parseInt(idade) <= 0) novosErros.idade = 'Informe uma idade válida.';
        if (!time.trim()) novosErros.time = 'Informe a instituição ou clube.';
        if (!codigo.trim()) novosErros.codigo = 'Informe o registro profissional.';

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return; 
        }
        setErros({}); 

        // === ATALHO PARA DESENVOLVIMENTO ===
        // Se estiver testando e o backend ainda não existir, ele pula direto para a tela
        if (__DEV__ && email.trim() === 'dev@dev.com') {
            router.replace('/(profissional)/(tabs)/dashboard');
            return;
        }

        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            const anoNascimento = new Date().getFullYear() - parseInt(idade);
            const dataNascimentoStr = `${anoNascimento}-01-01`;

            const profissionalPayload = {
                nome: nome.trim(),
                email: email.trim(),
                senha: senha.trim(),
                dataNascimento: dataNascimentoStr,
                clube: time ? { nome: time.trim() } : null,
                registro: codigo.trim(),
                especialidade: perfil 
            };

            const response = await fetch(`${API_URL}/profissionais`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profissionalPayload)
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
                            alert.success('Sucesso!', 'Conta criada e biometria habilitada com sucesso.');
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

                alert.success('Sucesso!', 'Conta criada com sucesso.', [
                    { 
                        text: 'OK', 
                        onPress: () => router.back()
                    }
                ]);
            } else {
                const errorData = await response.json();
                alert.error('Erro no Cadastro', errorData.message || 'Não foi possível criar a conta.');
            }

        } catch (error) {
            console.error(error);
            alert.error('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
        }
    };

    // Função para selecionar o perfil e limpar o erro
    const handleSelectPerfil = (tipo: string) => {
        setPerfil(tipo);
        setErros((prevErros) => ({ ...prevErros, perfil: '' }));
    };

    const handleChange = (field: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(value);
        setErros((prevErros) => ({ ...prevErros, [field]: '' }));
    };

    const CLUBES = [
        "Corinthians", "Palmeiras", "Santos", "São Paulo", "América-SP", 
        "Guarani", "Ponte Preta", "Ituano", "Juventus", "Portuguesa"
    ];

    return (
        <Screen backgroundColor="#F7F7F7" scrollable={true}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.formContainer}>

                <Text style={styles.sectionTitle}>{`Cadastro de\nprofissional`}</Text>
                
                <Text style={styles.sectionDescription}>Selecione seu perfil</Text>

                {/* --- CAIXAS DE SELEÇÃO DE PERFIL --- */}
                <View style={styles.perfilContainer}>
                    {/* Nutricionista */}
                    <TouchableOpacity
                        style={[styles.perfilCard, perfil === 'Nutricionista' && styles.perfilCardActive]}
                        onPress={() => handleSelectPerfil('Nutricionista')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="silverware-fork-knife"
                            size={32}
                            color={perfil === 'Nutricionista' ? '#1A1A1A' : '#888'}
                        />
                        <Text style={styles.perfilText}>Nutricionista</Text>
                    </TouchableOpacity>

                    {/* Treinador */}
                    <TouchableOpacity
                        style={[styles.perfilCard, perfil === 'Treinador' && styles.perfilCardActive]}
                        onPress={() => handleSelectPerfil('Treinador')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="dumbbell"
                            size={32}
                            color={perfil === 'Treinador' ? '#1A1A1A' : '#888'}
                        />
                        <Text style={styles.perfilText}>Treinador</Text>
                    </TouchableOpacity>

                    {/* Médico */}
                    <TouchableOpacity
                        style={[styles.perfilCard, perfil === 'Médico' && styles.perfilCardActive]}
                        onPress={() => handleSelectPerfil('Médico')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="stethoscope"
                            size={32}
                            color={perfil === 'Médico' ? '#1A1A1A' : '#888'}
                        />
                        <Text style={styles.perfilText}>Médico</Text>
                    </TouchableOpacity>
                </View>

                {/* Exibe o erro se ele tentar continuar sem selecionar */}
                {erros.perfil ? <Text style={[styles.errorText, { marginBottom: 15 }]}>{erros.perfil}</Text> : null}
                {/* ----------------------------------- */}

                <InputCadastro
                    label="NOME COMPLETO"
                    value={nome}
                    onChangeText={(text) => handleChange('nome', text, setNome)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    errorMessage={erros.nome} 
                />

                <InputCadastro
                    label="IDADE"
                    value={idade}
                    onChangeText={(text) => handleChange('idade', text, setIdade)}
                    keyboardType="numeric"
                    errorMessage={erros.idade}
                />

                <InputCadastro
                    label="REGISTRO DE PROFISSIONAL (Ex: CRN, CRM, etc)"
                    value={codigo}
                    onChangeText={(text) => handleChange('codigo', text, setCodigo)}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    errorMessage={erros.codigo}
                />

                <InputCadastro
                    label="E-MAIL"
                    value={email}
                    onChangeText={(text) => handleChange('email', text, setEmail)}
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                {/* 4. O CAMPO DE INSTITUIÇÃO (DROPDOWN INLINE) */}
                {/* O zIndex garante que a lista fique por cima dos outros elementos se necessário */}
                <View style={{ zIndex: 10 }}>
                    <TouchableOpacity 
                        activeOpacity={0.7} 
                        // Alterna entre abrir e fechar a lista
                        onPress={() => setModalClubesVisivel(!modalClubesVisivel)} 
                        style={styles.dropdownInputContainer}
                    >
                        <View pointerEvents="none" style={{ flex: 1 }}>
                            <InputCadastro
                                label="INSTITUIÇÃO OU CLUBE"
                                value={time ? time : 'Selecione um clube...'} 
                                onChangeText={() => {}} 
                                errorMessage={erros.time}
                            />
                        </View>
                        
                        {/* A SETINHA DINÂMICA (Aponta pra cima se aberto, pra baixo se fechado) */}
                        <MaterialCommunityIcons 
                            name={modalClubesVisivel ? "chevron-up" : "chevron-down"} 
                            size={24} 
                            color="#666" 
                            style={styles.dropdownIcon}
                        />
                    </TouchableOpacity>

                    {/* A LISTA DE CLUBES (Aparece logo abaixo do input quando clicado) */}
                    {modalClubesVisivel && (
                        <View style={styles.dropdownListContainer}>
                            {/* nestedScrollEnabled permite rolar a lista mesmo dentro do ScrollView principal da tela */}
                            <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                                {CLUBES.map((clube) => (
                                    <TouchableOpacity
                                        key={clube}
                                        style={styles.dropdownOption}
                                        onPress={() => {
                                            handleChange('time', clube, setTime);
                                            setModalClubesVisivel(false); // Fecha a lista após escolher
                                        }}
                                    >
                                        <Text style={[
                                            styles.dropdownOptionText, 
                                            time === clube && styles.dropdownOptionTextSelected
                                        ]}>
                                            {clube}
                                        </Text>
                                        
                                        {time === clube && (
                                            <MaterialCommunityIcons name="check" size={20} color={theme.colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

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
                    <Text style={styles.backButtonText}>Já possui conta ? FAZER LOGIN</Text>
                </TouchableOpacity>



            </View>
            
        </Screen>
    );
}