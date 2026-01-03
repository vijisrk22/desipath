import { Link } from "react-router-dom";
import SubscribeNewsletter from "./SubscribeNewsletter";

function Footer({ bgColor = "bg-[#f3f5f7]", newsletter = "hidden" }) {
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
    <div
      className={`w-full px-[130px] pt-20 pb-10 rounded-tl-[40px] rounded-tr-[40px] flex-col justify-end items-start gap-1 inline-flex ${bgColor} `}
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
              return (
                <button 
                  key={index}
                  className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <img src={icon} className="w-[24px] h-[24px]" alt={`Social icon ${index + 1}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:justify-between sm:items-center sm:flex w-full text-center">
          <div className="text-gray-500 text-xs lg:text-sm font-medium font-dmsans my-2">
            © 2024 Desipath. All rights reserved.
          </div>
          <div className="text-center text-[#0857d0] text-3xl font-normal font-fredoka">
            Desipath
          </div>

          <div className="text-gray-500 text-xs lg:text-sm font-medium font-dmsans  my-2">
            Terms of Service Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
