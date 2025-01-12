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

const Law = () => {
  const { role, loading } = useUserRole();
  const [recentLaws, setRecentLaws] = useState([]);

  // Cargar las leyes de tránsito recientes
  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const lawsRef = firestore().collection("laws");
        const snapshot = await lawsRef.limit(5).get();
        const lawsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentLaws(lawsData);
      } catch (error) {
        console.error("Error al obtener leyes de tránsito:", error);
      }
    };

    fetchLaws();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const renderLaw = ({ item }) => (
    <Link asChild href={`/lawDet/${item.id}`}>
      <Pressable style={styles.rowL}>
        <Text style={styles.textL}>{item.name}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leyes de Tránsito</Text>
      {recentLaws.length > 0 && (
        <View style={styles.recentLawsContainer}>
          <FlatList
            data={recentLaws}
            horizontal
            renderItem={renderLaw}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Link asChild href="/lawConx">
            <Pressable style={styles.hexOption}>
              <Icon name="car" size={50} color="#333" />
              <Text style={styles.hexText}>Conductores</Text>
            </Pressable>
          </Link>
          <Link asChild href="/lawCicx">
            <Pressable style={styles.hexOption}>
              <Icon name="bicycle" size={50} color="#333" />
              <Text style={styles.hexText}>Ciclistas</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.row}>
          <Link asChild href="/lawPeax">
            <Pressable style={styles.hexOption}>
              <Icon name="walking" size={50} color="#333" />
              <Text style={styles.hexText}>Peatones</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>

      {role === "admin" && (
        <Link asChild href="/addLawsx">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>Añadir</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
};

export default Law;

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
  recentLawsContainer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#CEE3FF",
    borderColor: "black",
    borderWidth: 1,
  },
  rowL: {
    borderWidth: 2,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 3,
    margin: 10,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  textL: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 20,
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
    resizeMode: "contain",
    borderRadius: 10,
  },
  hexText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDF5F9",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
