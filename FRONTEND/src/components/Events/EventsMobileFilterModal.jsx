import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { searchEvents } from "../../store/EventsSlice";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const categories = [
  "Workshops", "Comedy Shows", "Music Shows", "Kids",
  "Meetups", "Performances", "Conferences", "Exhibitions",
  "Screening", "Talks",
];
const languages = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Malayalam", "Bengali", "Hinglish", "Manipuri", "Marathi", "Japanese",
];
const moreExtras = [
  "Outdoor Events", "Fast Filling", "Must Attend", "Kids Allowed",
  "Unmissable Events", "Online Streaming", "Kids Activities", "New Year Parties",
];
const priceRanges = [
  { label: "Free",       min: 0,    max: 0      },
  { label: "0 – 500",   min: 0,    max: 500    },
  { label: "501 – 2000", min: 501,  max: 2000   },
  { label: "Above 2000", min: 2001, max: 100000 },
];

/* ─── FilterSection accordion ───────────────────────────────────────────── */
function FilterSection({ title, open, onToggle, onClear, children }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className="flex justify-between items-center px-5 py-3 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] text-gray-400 transition-transform duration-200 inline-block ${open ? "rotate-180" : ""}`}
          >▼</span>
          <span className={`text-sm font-semibold ${open ? "text-red-500" : "text-gray-700"}`}>
            {title}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
      {open && <div className="px-5 pb-4 pt-1">{children}</div>}
    </div>
  );
}

/* ─── Main modal ────────────────────────────────────────────────────────── */
export default function EventsMobileFilterModal({ open, onClose }) {
  const dispatch = useDispatch();
  const sheetRef = useRef(null);

  const [sections, setSections] = useState({
    categories: true, date: false, languages: false, more: false, price: false,
  });
  const [selCats,    setSelCats]    = useState([]);
  const [selDate,    setSelDate]    = useState(null);
  const [selLangs,   setSelLangs]   = useState([]);
  const [selMore,    setSelMore]    = useState([]);
  const [selPrice,   setSelPrice]   = useState(null);
  const [dateRange,  setDateRange]  = useState(false);

  /* lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* close on outside tap */
  const handleBackdropClick = (e) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose();
  };

  const toggle = (key) => setSections(s => ({ ...s, [key]: !s[key] }));

  const dispatch_ = (newCats, newLangs, newMore, newDate, newPrice) => {
    dispatch(searchEvents({
      eventType:   newCats,
      language:    newLangs,
      filters:     newMore,
      dateFilter:  newDate,
      priceMin:    newPrice ? newPrice.min : 0,
      priceMax:    newPrice ? newPrice.max : 1_000_000,
    }));
  };

  const toggleCat   = (v) => { const n = selCats.includes(v) ? selCats.filter(c=>c!==v) : [...selCats,v]; setSelCats(n); dispatch_(n,selLangs,selMore,selDate,selPrice); };
  const toggleLang  = (v) => { const n = selLangs.includes(v) ? selLangs.filter(l=>l!==v) : [...selLangs,v]; setSelLangs(n); dispatch_(selCats,n,selMore,selDate,selPrice); };
  const toggleMore  = (v) => { const n = selMore.includes(v) ? selMore.filter(m=>m!==v) : [...selMore,v]; setSelMore(n); dispatch_(selCats,selLangs,n,selDate,selPrice); };
  const toggleDate  = (v) => { const n = selDate===v ? null : v; setSelDate(n); dispatch_(selCats,selLangs,selMore,n,selPrice); };
  const togglePrice = (v) => { const n = selPrice?.label===v.label ? null : v; setSelPrice(n); dispatch_(selCats,selLangs,selMore,selDate,n); };

  const clearAll = () => {
    setSelCats([]); setSelDate(null); setSelLangs([]); setSelMore([]); setSelPrice(null);
    dispatch_([], [], [], null, null);
  };

  const activeCount = selCats.length + selLangs.length + selMore.length + (selDate?1:0) + (selPrice?1:0);

  const pill = (label, active, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs border rounded-full font-medium transition-colors ${
        active ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-600 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] md:hidden flex items-start"
      onMouseDown={handleBackdropClick}
      onTouchStart={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      {/* Top sheet */}
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-b-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: "82vh" }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-800 font-dmsans">Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={clearAll} className="text-sm text-red-500 font-semibold hover:underline">
              Clear All
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">

          {/* Categories */}
          <FilterSection title="Categories" open={sections.categories} onToggle={() => toggle("categories")} onClear={() => { setSelCats([]); dispatch_([],selLangs,selMore,selDate,selPrice); }}>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => pill(cat, selCats.includes(cat), () => toggleCat(cat)))}
            </div>
          </FilterSection>

          {/* Date */}
          <FilterSection title="Date" open={sections.date} onToggle={() => toggle("date")} onClear={() => { setSelDate(null); dispatch_(selCats,selLangs,selMore,null,selPrice); }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Today", "Tomorrow", "This Weekend"].map(d => pill(d, selDate===d, () => toggleDate(d)))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-red-500 w-4 h-4"
                checked={dateRange}
                onChange={e => setDateRange(e.target.checked)}
              />
              Date Range
            </label>
          </FilterSection>

          {/* Languages */}
          <FilterSection title="Languages" open={sections.languages} onToggle={() => toggle("languages")} onClear={() => { setSelLangs([]); dispatch_(selCats,[],selMore,selDate,selPrice); }}>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => pill(lang, selLangs.includes(lang), () => toggleLang(lang)))}
            </div>
          </FilterSection>

          {/* More Filters */}
          <FilterSection title="More Filters" open={sections.more} onToggle={() => toggle("more")} onClear={() => { setSelMore([]); dispatch_(selCats,selLangs,[],selDate,selPrice); }}>
            <div className="flex flex-wrap gap-2">
              {moreExtras.map(e => pill(e, selMore.includes(e), () => toggleMore(e)))}
            </div>
          </FilterSection>

          {/* Price */}
          <FilterSection title="Price" open={sections.price} onToggle={() => toggle("price")} onClear={() => { setSelPrice(null); dispatch_(selCats,selLangs,selMore,selDate,null); }}>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map(r => pill(r.label, selPrice?.label===r.label, () => togglePrice(r)))}
            </div>
          </FilterSection>

        </div>

        {/* Apply button */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 pb-6"
        >
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#0857d0] hover:bg-[#0746a8] active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition-all"
          >
            Show Results {activeCount > 0 && `(${activeCount} filter${activeCount > 1 ? "s" : ""} applied)`}
          </button>
        </div>
      </div>
    </div>
  );
}
