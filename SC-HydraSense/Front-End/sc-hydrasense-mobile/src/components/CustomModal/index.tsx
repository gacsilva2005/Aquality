import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../global/themas'; // Ajuste o caminho se necessário

// ==========================================
// 1. COMPONENTE DE ERRO/AVISO (Ícone de E-mail)
// ==========================================
interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  onOk: () => void;
}

export function CustomModal({ visible, title, message, onOk }: CustomModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onOk}>
      <View style={errorStyles.overlay}>
        <View style={errorStyles.container}>
          <View style={errorStyles.iconWrapper}>
            <Feather name="mail" size={28} color={theme.colors.primary} />
          </View>
          <Text style={errorStyles.title}>{title}</Text>
          <Text style={errorStyles.message}>{message}</Text>
          <TouchableOpacity style={errorStyles.btnOk} onPress={onOk} activeOpacity={0.8}>
            <Text style={errorStyles.btnOkText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ==========================================
// 2. COMPONENTE DE SUCESSO (Círculo Verde)
// ==========================================
interface SuccessModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onOk: () => void;
}

export function SuccessModal({ 
  visible, 
  title = "PARABÉNS!", 
  subtitle = "AÇÃO REALIZADA COM SUCESSO", 
  buttonText = "VOLTAR",
  onOk 
}: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onOk}>
      <View style={successStyles.overlay}>
        <View style={successStyles.card}>
          <View style={successStyles.shadowBox}>
            <View style={successStyles.checkCircle}>
              <Feather name="check" size={24} color="#FFF" />
            </View>
          </View>
          <Text style={successStyles.title}>{title}</Text>
          <Text style={successStyles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={successStyles.button} onPress={onOk} activeOpacity={0.8}>
            <Text style={successStyles.buttonText}>{buttonText}</Text>
            <Feather name="arrow-right" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ==========================================
// 3. COMPONENTE DE ATENÇÃO / AVISO (Exclamação Vermelho)
// ==========================================
interface WarningModalProps {
  visible: boolean;
  title: string;
  message: string;
  onOk: () => void;
}

export function WarningModal({ visible, title, message, onOk }: WarningModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onOk}>
      <View style={warningStyles.overlay}>
        <View style={warningStyles.container}>
          <View style={warningStyles.iconWrapper}>
            {/* Ícone de exclamação em vermelho */}
            <Feather name="alert-triangle" size={28} color="#E10032" />
          </View>
          <Text style={warningStyles.title}>{title}</Text>
          <Text style={warningStyles.message}>{message}</Text>
          <TouchableOpacity style={warningStyles.btnOk} onPress={onOk} activeOpacity={0.8}>
            <Text style={warningStyles.btnOkText}>ENTENDI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ==========================================
// ESTILOS SEPARADOS PARA NÃO DAR CONFLITO
// ==========================================

const errorStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 18,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  btnOk: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  btnOkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.textWhite,
    letterSpacing: 1,
  },
});

const successStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  shadowBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  checkCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.headingBold,
    fontSize: 24,
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: theme.fonts.bodyRegular,
    fontSize: 14,
    color: '#7C7C8A',
    marginBottom: 30,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    flexDirection: 'row',
    height: 55,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    marginRight: 10,
  },
});

  const warningStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing?.xl || 24,
  },
  container: {
    backgroundColor: theme.colors.surface || '#FFF',
    borderRadius: theme.borderRadius?.lg || 12,
    padding: theme.spacing?.xl || 24,
    width: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFE5EB', // Fundo vermelho bem claro e suave
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing?.md || 16,
  },
  title: {
    fontFamily: theme.fonts?.headingBold,
    fontSize: 18,
    color: '#E10032', // Texto em vermelho
    textAlign: 'center',
    marginBottom: theme.spacing?.sm || 8,
    fontWeight: 'bold',
  },
  message: {
    fontFamily: theme.fonts?.bodyRegular,
    fontSize: 14,
    color: theme.colors.textSecondary || '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing?.lg || 24,
  },
  btnOk: {
    backgroundColor: '#E10032', // Botão vermelho principal
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius?.sm || 8,
    alignItems: 'center',
  },
  btnOkText: {
    fontFamily: theme.fonts?.bodyBold,
    fontSize: 14,
    color: '#FFF',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
});