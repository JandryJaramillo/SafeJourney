import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
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
  FillLayer,
} from "@rnmapbox/maps";
import carro from "../assets/ciclista.png";
import * as Location from "expo-location";
import * as turf from "@turf/turf";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const cicloviasGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Sección 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.1983461270052, -3.9954684994999354],
            [-79.19826073394627, -3.9959840193980654],
            [-79.19824508663571, -3.9959815762653506],
            [-79.19833003768031, -3.995466056365572],
            [-79.1983461270052, -3.9954684994999354],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 2" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19826073394627, -3.9959840193980654],
            [-79.1981829535058, -3.9968460060085675],
            [-79.1981668641809, -3.996845326635494],
            [-79.19824508663571, -3.9959815762653506],
            [-79.19826073394627, -3.9959840193980654],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 3" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.1981829535058, -3.9968460060085675],
            [-79.1980977985895, -3.9979247093544217],
            [-79.19808170184321, -3.9979242651489955],
            [-79.1981668641809, -3.996845326635494],
            [-79.1981829535058, -3.9968460060085675],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 4" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.1980977985895, -3.9979247093544217],
            [-79.19787375270104, -4.000119685441902],
            [-79.19785833371016, -4.000117229256048],
            [-79.19808170184321, -3.9979242651489955],
            [-79.1980977985895, -3.9979247093544217],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 5" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19787375270104, -4.000119685441902],
            [-79.19772702172082, -4.001124090555692],
            [-79.19774333936535, -4.001124090555692],
            [-79.19785833371016, -4.000117229256048],
            [-79.19787375270104, -4.000119685441902],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 6" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19772702172082, -4.001124090555692],
            [-79.19768872417231, -4.002242364343957],
            [-79.1976719642949, -4.002240352366101],
            [-79.19774333936535, -4.001124090555692],
            [-79.19772702172082, -4.001124090555692],
          ],
        ],
      },
    },
  ],
};

const Bicycle: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [puntaje, setPuntaje] = useState(100);
  const mapRef = useRef<Mapbox.MapView>(null);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -3.9954684994999354,
    longitude: -79.1983461270052,
  });

  useEffect(() => {
    const startTrackingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      Location.watchPositionAsync(
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

  const isPolygon = (geometry: GeoJSON.Geometry): geometry is GeoJSON.Polygon =>
    geometry.type === "Polygon";

  const evaluarCercania = () => {
    if (!location) {
      Alert.alert(
        "Ubicación no disponible",
        "Espere a que se obtenga su ubicación."
      );
      return;
    }

    const userPoint = turf.point([location.longitude, location.latitude]);
    const isInside = cicloviasGeoJSON.features.some((feature) => {
      const { geometry } = feature;
      if (isPolygon(geometry)) {
        const polygon = turf.polygon(geometry.coordinates);
        return turf.booleanPointInPolygon(userPoint, polygon);
      }
      return false;
    });

    if (isInside) {
      Alert.alert("¡Correcto!", "Está dentro de la ciclovía.");
    } else {
      Alert.alert("¡Atención!", "Está fuera de la ciclovía.");
      setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 10, 0)); // Disminuye 10 puntos, con límite de 0
    }
  };

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
          ref={mapRef}
          style={{ flex: 1 }}
          zoomEnabled={true}
          surfaceView={true}
          pitchEnabled={true}
          styleURL="mapbox://styles/spocks/cm298d95s008x01pb82mm0dhv"
          rotateEnabled={true}
        >
          <Images images={{ carIcon: carro }} />
          <Camera
            zoomLevel={18}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode={"flyTo"}
            animationDuration={2000}
          />
          {location && (
            <ShapeSource
              id="bicycleSource"
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
                id="bicycleLayer"
                style={{
                  iconImage: "carIcon",
                  iconSize: 0.5,
                }}
              />
            </ShapeSource>
          )}
          <ShapeSource id="cicloviasSource" shape={cicloviasGeoJSON}>
            <FillLayer
              id="cicloviasLayer"
              style={{
                fillColor: "rgba(0, 255, 0, 0.4)",
                fillOutlineColor: "rgba(0, 255, 0, 1)",
              }}
            />
          </ShapeSource>
        </MapView>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          evaluacionIniciada
            ? finalizarEvaluacion()
            : setEvaluacionIniciada(true);
        }}
      >
        <Text style={styles.buttontxt}>
          {evaluacionIniciada ? "FINALIZAR EVALUACIÓN" : "EMPEZAR EVALUACIÓN"}
        </Text>
      </Pressable>
    </View>
  );
};

export default Bicycle;

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
