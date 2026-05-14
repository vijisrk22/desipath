import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareButton from '../../components/ShareButton';
import LikeButton from '../../components/LikeButton';
import ShareIcon from '@mui/icons-material/Share';
import { getFullImageUrl } from '../../utils/imageHelper';
import LazyImage from '../../components/LazyImage';
import { BedOutlined, BathtubOutlined, SquareFoot } from '@mui/icons-material';

export default function PropertyCard({ property, currency, exchangeRates }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (amount, targetCode) => {
    let finalAmount = amount;
    if (exchangeRates && property.currency !== targetCode) {
      const originalRate = exchangeRates[property.currency] || 1;
      const targetRate = exchangeRates[targetCode] || 1;
      finalAmount = (amount / originalRate) * targetRate;
    }
    if (targetCode === 'INR') {
      if (finalAmount >= 10000000) return `₹${(finalAmount / 10000000).toFixed(2)} Cr`;
      if (finalAmount >= 100000) return `₹${(finalAmount / 100000).toFixed(2)} L`;
      return `₹${finalAmount.toLocaleString('en-IN')}`;
    }
    if (targetCode === 'AED') return `AED ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    if (targetCode === 'USD') return `$${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
    return `${targetCode} ${Math.round(Number(finalAmount)).toLocaleString('en-US')}`;
  };

  const displayPrice = formatPrice(property.price, currency?.code || 'USD');
  const mainImage = property.main_image
    ? getFullImageUrl(property.main_image)
    : '/img/placeholder_property.jpg';

  const handleCardClick = () => {
    navigate(`/real-estate/details/${property.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group block bg-white rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full relative cursor-pointer"
      style={{ minHeight: '420px', maxWidth: '380px' }}
    >
      {/* Image Section */}
      <div className="w-full h-[240px] p-2 overflow-hidden shrink-0">
        <LazyImage
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-700"
        />
        {property.property_type && (
          <div className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-10 font-dmsans">
            {property.property_type}
          </div>
        )}
        {property.country && (
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-10 font-dmsans">
            {property.country}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-5 py-4 flex flex-col flex-grow bg-white">
        <div className="text-[#0857d0] text-lg font-bold font-dmsans truncate mb-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </div>

        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-2 text-gray-500">
            <img src="/location.svg" className="w-4 h-4 opacity-70" alt="" />
            <div className="text-xs font-semibold font-dmsans capitalize truncate">
              {property.city}, {property.country}
            </div>
          </div>

          {/* Beds / Baths / Sqft */}
          <div className="flex items-center gap-4 text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <BedOutlined sx={{ fontSize: 15, color: '#94a3b8' }} />
              <span className="text-xs font-semibold font-dmsans">{property.bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <BathtubOutlined sx={{ fontSize: 15, color: '#94a3b8' }} />
              <span className="text-xs font-semibold font-dmsans">{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1">
              <SquareFoot sx={{ fontSize: 15, color: '#94a3b8' }} />
              <span className="text-xs font-semibold font-dmsans">{property.area_sqft} sqft</span>
            </div>
          </div>

          {/* Possession */}
          {property.possession_starts && (
            <div className="flex items-center gap-2 text-gray-500">
              <img src="/calendar.svg" className="w-4 h-4 opacity-70" alt="" />
              <div className="text-xs font-semibold font-dmsans">
                Possession: {property.possession_starts}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="text-gray-800 text-2xl font-bold font-dmsans">
            {displayPrice}
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <ShareButton
              url={`${window.location.origin}/real-estate/details/${property.slug}`}
              IconComponent={ShareIcon}
              iconProps={{ sx: { color: '#0857d0', fontSize: '1.2rem' } }}
              buttonClass="relative bg-white shadow-md w-9 h-9 border border-gray-100 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
            />
            <div className="bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center border border-gray-100 hover:bg-red-50 transition-colors">
              <LikeButton isFavorited={isFavorited} setIsFavorited={setIsFavorited} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
