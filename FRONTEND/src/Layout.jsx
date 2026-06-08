import { Outlet, useNavigate } from "react-router-dom";
import MobileBottomNav from "./components/Navbar/MobileBottomNav";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator";

function Layout() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '70px' }}>
      <GlobalLoadingIndicator />
      <Outlet />

      {/* Floating Forum Button — mobile only, above bottom nav */}
      <button
        onClick={() => navigate('/forum')}
        className="md:hidden fixed z-[150] flex flex-col items-center justify-center gap-0.5"
        style={{
          bottom: '82px',
          right: '14px',
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Go to Forum"
      >
        {/* Chat bubble icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span style={{ color: 'white', fontSize: '8px', fontWeight: '700', letterSpacing: '0.02em', lineHeight: 1 }}>FORUM</span>
      </button>

      {/* Fixed bottom nav — only visible on mobile/tablet (hidden on md+) */}
      <MobileBottomNav />
    </div>
  );
}

export default Layout;
