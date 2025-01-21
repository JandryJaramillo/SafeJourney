import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../assets/logo.png";

export function Bitacora() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);
  const [promedios, setPromedios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evaluacionesRef = firestore().collection("evaluaciones");
        const snapshot = await evaluacionesRef.get();

        const evaluacionesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const fecha = doc.id;

          const puntuaciones = (data.puntajes || []).map((score) => {
            const match = score.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          });

          const promedio =
            puntuaciones.reduce((acc, score) => acc + score, 0) /
            puntuaciones.length;

          return {
            fecha,
            puntuacion: isNaN(promedio) ? 0 : promedio,
          };
        });

        setData(
          evaluacionesData.map((item) => ({
            ...item,
            puntuacion: `${item.puntuacion.toFixed(2)}/100`,
          }))
        );

        setPromedios(evaluacionesData.map((item) => item.puntuacion));
      } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompararPromedios = () => {
    if (promedios.length < 2) {
      Alert.alert(
        "Información insuficiente",
        "Se necesitan al menos 2 evaluaciones para comparar."
      );
      return;
    }

    let mejoras = 0;
    let empeoramientos = 0;

    for (let i = 1; i < promedios.length; i++) {
      const diferencia = promedios[i] - promedios[i - 1];
      if (diferencia > 0) {
        mejoras++;
      } else if (diferencia < 0) {
        empeoramientos++;
      }
    }

    if (mejoras > empeoramientos) {
      Alert.alert(
        "¡Buen progreso!",
        `En general, estás mejorando. Mejoraste en ${mejoras} evaluaciones y empeoraste en ${empeoramientos}.`
      );
    } else if (empeoramientos > mejoras) {
      Alert.alert(
        "¡Sigue trabajando!",
        `En general, has empeorado. Mejoraste en ${mejoras} evaluaciones y empeoraste en ${empeoramientos}.`
      );
    } else {
      Alert.alert(
        "Tendencia neutral",
        "Tu desempeño ha sido equilibrado, con la misma cantidad de mejoras y empeoramientos."
      );
    }
  };

  const renderItem = ({ item }) => (
    <Link
      asChild
      href={`/bitacoraDetx?fecha=${item.fecha}&puntuacion=${item.puntuacion}`}
    >
      <Pressable>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.fecha}</Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${parseFloat(item.puntuacion)}%` },
              ]}
            />
            <Text style={styles.progressText}>{item.puntuacion}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#F6F8FB",
      }}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>REPORTES</Text>
      </View>
      <Link asChild href="/profilex">
        <Pressable style={styles.backIcon}>
          <Icon name="arrow-back-circle-outline" size={36} color="#FFF" />
        </Pressable>
      </Link>
      <Text style={styles.titulo}>Reportes de evaluación</Text>
      <View style={styles.table}>      
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>FECHA</Text>
          <Text style={styles.headerCell}>PUNTUACIÓN</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleCompararPromedios}>
          <Text style={styles.buttontxt}>COMPARAR PROMEDIOS</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#52C5E2",
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  logo: {
    height: 50,
    width: 50,
    left: 20,
    top: 10,
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  backIcon: {
    position: "absolute",
    top: 40,
    right: 30,
    zIndex: 1,
  },
  table: {
    backgroundColor: "#E7F3FF",
    width: "90%",
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    marginLeft: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#305C89",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    elevation: 3,
  },
  cell: {
    width: "50%",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    width: "50%",
  },
  progressContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#FFFFFD",
    borderRadius: 5,
    justifyContent: "center",
    position: "relative",
    marginLeft: 10,
  },
  progressBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#DABB00",
    borderRadius: 5,
  },
  progressText: {
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1,
    color: "#333",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 30,
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
