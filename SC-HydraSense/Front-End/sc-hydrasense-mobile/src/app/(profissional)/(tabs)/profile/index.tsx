// src/app/(tabs)/profile/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
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

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const {
        user,
        setUser,
        profileImage,
        setProfileImage
    } = useUser();

    const [weight, setWeight] = useState(
        user?.pesoAtual?.toString() || ''
    );

    const [height, setHeight] = useState(
        user?.altura?.toString() || ''
    );

    const calcularIdade = (dataNascimento: string) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        let idade = hoje.getFullYear() - nascimento.getFullYear();

        const mes = hoje.getMonth() - nascimento.getMonth();

        if (
            mes < 0 ||
            (mes === 0 && hoje.getDate() < nascimento.getDate())
        ) {
            idade--;
        }

        return idade.toString();
    };

    const [age, setAge] = useState(
        user?.dataNascimento
            ? calcularIdade(user.dataNascimento)
            : ''
    );
    const [gender, setGender] = useState<'M' | 'F' | null>('M');
    const [time, setTime] = useState(
        user?.modalidade || ''
    );

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

            const response = await fetch(`${API_URL}/Atleta/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...user,
                    nome: user?.nome,
                    pesoAtual: Number(weight),
                    altura: Number(height),
                }),
            });

            const responseText = await response.text();

            console.log('STATUS:', response.status);
            console.log('RESPOSTA:', responseText);

            if (!response.ok) {
                Alert.alert('Erro', 'Não foi possível atualizar o perfil');
                return;
            }

            const updatedUser = JSON.parse(responseText);

            setUser(updatedUser);

            Alert.alert('Sucesso', 'Perfil atualizado!');
            setIsEditing(false);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro de conexão com servidor');
        }
    };

  const handleLogout = () => {
    console.log("Sessão encerrada");
    router.replace('/');
  };

  return (
    <Screen
      backgroundColor={theme.colors.background}
      scrollable={true}
      HeaderComponent={<Header/>}
    >
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine}>SEU</Text>
          <Text style={styles.titleLine}>PERFIL</Text>
        </View>

        <Text style={styles.description}>
          Gerencie seus parâmetros fisiológicos e equipamentos para cálculos precisos de taxa de suor.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONFIGURAÇÕES PESSOAIS</Text>
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

        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../../../assets/images/logo.png')}
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
                autoCapitalize="characters"
              />
            ) : (
                <Text style={styles.photoTitle}>{user?.nome}</Text>
            )}
            <Text style={styles.photoSubtitle}>
              {isEditing ? "Toque no ícone para alterar" : "Clique em EDITAR para mudar"}
            </Text>
          </View>
        </View>

        <InputProfile
          label="PESO ATUAL (KG)"
          value={weight}
          onChangeText={setWeight}
          editable={isEditing}
          placeholder='Ex: 70'
          observation="USE SEMPRE A MESMA BALANÇA"
          style={isEditing ? styles.inputUnlocked : styles.inputLocked}
        />

        <InputProfile
          label="ALTURA (CM)"
          value={height}
          onChangeText={setHeight}
          editable={isEditing}
          placeholder="Ex: 170"
          style={isEditing ? styles.inputUnlocked : styles.inputLocked}
        />

        <InputProfile
          label="IDADE"
          value={age}
          onChangeText={setAge}
          editable={isEditing}
          placeholder="Ex: 30"
          style={isEditing ? styles.inputUnlocked : styles.inputLocked}
        />

        <View style={[styles.genderContainer, !isEditing && { opacity: 0.5 }]}>
          <Text style={styles.inputLabel}>SEXO BIOLÓGICO</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              disabled={!isEditing}
              style={[styles.genderButton, gender === 'M' && styles.genderButtonSelected]}
              onPress={() => setGender('M')}
            >
              <Text style={[styles.genderText, gender === 'M' && styles.genderTextSelected]}>
                MASCULINO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isEditing}
              style={[styles.genderButton, gender === 'F' && styles.genderButtonSelected]}
              onPress={() => setGender('F')}
            >
              <Text style={[styles.genderText, gender === 'F' && styles.genderTextSelected]}>
                FEMININO
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Divider text="INFORMAÇÕES PROFISSIONAIS" />

        <View style={styles.professionalContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>EQUIPE (ORGANIZAÇÃO)</Text>
              <Text style={styles.infoValue}>
                  {user?.clube?.nome || 'Sem equipe'}
              </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>TIME (CATEGORIA)</Text>
            <Text style={styles.infoValue}>{time}</Text>
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