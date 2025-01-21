import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useUserRole } from "../hooks/useUserRole";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome5";
import Logo from "../assets/logo.png";

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
      <View style={styles.header}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.title}>EDUCACIÓN VIAL</Text>
      </View>

      {recentSignals.length > 0 && (
        <View style={styles.recentSignalsContainer}>
          <Text style={styles.titulo}>Señales de tránsito</Text>
          <FlatList
            data={recentSignals}
            horizontal
            renderItem={renderSignal}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoryList}>
          <Link asChild href="/signPeax">
            <Pressable style={styles.categoryItem}>
              <View style={styles.iconContainer}>
                <Icon name="walking" size={40} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>
                  Señales de tránsito para los peatones
                </Text>
                <Text style={styles.categoryDescription}>
                  Encontrarás las señales de tránsito relacionadas a los
                  peatones
                </Text>
              </View>
            </Pressable>
          </Link>
          <Link asChild href="/signConx">
            <Pressable style={styles.categoryItem}>
              <View style={styles.iconContainer}>
                <Icon name="car" size={40} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>
                  Señales de tránsito para los vehículos
                </Text>
                <Text style={styles.categoryDescription}>
                  Encontrarás las señales de tránsito relacionadas a los
                  vehículos
                </Text>
              </View>
            </Pressable>
          </Link>
          <Link asChild href="/signCicx">
            <Pressable style={styles.categoryItem}>
              <View style={styles.iconContainer}>
                <Icon name="bicycle" size={40} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryTitle}>
                  Señales de tránsito para los ciclistas
                </Text>
                <Text style={styles.categoryDescription}>
                  Encontrarás las señales de tránsito relacionadas a los
                  ciclistas
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

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
    backgroundColor: "#F6F8FB",
  },
  header: {
    backgroundColor: "#52C5E2",
    paddingVertical: 20,
    alignItems: "center",
    height: 90
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 20
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5
  },
  logo: {
    height: 50,
    width: 50,
    left: 20,
    top: 30,
    position: "absolute"
  },
  scrollContainer: {
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  categoryList: {
    flexDirection: "column",
    gap: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#41537B",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    width: 80,
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  categoryDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  recentSignalsContainer: {    
    backgroundColor: "#E6F0FA",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 5,
  },
  signalContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    width: 100,
    height: 100,
  },
  signalImage: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 30,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttontxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FB",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});
