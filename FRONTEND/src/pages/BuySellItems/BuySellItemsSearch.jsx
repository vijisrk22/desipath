import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../utils/api';
import { useForm } from 'react-hook-form';
import { BUY_SELL_CATEGORIES } from '../../constants/buySellItemCategories';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationSelectorModal from '../../components/LocationSelectorModal';

const BuySellItemsSearch = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    min_price: '',
    max_price: ''
  });
  const { setValue, watch } = useForm();
  const locationValue = watch('location');
  const [loading, setLoading] = useState(true);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let city = '';
      let zipcode = '';
      if (locationValue) {
        const parts = locationValue.split(',').map(p => p.trim());
        if (parts.length >= 3) {
           city = parts[0];
           zipcode = parts[parts.length - 1];
        } else {
           // Basic fallback
           const lastPart = parts[parts.length - 1];
           if (/\d/.test(lastPart)) zipcode = lastPart;
           else city = parts[0];
        }
      }
      const response = await api.get(`/api/buy-sell-items`, { params: { ...filters, city, zipcode } });
      setItems(Array.isArray(response.data) ? response.data : []);
      if (!Array.isArray(response.data)) {
        console.error("API returned non-array data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [locationValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setFilters({
      category: 'All Categories',
      min_price: '',
      max_price: ''
    });
    setValue('location', '');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50">
      <div className="bg-[#0857d0] text-white pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="text-sm text-blue-200 mb-4 flex items-center">
            <Link to="/" className="hover:text-white hover:underline font-medium">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white font-semibold">Buy/Sell Items</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0 w-full md:w-1/2">
              <h1 className="text-3xl font-bold mb-2">Buy & Sell Items</h1>
              <p className="text-lg text-blue-100 mb-4">Find great deals on new and used items in your area</p>
              
              {/* Location Trigger */}
              <div 
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-white text-gray-800 px-4 py-3 rounded-xl cursor-pointer flex items-center shadow-lg hover:shadow-xl transition-all w-full max-w-sm"
              >
                <svg className="w-5 h-5 text-[#0857d0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className={`flex-1 text-left truncate font-medium ${!locationValue ? 'text-gray-400' : ''}`}>
                  {locationValue || "Enter City, State or Zipcode"}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link to="/buy-sell-items/post" className="bg-white text-[#0857d0] px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Post an Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">Filters</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0]"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option>All Categories</option>
                  {BUY_SELL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0]"
                    value={filters.min_price}
                    onChange={(e) => setFilters({...filters, min_price: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-[#0857d0] focus:border-[#0857d0]"
                    value={filters.max_price}
                    onChange={(e) => setFilters({...filters, max_price: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-[#0857d0] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Search</button>
                <button type="button" onClick={handleReset} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition">Reset</button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Items for Sale</h2>
            <span className="text-gray-500">{items.length} results</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 text-lg mb-4">No items found matching your criteria.</p>
              <button onClick={handleReset} className="text-[#0857d0] hover:underline font-semibold">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <Link to={`/buy-sell-items/details/${item.id}`} key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative h-48 bg-gray-200">
                    {item.pictures && item.pictures.length > 0 ? (
                      <img src={item.pictures[0].startsWith('http') ? item.pictures[0] : `${BASE_URL}${item.pictures[0]}`} className="w-full h-full object-cover" alt={item.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    {item.price && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full font-bold">
                        ${Number(item.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 truncate">{item.category}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{item.condition}</span>
                      <span>{item.city}{item.city && item.state ? ', ' : ''}{item.state}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
      </div>
      
      <LocationSelectorModal 
        open={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onSelectLocation={(loc) => {
          setValue('location', loc);
          setIsLocationModalOpen(false);
        }} 
      />
      
      <Footer newsletter={"block"} />
    </div>
  );
};

export default BuySellItemsSearch;
