import { useState } from "react";
import { useDispatch } from "react-redux";
import { searchEvents } from "../../store/EventsSlice";

const categories = [
  "Workshops", "Comedy Shows", "Music Shows", "Kids",
  "Meetups", "Performances", "Conferences", "Exhibitions",
  "Screening", "Talks"
];

function EventsCategoryPills() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handlePillClick = (cat) => {
    const newSelected = selectedCategory === cat ? null : cat;
    setSelectedCategory(newSelected);
    dispatch(searchEvents({
      eventType: newSelected ? [newSelected] : [],
      priceMin: 0,
      priceMax: 1000
    }));
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handlePillClick(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selectedCategory === cat 
            ? 'bg-red-500 text-white border-red-500' 
            : 'bg-white text-red-400 border-red-200 hover:bg-red-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default EventsCategoryPills;
