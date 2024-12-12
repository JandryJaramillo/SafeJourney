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

export function Register() {
  const insets = useSafeAreaInsets();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const createAccount = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Por favor, llena toda la información.");
      return;
    }
    try {
      
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredential.user;     
      await user.updateProfile({
        displayName: name,
      });

      await firestore().collection("users").doc(user.uid).set({
        name: name,
        email: email,
        role: "user", 
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Éxito", "Cuenta creada exitosamente.");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      Alert.alert("Error", "Registro fallido. " + error.message);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#1769B0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={"light-content"} />
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
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
        <Link asChild href="/">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>VOLVER</Text>
          </Pressable>
        </Link>
        <Pressable onPress={createAccount} style={styles.button}>
          <Text style={styles.buttontxt}>CREAR CUENTA</Text>
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
    width: 155,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    width: 330,
  },
});
