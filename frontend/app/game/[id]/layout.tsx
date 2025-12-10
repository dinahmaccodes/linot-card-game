import React from "react";
import Navbar from "../components/Navbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #77F0FC 0%, #19D3F9 100%)",
      }}
    >
      <Navbar />
      {children}
    </div>
  );
}

export default layout;
