// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../global/themas';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 100, 
          paddingBottom: 30, // Sobe os ícones para fugir dos botões do sistema
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bodyBold,
          fontSize: 10,
        }
      }}
    >
      {/* 1º - Dashboard na Esquerda */}
      <Tabs.Screen
        name="dashboard/index" 
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
        }}
      />

      {/* 2º - Hydration */}
      <Tabs.Screen
        name="hydration/index"
        options={{
          title: 'HIDRATAÇÃO',
          tabBarIcon: ({ color }) => <FontAwesome5 name="tint" size={20} color={color} />,
        }}
      />

      {/* 3º - Performance */}
      <Tabs.Screen
        name="performance/index"
        options={{
          title: 'PERFORMANCE',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="lightning-bolt-outline" size={30} color={color} />,
        }}
      />

      {/* 4º - Profile na Direita */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'PERFIL',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      
    </Tabs>
  );
}