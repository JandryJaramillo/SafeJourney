import { useState } from "react";
import { db } from "./fb";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export function AddLaws() {
  const navigate = useNavigate();
  const [newLaw, setNewLaw] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setNewLaw({ ...newLaw, [field]: value });
  };

  const onSend = async () => {
    try {
      const { name, description, category } = newLaw;

      if (!name || !description || !category) {
        alert("Todos los campos son obligatorios");
        return;
      }

      await addDoc(collection(db, "laws"), newLaw);
      setSuccessMessage("Ley agregada correctamente");
      setNewLaw({
        name: "",
        description: "",
        category: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000); // Limpia el mensaje después de 3 segundos
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(`Error al agregar la ley: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Nueva Ley</h2>
      {successMessage && <div className="success">{successMessage}</div>}
      <div className="form-group">
        <label>Nombre de la Ley</label>
        <input
          placeholder="Nombre de la ley"
          value={newLaw.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          placeholder="Descripción de la ley"
          value={newLaw.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Categoría</label>
        <select
          value={newLaw.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
        >
          <option value="">Seleccione una categoría</option>
          <option value="conductores">Conductores</option>
          <option value="peatones">Peatones</option>
          <option value="ciclistas">Ciclistas</option>
        </select>
      </div>
      <button onClick={onSend}>Agregar Ley</button>
      <button onClick={() => navigate("/admin")}>Regresar</button>
    </div>
  );
}
