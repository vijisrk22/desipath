import { Link, useLocation } from "react-router-dom";
import DrawerComp from "./DrawerComp";
import SignInUp from "./SignInUp";
import Profile from "./Profile";

function Navbar() {
  const location = useLocation();
  const navPages = ["Home", "Post Ad", "About Us", "Contact"];
  const user = JSON.parse(localStorage.getItem("user"));

  let currentPath = location.pathname.replace("/", "").toLowerCase();

  return (
    <div className="px-[7%] pt-6 pb-2 flex justify-between items-center">
      <div className="text-[#0857d0] text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal font-fredoka ">
        Desipath
      </div>

      <div className="md:flex gap-6 md:gap-12 hidden">
        {navPages.map((item, index) => {
          const path = item.replace(" ", "").toLowerCase();

          if (currentPath == "") {
            currentPath = "home";
          }
          const isActive = path === currentPath;
          return (
            <Link
              key={index}
              to={`/${path}`}
              className={`${
                isActive ? "text-[#0857d0]" : "text-gray-400"
              } text-base sm:text-lg md:text-base lg:text-xl font-bold font-dmsans`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {user ? <Profile user={user} /> : <SignInUp />}

      {/* Hamburger Navbar on smaller screens*/}
      <div className="md:hidden flex">
        <DrawerComp navPages={navPages} />
      </div>
    </div>
  );
}

export default Navbar;
