import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";

export const CarIcon = (props) => (
  <FontAwesome5 name="car" size={24} color="black" {...props} />
);

export const BicicleIcon = (props) => (
  <FontAwesome5 name="bicycle" size={24} color="black" {...props} />
);

export const PersonIcon = (props) => (
  <FontAwesome5 name="walking" size={24} color="black" {...props} />
);

export const TrafficIcon = (props) => (
  <FontAwesome5 name="traffic-light" size={24} color="black" {...props} />
);

export const LawIcon = (props) => (
  <Octicons name="law" size={24} color="black" {...props} />
);

export const ProfileIcon = (props) => (
    <Octicons name="person" size={24} color="black" {...props} />
  );