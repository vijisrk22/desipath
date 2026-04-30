import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import EventsHeader from "../../components/Events/EventsHeader";
import EventsBody from "../../components/Events/EventsBody";
import EventsSidebarFilter from "../../components/Events/EventsSidebarFilter";
import EventsMobileFilterModal from "../../components/Events/EventsMobileFilterModal";
import EventsMobileSortModal from "../../components/Events/EventsMobileSortModal";

/* ── Filter icon ─────────────────────────────────────────────────────────── */
function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

/* ── Sort icon ───────────────────────────────────────────────────────────── */
function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

function FindEvent({ paths }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen,   setSortOpen]   = useState(false);
  // Sort state lifted here so both mobile modal and desktop SortBy can share it
  const [sortOption, setSortOption] = useState("created_at-desc");

  return (
    <div className="bg-[#f3f5f7] min-h-screen">
      <EventsHeader paths={paths} />

      {/* ── Mobile action bar (Filter + Sort buttons) ─────────────────── */}
      <div className="md:hidden px-4 pb-1 flex justify-end gap-2">
        {/* Filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 text-sm font-semibold hover:shadow-md active:scale-95 transition-all"
        >
          <FilterIcon />
          Filters
        </button>

        {/* Sort button */}
        <button
          onClick={() => setSortOpen(true)}
          aria-label="Open sort options"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 text-sm font-semibold hover:shadow-md active:scale-95 transition-all"
        >
          <SortIcon />
          Sort
        </button>
      </div>

      {/* ── Modals (mobile only) ─────────────────────────────────────── */}
      <EventsMobileFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
      <EventsMobileSortModal
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* ── Content: sidebar (desktop only) + main body ──────────────── */}
      <div className="px-[4%] pt-4 pb-16 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <EventsSidebarFilter />
        </div>

        {/* Right Main Body — receives sort state */}
        <div className="flex-1 w-full">
          <EventsBody sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>

      <Footer bgColor="bg-white" hideOnMobile />
    </div>
  );
}

export default FindEvent;
