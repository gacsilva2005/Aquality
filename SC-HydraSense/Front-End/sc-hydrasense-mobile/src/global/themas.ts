// constants/theme.ts

export const theme = {
  colors: {
    // Marca principal
    primary: '#D90429',       // Vermelho vibrante principal (Botões, ícones ativos, destaques)
    primaryLight: '#FFF0F2',  // Fundo vermelho bem claro 
    
    // Fundo e Superfícies
    background: '#F7F7F9',    // Fundo geral do app (cinza bem claro)
    surface: '#FFFFFF',       // Fundo dos cards brancos
    headersoft: '#1a1a1d',    // Fundo do cabeçalho superior escuro
    header: '#121214',        // Fundo do cabeçalho superior (cinza quase preto)
    
    // Textos
    textPrimary: '#1A1A1E',   // Textos principais e títulos (quase preto)
    textSecondary: '#7C7C8A', // Textos secundários, legendas e rótulos (cinza)
    textLight: '#C4C4CC',     // Textos de apoio ou placeholders
    textWhite: '#FFFFFF',     // Textos sobre fundos escuros ou botões
    textBrown: '#5D3F3D',
    textBrownSoft: '#A08C8A', // Textos marrons para destaque ou contraste (ex: descrição da tela de recuperação)

    // Status (Feedback Visual)
    success: '#16A34A',       // Verde (Optimal, metas alcançadas)
    warning: '#F59E0B',       // Amarelo (Warning)
    critical: '#7F1D1D',      // Bordô escuro (Critical)
    
    // Bordas e Divisores
    border: '#E4E4E7',        // Linhas de divisórias e bordas de inputs
  },
  
  fonts: {
    // Títulos e destaques numéricos grandes
    headingRegular: 'SpaceGrotesk_400Regular',
    headingBold: 'SpaceGrotesk_700Bold',
    
    // Textos corridos, botões e dados
    bodyRegular: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_700Bold',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,   // Margem padrão das laterais da tela
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,    // Bordas de botões e inputs
    lg: 16,   // Bordas dos cards principais
    full: 9999, // Botões circulares ou avatares
  }
};