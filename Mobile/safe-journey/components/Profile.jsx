import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import auth from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import perfil from "../assets/perfil.png";
import Logo from "../assets/logo.png";

export function Profile() {
  const insets = useSafeAreaInsets();
  const user = auth().currentUser;

  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos para acceder a la galería.");
      return;
    }

    // Seleccionar imagen
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos para acceder a la cámara.");
      return;
    }

    // Capturar foto
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
      <View style={styles.header}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.title}>PERFIL</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : perfil}
          style={styles.profileImage}
        />

        <Pressable onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Seleccionar Imagen</Text>
        </Pressable>

        <Pressable onPress={takePhoto} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Tomar Foto</Text>
        </Pressable>

        <Text style={styles.userName}>
          Bienvenido {user?.displayName || "Usuario"}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link asChild href="/bitacorax">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>BITÁCORA</Text>
          </Pressable>
        </Link>

        <Pressable onPress={() => auth().signOut()} style={styles.button}>
          <Text style={styles.buttontxt}>CERRAR SESIÓN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },
  header: {
    backgroundColor: "#52C5E2",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 70,
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    flexShrink: 1,
    right: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E6F0FA",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#52C5E2",
  },
  uploadButton: {
    backgroundColor: "#52C5E2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 30,
    marginTop: 10,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  buttontxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default Profile;
