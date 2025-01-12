import { useState, useEffect } from "react";
import { db } from "./fb";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export function AddCrosswalks() {
  const navigate = useNavigate();
  const [newCrosswalk, setNewCrosswalk] = useState({
    lat: "",
    lng: "",
  });
  const [crosswalks, setCrosswalks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [editCrosswalk, setEditCrosswalk] = useState(null);

  // Leer los pasos de cebra de Firestore
  useEffect(() => {
    const fetchCrosswalks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "crosswalks"));
        const crosswalksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCrosswalks(crosswalksList);
      } catch (error) {
        console.error("Error fetching crosswalks: ", error);
        alert("Error al cargar los pasos de cebra.");
      }
    };

    fetchCrosswalks();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setNewCrosswalk({ ...newCrosswalk, [field]: value });
  };

  // Agregar nuevo paso de cebra
  const onSend = async () => {
    const { lat, lng } = newCrosswalk;

    if (!lat || !lng) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const latParsed = parseFloat(lat);
    const lngParsed = parseFloat(lng);

    if (isNaN(latParsed) || isNaN(lngParsed)) {
      alert("Latitud y longitud deben ser números válidos.");
      return;
    }

    try {
      await addDoc(collection(db, "crosswalks"), {
        lat: latParsed,
        lng: lngParsed,
      });

      setSuccessMessage("Coordenadas añadidas correctamente");
      setNewCrosswalk({ lat: "", lng: "" });

      // Recargar los pasos de cebra
      const querySnapshot = await getDocs(collection(db, "crosswalks"));
      const crosswalksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCrosswalks(crosswalksList);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error añadiendo coordenadas:", error);
      alert(`Error al añadir coordenadas: ${error.message}`);
    }
  };

  // Eliminar paso de cebra
  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "crosswalks", id));
      setSuccessMessage("Paso de cebra eliminado correctamente.");
      setCrosswalks(crosswalks.filter((crosswalk) => crosswalk.id !== id)); // Filtrar la fila eliminada
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error al eliminar el paso de cebra.");
    }
  };

  // Editar paso de cebra
  const onEdit = (crosswalk) => {
    setEditCrosswalk(crosswalk);
    setNewCrosswalk({
      lat: crosswalk.lat,
      lng: crosswalk.lng,
    });
  };

  // Guardar cambios de paso de cebra editado
  const onSaveEdit = async () => {
    const { lat, lng } = newCrosswalk;

    if (!lat || !lng) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const latParsed = parseFloat(lat);
    const lngParsed = parseFloat(lng);

    if (isNaN(latParsed) || isNaN(lngParsed)) {
      alert("Latitud y longitud deben ser números válidos.");
      return;
    }

    try {
      await updateDoc(doc(db, "crosswalks", editCrosswalk.id), {
        lat: latParsed,
        lng: lngParsed,
      });

      setSuccessMessage("Paso de cebra actualizado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditCrosswalk(null);
      setNewCrosswalk({
        lat: "",
        lng: "",
      });

      // Recargar los pasos de cebra
      const querySnapshot = await getDocs(collection(db, "crosswalks"));
      const crosswalksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCrosswalks(crosswalksList);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error al actualizar el paso de cebra.");
    }
  };

  return (
    <div className="container">
      <h2>
        {editCrosswalk ? "Editar Paso de Cebra" : "Agregar Nuevo Paso de Cebra"}
      </h2>
      {successMessage && <div className="success">{successMessage}</div>}

      {/* Formulario para agregar o editar */}
      <div className="form-container">
        <div className="form-group">
          <label>Latitud</label>
          <input
            placeholder="Ej: -3.995"
            value={newCrosswalk.lat}
            onChange={(e) => handleInputChange("lat", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Longitud</label>
          <input
            placeholder="Ej: -79.198"
            value={newCrosswalk.lng}
            onChange={(e) => handleInputChange("lng", e.target.value)}
          />
        </div>

        <button onClick={editCrosswalk ? onSaveEdit : onSend}>
          {editCrosswalk ? "Actualizar Paso de Cebra" : "Agregar Paso de Cebra"}
        </button>
        <button onClick={() => navigate("/admin")}>Regresar</button>
      </div>

      {/* Tabla de Pasos de Cebra */}
      <div className="table-container">
        <h3>Lista de Pasos de Cebra</h3>
        <table>
          <thead>
            <tr>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {crosswalks.map((crosswalk) => (
              <tr key={crosswalk.id}>
                <td>{crosswalk.lat}</td>
                <td>{crosswalk.lng}</td>
                <td>
                  <button onClick={() => onEdit(crosswalk)}>Editar</button>
                  <button
                    className="delete"
                    onClick={() => onDelete(crosswalk.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
