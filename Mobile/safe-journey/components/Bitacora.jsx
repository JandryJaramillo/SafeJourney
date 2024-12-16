import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Pressable, StatusBar, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import firestore from "@react-native-firebase/firestore";

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
          const fecha = doc.id; // Fecha almacenada como el ID del documento

          // Calcular el promedio de las puntuaciones
          const puntuaciones = data.puntajes || [];
          const promedio = puntuaciones.reduce((acc, score) => acc + score, 0) / puntuaciones.length;
          const puntuacionFinal = isNaN(promedio) ? 0 : promedio; // Asegurarse de que sea un número

          return { fecha, puntuacion: promedio }; // Guardar promedio como número
        });

        setData(
          evaluacionesData.map((item) => ({
            ...item,
            puntuacion: `${item.puntuacion.toFixed(2)}/100`, // Formatear para mostrar
          }))
        );

        // Guardar los promedios numéricos para la comparación
        setPromedios(evaluacionesData.map((item) => item.puntuacion));
      } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
      }
    };

    fetchData();
  }, []);

  // Función para comparar los promedios
  const handleCompararPromedios = () => {
    if (promedios.length < 2) {
      Alert.alert("Información insuficiente", "Se necesitan al menos 2 evaluaciones para comparar.");
      return;
    }
  
    let mejoras = 0;
    let empeoramientos = 0;
  
    // Analizar tendencia
    for (let i = 1; i < promedios.length; i++) {
      const diferencia = promedios[i] - promedios[i - 1];
      if (diferencia > 0) {
        mejoras++;
      } else if (diferencia < 0) {
        empeoramientos++;
      }
    }
  
    // Determinar tendencia general
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
    <Link asChild href={`/bitacoraDetx?fecha=${item.fecha}&puntuacion=${item.puntuacion}`}>
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
          <Text style={styles.headerCell}>PUNTUACIÓN PROMEDIO</Text>
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
