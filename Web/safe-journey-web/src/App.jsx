import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import { AdminPage } from "./AdminPage";
import { AddLaws } from "./AddLaws";
import { AddSignals } from "./AddSignals";
import { AddCrosswalks } from "./AddCrosswalks";
import { AddBikeLanes } from "./AddBikeLanes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/add-laws" element={<AddLaws />} />
        <Route path="/add-signals" element={<AddSignals />} />
        <Route path="/add-crosswalks" element={<AddCrosswalks />} />
        <Route path="/add-bike-lanes" element={<AddBikeLanes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
