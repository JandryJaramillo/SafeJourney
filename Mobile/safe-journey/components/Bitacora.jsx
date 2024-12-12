import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";

export function Bitacora() {
  const insets = useSafeAreaInsets();

  const data = [
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
    { fecha: "24/07/2024", puntuacion: "100/100" },
    { fecha: "20/07/2024", puntuacion: "80/100" },
  ];

  const renderItem = ({ item }) => (
    <Link
      asChild
      href={`/bitacoraDetx?fecha=${item.fecha}&puntuacion=${item.puntuacion}`}
    >
      <Pressable>
        <View style={styles.row}>
          <Text style={styles.cell}>{item.fecha}</Text>
          <Text style={styles.cell}>{item.puntuacion}</Text>
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
        backgroundColor: "#F2F9FC",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
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
        <Link asChild href="/profilex">
          <Pressable style={styles.button}>
            <Text style={styles.buttontxt}>REGRESAR</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFFFFF",
    width: "80%",
    maxHeight: 400,
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
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
