import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import Logo from "../assets/logo.png";

const LawCon = () => {
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const querySnapshot = await firestore()
          .collection("laws")
          .where("category", "==", "conductores")
          .get();

        const fetchedLaws = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLaws(fetchedLaws);
      } catch (error) {
        console.error("Error fetching laws: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  const renderItem = ({ item }) => (
    <Link asChild href={`/lawDet/${item.id}`} key={item.id}>
      <Pressable style={styles.row}>
        <Text style={styles.text}>{item.name}</Text>
      </Pressable>
    </Link>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.title}>LEYES PARA LOS CONDUCTORES</Text>
      </View>

      {/* List */}
      <View style={styles.list}>
        <FlatList
          data={laws}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Button */}
      <Link asChild href="/lawx">
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>REGRESAR</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default LawCon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    alignItems: "center",
    paddingTop: 30,
  },
  header: {
    backgroundColor: "#52C5E2",    
    height: 70,
    width: "100%",
    marginBottom: 20
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFF",
    top: 20,
    left: 90
  },
  logo: {
    height: 50,
    width: 50,
    position: "absolute",
    left: 20,
    top: 10,
  },
  list: {
    height: "60%",
    width: "90%",
    marginBottom: 20,
  },
  row: {
    borderWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

