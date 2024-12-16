import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";

export function BitacoraDet() {
  const { fecha } = useLocalSearchParams();
  const [puntuacionPromedio, setPuntuacionPromedio] = useState(0);
  const [detalles, setDetalles] = useState([]);

  // Función para obtener los registros de la base de datos y calcular el promedio de puntuaciones
  useEffect(() => {
    async function fetchData() {
      const evaluationsRef = firestore().collection("evaluaciones");
      
      // Consultar los documentos de la colección 'evaluaciones' donde la fecha coincida
      const snapshot = await evaluationsRef.where("fecha", "==", fecha).get();

      let totalPuntuacion = 0;
      let count = 0;
      let detallesArray = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        // Calcular el promedio de puntuaciones
        data.puntajes.forEach((puntaje, index) => {
          totalPuntuacion += puntaje;
          detallesArray.push({
            error: data.errores[index],  // Obtener el error correspondiente
            puntaje: puntaje
          });
          count++;
        });
      });

      setPuntuacionPromedio(count > 0 ? totalPuntuacion / count : 0);
      setDetalles(detallesArray);
    }

    fetchData();
  }, [fecha]);

  return (
    <View style={styles.container}>
      {/* Tabla con la fecha y puntuación promedio */}
      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>FECHA</Text>
          <Text style={styles.headerCell}>PUNTUACIÓN PROMEDIO</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{fecha}</Text>
          <Text style={styles.cell}>{puntuacionPromedio.toFixed(2)}</Text>
        </View>
      </View>

      {/* Detalles de la evaluación usando FlatList */}
      <View style={styles.details}>
        <Text style={styles.detailsTitle}>DETALLES:</Text>
        {detalles.length > 0 ? (
          <FlatList
            data={detalles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.detailsText}>
                - {item.error} - Puntaje: {item.puntaje}
              </Text>
            )}
          />
        ) : (
          <Text style={styles.detailsText}>No se encontraron detalles para esta fecha.</Text>
        )}
      </View>

      {/* Botón para regresar */}
      <Link asChild href="/bitacorax">
        <Pressable style={styles.button}>
          <Text style={styles.buttontxt}>REGRESAR</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F9FC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFFFFF",
    width: "80%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderBottomWidth: 1,
  },
  cell: {
    width: "50%",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    width: "50%",
    textAlign: "center",
  },
  details: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFFFFF",
    width: "80%",
    padding: 10,
    height: "60%",
    marginTop: 20,
  },
  detailsTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsText: {
    marginBottom: 5,
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
});
