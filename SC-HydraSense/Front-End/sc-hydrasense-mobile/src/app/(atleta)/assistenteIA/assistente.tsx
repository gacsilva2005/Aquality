import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { styles } from './assistente_styles';
import { theme } from '../../../global/themas';
import { useRouter, useFocusEffect } from 'expo-router';
import { useUser } from '../../../contexts/UserContext';
import Constants from 'expo-constants';
import { useAlert } from '@/src/contexts/alertContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

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

interface SessionMeta {
  id: string;
  title: string;
  date: string;
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

  const [sessionId, setSessionId] = useState<string>(Crypto.randomUUID());
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [sessions, setSessions] = useState<SessionMeta[]>([]);

  // ── Estados de áudio ──
  const [isRecording,  setIsRecording]  = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // ── Controle de Áudio Global ──
  useFocusEffect(
    useCallback(() => {
      return () => {
        Speech.stop(); // Interrompe o áudio ao sair da tela
      };
    }, [])
  );

  // ── Gerenciamento de Sessões ──
  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const stored = await AsyncStorage.getItem('@camilo_sessions');
      if (stored) setSessions(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }

  async function saveSession(id: string, title: string) {
    try {
      const stored = await AsyncStorage.getItem('@camilo_sessions');
      let currentSessions: SessionMeta[] = stored ? JSON.parse(stored) : [];
      if (!currentSessions.find(s => s.id === id)) {
        currentSessions = [{ id, title, date: new Date().toISOString() }, ...currentSessions];
        await AsyncStorage.setItem('@camilo_sessions', JSON.stringify(currentSessions));
        setSessions(currentSessions);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function startNewSession() {
    Speech.stop();
    setSessionId(Crypto.randomUUID());
    setMessages(INITIAL_MESSAGES);
    setHistoryModalVisible(false);
  }

  async function loadChatHistory(id: string) {
    Speech.stop();
    setSessionId(id);
    setHistoryModalVisible(false);
    setLoading(true);
    try {
      const hostUri = Constants?.expoConfig?.hostUri;
      const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
      const API_URL = `http://${ip}:8000`;
      const response = await fetch(`${API_URL}/chat/history/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages(INITIAL_MESSAGES);
        }
      }
    } catch (e) {
      alert.error('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  // ENVIAR MENSAGEM DE TEXTO CENTRALIZADA
  async function handleSendWithText(textToSend: string) {
    if (!textToSend || loading) return;

    Keyboard.dismiss();

    const userMsg: Message = {
      id:      Date.now().toString(),
      role:    'user',
      content: textToSend,
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
          session_id: sessionId,
          atleta_id: user?.id ? Number(user.id) : null,
          message: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta da API');
      }

      if (messages.length === INITIAL_MESSAGES.length) {
        saveSession(sessionId, textToSend.substring(0, 30) + (textToSend.length > 30 ? '...' : ''));
      }

      const data = await response.json();
      
      const newMsg: Message = {
        id:      String(Date.now() + 1),
        role:    'assistant',
        content: data.content,
        sources: data.sources || [],
      };
      
      setMessages(prev => [...prev, newMsg]);

      // TTS: Falar a resposta automaticamente
      Speech.speak(stripBold(data.content), { language: 'pt-BR' });

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

  async function handleSend() {
    handleSendWithText(input.trim());
  }

  // INICIAR GRAVAÇÃO
  async function startRecording() {
    try {
      Speech.stop(); // Para a fala se estiver falando
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert.warning('Permissão negada', 'Permita o acesso ao microfone nas configurações do dispositivo.');
        return;
      }

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

  // CANCELAR GRAVAÇÃO (Botão da Esquerda)
  async function cancelRecording() {
    if (!recordingRef.current) return;
    setIsRecording(false);
    await recordingRef.current.stopAndUnloadAsync();
    recordingRef.current = null;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  }

  // PARAR GRAVAÇÃO E TRANSCREVER (Botão da Direita)
  async function stopRecording() {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

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
        // O fluxo seamless: assim que transcreveu, já envia!
        handleSendWithText(data.transcript);
      } else {
        alert.warning('Aviso', 'Não foi possível transcrever o áudio. Tente novamente.');
      }
    } catch (e) {
      alert.error('Erro', 'Não foi possível processar o áudio.');
    } finally {
      setIsProcessing(false);
    }
  }

  // PARAR FALA MANUALMENTE
  function stopSpeaking() {
    Speech.stop();
  }

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
        <TouchableOpacity onPress={() => setHistoryModalVisible(true)} style={styles.headerBack}>
          <Feather name="clock" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
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
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrapper}>
            <FontAwesome5 name="tint" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.logoSubtitle}>AQUALITY</Text>
          <Text style={styles.logoTitle}>CO</Text>
        </View>

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

                  {/* Botões TTS */}
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity 
                    onPress={() => Speech.speak(stripBold(msg.content), { language: 'pt-BR' })} 
                    style={{ marginRight: 12 }}
                  >
                    <Feather name="play-circle" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={stopSpeaking}>
                    <Feather name="stop-circle" size={16} color={theme.colors.critical} />
                  </TouchableOpacity>
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
          <Text style={styles.recordingText}>Gravando... clique no check para enviar ou lixeira para cancelar</Text>
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

        {/* Botão microfone (Esquerda) — Lixeira quando gravando */}
        <TouchableOpacity
          style={[
            styles.micButton, 
            isRecording && { backgroundColor: theme.colors.criticalLight, borderColor: theme.colors.critical }
          ]}
          onPress={isRecording ? cancelRecording : startRecording}
          disabled={isProcessing}
        >
          <Feather 
            name={isProcessing ? 'loader' : isRecording ? 'trash-2' : 'mic'} 
            size={20} 
            color={isRecording ? theme.colors.critical : theme.colors.textSecondary} 
          />
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

        {/* Botão enviar (Direita) — Check quando gravando */}
        <TouchableOpacity
          style={[
            styles.sendButton, 
            (!input.trim() && !isRecording || loading || isProcessing) && styles.sendButtonDisabled,
            isRecording && { backgroundColor: theme.colors.success }
          ]}
          onPress={isRecording ? stopRecording : handleSend}
          disabled={(!input.trim() && !isRecording) || loading || isProcessing}
        >
          <Feather 
            name={isRecording ? "check" : "arrow-up"} 
            size={18} 
            color={theme.colors.textWhite} 
          />
        </TouchableOpacity>

      </View>

      {/* ── MODAL DE HISTÓRICO ── */}
      <Modal visible={historyModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontFamily: theme.fonts.bodyBold, color: theme.colors.textPrimary }}>Histórico de Conversas</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                <Feather name="x" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={startNewSession} style={{ backgroundColor: theme.colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: '#fff', fontFamily: theme.fonts.bodyBold }}>Nova Conversa</Text>
            </TouchableOpacity>
            <FlatList
              data={sessions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => loadChatHistory(item.id)} style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                  <Text style={{ fontFamily: theme.fonts.bodyBold, color: theme.colors.textPrimary, marginBottom: 4 }}>{item.title}</Text>
                  <Text style={{ fontFamily: theme.fonts.body, color: theme.colors.textSecondary, fontSize: 12 }}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20 }}>Nenhuma conversa salva.</Text>}
            />
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}