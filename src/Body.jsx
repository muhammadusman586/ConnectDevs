import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const Body = () => {
  return (
    <div className="min-h-screen bg-bg text-body relative">
      <div className="noise-overlay" />
      <Navbar />
      <main className="pt-20 pb-16 relative z-[2]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
