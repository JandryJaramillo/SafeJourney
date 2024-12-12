import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export default function Layout() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const router = useRouter();
  const segments = useSegments();

  // Función para autenticación de usuarios
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // Función para solicitar permisos de ubicación
  const requestLocationPermission = async () => {
    const permission = Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      console.log('Permisos de localización concedidos');
    } else if (result === RESULTS.DENIED) {
      Alert.alert('Permission Denied', 'Location access is required to use the map features.');
    } else {
      Alert.alert('Permission Blocked', 'Please enable location permissions from settings.');
    }
  };

  useEffect(() => {
    const suscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return suscriber;
  }, []);

  useEffect(()=>{
    if(initializing) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (user && !inAuthGroup){
      router.replace('/carx');
    } else if (!user && inAuthGroup) {
      router.replace('/');
    }

    // Solicitar permisos de ubicación después de que se autentique el usuario
    if (user) {
      requestLocationPermission();
    }

  },[user, initializing]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{headerShown: false}} />
    </SafeAreaProvider>
  );
}
