import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

export function BitacoraDet() {
  const { fecha, puntuacion } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>FECHA</Text>
          <Text style={styles.headerCell}>PUNTUACIÓN</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{fecha}</Text>
          <Text style={styles.cell}>{puntuacion}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailsTitle}>DETALLES:</Text>
        <Text style={styles.detailsText}>- SE PASÓ UN SEMÁFORO ROJO</Text>
        <Text style={styles.detailsText}>- EXCEDE EL LÍMITE DE VELOCIDAD</Text>
      </View>
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
