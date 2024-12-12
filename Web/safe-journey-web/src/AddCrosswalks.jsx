import { useState } from "react";
import { db } from "./fb";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export function AddCrosswalks() {
  const navigate = useNavigate();
  const [newCrosswalk, setNewCrosswalk] = useState({
    lat: "",
    lng: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setNewCrosswalk({ ...newCrosswalk, [field]: value });
  };

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

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error añadiendo coordenadas:", error);
      alert(`Error al añadir coordenadas: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Paso de Cebra</h2>
      <p>Añade las coordenadas del centro del paso cebra</p>
      {successMessage && <div className="success">{successMessage}</div>}
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
      <button onClick={onSend}>Agregar Paso de Cebra</button>
      <button onClick={() => navigate("/admin")}>Regresar</button>
    </div>
  );
}
