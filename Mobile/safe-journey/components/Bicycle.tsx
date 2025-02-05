import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, StatusBar, Text, Pressable } from "react-native";
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
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY);
Mapbox.setTelemetryEnabled(false);

const cicloviasGeoJSON2: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Sección 1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19834982078858, -3.995451006456861],
            [-79.19833305539244, -3.9954496733988236],
            [-79.19824018773642, -3.9960087598881415],
            [-79.19825897200226, -3.9960105372974084],
            [-79.19834982078858, -3.995451006456861],
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
            [-79.19809923482754, -3.997923410603846],
            [-79.19808225650573, -3.9979241943806443],
            [-79.19785886986232, -4.000117475445549],
            [-79.19787494476911, -4.000123568401236],
            [-79.19809923482754, -3.997923410603846],
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
            [-79.19787494476911, -4.000123568401236],
            [-79.19785671389984, -4.000115808435396],
            [-79.19772649815037, -4.001123481223203],
            [-79.19774393388279, -4.001125480796517],
            [-79.19787494476911, -4.000123568401236],
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
            [-79.19774428732194, -4.001125699641449],
            [-79.19772572006767, -4.001122405330804],
            [-79.1976952952244, -4.00153858241886],
            [-79.19771206040227, -4.001539915467077],
            [-79.19774428732194, -4.001125699641449],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 7" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19771206040227, -4.001539915467077],
            [-79.1976952952244, -4.00153858241886],
            [-79.19767250854008, -4.002242253936259],
            [-79.19768927565946, -4.002242253936259],
            [-79.19771206040227, -4.001539915467077],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sección 8" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.19768927565946, -4.002242253936259],
            [-79.19767250854008, -4.002242253936259],
            [-79.19758888894937, -4.0029482637362435],
            [-79.19760634620401, -4.002950722677667],
            [-79.19768927565946, -4.002242253936259],
          ],
        ],
      },
    },
  ],
};

function expandPolygons(geojson, bufferDistance) {
  const expandedFeatures = geojson.features.map((feature) => {
    if (feature.geometry.type === "Polygon") {
      const polygon = turf.polygon(feature.geometry.coordinates);
      const buffered = turf.buffer(polygon, bufferDistance, {
        units: "meters",
      });
      return {
        ...feature,
        geometry: buffered.geometry,
      };
    }
    return feature;
  });

  return {
    ...geojson,
    features: expandedFeatures,
  };
}

// Aumenta en metros el ancho de las ciclovias
const cicloviasGeoJSON = expandPolygons(cicloviasGeoJSON2, 1.5);

const Bicycle: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [evaluacionIniciada, setEvaluacionIniciada] = useState(false);
  const [puntaje, setPuntaje] = useState(100);
  const mapRef = useRef<Mapbox.MapView>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -3.9954684994999354,
    longitude: -79.1983461270052,
  });
/*
  const handleMapPress = async (event: any) => {
    const { geometry } = event;
    const [longitude, latitude] = geometry.coordinates;
    console.log(`Coordenadas clickeadas: ${longitude}, ${latitude}`);    
  };
*/
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
      Toast.show({
        type: "info",
        text1: "Ubicación no disponible",
        text2: "Espere a que se obtenga su ubicación.",
      });
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

    console.log("Evaluar cercanía - Ubicación actual:", location);
    console.log("¿dentro ciclovia?", isInside);

    if (isInside) {
      Toast.show({
        type: "success",
        text1: "¡Correcto!",
        text2: "Está dentro de la ciclovía.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "¡Atención!",
        text2: "Está fuera de la ciclovía.",
      });
      setPuntaje((prevPuntaje) => Math.max(prevPuntaje - 5, 0));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (evaluacionIniciada) {
      setStartTime(new Date());
      evaluarCercania();
      interval = setInterval(() => evaluarCercania(), 10000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [evaluacionIniciada, location]);

  const finalizarEvaluacion = async () => {
    setEvaluacionIniciada(false);

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );
    console.log("Tiempo de inicio:", startTime);
    console.log("Tiempo de finalización:", endTime);
    console.log("Duración calculada (segundos):", duration);
    const errores: string[] = [];
    const mensajeCiclovia = puntaje < 100 ? "Salir de la ciclovía" : null;
    if (mensajeCiclovia) errores.push(mensajeCiclovia);

    // Crear el string con puntaje y errores
    const detalles = `Puntaje: ${puntaje}/100, Errores: ${errores.join(
      ", "
    )}, Duración: ${duration}s`;
    const fechaHoy = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

    try {
      const evaluacionesRef = firestore().collection("evaluaciones");
      const docRef = evaluacionesRef.doc(fechaHoy); // Usamos la fecha como ID del documento

      // Obtener el documento de la fecha para verificar los detalles existentes
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        // Si el documento ya existe, obtenemos los detalles actuales
        const data = docSnap.data();
        let detallesExistentes = data?.detalles || [];
        let puntajesExistentes = data?.puntajes || [];

        // Verificar si el detalle ya existe y crear un contador para evitar duplicados
        let contadorDetalles = 1;
        let nuevoDetalle = detalles;

        while (detallesExistentes.includes(nuevoDetalle)) {
          contadorDetalles++;
          nuevoDetalle = `${contadorDetalles}. ${detalles}`;
        }

        // Agregar el nuevo detalle con el contador
        await docRef.update({
          detalles: firestore.FieldValue.arrayUnion(nuevoDetalle),
        });

        // Verificar si la puntuación ya existe y crear un contador para las puntuaciones
        let contadorPuntajes = 1;
        let nuevoPuntaje = `${puntaje}`;

        while (puntajesExistentes.includes(nuevoPuntaje)) {
          contadorPuntajes++;
          nuevoPuntaje = `${puntaje} (${contadorPuntajes})`;
        }

        // Agregar la nueva puntuación con el contador
        await docRef.update({
          puntajes: firestore.FieldValue.arrayUnion(nuevoPuntaje),
        });
      } else {
        // Si el documento no existe, lo creamos con el primer detalle y puntuación
        await docRef.set({
          detalles: [`${detalles}`],
          puntajes: [`${puntaje}`],
        });
      }

      Toast.show({
        type: "success",
        text1: "Evaluación registrada",
        text2: `Tu puntaje final es: ${puntaje}/100. Duración: ${duration}s`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No se pudo guardar la evaluación: ${error.message}`,
      });
    }

    setPuntaje(100); // Reiniciar puntaje
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
          //onPress={handleMapPress}
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

      {/* Toast Message */}
      <Toast />
    </View>
  );
};

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

export default Bicycle;
