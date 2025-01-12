import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

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
            totalPuntuacion += puntaje;
            detallesArray.push({
              detalle: data.detalles?.[index] || "Sin detalle registrado",
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

  const promedioProgressWidth = (puntuacionPromedio / 100) * 100;

  // Función para determinar el ícono según la categoría
  const getIconByCategory = (detalle) => {
    if (detalle.toLowerCase().includes("ciclovía")) {
      return "bicycle"; // Icono para ciclistas
    } else if (detalle.toLowerCase().includes("cebra")) {
      return "walk"; // Icono para peatones
    } else if (detalle.toLowerCase().includes("velocidad")) {
      return "car"; // Icono para conductores
    } else {
      return "checkmark-circle"; // Icono genérico
    }
  };

  return (
    <View style={styles.container}>
      <Link asChild href="/bitacorax">
        <Pressable style={styles.iconContainer}>
          <Ionicons name="arrow-back-circle-outline" size={36} color="black" />
        </Pressable>
      </Link>

      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>FECHA</Text>
          <Text style={styles.headerCell}>PUNTUACIÓN PROMEDIO</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{fecha}</Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${promedioProgressWidth}%` },
              ]}
            />
            <Text style={styles.progressText}>
              {puntuacionPromedio.toFixed(2)}/100
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        {detalles.length > 0 ? (
          <FlatList
            data={detalles}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View style={styles.rowHeader}>
                <Text style={styles.headerCell}>PUNTOS</Text>
                <Text style={styles.headerCell}>DETALLES</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const errorMatch = item.detalle.match(/Errores:\s*(.*)/);
              const errores = errorMatch ? errorMatch[1] : "Ninguno";
              const progressWidth = (item.puntaje / 100) * 100;
              const iconName = getIconByCategory(item.detalle);

              return (
                <View style={styles.row}>
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progressWidth}%` },
                      ]}
                    />
                    <Text style={styles.progressText}>{item.puntaje}/100</Text>
                  </View>
                  <Text style={styles.cell}>{errores}</Text>
                  <Ionicons
                    name={iconName}
                    size={24}
                    color="#555"
                    style={styles.icon}
                  />
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.detailsText}>
            No se encontraron detalles para esta fecha.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F9FC",
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 40,
    right: 30,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFFFFF",
    width: "90%",
    marginBottom: 20,
    marginTop: 70,
    alignSelf: "center",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#CEE3FF",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  headerCell: {
    width: "45%",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  cell: {
    width: "40%",
    textAlign: "center",
    color: "#555",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
    height: 25,
    backgroundColor: "#CEE3FF",
    borderRadius: 5,
    justifyContent: "center",
    position: "relative",
    marginHorizontal: 10,
  },
  progressBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#7BDFF2",
    borderRadius: 5,
  },
  progressText: {
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1,
  },
  details: {
    width: "90%",
    height: "60%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    alignSelf: "center",
  },
  detailsText: {
    textAlign: "center",
    color: "#555",
    padding: 10,
  },
});
