import { Outlet } from "react-router-dom";
import MobileBottomNav from "./components/Navbar/MobileBottomNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Outlet />
      {/* Fixed bottom nav — only visible on mobile/tablet (hidden on md+) */}
      <MobileBottomNav />
    </div>
  );
}

export default Layout;
