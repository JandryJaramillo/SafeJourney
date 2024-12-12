import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
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
import peaton from "../assets/peaton.png";
import * as Location from "expo-location";
import firestore from "@react-native-firebase/firestore";


Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const Walk: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [puntaje, setPuntaje] = useState(100); // Puntaje inicial
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -3.9954684994999354,
    longitude: -79.1983461270052,
  });

  const [crosswalks, setCrosswalks] = useState<
    { lat: number; lng: number }[]
  >([]);

  const fetchCrosswalks = async () => {
    try {
      const snapshot = await firestore().collection("crosswalks").get();
      const crosswalkData: { lat: number; lng: number }[] = snapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return { lat: data.lat, lng: data.lng };
        }
      );
      setCrosswalks(crosswalkData);
    } catch (error) {
      console.error("Error fetching crosswalks:", error);
      Alert.alert("Error", "No se pudieron obtener los datos de los pasos de cebra.");
    }
  };
  
  const evaluarCercania = () => {
    const isNearCrosswalk = crosswalks.some((crosswalk) => {
      const diffLat = Math.abs(location.latitude - crosswalk.lat);
      const diffLng = Math.abs(location.longitude - crosswalk.lng);
      //umbral de distancia para lo de los pasos cebras
      return diffLat < 0.00002 && diffLng < 0.00002; //  Menos de 2.2 metros
    });

    if (isNearCrosswalk) {
      Alert.alert("¡Correcto!", "Está utilizando un paso de cebra.");
    } else {
      Alert.alert("¡Atención!", "Por favor, use el paso de cebra más cercano.");
      setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 10, 0)); // Disminuye 10 puntos, con límite de 0
    }
  };

  useEffect(() => {
    fetchCrosswalks();
  }, []);
  
  //Para saber coordenadas de elementos en el mapa
  const handleMapPress = async (event: any) => {
    const { geometry } = event;
    const [longitude, latitude] = geometry.coordinates;
    console.log(`Coordenadas clickeadas: ${longitude}, ${latitude}`);
    Alert.alert(
      "Coordenadas clickeadas",
      `Longitud: ${longitude}, Latitud: ${latitude}`
    );
  };
/*  
  useEffect(() => {
    const startTrackingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Por favor habilite el acceso a la ubicación en la configuración del dispositivo."
        );
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        }
      );
    };
    

    startTrackingLocation();
  }, []);
*/
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (evaluacionIniciada) {
      evaluarCercania(); // Evalúa inmediatamente al iniciar
      interval = setInterval(() => {
        evaluarCercania();
      }, 10000); // Evaluaciones cada 10 segundos
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [evaluacionIniciada, location]);

  const finalizarEvaluacion = () => {
    setEvaluacionIniciada(false);
    Alert.alert("Evaluación finalizada", `Tu puntaje final es: ${puntaje}/100`);
    setPuntaje(100); // Reiniciar el puntaje para la próxima evaluación
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
      <View style={styles.mapCont}>
        <MapView
          style={{ flex: 1 }}
          zoomEnabled={true}
          surfaceView={true}
          pitchEnabled={true}
          styleURL="mapbox://styles/spocks/cm298d95s008x01pb82mm0dhv"
          rotateEnabled={true}
          onPress={handleMapPress} // ubicaciones dando click
        >
          <Images images={{ peatonIcon: peaton }} />
          <Camera
            zoomLevel={18}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode={"flyTo"}
            animationDuration={2000}
          />
          {location && (
            <ShapeSource
              id="peatonSource"
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
                id="peatonLayer"
                style={{
                  iconImage: "peatonIcon",
                  iconSize: 0.5,
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

export default Walk;

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
});
