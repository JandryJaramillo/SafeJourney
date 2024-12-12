import { useState } from "react";
import { db } from "./fb";
import { collection, addDoc } from "firebase/firestore";
import "./styles.css";

export function AddBikeLanes() {
  const [laneName, setLaneName] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [currentCoord, setCurrentCoord] = useState({ lat: "", lng: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const addCoordinate = () => {
    const { lat, lng } = currentCoord;
    if (!lat || !lng) {
      alert("Por favor ingresa latitud y longitud.");
      return;
    }

    setCoordinates((prev) => [...prev, [parseFloat(lng), parseFloat(lat)]]);
    setCurrentCoord({ lat: "", lng: "" }); // Limpia los campos
  };

  const handleSubmit = async () => {
    if (!laneName) {
      alert("Por favor ingresa el nombre de la ciclovía.");
      return;
    }
    if (coordinates.length < 3) {
      alert("Se necesitan al menos 3 puntos para formar un polígono.");
      return;
    }

    // Cierra el polígono automáticamente si es necesario
    const polygonCoordinates =
      JSON.stringify(coordinates[0]) !==
      JSON.stringify(coordinates[coordinates.length - 1])
        ? [...coordinates, coordinates[0]]
        : coordinates;

    const newFeature = {
      type: "Feature",
      properties: { name: laneName },
      geometry: {
        type: "Polygon",
        coordinates: polygonCoordinates,
      },
    };

    try {      
      await addDoc(collection(db, "bikeLanes"), newFeature);
      setSuccessMessage("Ciclovía agregada correctamente");
      setLaneName("");
      setCoordinates([]);
    } catch (error) {
      alert("Datos a guardar: ", JSON.stringify(newFeature, null, 2));  
      console.error("Error al agregar ciclovía: ", error.message);
      alert("Error al agregar la ciclovía." + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Nueva Ciclovía</h2>
      <p>
        Agrega la sección geometrica de la ciclovia, formando un rectángulo,
        añade 5 coordenadas las cuales la quinta es la misma que la primera,
        esto se hace para cerrar el polígono.
      </p>
      {successMessage && <div className="success">{successMessage}</div>}
      <div className="form-group">
        <label>Nombre de la Ciclovía</label>
        <input
          placeholder="Nombre de la ciclovía"
          value={laneName}
          onChange={(e) => setLaneName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Coordenadas</label>
        <div className="coord-inputs">
          <input
            placeholder="Latitud"
            value={currentCoord.lat}
            onChange={(e) =>
              setCurrentCoord({ ...currentCoord, lat: e.target.value })
            }
          />
          <input
            placeholder="Longitud"
            value={currentCoord.lng}
            onChange={(e) =>
              setCurrentCoord({ ...currentCoord, lng: e.target.value })
            }
          />
          <button onClick={addCoordinate}>Añadir Coordenada</button>
        </div>
      </div>
      {coordinates.length > 0 && (
        <div>
          <h3>Coordenadas Añadidas:</h3>
          <ul>
            {coordinates.map(([lng, lat], index) => (
              <li key={index}>
                [{lng}, {lat}]
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleSubmit} disabled={coordinates.length < 3}>
        Guardar Ciclovía
      </button>
    </div>
  );
}
