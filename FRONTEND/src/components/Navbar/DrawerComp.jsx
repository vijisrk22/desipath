import { useState } from "react";
import {
  Box, Drawer, IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import SignInUp from "./SignInUp";
import Profile from "./Profile";

/* ─── About Us content ─────────────────────────────────────────────────── */
const services = [
  { title: "Home & Roommates",    icon: "🏠", desc: "Find the right place to live with people who understand your lifestyle." },
  { title: "Cars & Transport",    icon: "🚗", desc: "Buy or sell vehicles within the community with trust and transparency." },
  { title: "Events & Culture",    icon: "🎉", desc: "Never miss a community gathering, concert, or festival near you." },
  { title: "Professional Services", icon: "💼", desc: "Connect with Desi doctors, attorneys, and IT trainers who understand your needs." },
  { title: "Travel Companions",   icon: "✈️", desc: "Traveling back home? Find friends and companions to share the journey." },
  { title: "Kids Education",      icon: "🎓", desc: "Preserve heritage with classes focusing on language, music, and arts." },
];

function AboutUsContent() {
  return (
    <div className="px-5 py-4 overflow-y-auto">
      {/* Hero */}
      <div className="mb-6">
        <span className="text-[#0857d0] font-bold tracking-widest uppercase text-xs mb-2 inline-block">Established 2024</span>
        <h2 className="text-2xl font-bold font-dmsans text-gray-900 leading-tight mb-3">
          Connecting the <span className="text-[#ffa41c]">Desi Heart</span> in North America.
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Desipath is more than a platform — it's a digital bridge for millions of Desi people across the US and Canada. We believe in the power of community to make life in a new country feel like home.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[["1M+","Active Users"],["50+","Cities"],["10k+","Daily Ads"],["100%","Desi Focused"]].map(([val,lbl]) => (
          <div key={lbl} className="bg-[#0857d0] rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{val}</div>
            <div className="text-blue-200 text-xs font-medium uppercase tracking-wide mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Why section */}
      <div className="mb-6">
        <h3 className="text-base font-bold font-dmsans text-gray-800 mb-2">Why Desipath?</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Whether it's finding a roommate who understands your food preferences, a doctor who speaks your language, or an event celebrating your heritage — Desipath brings it all under one roof.
        </p>
      </div>

      {/* Services */}
      <div className="mb-6">
        <h3 className="text-base font-bold font-dmsans text-gray-800 mb-3">Our Ecosystem</h3>
        <div className="grid grid-cols-2 gap-3">
          {services.map(s => (
            <div key={s.title} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-bold text-gray-800 mb-1">{s.title}</div>
              <div className="text-[11px] text-gray-400 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => window.location.href = "/register"}
        className="w-full py-3.5 bg-[#ffa41c] hover:bg-[#ff9900] text-gray-900 font-bold text-sm rounded-2xl transition-all active:scale-[0.98]"
      >
        Join Community Now
      </button>
    </div>
  );
}

/* ─── Contact content ───────────────────────────────────────────────────── */
function ContactContent() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:support@desipath.com?subject=Contact from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AMessage: ${formData.message}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#0857d0] focus:ring-2 focus:ring-blue-50 transition-all outline-none text-sm text-gray-800";

  if (submitted) {
    return (
      <div className="px-5 py-8 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
        <p className="text-gray-500 text-sm mb-6">Thank you {formData.name}. We'll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="px-8 py-3 border-2 border-blue-100 text-[#0857d0] font-bold rounded-2xl hover:bg-blue-50 transition-all text-sm">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      {/* Contact info */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold font-dmsans text-gray-900 mb-1">Let's <span className="text-[#0857d0]">talk.</span></h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">Have questions or need help? Our team is here for you.</p>
        <div className="flex flex-col gap-3">
          {[["✉️","Email Us","support@desipath.com","bg-blue-50"],["📞","Support Line","+1 (800) DESI-PATH","bg-amber-50"]].map(([icon,label,val,bg]) => (
            <div key={label} className={`flex items-center gap-3 ${bg} rounded-2xl p-3`}>
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
                <div className="text-sm font-bold text-gray-800">{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Full Name</label>
            <input required type="text" name="name" placeholder="Your name" value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Phone</label>
            <input required type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Email Address</label>
          <input required type="email" name="email" placeholder="you@email.com" value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600">Your Message</label>
          <textarea required name="message" rows="3" placeholder="How can we help?" value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})} className={`${inputClass} resize-none`} />
        </div>
        <button type="submit" className="w-full bg-[#0857d0] hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-blue-100 active:scale-[0.98]">
          Send Message
        </button>
        <p className="text-center text-gray-400 text-[10px]">By submitting, you agree to our Terms of Service.</p>
      </form>
    </div>
  );
}

/* ─── Content Modal (full-screen overlay) ───────────────────────────────── */
function ContentModal({ type, onClose }) {
  if (!type) return null;
  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white" style={{ overscrollBehavior: "contain" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 shadow-sm">
        <span className="text-base font-bold text-gray-800 font-dmsans">
          {type === "aboutus" ? "About Us" : "Contact Us"}
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {type === "aboutus" ? <AboutUsContent /> : <ContactContent />}
      </div>
    </div>
  );
}

/* ─── Main DrawerComp ───────────────────────────────────────────────────── */
function DrawerComp({ navItems, setValue }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [modalType,  setModalType]  = useState(null); // "aboutus" | "contact"
  const navigate   = useNavigate();
  const location   = useLocation();
  const user       = JSON.parse(localStorage.getItem("user"));

  let currentPath = location.pathname;

  /* Desktop: navigate normally */
  function handleItemClick(item) {
    setOpenDrawer(false);
    if (item.path === "/aboutus" || item.path === "/contact") {
      setModalType(item.path.replace("/", ""));
    } else {
      navigate(item.path);
    }
  }

  // Mobile only shows About Us, Contact, and Forum
  const mobileItems = navItems.filter(item => item.label === "About Us" || item.label === "Contact" || item.label === "Forum");

  return (
    <>
      {/* ── Full-screen content modal ─────────────────────────────── */}
      <ContentModal type={modalType} onClose={() => setModalType(null)} />

      {/* ── MUI Drawer ───────────────────────────────────────────── */}
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="top">
        {/* Close button */}
        <button
          onClick={() => setOpenDrawer(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "8px 12px",
            color: "#9ca3af",
            fontWeight: 700,
            fontSize: "1.2rem",
            zIndex: 50,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >✕</button>

        {/* Mobile menu — only About Us & Contact */}
        <div className="md:hidden flex flex-col items-center gap-2 pt-16 pb-8 px-6">
          {mobileItems.map(item => {
            const isActive = item.path === currentPath;
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full py-3 rounded-2xl text-sm font-bold font-dmsans transition-all ${
                  isActive
                    ? "bg-[#0857d0] text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop menu — all navItems (unchanged) */}
        <div className="hidden md:flex flex-col items-center gap-2 py-8 px-6">
          {navItems.map(item => {
            const isActive = currentPath === item.path || (currentPath === "/" && item.path === "/");
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={`w-full py-3 rounded-2xl text-sm font-bold font-dmsans transition-all ${
                  isActive ? "bg-[#0857d0] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Auth buttons */}
        {user ? (
          <Profile user={user} viewPortClass="md:hidden" isStatic={true} onMenuClick={() => setOpenDrawer(false)} />
        ) : (
          <Box sx={{ my: "1rem", mx: "auto" }}>
            <SignInUp viewPortClass="flex md:hidden" onMenuClick={() => setOpenDrawer(false)} />
          </Box>
        )}
      </Drawer>

      {/* Hamburger trigger */}
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon sx={{ color: "#FFA41C" }} />
      </IconButton>
    </>
  );
}

export default DrawerComp;
