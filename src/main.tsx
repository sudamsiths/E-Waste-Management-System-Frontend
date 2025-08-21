import ReactDOM from "react-dom/client";
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from './App.tsx';
import Register from "./components/login/Register.tsx";
import Login from "./components/login/Login.tsx";
import Header from "./components/common/Header.tsx";
import Clientinterface01 from "./components/Clientinterface/Clientinterface01.tsx";
import ClientInterface02 from "./components/Clientinterface/ClientInterface02.tsx";
import Navigates from "./components/common/navigates.tsx";
import Clientinterface03 from "./components/Clientinterface/Clientinterface03.tsx";
import Footer from "./components/common/Footer.tsx";
import AdminDashboard from "./components/Admininterface/AdminDashboard.tsx";

const root = document.getElementById("root") || document.createElement("div");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Clientinterface" element={<Clientinterface01 />} />
      <Route path="/Header" element={<Header />} />
      <Route path="/ClientInterface02" element={<ClientInterface02 />} />
      <Route path="/Clientinterface03" element={<Clientinterface03 />} />
      <Route path="/Navigate" element={<Navigates />} />
      <Route path="/Footer" element={<Footer />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
);
