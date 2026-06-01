import { useEffect, useRef } from "react";

const SORT_OPTIONS = [
  { value: "created_at-desc", label: "Newest Listing",      icon: "🆕" },
  { value: "price-asc",       label: "Price: Low to High",  icon: "↑" },
  { value: "price-desc",      label: "Price: High to Low",  icon: "↓" },
];

export default function EventsMobileSortModal({ open, onClose, sortOption, setSortOption }) {
  const sheetRef = useRef(null);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleBackdropClick = (e) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose();
  };

  const handleSelect = (value) => {
    setSortOption(value);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] md:hidden flex items-end"
      onMouseDown={handleBackdropClick}
      onTouchStart={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-3xl shadow-2xl"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-base font-bold text-gray-800 font-dmsans">Sort By</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        {/* Options */}
        <div className="px-4 py-3 space-y-2">
          {SORT_OPTIONS.map((opt) => {
            const active = sortOption === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-sm font-semibold font-dmsans transition-all active:scale-[0.98] ${
                  active
                    ? "border-[#0857d0] bg-blue-50 text-[#0857d0]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-base ${active ? "text-[#0857d0]" : "text-gray-400"}`}>
                  {active ? "✓" : opt.icon}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom safe area spacer */}
        <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  );
}
