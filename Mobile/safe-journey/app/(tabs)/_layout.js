import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  CarIcon,
  BicicleIcon,
  PersonIcon,
  TrafficIcon,
  LawIcon,
  ProfileIcon,
} from "../../components/Icons";

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="carx"
          options={{
            title: "Auto",
            tabBarIcon: ({ color }) => <CarIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="bicyclex"
          options={{
            title: "Bici",
            tabBarIcon: ({ color }) => <BicicleIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="walkx"
          options={{
            title: "A Pie",
            tabBarIcon: ({ color }) => <PersonIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="signx"
          options={{
            title: "Señales",
            tabBarIcon: ({ color }) => <TrafficIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="lawx"
          options={{
            title: "Leyes",
            tabBarIcon: ({ color }) => <LawIcon color={color} />,
          }}
        />

        <Tabs.Screen
          name="profilex"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
