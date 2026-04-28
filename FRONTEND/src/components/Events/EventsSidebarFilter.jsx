import { useState } from "react";
import { useDispatch } from "react-redux";
import { searchEvents } from "../../store/EventsSlice";

const categories = [
  "Workshops", "Comedy Shows", "Music Shows", "Kids",
  "Meetups", "Performances", "Conferences", "Exhibitions",
  "Screening", "Talks"
];

const languages = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", 
  "Malayalam", "Bengali", "Hinglish", "Manipuri", "Marathi", "Japanese"
];

const moreExtras = [
  "Outdoor Events", "Fast Filling", "Must Attend", "Kids Allowed", "Unmissable Events",
  "Online Streaming", "Kids Activities", "New Year Parties"
];

const priceRanges = [
  { label: "Free", min: 0, max: 0 },
  { label: "0 - 500", min: 0, max: 500 },
  { label: "501 - 2000", min: 501, max: 2000 },
  { label: "Above 2000", min: 2001, max: 100000 },
];

function EventsSidebarFilter() {
  const dispatch = useDispatch();

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    date: false,
    languages: false,
    moreFilters: false,
    price: false,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [isDateRangeActive, setIsDateRangeActive] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedMoreFilters, setSelectedMoreFilters] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterUpdate = (type, value) => {
    let newCats = selectedCategories;
    let newLangs = selectedLanguages;
    let newMore = selectedMoreFilters;
    let newDate = selectedDateFilter;
    let newPrice = selectedPriceRange;

    if (type === 'category') {
      newCats = newCats.includes(value) ? newCats.filter(c => c !== value) : [...newCats, value];
      setSelectedCategories(newCats);
    } else if (type === 'language') {
      newLangs = newLangs.includes(value) ? newLangs.filter(l => l !== value) : [...newLangs, value];
      setSelectedLanguages(newLangs);
    } else if (type === 'more') {
      newMore = newMore.includes(value) ? newMore.filter(m => m !== value) : [...newMore, value];
      setSelectedMoreFilters(newMore);
    } else if (type === 'date') {
      newDate = newDate === value ? null : value;
      setSelectedDateFilter(newDate);
    } else if (type === 'price') {
      newPrice = newPrice?.label === value.label ? null : value;
      setSelectedPriceRange(newPrice);
    }

    dispatch(searchEvents({
      eventType: newCats,
      language: newLangs,
      filters: newMore,
      dateFilter: newDate,
      priceMin: newPrice ? newPrice.min : 0,
      priceMax: newPrice ? newPrice.max : 1000000
    }));
  };

  return (
    <div className="w-full bg-white md:bg-transparent md:w-[280px] shrink-0 pb-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 font-dmsans">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => toggleSection('categories')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.categories ? 'rotate-180' : ''} text-gray-400 text-xs`}>
                ▼
              </span>
              <span className={`font-medium ${expandedSections.categories ? 'text-red-500' : 'text-gray-700'}`}>Categories</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          
          {expandedSections.categories && (
            <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterUpdate('category', cat)}
                  className={`px-3 py-1.5 text-sm border font-medium transition-colors ${
                    selectedCategories.includes(cat) 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('date')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.date ? 'rotate-180' : ''} text-gray-400 text-xs`}>
                ▼
              </span>
              <span className={`font-medium ${expandedSections.date ? 'text-red-500' : 'text-gray-700'}`}>Date</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          {expandedSections.date && (
            <div className="px-4 pb-4 pt-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {["Today", "Tomorrow", "This Weekend"].map(d => (
                  <button
                    key={d}
                    onClick={() => handleFilterUpdate('date', d)}
                    className={`px-4 py-2 text-sm border font-medium transition-colors ${
                      selectedDateFilter === d 
                        ? 'border-red-500 text-red-500 bg-red-50' 
                        : 'border-gray-200 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  id="dateRange"
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4" 
                  checked={isDateRangeActive}
                  onChange={(e) => setIsDateRangeActive(e.target.checked)}
                />
                <label htmlFor="dateRange" className="cursor-pointer">Date Range</label>
              </div>
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('languages')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.languages ? 'rotate-180' : ''} text-gray-400 text-xs`}>
                ▼
              </span>
              <span className={`font-medium ${expandedSections.languages ? 'text-red-500' : 'text-gray-700'}`}>Languages</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          {expandedSections.languages && (
            <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleFilterUpdate('language', lang)}
                  className={`px-4 py-2 text-sm border font-medium transition-colors ${
                    selectedLanguages.includes(lang) 
                      ? 'border-red-500 text-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-200 text-red-500 hover:bg-red-50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* More Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('moreFilters')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.moreFilters ? 'rotate-180' : ''} text-gray-400 text-xs`}>
                ▼
              </span>
              <span className={`font-medium ${expandedSections.moreFilters ? 'text-red-500' : 'text-gray-700'}`}>More Filters</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          {expandedSections.moreFilters && (
            <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
              {moreExtras.map(extra => (
                <button
                  key={extra}
                  onClick={() => handleFilterUpdate('more', extra)}
                  className={`px-4 py-2 text-sm border font-medium transition-colors ${
                    selectedMoreFilters.includes(extra) 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-200 text-red-500 hover:bg-red-50'
                  }`}
                >
                  {extra}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('price')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.price ? 'rotate-180' : ''} text-gray-400 text-xs`}>
                ▼
              </span>
              <span className={`font-medium ${expandedSections.price ? 'text-red-500' : 'text-gray-700'}`}>Price</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          {expandedSections.price && (
            <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => handleFilterUpdate('price', range)}
                  className={`px-4 py-2 text-sm border font-medium transition-colors ${
                    selectedPriceRange?.label === range.label 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-200 text-red-500 hover:bg-red-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsSidebarFilter;
