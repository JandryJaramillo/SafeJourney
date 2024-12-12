import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./fb";
import { doc, getDoc } from "firebase/firestore";
import "./styles.css";

export function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Debes iniciar sesión.");
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const { role } = userDoc.data();
          if (role !== "admin") {
            alert("No tienes acceso a esta página.");
            navigate("/login");
          }
        } else {
          alert("El usuario no tiene datos en Firestore.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error al verificar el rol:", error.message);
        alert("Error al verificar el rol.");
        navigate("/login");
      }
    };

    checkUserRole();
  }, [navigate]);

  return (
    <div className="container">
      <h1>Panel de Administración</h1>
      <p>Elige una acción para continuar:</p>
      <div className="actions">
        <button onClick={() => navigate("/add-laws")}>Agregar Ley</button>
        <button onClick={() => navigate("/add-signals")}>Agregar Señal</button>
        <button onClick={() => navigate("/add-crosswalks")}>
          Agregar Paso de Cebra
        </button>        
        <button
          onClick={() =>
            auth.signOut().then(() => {
              navigate("/login");
            })
          }
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
