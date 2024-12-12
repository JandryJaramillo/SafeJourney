import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    if (!email || !password) {
      alert("Por favor, llena toda la información");
      return;
    }
    try {
      
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await firestore().collection("users").doc(user.uid).get();

      if (userDoc.exists) {
        const { role } = userDoc.data();
        Alert.alert("Éxito", `Has ingresado como ${role}.`);
      } else {
        Alert.alert("Error", "El usuario no tiene datos en Firestore.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      Alert.alert("Error", "Inicio de sesión fallido. " + error.message);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        backgroundColor: "#1769B0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={"dark-content"} />
      <Text style={styles.title}>SafeJourney</Text>
      <Text style={styles.subtitle}>
        Ingresa tus datos para identificarte en el sistema
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Link asChild href="/regisx">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>REGISTRARSE</Text>
          </Pressable>
        </Link>
        <Pressable onPress={logIn} style={styles.button}>
          <Text style={styles.buttontxt}>INGRESAR</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFFF",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 37,
  },
  subtitle: {
    color: "#FFFF",
    fontSize: 20,
    marginBottom: 56,
    textAlign: "center",
    width: 250,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 30,
    width: 264,
  },
  button: {
    backgroundColor: "#7BDFF2",
    borderRadius: 30,
    marginTop: 64,
    width: 155,
    height: 40,
  },
  buttontxt: {
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 64,
    width: 330,
  },
});
