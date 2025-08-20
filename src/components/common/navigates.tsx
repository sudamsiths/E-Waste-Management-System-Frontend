import React from "react";
import ClientInterface02 from "../interface/ClientInterface02";
import ClientInterface01 from "../interface/Clientinterface01";
import Clientinterface03 from "../interface/Clientinterface03";
import Clientinterface04 from "../interface/Clientinterface04";
import Footer from "./Footer";
function navigate() {
  return (
    <>
    <header/>
      <ClientInterface01 />
      <ClientInterface02 />
      <Clientinterface03 />
      <Clientinterface04 />
      <Footer />
    </>
  );
}

export default navigate;
