import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from './styles';
import { theme } from '@/src/global/themas';

interface ModalTipoCadastroProps {
    visible: boolean;
    onClose: () => void;
}

export function ModalTipoCadastro({ visible, onClose }: ModalTipoCadastroProps) {
    // Estado para controlar qual card está pressionado no momento
    const [selectedOption, setSelectedOption] = useState<'atleta' | 'profissional' | null>(null);

    const handleSelectAtleta = () => {
        setSelectedOption('atleta'); // Fica vermelho
        setTimeout(() => {
            setSelectedOption(null); // Reseta o visual
            onClose(); 
            router.push('/cadastroAtleta');
        }, 300); // Aguarda 300ms para a animação de cor ser vista
    };

    const handleSelectProfissional = () => {
        setSelectedOption('profissional'); // Fica vermelho
        setTimeout(() => {
            setSelectedOption(null); // Reseta o visual
            onClose(); 
            router.push('./cadastroProfissional');
        }, 300); // Aguarda 300ms
    };

    const isAtleta = selectedOption === 'atleta';
    const isProfissional = selectedOption === 'profissional';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <MaterialCommunityIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>

                            <View style={styles.topIconContainer}>
                                <Ionicons name="water-sharp" size={28} color={theme.colors.primary} />
                            </View>

                            <Text style={styles.title}>ESCOLHA COMO DESEJA{'\n'}SE CADASTRAR</Text>

                            {/* --- BOTÃO ATLETA --- */}
                            <TouchableOpacity 
                                style={[styles.optionCard, isAtleta && styles.cardSelected]} 
                                activeOpacity={0.9}
                                onPress={handleSelectAtleta}
                            >
                                <View style={[styles.iconBox, isAtleta && styles.iconBoxSelected]}>
                                    <FontAwesome5 name="running" size={20} color={isAtleta ? '#FFF' : theme.colors.textBrown} />
                                </View>
                                <View style={styles.textWrapper}>
                                    <Text style={[styles.cardTitle, isAtleta && styles.textWhite]}>ATLETA</Text>
                                    <Text style={[styles.cardDesc, isAtleta ? styles.textWhiteDesc : styles.textBrown]}>
                                        Acompanhe sua hidratação e{'\n'}performance
                                    </Text>
                                </View>
                                <MaterialCommunityIcons name="arrow-right" size={20} color={isAtleta ? '#FFF' : theme.colors.textBrown} />
                            </TouchableOpacity>

                            {/* --- BOTÃO PROFISSIONAL --- */}
                            <TouchableOpacity 
                                style={[styles.optionCard, isProfissional && styles.cardSelected]} 
                                activeOpacity={0.9}
                                onPress={handleSelectProfissional}
                            >
                                <View style={[styles.iconBox, isProfissional && styles.iconBoxSelected]}>
                                    <MaterialCommunityIcons name="clipboard-account-outline" size={24} color={isProfissional ? '#FFF' : theme.colors.textBrown} />
                                </View>
                                <View style={styles.textWrapper}>
                                    <Text style={[styles.cardTitle, isProfissional && styles.textWhite]}>PROFISSIONAL</Text>
                                    <Text style={[styles.cardDesc, isProfissional ? styles.textWhiteDesc : styles.textBrown]}>
                                        Monitore e analise{'\n'}dados de atletas
                                    </Text>
                                </View>
                                <MaterialCommunityIcons name="arrow-right" size={20} color={isProfissional ? '#FFF' : theme.colors.textBrown} />
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}