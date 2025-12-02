import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import Inicio from "./pages/home/home.jsx";
import Admin from "./pages/admin/admin.jsx";
import ReservarSala from "./pages/reservar/reservarSala.jsx";
import MisReservas from "./pages/mis-reservas/misReservas.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inicio/sala/:id" element={<ReservarSala />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
      </Routes>
    </Router>
  );
}

export default App;