import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Pressable,
  Alert,
} from "react-native";
import Mapbox, {
  Camera,
  MapView,
  Images,
  SymbolLayer,
  ShapeSource,
} from "@rnmapbox/maps";
import carro from "../assets/car.png";
import * as Location from "expo-location";
import Velocidad from "./Velocidad";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const Car: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [speed, setSpeed] = useState(0);
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [score, setScore] = useState(100);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -3.9954684994999354,
    longitude: -79.1983461270052,
  });

  useEffect(() => {
    const startTrackingLocationAndSpeed = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos denegados",
          "Se necesitan permisos de ubicación para usar esta funcionalidad."
        );
        return;
      }

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

          if (evaluacionIniciada && speedInKmh > 50) {
            setScore((prevScore) => Math.max(prevScore - 10, 0)); // Reducir puntaje
            Alert.alert(
              "Advertencia de Velocidad",
              "Está excediendo el límite de velocidad, reduzca su velocidad por favor"
            );
          }
        }
      );
    };

    startTrackingLocationAndSpeed();
  }, [evaluacionIniciada]);

  const finalizarEvaluacion = () => {
    setEvaluacionIniciada(false);
    Alert.alert("Evaluación finalizada", `Tu puntaje final es: ${score}/100`);
    setScore(100); // Reiniciar el puntaje para la próxima evaluación
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: "#FFFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
    </View>
  );
};

export default Car;

const styles = StyleSheet.create({
  mapCont: {
    height: 770,
    width: 410,
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
