import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./fb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./login.css";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    if (!email || !password) {
      alert("Por favor, llena toda la información");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const { role } = userDoc.data();
        if (role === "admin") {
          navigate("/admin");
        } else {
          alert(`No tienes acceso como administrador. Tu rol es ${role}.`);
        }
      } else {
        alert("El usuario no tiene datos en Firestore.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error de inicio de sesión: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <img src="./logo.png" alt="Logo" className="logo" />
      <h1>Safe Journey Admin</h1>
      <p>Ingresa tus datos para identificarte en el sistema</p>
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
        <button className="button" onClick={() => navigate("/register")}>
          <span className="buttonText">REGISTRARSE</span>
        </button>
        <button className="button" onClick={logIn}>
          <span className="buttonText">INGRESAR</span>
        </button>
      </div>
    </div>
  );
}
