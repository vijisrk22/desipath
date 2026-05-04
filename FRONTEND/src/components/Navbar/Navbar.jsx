import { Link, useLocation, useNavigate } from "react-router-dom";
import DrawerComp from "./DrawerComp";
import SignInUp from "./SignInUp";
import Profile from "./Profile";
import Breadcrumbs from "../Common/Breadcrumbs";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "My Ads", path: "/postad" },
    { label: "About Us", path: "/aboutus" },
    { label: "Inbox", path: "/inbox" },
    { label: "Forum", path: "/forum" },
    { label: "Contact", path: "/contact" }
  ];
  const user = JSON.parse(localStorage.getItem("user"));

  let currentPath = location.pathname;

  return (
    <div className="flex flex-col relative z-50 bg-white">
      <div className="px-[7%] pt-4 pb-2 flex justify-between items-center">
        <Link to="/" className="text-[#0857d0] text-lg sm:text-xl md:text-xl lg:text-2xl font-normal font-fredoka hover:cursor-pointer">
          Desipath
        </Link>

        <div className="md:flex gap-4 md:gap-8 hidden">
          {navItems.map((item, index) => {
            const isActive = currentPath === item.path || (currentPath === "/" && item.path === "/");
            return (
              <Link
                key={index}
                to={item.path}
                className={`${
                  isActive ? "text-[#0857d0]" : "text-gray-400"
                } text-sm sm:text-base md:text-sm lg:text-base font-bold font-dmsans`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {user ? <Profile user={user} /> : <SignInUp />}

        <div className="md:hidden flex">
          <DrawerComp navItems={navItems} />
        </div>
      </div>

      {/* Mobile Back Button - Visible only on mobile below the header and not on home page */}
      {currentPath !== "/" && (
        <div className="md:hidden w-full px-[7%] py-2 bg-gray-50 border-b border-gray-100 flex items-center shadow-sm">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-[#0857d0] font-bold text-sm font-dmsans active:scale-95 transition-transform"
          >
            <span className="text-lg leading-none">&larr;</span> Back
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
