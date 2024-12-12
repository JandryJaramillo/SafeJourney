import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function SignDet() {
  const { id } = useLocalSearchParams();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const signalId = Array.isArray(id) ? id[0] : id;

        if (signalId) {
          const docRef = firestore().collection("signals").doc(signalId); // Usar 'signalId' directamente
          const docSnap = await docRef.get(); // Obtén el documento
          if (docSnap.exists) {
            setSignal(docSnap.data()); // Establece los datos del documento en el estado
          } else {
            console.error("No such document!");
          }
        } else {
          console.error("ID is missing");
        }
      } catch (error) {
        console.error("Error fetching signal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal(); 
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Muestra el indicador de carga mientras se obtiene el documento
  }

  if (!signal) {
    return <Text>Señal no encontrada</Text>; // Muestra un mensaje si no se encontró la señal
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{signal.name}</Text>
      <Image source={{ uri: signal.imageUrl }} style={styles.image} />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{signal.description}</Text>
      </View>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>REGRESAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#EDF5F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    top: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 10,
  },
  descriptionContainer: {
    padding: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  description: { fontSize: 16, color: "#333" },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#7BDFF2",
    borderRadius: 5,
  },
  buttonText: { color: "#333", fontWeight: "bold" },
});
