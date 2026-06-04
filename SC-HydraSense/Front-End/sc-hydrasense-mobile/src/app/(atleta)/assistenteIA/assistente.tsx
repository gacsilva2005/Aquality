import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { styles } from './assistente_styles';
import { theme } from '../../../global/themas';
import { useRouter } from 'expo-router';
import { useUser } from '../../../contexts/UserContext';
import Constants from 'expo-constants';
import { useAlert } from '@/src/contexts/alertContext';

// TIPOS
type MessageRole = 'user' | 'assistant';

interface Source {
  id:    string;
  title: string;
}

interface Message {
  id:       string;
  role:     MessageRole;
  content:  string;
  sources?: Source[];
}

// MENSAGEM DE BOAS-VINDAS
const INITIAL_MESSAGES: Message[] = [
  {
    id:      '1',
    role:    'assistant',
    content: 'Olá! Sou o Camilo, seu assistente de hidratação e performance esportiva.\n\nComo posso te ajudar hoje? Aqui vão algumas sugestões:\n\n– Qual a quantidade ideal de água para o meu treino?\n– Como repor eletrólitos após exercícios longos?\n– O que fazer para evitar câimbras durante a atividade física?',
  },
];

// HELPER — renderiza Markdown real (headings, bold inline, listas, tabelas)
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();

    // Linha vazia → espaçamento
    if (!trimmed) return <View key={i} style={{ height: 6 }} />;

    // Separador de tabela (|---|---|) → ignorar
    if (/^\|[\s\-:|]+\|$/.test(trimmed)) return null;

    // Linha de tabela (|col1|col2|) → texto limpo
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .filter(c => c.trim())
        .map(c => c.trim());
      const cellText = cells.join('  •  ');
      return <Text key={i} style={styles.msgText}>{stripBold(cellText)}</Text>;
    }

    // Heading ### → título de seção
    if (trimmed.startsWith('#')) {
      const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
      return (
        <Text key={i} style={styles.msgSectionTitle}>
          {text}
        </Text>
      );
    }

    // Linha inteira em bold **TEXTO**
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      return (
        <Text key={i} style={styles.msgSectionTitle}>
          {trimmed.replace(/\*\*/g, '')}
        </Text>
      );
    }

    // Lista (*, -, › ou número.)
    if (/^(\*|-|›|\d+\.)\s/.test(trimmed)) {
      const text = trimmed.replace(/^(\*|-|›|\d+\.)\s*/, '');
      return (
        <View key={i} style={styles.listItem}>
          <View style={styles.listBullet} />
          <Text style={styles.listText}>{renderInlineBold(text)}</Text>
        </View>
      );
    }

    // Texto normal (com bold inline)
    return <Text key={i} style={styles.msgText}>{renderInlineBold(trimmed)}</Text>;
  });
}

// Renderiza trechos **bold** inline misturados com texto normal
function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return stripBold(text);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={{ fontFamily: theme.fonts.bodyBold }}>
          {part.replace(/\*\*/g, '')}
        </Text>
      );
    }
    return <Text key={i}>{part}</Text>;
  });
}

// Remove ** de uma string (fallback)
function stripBold(text: string): string {
  return text.replace(/\*\*/g, '');
}

