import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./fb";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./login.css";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = async () => {
    if (!name || !email || !password) {
      alert("Por favor, llena toda la información.");
      return;
    }
    try {      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(collection(db, "users"), user.uid), {
        name,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("Cuenta creada exitosamente.");
      navigate("/login"); // Redirigir al login
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      alert("Registro fallido: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <img src="./logo.png" alt="Logo" className="logo" />
      <h1>Registro</h1>
      <p>Crea tu cuenta para empezar</p>
      <input
        className="input"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="buttonContainer">
        <button className="button" onClick={() => navigate("/login")}>
          <span className="buttonText">VOLVER</span>
        </button>
        <button className="button" onClick={createAccount}>
          <span className="buttonText">REGISTRARSE</span>
        </button>
      </div>
    </div>
  );
}
