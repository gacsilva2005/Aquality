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
import { theme } from '../../global/themas';
import { useRouter } from 'expo-router';

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

// MOCK INICIAL
const INITIAL_MESSAGES: Message[] = [
  {
    id:      '1',
    role:    'user',
    content: 'Qual a recomendação de carboidratos intra-treino para endurance?',
  },
  {
    id:      '2',
    role:    'assistant',
    content: 'Para exercícios de endurance prolongados, a recomendação de ingestão de carboidratos varia conforme a duração do esforço, visando poupar o glicogênio muscular e manter a glicemia.\n\n**RECOMENDAÇÕES POR DURAÇÃO**\n\n› 1 a 2 horas: 30 g/h (pode ser uma única fonte, como glicose ou polímeros).\n\n› 2 a 3 horas: 60 g/h (preferencialmente blends de carboidratos).\n\n› > 2.5 a 3 horas: 90 g/h (necessário uso de múltiplos transportadores, como Glicose:Frutose na proporção 2:1 ou 1:0.8).\n\nÉ crucial treinar o sistema digestório ("train the gut") durante as sessões preparatórias para tolerar essas quantidades sem desconforto gastrointestinal.',
    sources: [
      { id: 's1', title: 'Position Stand IOC (2024)' },
      { id: 's2', title: 'Diretriz ABN' },
    ],
  },
];

// HELPER — renderiza bold e listas
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <View key={i} style={{ height: 8 }} />;

    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <Text key={i} style={styles.msgSectionTitle}>
          {line.replace(/\*\*/g, '')}
        </Text>
      );
    }

    if (line.startsWith('›')) {
      return (
        <View key={i} style={styles.listItem}>
          <View style={styles.listBullet} />
          <Text style={styles.listText}>{line.replace('› ', '')}</Text>
        </View>
      );
    }

    return <Text key={i} style={styles.msgText}>{line}</Text>;
  });
}

// COMPONENTE PRINCIPAL
export default function AssistenteIA() {
  const router    = useRouter();
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
      // TODO: substituir pelo fetch real
      // const response = await fetch('https://SUA-API/assistente', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: text }),
      // });
      // const data = await response.json();
      // setMessages(prev => [...prev, { id: String(Date.now()+1), role: 'assistant', content: data.content, sources: data.sources }]);

      await new Promise(r => setTimeout(r, 1200));
      setMessages(prev => [...prev, {
        id:      (Date.now() + 1).toString(),
        role:    'assistant',
        content: 'Esta é uma resposta temporária enquanto a API não está conectada.',
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
        Alert.alert('Permissão negada', 'Permita o acesso ao microfone nas configurações do dispositivo.');
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
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
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

      // TODO: enviar o áudio para a API de transcrição (ex: Whisper)
      // const formData = new FormData();
      // formData.append('file', { uri, type: 'audio/m4a', name: 'audio.m4a' } as any);
      // const response = await fetch('https://SUA-API/transcribe', { method: 'POST', body: formData });
      // const data = await response.json();
      // setInput(data.transcript); // ← coloca o texto transcrito no input

      // Mock: simula transcrição e coloca no input
      setInput('Áudio gravado — transcrição disponível quando a API estiver conectada.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível processar o áudio.');
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
        <TouchableOpacity style={styles.headerMore}>
          <Feather name="more-vertical" size={22} color={theme.colors.textPrimary} />
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
        {/* Logo central */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrapper}>
            <FontAwesome5 name="hospital" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.logoSubtitle}>HOSPITAL</Text>
          <Text style={styles.logoTitle}>SÃO CAMILO</Text>
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