// COMPONENTE PRINCIPAL
export default function AssistenteIA() {
  const alert = useAlert(); // pop-up
  const router    = useRouter();
  const { user }  = useUser();
  const scrollRef = useRef<ScrollView>(null);

  const [messages,    setMessages]    = useState<Message[]>(INITIAL_MESSAGES);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);

  // ── Estados de áudio ──
  const [isRecording,  setIsRecording]  = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // ENVIAR MENSAGEM DE TEXTO
  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    Keyboard.dismiss();

    const userMsg: Message = {
      id:      Date.now().toString(),
      role:    'user',
      content: text,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8000`;
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: user?.id ? String(user.id) : 'user-default',
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da API');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id:      String(Date.now() + 1),
        role:    'assistant',
        content: data.content,
        sources: data.sources || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id:      (Date.now() + 1).toString(),
        role:    'assistant',
        content: 'Não foi possível obter uma resposta. Verifique sua conexão.',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }


  // INICIAR GRAVAÇÃO
  async function startRecording() {
    try {
      // Pede permissão de microfone
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert.warning('Permissão negada', 'Permita o acesso ao microfone nas configurações do dispositivo.');
        return;
      }

      // Configura o modo de áudio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS:   true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      alert.error('Erro', 'Não foi possível iniciar a gravação.');
    }
  }

  // PARAR GRAVAÇÃO E PROCESSAR
  async function stopRecording() {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Volta modo de áudio normal
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (!uri) return;

      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8000`;
      const formData = new FormData();
      formData.append('file', { uri, type: 'audio/m4a', name: 'audio.m4a' } as any);

      const response = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha na transcrição');
      }

      const data = await response.json();
      if (data.transcript) {
        setInput(data.transcript);
      } else {
        alert.warning('Aviso', 'Não foi possível transcrever o áudio. Tente novamente.');
      }
    } catch (e) {
      alert.error('Erro', 'Não foi possível processar o áudio.');
    } finally {
      setIsProcessing(false);
    }
  }

  // TOGGLE DO MICROFONE
  function handleMicPress() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  // COR E ÍCONE DO BOTÃO DE MIC
  const micColor = isRecording
    ? theme.colors.primary       
    : theme.colors.textSecondary; 

  const micIcon = isProcessing ? 'loader' : isRecording ? 'mic-off' : 'mic';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Feather name="arrow-left" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ASSISTENTE IA</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── MENSAGENS ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo central */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrapper}>
            <FontAwesome5 name="tint" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.logoSubtitle}>AQUALITY</Text>
          <Text style={styles.logoTitle}>CO</Text>
        </View>

        {/* Mensagens */}
        {messages.map(msg => (
          <View key={msg.id}>

            {msg.role === 'user' && (
              <View style={styles.userBubbleWrapper}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{msg.content}</Text>
                </View>
              </View>
            )}

            {msg.role === 'assistant' && (
              <View style={styles.assistantWrapper}>
                <View style={styles.analysisHeader}>
                  <View style={styles.analysisIconWrapper}>
                    <FontAwesome5 name="robot" size={12} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.analysisLabel}>ANÁLISE CLÍNICA IA</Text>
                </View>

                <View style={styles.assistantContent}>
                  {renderContent(msg.content)}
                </View>

                {msg.sources && msg.sources.length > 0 && (
                  <View style={styles.sourcesContainer}>
                    <Text style={styles.sourcesLabel}>FONTES CITADAS</Text>
                    <View style={styles.sourcesRow}>
                      {msg.sources.map(src => (
                        <View key={src.id} style={styles.sourceTag}>
                          <Feather name="file-text" size={10} color={theme.colors.primary} />
                          <Text style={styles.sourceText}>{src.title}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

          </View>
        ))}

        {/* Indicador de digitando */}
        {loading && (
          <View style={styles.assistantWrapper}>
            <View style={styles.analysisHeader}>
              <View style={styles.analysisIconWrapper}>
                <FontAwesome5 name="robot" size={12} color={theme.colors.primary} />
              </View>
              <Text style={styles.analysisLabel}>ANÁLISE CLÍNICA IA</Text>
            </View>
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.typingText}>Analisando...</Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── BANNER DE GRAVAÇÃO ── */}
      {isRecording && (
        <View style={styles.recordingBanner}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Gravando... toque no microfone para parar</Text>
        </View>
      )}

      {isProcessing && (
        <View style={styles.recordingBanner}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.recordingText}>Processando áudio...</Text>
        </View>
      )}

      {/* ── INPUT FIXO ── */}
      <View style={styles.inputContainer}>

        {/* Botão microfone — vermelho quando gravando */}
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          onPress={handleMicPress}
          disabled={isProcessing}
        >
          <Feather name={micIcon} size={20} color={micColor} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={isRecording ? 'Gravando...' : 'Nova pergunta...'}
          placeholderTextColor={isRecording ? theme.colors.primary : theme.colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!isRecording && !isProcessing}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading || isRecording) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading || isRecording}
        >
          <Feather name="arrow-up" size={18} color={theme.colors.textWhite} />
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  );
}