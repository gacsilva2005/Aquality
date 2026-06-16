import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/src/global/themas';
import { styles } from './styles';

export interface EstadoBasalProps {
  corUrina: number | null;
  setCorUrina: (valor: number) => void;
  sede: number;
  setSede: (valor: number) => void;
  title?: string;
}

export function EstadoBasal({ corUrina, setCorUrina, sede, setSede, title = "ESTADO BASAL" }: EstadoBasalProps) {
  const cores = [
    '#F5F5DC',
    '#FFFACD',
    '#FFFFE0',
    '#FFD700',
    '#FFC700',
    '#FFA500',
    '#FF8C00',
    '#FF7F50',
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Cor da Urina */}
      <View style={styles.scalerContainer}>
        <View style={styles.scalerHeader}>
          <Text style={styles.scalerLabel}>COR DA URINA (1-8)</Text>
        </View>

        <View style={styles.colorScaleGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((nivel) => (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.colorBox,
                { backgroundColor: cores[nivel - 1] },
                corUrina === nivel && styles.colorBoxSelected,
              ]}
              onPress={() => setCorUrina(nivel)}
              activeOpacity={0.8}
            >
              {corUrina === nivel && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sede */}
      <View style={styles.scalerContainer}>
        <View style={styles.scalerHeader}>
          <Text style={styles.scalerLabel}>SEDE (0-10)</Text>
          <Text style={styles.sedeValue}>{Math.round(sede)}</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={sede}
          onValueChange={setSede}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor="#E4E4E7"
          thumbTintColor={theme.colors.primary}
        />

        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0 = SEM SEDE</Text>
          <Text style={styles.sliderLabel}>10 = MUITA SEDE</Text>
        </View>
      </View>
    </View>
  );
}
