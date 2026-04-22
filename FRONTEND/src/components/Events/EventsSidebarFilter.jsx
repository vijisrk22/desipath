import { useState } from "react";
import { useDispatch } from "react-redux";
import { searchEvents } from "../../store/EventsSlice";

const categories = [
  "Workshops", "Comedy Shows", "Music Shows", "Kids",
  "Meetups", "Performances", "Conferences", "Exhibitions",
  "Screening", "Talks"
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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategorySelect = (cat) => {
    let newSelected = [...selectedCategories];
    if (newSelected.includes(cat)) {
      newSelected = newSelected.filter((c) => c !== cat);
    } else {
      newSelected.push(cat);
    }
    setSelectedCategories(newSelected);
    
    // dispatch search (simplified)
    dispatch(searchEvents({
      eventType: newSelected,
      priceMin: 0,
      priceMax: 1000
    }));
  };

  return (
    <div className="w-full bg-white md:bg-transparent md:w-[280px] shrink-0">
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
              <span className={`transform transition-transform ${expandedSections.categories ? 'rotate-180' : ''} text-gray-400 text-sm`}>
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
                  onClick={() => handleCategorySelect(cat)}
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
              <span className={`transform transition-transform ${expandedSections.date ? 'rotate-180' : ''} text-gray-400 text-sm`}>
                ▼
              </span>
              <span className="font-medium text-gray-700">Date</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('languages')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.languages ? 'rotate-180' : ''} text-gray-400 text-sm`}>
                ▼
              </span>
              <span className="font-medium text-gray-700">Languages</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        </div>

        {/* More Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('moreFilters')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.moreFilters ? 'rotate-180' : ''} text-gray-400 text-sm`}>
                ▼
              </span>
              <span className="font-medium text-gray-700">More Filters</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            className="flex justify-between items-center px-4 py-4 cursor-pointer"
            onClick={() => toggleSection('price')}
          >
            <div className="flex items-center gap-2">
              <span className={`transform transition-transform ${expandedSections.price ? 'rotate-180' : ''} text-gray-400 text-sm`}>
                ▼
              </span>
              <span className="font-medium text-gray-700">Price</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsSidebarFilter;
