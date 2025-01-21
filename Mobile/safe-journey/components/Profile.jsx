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
import perfil from "../assets/perfil.png";
import Logo from "../assets/logo.png";

export function Profile() {
  const insets = useSafeAreaInsets();

  const user = auth().currentUser;

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#F6F8FB", // Fondo similar al resto de componentes
      }}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
      <View style={styles.header}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.title}>PERFIL</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={perfil} style={styles.profileImage} />

        <Text style={styles.userName}>
          Bienvenido {user?.displayName || "Nombre no disponible"}
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
  header: {
    backgroundColor: "#52C5E2", // Color similar al encabezado de "Sign"
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    height: 50,
    width: 50,
    left: 20,
    top: 10,
    position: "absolute",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#E6F0FA", // Fondo azul claro similar
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    borderWidth: 3, // Borde para destacar la imagen
    borderColor: "#52C5E2",
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
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007AFF", // Azul vibrante consistente con los botones de "Sign"
    borderRadius: 30,
    marginTop: 10,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Sombra sutil
  },
  buttontxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
