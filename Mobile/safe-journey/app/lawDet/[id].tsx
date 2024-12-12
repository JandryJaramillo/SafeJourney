import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router"; 
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function LawDet() {
  const { id } = useLocalSearchParams(); 
  const [law, setLaw] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLaw = async () => {
      try {        
        const lawId = Array.isArray(id) ? id[0] : id;

        if (lawId) {       
        const docRef = firestore().collection("laws").doc(lawId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          setLaw(docSnap.data());
        } else {
          Alert.alert("Error", "No se encontró la ley solicitada");
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

    fetchLaw();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!law) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ley no encontrada</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>REGRESAR</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{law.name}</Text>      
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.description}>{law.description}</Text>
      </ScrollView>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  placeholderImage: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  descriptionContainer: {
    padding: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: 400,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#7BDFF2",
    borderRadius: 5,
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
});
