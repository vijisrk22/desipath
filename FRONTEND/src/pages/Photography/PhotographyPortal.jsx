import React from "react";
import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

export default function PhotographyPortal() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Photography", eP: "/services/photography" },
    { text: "Post a Profile", eP: "/services/photography/post" },
  ];

  return (
    <div className="bg-[#f3f5f7] min-h-screen">
      <div className="mb-20 h-auto">
        <ServiceTopBar
          title="Photography & Videography"
          paths={paths}
          form="photography"
        />
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}
