import { useState, useEffect } from "react";
import { db } from "./fb";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
  const [signals, setSignals] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [editSignal, setEditSignal] = useState(null);

  // Leer las señales de Firestore
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "signals"));
        const signalsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSignals(signalsList);
      } catch (error) {
        console.error("Error fetching signals: ", error);
        alert("Error al cargar las señales.");
      }
    };

    fetchSignals();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setNewSign({ ...newSign, [field]: value });
  };

  // Agregar nueva señal
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

      // Recargar las señales
      const querySnapshot = await getDocs(collection(db, "signals"));
      const signalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSignals(signalsList);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(`Error al agregar la señal: ${error.message}`);
    }
  };

  // Eliminar señal
  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "signals", id));
      setSuccessMessage("Señal eliminada correctamente.");
      setSignals(signals.filter((signal) => signal.id !== id)); // Filtrar la señal eliminada de la lista
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error al eliminar la señal.");
    }
  };

  // Editar señal
  const onEdit = (signal) => {
    setEditSignal(signal);
    setNewSign({
      name: signal.name,
      description: signal.description,
      imageUrl: signal.imageUrl,
      category: signal.category,
    });
  };

  // Guardar cambios de señal editada
  const onSaveEdit = async () => {
    try {
      const { name, description, imageUrl, category } = newSign;

      if (!name || !description || !imageUrl || !category) {
        alert("Todos los campos son obligatorios");
        return;
      }

      await updateDoc(doc(db, "signals", editSignal.id), newSign);
      setSuccessMessage("Señal actualizada correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditSignal(null);
      setNewSign({
        name: "",
        description: "",
        imageUrl: "",
        category: "",
      });

      // Recargar las señales
      const querySnapshot = await getDocs(collection(db, "signals"));
      const signalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSignals(signalsList);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error al actualizar la señal.");
    }
  };

  return (
    <div className="container">
      <h2>{editSignal ? "Editar Señal" : "Agregar Nueva Señal"}</h2>
      {successMessage && <div className="success">{successMessage}</div>}

      {/* Formulario para agregar o editar */}
      <div className="form-container">
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

      <button onClick={editSignal ? onSaveEdit : onSend}>
        {editSignal ? "Actualizar Señal" : "Agregar Señal"}
      </button>
      <button onClick={() => navigate("/admin")}>Regresar</button>
      </div>

      {/* Tabla de Señales */}
      <div className="table-container">
        <h3>Lista de Señales</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal.id}>
                <td>{signal.name}</td>
                <td>{signal.description}</td>
                <td>{signal.category}</td>
                <td>
                  <img
                    src={signal.imageUrl}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>
                  <button onClick={() => onEdit(signal)}>Editar</button>
                  <button className="delete" onClick={() => onDelete(signal.id)}>
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
