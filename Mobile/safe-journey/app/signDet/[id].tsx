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
import Logo from "../../assets/logo.png";

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
          const docRef = firestore().collection("signals").doc(signalId);
          const docSnap = await docRef.get();
          if (docSnap.exists) {
            setSignal(docSnap.data());
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
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!signal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Señal no encontrada</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
        <Text style={styles.headerTitle}>DETALLE DE LA SEÑAL</Text>
      </View>

      {/* Signal Details */}
      <Text style={styles.title}>{signal.name}</Text>
      <Image
        source={{ uri: signal.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{signal.description}</Text>
      </View>

      {/* Back Button */}
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
    left: 90,
  },
  logo: {
    height: 50,
    width: 50,
    position: "absolute",
    left: 20,
    top: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: "90%",
    height: 200,
    marginBottom: 20,
  },
  descriptionContainer: {
    padding: 20,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#FFF",
    width: "90%",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
