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

export function Profile() {
  const insets = useSafeAreaInsets();

  const user = auth().currentUser;

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#F2F9FC",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
      <Image source={perfil} style={styles.profileImage} />

      <Text style={styles.userName}>
        Bienvenido {user?.displayName || "Nombre no disponible"}
      </Text>
      <Text style={styles.userEmail}>{user?.email}</Text>
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
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#7BDFF2",
    borderRadius: 30,
    marginTop: 20,
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
});