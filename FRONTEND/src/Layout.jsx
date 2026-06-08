import { Outlet } from "react-router-dom";
import MobileBottomNav from "./components/Navbar/MobileBottomNav";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator";

function Layout() {
  return (
    <div style={{ paddingBottom: '70px' }}>
      <GlobalLoadingIndicator />
      <Outlet />
      {/* Fixed bottom nav — only visible on mobile/tablet (hidden on md+) */}
      <MobileBottomNav />
    </div>
  );
}

export default Layout;
