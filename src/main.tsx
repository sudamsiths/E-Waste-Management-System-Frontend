import ReactDOM from "react-dom/client";
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import Register from "./components/login/Register.tsx";
import Login from "./components/login/Login.tsx";
import Header from "./components/common/Header.tsx";
import Clientinterface01 from "./components/interface/Clientinterface01.tsx";


const root = document.getElementById("root") || document.createElement("div");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Clientinterface" element={<Clientinterface01 />} />
      <Route path="/Header" element={<Header />} />
    </Routes>
  </BrowserRouter>
);
