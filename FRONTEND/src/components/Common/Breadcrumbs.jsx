import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── Friendly label map ───────────────────────────────────────────────────────
// Maps URL segments → human-readable labels.
// Wildcards (dynamic IDs like UUIDs / numeric IDs) fall back to auto-titling.
const SEGMENT_LABELS = {
  // Top-level
  'services':               null,           // hidden from breadcrumb
  'login':                  'Login',
  'register':               'Register',
  'postad':                 'Post Ad',
  'aboutus':                'About Us',
  'contact':                'Contact',
  'inbox':                  'Inbox',
  'profile':                'Profile',
  'edtprofile':             'Edit Profile',
  'mylistings':             'My Listings',

  // Marketplace modules
  'roommates':              'Roommates',
  'buyhome':                'Buy / Sell House',
  'rentalhomes':            'Rental Homes',
  'cars':                   'Cars',
  'events':                 'Events',
  'ittrainings':            'IT Trainings',
  'astrologyads':           'Astrology Ads',
  'classesforkids':         'Classes for Kids',
  'localdeals':             'Local Deals',

  // IT Training
  'it-training':            'IT Training',
  'instructor-portal':      'Instructor Portal',
  'success':                'Success',
  'details':                null,           // skip; next segment is the ID

  // Kids Class
  'kids-class':             'Kids Class',

  // Travel Companion
  'travel-companion':       'Travel Companion',
  'post-request':           'Post Request',
  'post-volunteer':         'Post Volunteer',
  'browse-volunteers':      'Browse Volunteers',
  'browse-requests':        'Browse Requests',
  'my-posts':               'My Posts',
  'post-success':           'Post Success',
  'guidelines':             'Guidelines',

  // Admin
  'admindashboard':         'Admin Dashboard',
  'users':                  'Users',
  'categories':             'Categories',
  'rental-homes':           'Rental Homes',
  'kids-class-admin':       'Kids Class',
  'local-ads':              'Local Ads',
  'zipcodes':               'Zipcodes',
  'trainings':              'Trainings',
  'travel':                 'Travel',
  'houses':                 'Houses',
};

// Segments that look like IDs (all-numeric or UUID) – skip them
const isId = (seg) => /^\d+$/.test(seg) || /^[0-9a-f-]{32,}$/i.test(seg);

// Segments we should completely omit from the trail
const SKIP_SEGMENTS = new Set(['services', 'details', 'action']);

// Pages where breadcrumbs should be hidden entirely
const HIDDEN_ON = [
  '/',
  '/login',
  '/register',
];

function getLabel(segment) {
  const key = segment.toLowerCase();
  if (SEGMENT_LABELS[key] !== undefined) return SEGMENT_LABELS[key]; // may be null → skip
  // Auto-capitalize hyphenated slugs
  return segment
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── ChevronIcon ─────────────────────────────────────────────────────────────
const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    style={{ width: 14, height: 14, color: '#cbd5e1', flexShrink: 0 }}
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

// ─── HomeIcon ─────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    style={{ width: 15, height: 15 }}
  >
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
const Breadcrumbs = () => {
  const location = useLocation();
  const rawSegments = location.pathname.split('/').filter(Boolean);

  // Hide on home / auth pages
  if (HIDDEN_ON.includes(location.pathname)) return null;

  // Build crumbs: filter, label, accumulate path
  const crumbs = [];
  let accPath = '';

  for (let i = 0; i < rawSegments.length; i++) {
    const seg = rawSegments[i];
    const key = seg.toLowerCase();

    // Skip numeric / UUID IDs and explicitly skipped segments
    if (isId(seg) || SKIP_SEGMENTS.has(key)) continue;

    const label = getLabel(seg);
    // null label means the segment is invisible in the trail
    if (label === null) continue;

    accPath += `/${seg}`;
    crumbs.push({ label, to: accPath });
  }

  // Nothing meaningful to show
  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          padding: '8px 7%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
        }}
      >
        {/* Home */}
        <Link
          to="/"
          aria-label="Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <HomeIcon />
          Home
        </Link>

        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.to}>
              <ChevronIcon />
              {isLast ? (
                <span
                  aria-current="page"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#1e40af',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
