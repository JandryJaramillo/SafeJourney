import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../assets/logo.png";

export function BitacoraDet() {
  const { fecha } = useLocalSearchParams();
  const [puntuacionPromedio, setPuntuacionPromedio] = useState(0);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evaluationsRef = firestore().collection("evaluaciones");
        const snapshot = await evaluationsRef
          .where(firestore.FieldPath.documentId(), "==", fecha)
          .get();

        let totalPuntuacion = 0;
        let count = 0;
        let detallesArray = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          const puntajesProcesados = (data.puntajes || []).map((puntaje) => {
            const match = puntaje.toString().match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          });

          puntajesProcesados.forEach((puntaje, index) => {
            const detalleCompleto =
              data.detalles?.[index] || "Sin detalle registrado";
            const detalleExtraido =
              detalleCompleto.split("Errores:")[1]?.trim() || detalleCompleto;

            totalPuntuacion += puntaje;
            detallesArray.push({
              detalle: detalleExtraido, // Información después de "Errores"
              puntaje: puntaje,
            });
            count++;
          });
        });

        setPuntuacionPromedio(count > 0 ? totalPuntuacion / count : 0);
        setDetalles(detallesArray);
      } catch (error) {
        console.error("Error al obtener los detalles:", error);
      }
    };

    fetchData();
  }, [fecha]);

  const getIconByCategory = (detalle) => {
    if (detalle.toLowerCase().includes("ciclovía")) {
      return "bicycle";
    } else if (detalle.toLowerCase().includes("calle")) {
      return "walk";
    } else if (detalle.toLowerCase().includes("velocidad")) {
      return "car";
    } else {
      return "checkmark-circle";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.headerTitle}>DETALLE</Text>
        <Link asChild href="/bitacorax">
          <Pressable style={styles.backIcon}>
            <Icon name="arrow-back-circle-outline" size={36} color="#FFF" />
          </Pressable>
        </Link>
      </View>
      <View style={styles.main}>
        <View style={styles.summaryContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de la evaluación:</Text>
            <Text style={styles.value}>{fecha}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Calificación:</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{puntuacionPromedio.toFixed(0)}</Text>
              <Text style={styles.scoreTotal}>/100</Text>
            </View>
          </View>
        </View>
        <View style={styles.flat}>
        <FlatList
          data={detalles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.detailRow}>
              <View style={styles.progressContainer}>
                <View
                  style={[styles.progressBar, { width: `${item.puntaje}%` }]}
                />
                <Text style={styles.progressText}>{item.puntaje}/100</Text>
              </View>
              <Text style={styles.detailText}>{item.detalle}</Text>
              <Icon
                name={getIconByCategory(item.detalle)}
                size={24}
                color="#DABB00"
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay detalles registrados.</Text>
          }
        />
        </View>
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
    paddingHorizontal: 10, // Espaciado interno horizontal
    flexDirection: "row", // Alinear elementos en fila
    alignItems: "center", // Centrar verticalmente los elementos
    justifyContent: "space-between", // Distribuir espacio entre elementos
    height: 70,
    top: 20, 
    marginBottom: 10
  },
  flat:{
    height: "65%"
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain"
  },
  headerTitle: {
    flex: 1, // Toma el espacio disponible
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center", // Centrar el texto
    flexShrink: 1,
  },
  backIcon: {
    height: 50,
    width: 50,
    marginRight: 10,
    marginTop: 15
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#305C89",
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
    maxWidth: "65%",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  score: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#DABB00",
  },
  scoreTotal: {
    fontSize: 18,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F3FF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,    
  },
  progressContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "#FFF",
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 10,
    position: "relative",
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
  detailText: {
    flex: 2,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginTop: 20,
  },
});
