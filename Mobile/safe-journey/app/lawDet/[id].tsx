import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../assets/logo.png";

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
        <ActivityIndicator size="large" color="#007AFF" />
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
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.headerTitle}>DETALLE DE LA LEY</Text>
      </View>

      {/* Law details */}
      <Text style={styles.title}>{law.name}</Text>
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.description}>{law.description}</Text>
      </ScrollView>

      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>REGRESAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#52C5E2",
    height: 90,
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    top: 15,
    left: 90
  },
  logo: {
    height: 50,
    width: 50,
    position: "absolute",
    left: 20,
    top: 30,
    },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    color: "#333",
  },
  descriptionContainer: {
    padding: 20,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    width: "90%",
    height: "50%",
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
});
