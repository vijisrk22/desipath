import { Link } from "react-router-dom";
import SubscribeNewsletter from "./SubscribeNewsletter";

function Footer({ bgColor = "bg-[#f3f5f7]", newsletter = "hidden", hideOnMobile = false }) {
  const displayClass = hideOnMobile ? "hidden md:inline-flex" : "inline-flex";
  const icons = [
    "/facebook.svg",
    "/twitter.svg",
    "/instagram.svg",
    "/youtube.svg",
  ];

  const navLinks = [
    { to: "/", text: " Home" },
    { to: "/postad", text: "Advertise" },
    { to: "/aboutus", text: "About" },
    { to: "/contact", text: "Contact" },
  ];

  return (
    <footer
      className={`w-full px-6 md:px-16 lg:px-[130px] pt-12 md:pt-20 pb-10 rounded-tl-[40px] rounded-tr-[40px] flex-col justify-end items-start gap-1 ${displayClass} ${bgColor}`}
    >
      <div className="self-stretch pb-10 flex-col justify-start items-center gap-10 flex">
        <div className={`${newsletter}`}>
          <SubscribeNewsletter />
        </div>
        <div className="lg:justify-between flex flex-wrap gap-y-6 justify-center items-center w-full">
          <div className="justify-start items-center gap-12 flex">
            {navLinks.map((navLink, index) => {
              return (
                <Link
                  to={navLink.to}
                  key={index}
                  className="text-[#0857d0] text-base font-bold font-dmsans cursor-pointer hover:underline transition-all"
                >
                  {navLink.text}
                </Link>
              );
            })}
          </div>

          <div className="flex gap-[40px] items-center">
            {icons.map((icon, index) => {
              const platform = icon.split('/').pop().split('.')[0];
              return (
                <button 
                  key={index}
                  className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                  aria-label={`Visit our ${platform} page`}
                >
                  <img src={icon} className="w-[24px] h-[24px]" alt={`${platform} logo`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:justify-between sm:items-center sm:flex w-full text-center">
          <div className="text-gray-600 text-xs lg:text-sm font-medium font-dmsans my-2">
            © 2024 Desipath. All rights reserved.
          </div>

          <div className="text-gray-600 text-xs lg:text-sm font-medium font-dmsans  my-2">
            Terms of Service Privacy Policy
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
