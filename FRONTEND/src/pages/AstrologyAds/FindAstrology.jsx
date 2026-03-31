import { useState, useEffect } from "react";
import ServiceTopBar from "../../components/ServiceTopBar";

export default function FindAstrology() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL 
      ? `${import.meta.env.VITE_BACKEND_URL}/api/astrologyads` 
      : "http://127.0.0.1:8000/api/astrologyads";
      
    fetch(url, { headers: { Accept: "application/json" } })
      .then(res => res.json())
      .then(data => {
         // handle if the API returns {data: [...]} or just [...]
         if (Array.isArray(data)) setAds(data);
         else if (data && Array.isArray(data.data)) setAds(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  const paths = [
    { text: "Home", eP: "/" },
    { text: "Astrology Ads", eP: "/services/astrologyAds" },
    { text: "Find Astrologer", eP: "/services/astrologyAds/findAstrologer" },
  ];

  return (
    <div className="bg-[#f3f5f7] min-h-[70vh]">
      <ServiceTopBar inputs={["location"]} title="Find Astrologers" paths={paths} />
      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {ads.length > 0 ? ads.map(ad => (
          <div key={ad.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800">{ad.astrologer_type} Astrologer</h3>
            <p className="text-gray-500 font-medium">{ad.city}, {ad.state}</p>
            <p className="text-gray-600 mt-3 line-clamp-3 text-sm">{ad.description}</p>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-blue-700 font-bold">${ad.price}</span>
            </div>
          </div>
        )) : <p className="col-span-3 text-center text-gray-500 py-10">No astrologers found.</p>}
      </div>
    </div>
  );
}
