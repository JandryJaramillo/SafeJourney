import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar, Text, Pressable } from "react-native";
import Mapbox, {
  Camera,
  MapView,
  Images,
  SymbolLayer,
  ShapeSource,
} from "@rnmapbox/maps";
import * as Location from "expo-location";
import Velocidad from "./Velocidad";
import firestore from "@react-native-firebase/firestore";
import carro from "../assets/car.png";
import Toast from "react-native-toast-message";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const Car: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [puntaje, setPuntaje] = useState(100);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [location, setLocation] = useState({
    latitude: -3.9954684994999354,
    longitude: -79.1983461270052,
  });

  useEffect(() => {
    const startTrackingLocationAndSpeed = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permisos Denegados",
          text2: "Se necesitan permisos de ubicación.",
        });
        return;
      }

      let lastToastTime = 0;

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (position) => {
          const { latitude, longitude, speed } = position.coords;
          setLocation({ latitude, longitude });
          const speedInKmh = (speed || 0) * 3.6; // Convertir m/s a km/h
          setSpeed(speedInKmh);
          setStartTime(new Date());

          const currentTime = Date.now();
          if (
            evaluacionIniciada &&
            speedInKmh > 50 &&
            currentTime - lastToastTime > 5000
          ) {
            setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 5, 0)); // Reducir puntaje
            Toast.show({
              type: "error",
              text1: "Advertencia de Velocidad",
              text2: "Está excediendo el límite de velocidad.",
            });
            lastToastTime = currentTime;
          }
        }
      );
    };

    startTrackingLocationAndSpeed();
  }, [evaluacionIniciada]);

  const finalizarEvaluacion = async () => {
    setEvaluacionIniciada(false);

    const endTime = new Date();
    const duration = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    // Determinar errores según el puntaje
    const errores = [];
    if (puntaje < 100) {
      errores.push("Exceso de velocidad");
    }

    if (errores.length === 0) {
      errores.push("Sin errores detectados");
    }

    // Crear el string con puntaje y errores
    const detalles = `Puntaje: ${puntaje}/100, Errores: ${errores.join(
      ", "
    )}, Duración: ${duration}s`;

    // Formatear la fecha actual
    const fechaHoy = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    try {
      const evaluacionesRef = firestore().collection("evaluaciones");
      const docRef = evaluacionesRef.doc(fechaHoy);

      // Usar una sola operación de actualización/creación
      await docRef.set(
        {
          detalles: firestore.FieldValue.arrayUnion(detalles),
          puntajes: firestore.FieldValue.arrayUnion(puntaje.toString()),
        },
        { merge: true } // Merge asegura que no se sobrescriban datos existentes
      );

      Toast.show({
        type: "success",
        text1: "Evaluación registrada",
        text2: `Tu puntaje final es: ${puntaje}/100. Duración: ${duration}s`,
      });
    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No se pudo guardar la evaluación: ${error.message}`,
      });
    }

    // Reiniciar puntaje
    setPuntaje(100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="#FFF" />
      <View style={styles.speedometer}>
        <Velocidad speed={speed} />
      </View>
      <View style={styles.mapCont}>
        <MapView
          style={{ flex: 1 }}
          zoomEnabled={true}
          surfaceView={true}
          pitchEnabled={true}
          styleURL="mapbox://styles/spocks/cm298d95s008x01pb82mm0dhv"
          rotateEnabled={true}
        >
          <Images images={{ carIcon: carro }} />
          {location ? (
            <Camera
              zoomLevel={18}
              centerCoordinate={[location.longitude, location.latitude]}
              animationMode={"flyTo"}
              animationDuration={2000}
            />
          ) : null}
          {location && (
            <ShapeSource
              id="carSource"
              shape={{
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [location.longitude, location.latitude],
                },
                properties: {},
              }}
            >
              <SymbolLayer
                id="carLayer"
                style={{
                  iconImage: "carIcon",
                  iconSize: 0.1,
                }}
              />
            </ShapeSource>
          )}
        </MapView>
      </View>
      <Pressable
        style={styles.button}
        onPress={() =>
          evaluacionIniciada
            ? finalizarEvaluacion()
            : setEvaluacionIniciada(true)
        }
      >
        <Text style={styles.buttontxt}>
          {evaluacionIniciada ? "FINALIZAR EVALUACIÓN" : "EMPEZAR EVALUACIÓN"}
        </Text>
      </Pressable>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  mapCont: {
    height: "100%",
    width: "100%",
  },
  button: {
    backgroundColor: "#7BDFF2",
    borderRadius: 30,
    marginTop: 64,
    width: 152,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  buttontxt: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
  speedometer: {
    position: "absolute",
    top: 20,
    right: 10,
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
  },
});

export default Car;
