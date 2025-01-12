import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import { useUserRole } from "../hooks/useUserRole";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome5";

const Sign = () => {
  const { role, loading } = useUserRole();
  const [recentSignals, setRecentSignals] = useState([]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const signalsRef = firestore().collection("signals");
        const snapshot = await signalsRef.limit(5).get();
        const signalsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentSignals(signalsData);
      } catch (error) {
        console.error("Error al obtener señales de tránsito:", error);
      }
    };

    fetchSignals();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const renderSignal = ({ item }) => (
    <Link asChild href={`/signDet/${item.id}`}>
      <Pressable style={styles.signalContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.signalImage}
          resizeMode="contain"
        />
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Señales de Tránsito</Text>

      {recentSignals.length > 0 && (
        <View style={styles.recentSignalsContainer}>
          <FlatList
            data={recentSignals}
            horizontal
            renderItem={renderSignal}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Link asChild href="/signConx">
            <Pressable style={styles.hexOption}>
              <Icon name="car" size={50} color="#333" />
              <Text style={styles.hexText}>Conductores</Text>
            </Pressable>
          </Link>
          <Link asChild href="/signCicx">
            <Pressable style={styles.hexOption}>
              <Icon name="bicycle" size={50} color="#333" />
              <Text style={styles.hexText}>Ciclistas</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.row}>
          <Link asChild href="/signPeax">
            <Pressable style={styles.hexOption}>
              <Icon name="walking" size={50} color="#333" />
              <Text style={styles.hexText}>Peatones</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>

      {role === "admin" && (
        <Link asChild href="/addSignalsx">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>Añadir</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
};

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EDF5F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#7BDFF2",
    borderRadius: 30,
    marginTop: 20,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttontxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  recentSignalsContainer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#CEE3FF",
    borderColor: "black",
    borderWidth: 1,
  },
  signalContainer: {
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    width: 120,
    height: 120,
  },
  signalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  hexOption: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 15,
  },
  hexImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain", // Mantiene las proporciones
    borderRadius: 10, // Redondeado para imágenes también
  },
  hexText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
