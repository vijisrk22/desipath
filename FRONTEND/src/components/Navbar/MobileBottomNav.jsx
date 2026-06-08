import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineSpeakerphone,
  HiOutlineCalendar,
  HiOutlineNewspaper,
  HiOutlineInbox,
  HiOutlineUser,
} from 'react-icons/hi';

const NAV_ITEMS = [
  { label: 'Home',        icon: HiOutlineHome,        path: '/'           },
  { label: 'Local Deals', icon: HiOutlineSpeakerphone, path: '/services/Localdeals'},
  { label: 'Events',      icon: HiOutlineCalendar,     path: '/events/findEvent'     },
  { label: 'Desi News',   icon: HiOutlineNewspaper,    path: '/daily-news'       },
  { label: 'Inbox',       icon: HiOutlineInbox,        path: '/inbox'      },
  { label: 'Profile',     icon: HiOutlineUser,         path: '/profile'    },
];

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(232, 148, 10, 0.9)', // #E8940A with 90% opacity (10% transparency)
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '10px',
    zIndex: 1000,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    flex: 1,
    cursor: 'pointer',
    position: 'relative',
    paddingTop: '6px',
  },
  icon: (active, hovered) => ({
    fontSize: '22px',
    color: '#ffffff',
    opacity: active ? 1 : hovered ? 1 : 0.9,
    transition: 'opacity 0.15s',
  }),
  label: (active, hovered) => ({
    fontSize: '11px',
    fontWeight: active ? '500' : '400',
    color: '#ffffff',
    opacity: active ? 1 : hovered ? 1 : 0.9,
    transition: 'opacity 0.15s',
  }),
  pill: {
    position: 'absolute',
    top: 0,
    width: '28px',
    height: '3px',
    borderRadius: '2px',
    backgroundColor: '#1E3A8A', // Dark blue for active tab
  },
};

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const isMatch = (pathname, to) => {
    if (to === "/") return pathname === "/" || pathname === "/forum" || pathname.startsWith("/forum/");
    return pathname === to || pathname.startsWith(to + "/");
  };

  return (
    <nav style={styles.nav} className="md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = isMatch(location.pathname, item.path);
        const isHovered = hovered === item.path;
        const Icon = item.icon;
        return (
          <div
            key={item.path}
            style={styles.item}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => setHovered(null)}
          >
            {active && <div style={styles.pill} />}
            <Icon style={styles.icon(active, isHovered)} />
            <span style={styles.label(active, isHovered)}>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
