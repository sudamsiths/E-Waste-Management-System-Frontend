import React from "react";
import ClientInterface02 from "../interface/ClientInterface02";
import ClientInterface01 from "../interface/Clientinterface01";
import Clientinterface03 from "../interface/Clientinterface03";
import Clientinterface04 from "../interface/Clientinterface04";
import Footer from "./Footer";
import Header from "./Header";

function navigate() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <div className="flex-grow w-full">
        <ClientInterface01 />

        {/* Remove gaps between these components by using negative margin or removing padding */}
        <div className="bg-white w-full overflow-hidden">
          <ClientInterface02 />
          <Clientinterface03 />
          <Clientinterface04 />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default navigate;
