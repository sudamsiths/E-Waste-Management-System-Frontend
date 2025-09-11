import ReactDOM from "react-dom/client";
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/login/Register.tsx";
import Login from "./components/login/Login.tsx";
import Header from "./components/common/Header.tsx";
import Clientinterface01 from "./components/Clientinterface/Clientinterface01.tsx";
import ClientInterface02 from "./components/Clientinterface/ClientInterface02.tsx";
import Navigates from "./components/common/navigates";
import Clientinterface03 from "./components/Clientinterface/Clientinterface03.tsx";
import Footer from "./components/common/Footer.tsx";
import AdminDashboard from "./components/Admininterface/AdminDashboard.tsx";
import ClientService from "./components/Clientinterface/Services/ClientService.tsx";
import ClientRequest from "./components/Clientinterface/Services/ClientGarbageRequest.tsx";
import ClientAccountSetting from "./components/Clientinterface/Services/ClientAccountSetting.tsx";
import Contact from "./components/Clientinterface/Contact.tsx";
import ManageUserProfile from "./components/Admininterface/ManageUserProfile.tsx";
import AddAgent from "./components/Admininterface/AddAgent.tsx";
import CustomerAccountSettings from "./components/Clientinterface/CustomerAccountSettings.tsx";
import ClientAllRequest from './components/Clientinterface/Services/ClientAllRequest';


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
      <Route path="/services" element={<ClientService />} />
      <Route path="/ClientRequest" element={<ClientRequest />} />
      <Route path="/settings" element={<ClientAccountSetting />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/manage-user-profile" element={<ManageUserProfile />} />
      <Route path="/add-agent" element={<AddAgent />} />
      <Route path="/customer-account-settings" element={<CustomerAccountSettings />} />
      <Route path="/client/all-requests" element={<ClientAllRequest />} />
    </Routes>
  </BrowserRouter>
);
