import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useUserRole } from "../hooks/useUserRole";

const Sign = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Señales de Tránsito</Text>
      <ScrollView style={styles.flat}>
        <Link asChild href="/signConx">
          <Pressable style={styles.option}>
            <Image
              source={require("../assets/conductores.png")}
              style={styles.image}
            />
            <Text style={styles.optionText}>Conductores</Text>
          </Pressable>
        </Link>
        <Link asChild href="/signCicx">
          <Pressable style={styles.option}>
            <Image
              source={require("../assets/ciclistas.png")}
              style={styles.image}
            />
            <Text style={styles.optionText}>Ciclistas</Text>
          </Pressable>
        </Link>
        <Link asChild href="/signPeax">
          <Pressable style={styles.option}>
            <Image
              source={require("../assets/peatones.png")}
              style={styles.image}
            />
            <Text style={styles.optionText}>Peatones</Text>
          </Pressable>
        </Link>
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
    marginVertical: 20,
    top: 15,
  },
  option: {
    width: "100%",
    borderWidth: 1,
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  optionText: {
    fontSize: 18,
    marginVertical: 10,
  },
  flat: {
    width: "90%",
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
});
