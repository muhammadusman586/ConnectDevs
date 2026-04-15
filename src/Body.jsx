import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { addUser } from "./utils/userSlice";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const Body = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) return;
    const checkAuth = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch {
        // Not logged in — that's fine, continue as guest
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
