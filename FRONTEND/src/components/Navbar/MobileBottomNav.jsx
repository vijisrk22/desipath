import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ── SVG Icons ────────────────────────────────────────────────────────────── */
const HomeIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MegaphoneIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8} className="w-6 h-6">
    {filled ? (
      <path fillRule="evenodd" clipRule="evenodd"
        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    )}
  </svg>
);

const CalendarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8} className="w-6 h-6">
    {filled ? (
      <path fillRule="evenodd" clipRule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    )}
  </svg>
);

const ChatIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8} className="w-6 h-6">
    {filled ? (
      <path fillRule="evenodd" clipRule="evenodd"
        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    )}
  </svg>
);

const UserIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8} className="w-6 h-6">
    {filled ? (
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    )}
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const isMatch = (pathname, to) => {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/") || pathname.startsWith(to);
};

/* ── Component ────────────────────────────────────────────────────────────── */
export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Close profile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const activeHome   = isMatch(location.pathname, "/");
  const activeAds    = isMatch(location.pathname, "/services/Localdeals");
  const activeEvents = isMatch(location.pathname, "/services/events/findEvent");
  const activeChat   = isMatch(location.pathname, "/inbox");
  const activeUser   = isMatch(location.pathname, "/profile") || isMatch(location.pathname, "/postad");

  return (
    <>
      {/* ── Profile / Post Ad slide-up menu ─────────────────────────────── */}
      {profileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop — inert to assistive tech */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setProfileMenuOpen(false)}
          />
          {/* Menu card */}
          <div
            ref={menuRef}
            className="absolute bottom-[72px] right-4 bg-white rounded-2xl shadow-2xl overflow-hidden w-52 border border-gray-100 animate-slideUp"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
            </div>
            <Link
              to={user ? "/profile" : "/login"}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon filled />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{user ? "My Profile" : "Sign In"}</p>
                <p className="text-[10px] text-gray-400">{user ? user.name || "View account" : "Login to continue"}</p>
              </div>
            </Link>
            <Link
              to={user ? "/postad" : "/login"}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-orange-50 transition-colors border-t border-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <PlusIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Post an Ad</p>
                <p className="text-[10px] text-gray-400">List your service or item</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ── Bottom Nav Bar ───────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        aria-label="Mobile navigation"
      >
        {/* Safe-area spacer for notched phones */}
        <div
          className="bg-white border-t border-gray-100"
          style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-end justify-around px-2 pt-1 pb-2"
            style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
          >

            {/* 1 — Home */}
            <Link
              to="/"
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              aria-label="Home"
            >
              <span className={`transition-colors ${activeHome ? "text-[#0857d0]" : "text-gray-400 group-hover:text-gray-600"}`}>
                <HomeIcon filled={activeHome} />
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${activeHome ? "text-[#0857d0]" : "text-gray-400"}`}>
                Home
              </span>
              {activeHome && <span className="w-1 h-1 rounded-full bg-[#0857d0] mt-0.5" />}
            </Link>

            {/* 2 — Local Ads */}
            <Link
              to="/services/Localdeals"
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              aria-label="Local Ads"
            >
              <span className={`transition-colors ${activeAds ? "text-[#0857d0]" : "text-gray-400 group-hover:text-gray-600"}`}>
                <MegaphoneIcon filled={activeAds} />
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${activeAds ? "text-[#0857d0]" : "text-gray-400"}`}>
                Local Ads
              </span>
              {activeAds && <span className="w-1 h-1 rounded-full bg-[#0857d0] mt-0.5" />}
            </Link>

            {/* 3 — Events */}
            <Link
              to="/services/events/findEvent"
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              aria-label="Events"
            >
              <span className={`transition-colors ${activeEvents ? "text-[#0857d0]" : "text-gray-400 group-hover:text-gray-600"}`}>
                <CalendarIcon filled={activeEvents} />
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${activeEvents ? "text-[#0857d0]" : "text-gray-400"}`}>
                Events
              </span>
              {activeEvents && <span className="w-1 h-1 rounded-full bg-[#0857d0] mt-0.5" />}
            </Link>

            {/* 4 — Inbox */}
            <Link
              to="/inbox"
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              aria-label="Inbox"
            >
              <span className={`transition-colors ${activeChat ? "text-[#0857d0]" : "text-gray-400 group-hover:text-gray-600"}`}>
                <ChatIcon filled={activeChat} />
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${activeChat ? "text-[#0857d0]" : "text-gray-400"}`}>
                Inbox
              </span>
              {activeChat && <span className="w-1 h-1 rounded-full bg-[#0857d0] mt-0.5" />}
            </Link>

            {/* 5 — Profile & Post Ad */}
            <button
              onClick={() => setProfileMenuOpen((v) => !v)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              aria-label="Profile and Post Ad"
              aria-expanded={profileMenuOpen}
            >
              <span className={`transition-colors ${activeUser || profileMenuOpen ? "text-[#0857d0]" : "text-gray-400 group-hover:text-gray-600"}`}>
                <UserIcon filled={activeUser || profileMenuOpen} />
              </span>
              <span className={`text-[10px] font-semibold transition-colors ${activeUser || profileMenuOpen ? "text-[#0857d0]" : "text-gray-400"}`}>
                Profile
              </span>
              {(activeUser || profileMenuOpen) && <span className="w-1 h-1 rounded-full bg-[#0857d0] mt-0.5" />}
            </button>

          </div>
        </div>
      </nav>

      {/* Bottom padding so page content isn't hidden behind the nav */}
      <div className="h-[72px] md:hidden" aria-hidden="true" />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.2s ease-out both; }
      `}</style>
    </>
  );
}
