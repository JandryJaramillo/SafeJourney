import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    
    if (user) {
      const getUserRole = async () => {
        try {
          const userDoc = await firestore().collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            setRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error al obtener el rol:", error);
        } finally {
          setLoading(false);
        }
      };

      getUserRole();
    } else {
      setLoading(false); // Si no hay usuario logueado, dejamos de cargar.
    }
  }, []);

  return { role, loading };
}
