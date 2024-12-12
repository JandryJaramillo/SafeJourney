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

const SignCon = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const querySnapshot = await firestore()
          .collection("signals")
          .where("category", "==", "peatones")
          .get();

        const fetchedSignals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSignals(fetchedSignals);
      } catch (error) {
        console.error("Error fetching signals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

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
      <Text style={styles.title}>Señales de Tránsito para Peatones</Text>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scrol}>
          {signals.map((signal) => (
            <Link asChild href={`/signDet/${signal.id}`} key={signal.id}>
              <Pressable style={styles.items}>
                <Image
                  source={{ uri: signal.imageUrl }}
                  style={styles.signImage}
                  resizeMode="contain"
                />
                <Text style={styles.text}>{signal.name}</Text>
              </Pressable>
            </Link>
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

export default SignCon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EDF5F9",
    paddingBottom: 20,
  },
  title: {
    top: 15,
    fontSize: 22,
    marginVertical: 20,
    textAlign: "center",
  },
  signImage: {
    width: "100%",
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#7BDFF2",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: { color: "black", fontWeight: "bold" },
  scrol: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 20,
  },
  items: {
    width: "45%",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    padding: 10,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDF5F9",
  },
});
