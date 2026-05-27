import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '../../../../components/Screen'; // Ajuste o caminho se necessário
import { Header } from '../../../../components/Header'; // Ajuste o caminho se necessário
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { theme } from '@/src/global/themas';

export default function EmConstrucao() {
    return (
        <Screen
            backgroundColor={theme.colors.background}
            scrollable={false} // Não precisa de scroll aqui, vamos focar no meio da tela
            HeaderComponent={<Header />}
        >
            <View style={styles.container}>

                <Text style={styles.title}>PÁGINA EM CONSTRUÇÃO</Text>
                
                <Text style={styles.description}>
                    Estamos preparando esta área com ferramentas incríveis para a sua gestão profissional. Em breve teremos novidades por aqui!
                </Text>

            </View>
        </Screen>
    );
}