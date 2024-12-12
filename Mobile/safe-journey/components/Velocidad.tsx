import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VelocidadProps {
  speed: number;
}

const Velocidad: React.FC<VelocidadProps> = ({ speed }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Velocidad</Text>
      <Text style={styles.speed}>{Math.round(speed)} km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  speed: {
    fontSize: 32,
    color: '#00FF00',
  },
});

export default Velocidad;
