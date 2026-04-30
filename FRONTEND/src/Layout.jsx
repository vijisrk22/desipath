import { Outlet } from "react-router-dom";
import MobileBottomNav from "./components/Navbar/MobileBottomNav";

function Layout() {
  return (
    <div>
      <Outlet />
      {/* Fixed bottom nav — only visible on mobile/tablet (hidden on md+) */}
      <MobileBottomNav />
    </div>
  );
}

export default Layout;
