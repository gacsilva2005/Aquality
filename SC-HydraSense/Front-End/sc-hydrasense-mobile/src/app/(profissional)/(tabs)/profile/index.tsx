import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import { Screen } from '../../../../components/Screen';
import { Header } from '../../../../components/Header';
import { InputProfile } from '../../../../components/InputProfile';
import { styles } from './styles';
import { theme } from '@/src/global/themas';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Divider } from '@/src/components/Divider';
import { useUser } from '../../../../contexts/UserContext';
import Constants from "expo-constants";
import { useAlert } from '@/src/contexts/alertContext';

import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

const CLUBES = [
    "Corinthians", "Palmeiras", "Santos", "São Paulo", "América-SP", 
    "Guarani", "Ponte Preta", "Ituano", "Juventus", "Portuguesa"
];

export default function ProfileProfissional() {
    const alert = useAlert();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const {
        user,
        setUser,
        profileImage,
        setProfileImage
    } = useUser();

    // --- ESTADOS ESPECÍFICOS DO PROFISSIONAL ---
    const [perfil, setPerfil] = useState(user?.especialidade || ''); 
    const [email, setEmail] = useState(user?.email || '');
    const [registro, setRegistro] = useState(user?.registro || '');
    const [especialidade, setEspecialidade] = useState(user?.especialidade || '');
    const [clube, setClube] = useState(user?.clube?.nome || '');
    const [modalClubesVisivel, setModalClubesVisivel] = useState(false);
    const [gender, setGender] = useState<'M' | 'F' | null>(user?.sexo === 'Feminino' ? 'F' : 'M');

    // Função para selecionar o perfil e limpar o erro
    const handleSelectPerfil = (tipo: string) => {
        setPerfil(tipo);
        setEspecialidade(tipo);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            const hostUri = Constants?.expoConfig?.hostUri;
            const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
            const API_URL = `http://${ip}:8080`;

            console.log('--- LOG DE SALVAR (PROFISSIONAL) ---');
            console.log('profileImage atual:', profileImage);
            let base64Image = profileImage;
            if (profileImage && !profileImage.startsWith('data:')) {
                try {
                    const base64 = await FileSystem.readAsStringAsync(profileImage, {
                        encoding: 'base64',
                    });
                    base64Image = `data:image/png;base64,${base64}`;
                    console.log('Conversão Base64 executada com sucesso! Tamanho:', base64Image.length);
                } catch (err) {
                    console.log('Erro ao converter imagem para Base64:', err);
                }
            }

            const response = await fetch(`${API_URL}/profissionais/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...user,
                    nome: user?.nome,
                    email: email,
                    registro: registro,
                    especialidade: especialidade,
                    sexo: gender === 'M' ? 'Masculino' : 'Feminino',
                    clube: clube ? { nome: clube.trim() } : null,
                    fotoPerfil: base64Image
                }),
            });

            if (!response.ok) {
                alert.error('Erro', 'Não foi possível atualizar o perfil');
                return;
            }

            const responseText = await response.text();
            const updatedUser = JSON.parse(responseText);

            // Evitar erro de 2KB no SecureStore limpando fotoPerfil do objeto persistido no dispositivo
            const userToSave = { ...updatedUser, fotoPerfil: null };
            await SecureStore.setItemAsync('usuarioLogado', JSON.stringify(userToSave));
            await setUser(updatedUser);
            
            alert.success('Sucesso', 'Perfil atualizado!');
            setIsEditing(false);

        } catch (error) {
            console.log(error);
            alert.error('Erro', 'Erro de conexão com servidor');
        }
    };

    const handleLogout = async () => {
        console.log("Sessão encerrada");
        await SecureStore.deleteItemAsync('usuarioLogado');
        setUser(null);
        router.replace('/');
    };

    return (
        <Screen
            backgroundColor={theme.colors.background}
            scrollable={true}
            HeaderComponent={<Header />}
        >
            <View style={styles.mainContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleLine}>SEU</Text>
                    <Text style={styles.titleLine}>PERFIL</Text>
                </View>

                <Text style={styles.description}>
                    Gerencie suas credenciais de acesso, registro profissional e vínculos institucionais.
                </Text>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>DADOS DA CONTA</Text>
                    <TouchableOpacity
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                        style={styles.editButton}
                    >
                        <MaterialCommunityIcons
                            name={isEditing ? "check-circle" : "pencil-circle"}
                            size={24}
                            color={isEditing ? "#27ae60" : theme.colors.primary}
                        />
                        <Text style={[styles.editText, isEditing && { color: "#27ae60" }]}>
                            {isEditing ? "SALVAR" : "EDITAR"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- FOTO E NOME --- */}
                <View style={styles.photoSection}>
                    <View style={styles.photoContainer}>
                        <Image
                            source={profileImage ? { uri: profileImage } : require('../../../../assets/images/anonymous_avatar.png')}
                            style={styles.profilePhoto}
                        />
                        {isEditing && (
                            <TouchableOpacity
                                style={styles.changePhotoButton}
                                onPress={pickImage}
                            >
                                <MaterialCommunityIcons name="camera-flip" size={20} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.photoTextContainer}>
                        {isEditing ? (
                            <TextInput
                                style={[styles.photoTitle, styles.nameInput]}
                                value={user?.nome || ''}
                                onChangeText={(text) =>
                                    setUser({
                                        ...user!,
                                        nome: text,
                                    })
                                }
                                autoFocus
                                placeholder="SEU NOME"
                                autoCorrect={false}
                                spellCheck={false}
                                autoCapitalize="words"
                            />
                        ) : (
                            <Text style={styles.photoTitle}>{user?.nome || 'Profissional'}</Text>
                        )}
                        <Text style={styles.photoSubtitle}>
                            {isEditing ? "Toque no ícone para alterar" : "Clique em EDITAR para mudar"}
                        </Text>
                    </View>
                </View>

                {/* --- INPUTS DO PROFISSIONAL --- */}
                <InputProfile
                    label="ENDEREÇO DE E-MAIL"
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditing}
                    placeholder="exemplo@clinica.com"
                    style={isEditing ? styles.inputUnlocked : styles.inputLocked}
                />

                <InputProfile
                    label="REGISTRO PROFISSIONAL (CRN/CRM/CREF)"
                    value={registro}
                    onChangeText={setRegistro}
                    editable={isEditing}
                    placeholder="Ex: 123456-SP"
                    autoCapitalize="characters"
                    style={isEditing ? styles.inputUnlocked : styles.inputLocked}
                />

                <Text style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleProfissional}>SEXO BIOLÓGICO</Text>
                </Text>
                <View style={[styles.genderContainer, !isEditing && { opacity: 0.7 }]}>
                    <TouchableOpacity
                        disabled={!isEditing}
                        style={[
                            styles.genderButton,
                            gender === 'M' && styles.genderButtonSelected,
                            !isEditing && styles.genderButtonLocked
                        ]}
                        onPress={() => setGender('M')}
                    >
                        <Text style={[styles.genderText, gender === 'M' && styles.genderTextSelected]}>
                            MASCULINO
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={!isEditing}
                        style={[
                            styles.genderButton,
                            gender === 'F' && styles.genderButtonSelected,
                            !isEditing && styles.genderButtonLocked
                        ]}
                        onPress={() => setGender('F')}
                    >
                        <Text style={[styles.genderText, gender === 'F' && styles.genderTextSelected]}>
                            FEMININO
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- CAIXAS DE SELEÇÃO DE PERFIL --- */}

                <Text style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleProfissional}>TIPO DE PROFISSIONAL</Text>
                </Text>
                <View style={[styles.perfilContainer, !isEditing && { opacity: 0.7 }]}>
                    {/* Nutricionista */}
                    <TouchableOpacity
                        disabled={!isEditing} // <-- O SEGREDO ESTÁ AQUI
                        style={[
                            styles.perfilCard, 
                            perfil === 'Nutricionista' && styles.perfilCardActive,
                            !isEditing && styles.perfilCardLocked // <-- Adiciona estilo extra quando bloqueado
                        ]}
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
                        disabled={!isEditing} // Bloqueia o clique se não estiver editando
                        style={[
                            styles.perfilCard, 
                            perfil === 'Treinador' && styles.perfilCardActive,
                            !isEditing && styles.perfilCardLocked 
                        ]}
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
                        disabled={!isEditing} // Bloqueia o clique se não estiver editando
                        style={[
                            styles.perfilCard, 
                            perfil === 'Médico' && styles.perfilCardActive,
                            !isEditing && styles.perfilCardLocked
                        ]}
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

                <Divider text="VÍNCULO COM CLUBE" />

                <View style={[styles.professionalContainer, { zIndex: 10 }]}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>INSTITUIÇÃO OU CLUBE</Text>
                        {isEditing ? (
                            <View>
                                <TouchableOpacity 
                                    activeOpacity={0.7} 
                                    onPress={() => setModalClubesVisivel(!modalClubesVisivel)} 
                                    style={styles.dropdownInputContainer}
                                >
                                    <Text style={[styles.infoValue, { borderBottomWidth: 1, borderColor: '#CCC', paddingBottom: 4 }]}>
                                        {clube ? clube : 'Selecione um clube...'}
                                    </Text>
                                    <MaterialCommunityIcons 
                                        name={modalClubesVisivel ? "chevron-up" : "chevron-down"} 
                                        size={20} 
                                        color="#666" 
                                        style={styles.dropdownIcon}
                                    />
                                </TouchableOpacity>

                                {modalClubesVisivel && (
                                    <View style={styles.dropdownListContainer}>
                                        <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                                            {CLUBES.map((clubeItem) => (
                                                <TouchableOpacity
                                                    key={clubeItem}
                                                    style={styles.dropdownOption}
                                                    onPress={() => {
                                                        setClube(clubeItem);
                                                        setModalClubesVisivel(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.dropdownOptionText, 
                                                        clube === clubeItem && styles.dropdownOptionTextSelected
                                                    ]}>
                                                        {clubeItem}
                                                    </Text>
                                                    {clube === clubeItem && (
                                                        <MaterialCommunityIcons name="check" size={18} color={theme.colors.primary} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.infoValue}>{clube || 'Não informado'}</Text>
                        )}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>CÓDIGO DE ACESSO DA EQUIPE</Text>
                        {/* Esse dado costuma ser gerado pelo sistema, então mantemos fixo para visualização */}
                        <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                            {user?.clube?.codigo || 'Sem código'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="logout-variant"
                        size={22}
                        color={theme.colors.primary}
                    />
                    <Text style={styles.logoutText}>ENCERRAR SESSÃO</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
}