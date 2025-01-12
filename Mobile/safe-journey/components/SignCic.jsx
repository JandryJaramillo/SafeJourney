import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const SignCic = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const querySnapshot = await firestore()
          .collection("signals")
          .where("category", "==", "ciclistas")
          .get();

        const fetchedSignals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          like: doc.data().like ?? 0,
        }));

        // Ordenar las señales por el campo 'like' (las que tienen 1 deben estar primero)
        fetchedSignals.sort((a, b) => b.like - a.like);

        setSignals(fetchedSignals);
      } catch (error) {
        console.error("Error fetching signals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const handleLike = async (signalId, currentLike) => {
    try {
      const signalRef = firestore().collection("signals").doc(signalId);

      await signalRef.update({
        like: currentLike === 1 ? 0 : 1,
      });

      setSignals((prevSignals) =>
        prevSignals.map((signal) =>
          signal.id === signalId
            ? { ...signal, like: currentLike === 1 ? 0 : 1 }
            : signal
        )
      );
    } catch (error) {
      console.error("Error toggling like: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7BDFF2" />
        <Text>Cargando señales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Señales de Tránsito para Ciclistas</Text>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scrol}>
          {signals.map((signal) => (
            <View key={signal.id} style={styles.items}>
              <Image
                source={{ uri: signal.imageUrl }}
                style={styles.signImage}
                resizeMode="contain"
              />
              <Text style={styles.text}>{signal.name}</Text>
              <Pressable
                onPress={() => handleLike(signal.id, signal.like || false)}
                style={styles.likeButton}
              >
                <Icon
                  name="heart"
                  size={24}
                  color={signal.like ? "red" : "gray"}
                />
              </Pressable>
              <Link asChild href={`/signDet/${signal.id}`}>
                <Pressable style={styles.detailButton}>
                  <Text style={styles.buttonText}>Ver Detalles</Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </ScrollView>
      </View>
      <Link asChild href="/signx">
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>REGRESAR</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default SignCic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EDF5F9",
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 20,
    textAlign: "center",
    fontWeight: "bold",
    top: 20,
  },
  signImage: {
    width: "100%",
    height: 120,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  likeButton: {
    marginVertical: 10,
  },
  detailButton: {
    backgroundColor: "#B2F2BB",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  scrol: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  items: {
    width: "48%",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollContainer: {
    flex: 1,
    width: "90%",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDF5F9",
  },
  button: {
    backgroundColor: "#7BDFF2",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
});
