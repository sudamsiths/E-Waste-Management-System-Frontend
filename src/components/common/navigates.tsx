import React from "react";
import ClientInterface02 from "../interface/ClientInterface02";
import ClientInterface01 from "../interface/Clientinterface01";

function navigate() {
  return (
    <>
    <header/>
      <ClientInterface01 />
      <ClientInterface02 />
    </>
  );
}

export default navigate;
