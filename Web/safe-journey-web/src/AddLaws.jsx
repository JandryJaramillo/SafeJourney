import { useState, useEffect } from "react";
import { db } from "./fb"; // Configuración de Firebase
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export function AddLaws() {
  const navigate = useNavigate();
  const [laws, setLaws] = useState([]); // Lista de leyes
  const [newLaw, setNewLaw] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [editLawId, setEditLawId] = useState(null); // Para editar una ley existente
  const [successMessage, setSuccessMessage] = useState("");

  // Función para manejar los cambios en los inputs
  const handleInputChange = (field, value) => {
    setNewLaw({ ...newLaw, [field]: value });
  };

  // Función para obtener todas las leyes (Read)
  const fetchLaws = async () => {
    try {
      const snapshot = await getDocs(collection(db, "laws"));
      const lawsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLaws(lawsData);
    } catch (error) {
      console.error("Error al obtener leyes: ", error);
    }
  };

  // Función para agregar o actualizar una ley (Create / Update)
  const onSend = async () => {
    try {
      const { name, description, category } = newLaw;

      if (!name || !description || !category) {
        alert("Todos los campos son obligatorios");
        return;
      }

      if (editLawId) {
        // Actualizar una ley existente
        const lawRef = doc(db, "laws", editLawId);
        await updateDoc(lawRef, newLaw);
        setSuccessMessage("Ley actualizada correctamente");
      } else {
        // Agregar una nueva ley
        await addDoc(collection(db, "laws"), newLaw);
        setSuccessMessage("Ley agregada correctamente");
      }

      // Resetear formulario y estado
      setNewLaw({ name: "", description: "", category: "" });
      setEditLawId(null);
      fetchLaws();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al agregar/actualizar la ley: ", error);
    }
  };

  // Función para eliminar una ley (Delete)
  const onDelete = async (id) => {
    try {
      const lawRef = doc(db, "laws", id);
      await deleteDoc(lawRef);
      setSuccessMessage("Ley eliminada correctamente");
      fetchLaws();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al eliminar la ley: ", error);
    }
  };

  // Función para cargar datos al formulario para edición
  const onEdit = (law) => {
    setNewLaw({
      name: law.name,
      description: law.description,
      category: law.category,
    });
    setEditLawId(law.id);
  };

  // Cargar las leyes al iniciar
  useEffect(() => {
    fetchLaws();
  }, []);

  return (
    <div className="container">
      <h2>{editLawId ? "Editar Ley" : "Agregar Nueva Ley"}</h2>
      {successMessage && <div className="success">{successMessage}</div>}

      {/* Contenedor del formulario */}
      <div className="form-container">
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
        <div className="actions">
          <button onClick={onSend}>
            {editLawId ? "Actualizar Ley" : "Agregar Ley"}
          </button>
          <button onClick={() => navigate("/admin")}>Regresar</button>
        </div>
      </div>

      {/* Tabla de Leyes */}
      <div className="table-container">
        <h3>Lista de Leyes</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {laws.map((law) => (
              <tr key={law.id}>
                <td>{law.name}</td>
                <td>{law.description}</td>
                <td>{law.category}</td>
                <td>
                  <button onClick={() => onEdit(law)}>Editar</button>
                  <button className="delete" onClick={() => onDelete(law.id)}>
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
