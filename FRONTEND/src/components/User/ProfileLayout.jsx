import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function ProfileLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default ProfileLayout;
