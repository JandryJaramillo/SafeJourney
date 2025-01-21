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
  LineLayer,
} from "@rnmapbox/maps";
import peaton from "../assets/peaton.png";
import * as Location from "expo-location";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const Walk: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [puntaje, setPuntaje] = useState(100);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -3.995537557649527,
    longitude: -79.1983012505136,
  });

  const [crosswalks, setCrosswalks] = useState<{ lat: number; lng: number }[]>(
    []
  );

  const streetCoordinates = [
    { lat: -3.995537557649527, lng: -79.1983012505136 },
    { lat: -3.996004050496751, lng: -79.19822167330292 },
    { lat: -3.996866822886389, lng: -79.19814655913011 },
    { lat: -3.997898734399442, lng: -79.19806786193458 },
    { lat: -3.998957580768632, lng: -79.19796212240325 },
    { lat: -4.000088874384218, lng: -79.19784344755705 },
    { lat: -4.001123114591607, lng: -79.19770416299892 },
    { lat: -4.002207579616069, lng: -79.19765549842603 },
    { lat: -4.002945872095836, lng: -79.19757055747012 },
  ];

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
      Alert.alert(
        "Error",
        "No se pudieron obtener los datos de los pasos de cebra."
      );
    }
  };

  const distanciaPuntoASegmento = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const estaEnCalle = () => {
    const umbralDistanciaCalle = 0.00002; // ~5 metros
    for (let i = 0; i < streetCoordinates.length - 1; i++) {
      const puntoInicio = streetCoordinates[i];
      const puntoFin = streetCoordinates[i + 1];

      const distancia = distanciaPuntoASegmento(
        location.latitude,
        location.longitude,
        puntoInicio.lat,
        puntoInicio.lng,
        puntoFin.lat,
        puntoFin.lng
      );

      if (distancia <= umbralDistanciaCalle) {
        return true;
      }
    }
    return false;
  };

  const evaluarCercania = () => {
    const isNearCrosswalk = crosswalks.some((crosswalk) => {
      const diffLat = Math.abs(location.latitude - crosswalk.lat);
      const diffLng = Math.abs(location.longitude - crosswalk.lng);
      return diffLat < 0.00002 && diffLng < 0.00002; // Menos de 2.2 metros
    });

    if (isNearCrosswalk) {
      Toast.show({
        type: "info",
        text1: "¡Correcto!",
        text2: "Está utilizando un paso de cebra.",
      });
    } else if (!estaEnCalle()) {
      // No está en la calle, no penalizar
      Toast.show({
        type: "info",
        text1: "¡Todo bien!",
        text2: "Sigue caminando por la vereda.",
      });
    } else {
      Toast.show({
        type: "info",
        text1: "¡Atención!",
        text2: "Está cruzando fuera de un paso de cebra.",
      });
      setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 10, 0));
    }
  };

  useEffect(() => {
    fetchCrosswalks();
  }, []);

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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (evaluacionIniciada) {
      setStartTime(new Date());
      evaluarCercania();
      interval = setInterval(() => {
        evaluarCercania();
      }, 10000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [evaluacionIniciada, location]);

  const finalizarEvaluacion = async () => {
    setEvaluacionIniciada(false);

    const endTime = new Date(); // Tiempo de finalización
    const duration = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;
    const errores = puntaje < 100 ? ["No cruzar la calle correctamente"] : [];
    const detalles = `Puntaje: ${puntaje}/100, Errores: ${errores.join(
      ", "
    )}, Duración: ${duration}s`; // Incluye duración en los detalles
    const fechaHoy = new Date().toISOString().split("T")[0]; // Formato: YYYY-MM-DD

    try {
      const evaluacionesRef = firestore().collection("evaluaciones");
      const docRef = evaluacionesRef.doc(fechaHoy);

      const docSnap = await docRef.get();

      if (docSnap.exists) {
        // Si el documento ya existe, obtenemos los datos actuales
        const data = docSnap.data();
        const detallesExistentes = data?.detalles || [];
        const puntajesExistentes = data?.puntajes || [];

        // Enumerar los detalles para evitar duplicados
        let contadorDetalles = 1;
        let nuevoDetalle = detalles;

        while (detallesExistentes.includes(nuevoDetalle)) {
          contadorDetalles++;
          nuevoDetalle = `${contadorDetalles}. ${detalles}`;
        }

        // Enumerar los puntajes para evitar duplicados
        let contadorPuntajes = 1;
        let nuevoPuntaje = `${puntaje}`;

        while (puntajesExistentes.includes(nuevoPuntaje)) {
          contadorPuntajes++;
          nuevoPuntaje = `${puntaje} (${contadorPuntajes})`;
        }

        // Actualizar el documento con los nuevos datos
        await docRef.update({
          detalles: firestore.FieldValue.arrayUnion(nuevoDetalle),
          puntajes: firestore.FieldValue.arrayUnion(nuevoPuntaje),
        });
      } else {
        // Si el documento no existe, lo creamos con el primer detalle y puntaje
        await docRef.set({
          detalles: [detalles],
          puntajes: [puntaje.toString()],
        });
      }

      Toast.show({
        type: "success",
        text1: "Evaluación Finalizada",
        text2: `Tu puntaje final es: ${puntaje}/100. Duración: ${duration}s`,
      });
    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar la evaluación.",
      });
    }

    setPuntaje(100);
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
        >
          <Images images={{ peatonIcon: peaton }} />
          <Camera
            zoomLevel={18}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode={"flyTo"}
            animationDuration={2000}
          />
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

export default Walk;

const styles = StyleSheet.create({
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
});
