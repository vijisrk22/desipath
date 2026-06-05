import { Link } from "react-router-dom";
import SubscribeNewsletter from "./SubscribeNewsletter";

function Footer({ newsletter = "hidden", hideOnMobile = true }) {
  const displayClass = hideOnMobile ? "hidden md:flex" : "flex";

  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "X (Twitter)",
      url: "#",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "YouTube",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const exploreLinks = [
    { text: "Home", to: "/" },
    { text: "Forum", to: "/services/forum" },
    { text: "Events", to: "/services/events" },
    { text: "Marketplace", to: "/services" },
    { text: "Local Businesses", to: "/services/localdeals" },
  ];

  const serviceLinks = [
    { text: "Rental Homes", to: "/services/rentalhomes" },
    { text: "Cars", to: "/services/cars" },
    { text: "Jobs", to: "/services/jobs" },
    { text: "Rideshare", to: "/services/rideshare" },
    { text: "Classifieds", to: "/services/classifieds" },
    { text: "Real Estate", to: "/services/realestate" },
  ];

  const companyLinks = [
    { text: "About Us", to: "/aboutus" },
    { text: "Contact Us", to: "/contact" },
    { text: "Advertise", to: "/postad" },
    { text: "Blog", to: "#" },
    { text: "Help Center", to: "#" },
  ];

  return (
    <div className={`w-full flex-col ${displayClass}`}>
      <footer className="w-full bg-gradient-to-b from-[#F8FAFC] to-[#EEF4FF] border-t border-[#E5E7EB] pt-16 md:pt-20 pb-8 md:pb-12 px-6 md:px-12 lg:px-[80px]">
        {newsletter !== "hidden" && (
          <div className="w-full z-20 pb-16 md:pb-24">
            <SubscribeNewsletter />
          </div>
        )}

        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-16">
          
          {/* Main Footer Content - 5 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Column 1: Brand (Takes up 4 cols on large screens) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Link to="/" className="text-[28px] font-bold text-[#1565D8] font-dmsans tracking-tight hover:opacity-90 transition-opacity">
                Desipath
              </Link>
              <p className="text-[16px] font-semibold text-gray-800 font-dmsans">
                Connecting Indian Communities Across North America
              </p>
              <p className="text-[15px] text-gray-600 font-dmsans leading-relaxed pr-0 lg:pr-8">
                Discover events, jobs, rentals, classifieds, rideshares, and local businesses all in one place.
              </p>
              
              <ul className="flex flex-col gap-2 mt-2">
                {["Community Driven", "Free Listings", "Secure Messaging"].map((badge, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[15px] text-gray-700 font-medium font-dmsans">
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[16px] font-semibold text-gray-900 font-dmsans uppercase tracking-wider">Explore</h4>
              <ul className="flex flex-col gap-3">
                {exploreLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-[15px] text-gray-600 hover:text-[#1565D8] hover:underline font-dmsans transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[16px] font-semibold text-gray-900 font-dmsans uppercase tracking-wider">Services</h4>
              <ul className="flex flex-col gap-3">
                {serviceLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-[15px] text-gray-600 hover:text-[#1565D8] hover:underline font-dmsans transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[16px] font-semibold text-gray-900 font-dmsans uppercase tracking-wider">Company</h4>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-[15px] text-gray-600 hover:text-[#1565D8] hover:underline font-dmsans transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Follow Us */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[16px] font-semibold text-gray-900 font-dmsans uppercase tracking-wider">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1565D8] hover:border-[#1565D8] hover:scale-105 hover:shadow-md transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Legal Bar */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#E5E7EB]">
            <p className="text-[14px] text-gray-500 font-medium font-dmsans text-center md:text-left">
              © 2026 Desipath. All rights reserved.
            </p>
            <div className="flex items-center gap-2 sm:gap-4 text-[14px] text-gray-500 font-medium font-dmsans flex-wrap justify-center">
              <Link to="/terms" className="hover:text-[#1565D8] hover:underline transition-colors">Terms of Service</Link>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <Link to="/privacy" className="hover:text-[#1565D8] hover:underline transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <Link to="/cookies" className="hover:text-[#1565D8] hover:underline transition-colors">Cookie Policy</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default Footer;
