import ReactDOM from "react-dom/client";import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.tsx'
import Register from "./components/login/Register.tsx";
import Login from "./components/login/Login.tsx";

const root = document.getElementById("root") || document.createElement("div");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>,
);
