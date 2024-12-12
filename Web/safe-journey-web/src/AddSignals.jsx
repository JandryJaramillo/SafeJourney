import { useState } from "react";
import { db } from "./fb";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export function AddSignals() {
  const navigate = useNavigate();
  const [newSign, setNewSign] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setNewSign({ ...newSign, [field]: value });
  };

  const onSend = async () => {
    try {
      const { name, description, imageUrl, category } = newSign;

      if (!name || !description || !imageUrl || !category) {
        alert("Todos los campos son obligatorios");
        return;
      }

      await addDoc(collection(db, "signals"), newSign);
      setSuccessMessage("Señal agregada correctamente");
      setNewSign({
        name: "",
        description: "",
        imageUrl: "",
        category: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(`Error al agregar la señal: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Nueva Señal</h2>
      {successMessage && <div className="success">{successMessage}</div>}
      <div className="form-group">
        <label>Nombre de la Señal</label>
        <input
          placeholder="Nombre de la señal"
          value={newSign.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          placeholder="Descripción de la señal"
          value={newSign.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>URL de la Imagen</label>
        <input
          placeholder="URL de la imagen"
          value={newSign.imageUrl}
          onChange={(e) => handleInputChange("imageUrl", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Categoría</label>
        <select
          value={newSign.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          <option value="conductores">Conductores</option>
          <option value="peatones">Peatones</option>
          <option value="ciclistas">Ciclistas</option>
        </select>
      </div>
      <button onClick={onSend}>Agregar Señal</button>
      <button onClick={() => navigate("/admin")}>Regresar</button>
    </div>
  );
}
