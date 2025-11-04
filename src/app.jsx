import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.jsx";
// import Register from "./pages/Register";
// import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/registro" element={<Register />} /> */}
        {/* <Route path="/usuarios" element={<Users />} /> */}
      </Routes>
    </Router>
  );
}

export default App;