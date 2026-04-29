import React from 'react';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageHelper';

const MyListingCard = ({ item, category, onEdit, onDelete, onToggleStatus }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Determine title/location based on item type
    const title = item.course_title || item.event_name || item.type || item.make || item.home_type || "Listing";
    const subTitle = item.location || item.address || `${item.location_city || ''} ${item.location_state || ''}`.trim() || "Local Listing";
    const price = item.price || item.rent || item.deposit_rent || item.course_fee || item.ticket_price;
    const image = item.images?.[0] || item.photos?.[0] || (item.image_1) || (Array.isArray(item.cover_images) ? item.cover_images[0] : null) || null;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all duration-300 group">
            {/* Thumbnail */}
            <div className="w-full sm:w-32 h-32 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                {image ? (
                    <img 
                        src={getFullImageUrl(image)} 
                        alt="thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => e.target.src = "/homesSmpl.png"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl opacity-50">
                        🖼️
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-grow text-center sm:text-left overflow-hidden w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#ffa41c] bg-amber-50 px-2 py-0.5 rounded-full inline-block sm:inline whitespace-nowrap self-center sm:self-auto">
                        {category}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span className="text-gray-400 text-xs font-medium">{formatDate(item.created_at)}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1 font-dmsans">{title}</h3>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-500 text-sm">
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{subTitle}</span>
                </div>
                {price && (
                    <div className="mt-2 text-[#0857d0] font-bold text-lg">
                        {isNaN(parseFloat(price)) ? price : `$${Number(price).toLocaleString()}`}
                        {item.rent_frequency && <span className="text-xs font-medium text-gray-400">/{item.rent_frequency}</span>}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center sm:items-end gap-3 min-w-[120px]">
                {/* Status Toggle */}
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase ${item.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <button
                        onClick={() => onToggleStatus && onToggleStatus(item)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${
                            item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    >
                        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                            item.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEdit(item.id)}
                        className="p-2.5 rounded-xl bg-blue-50 text-[#0857d0] hover:bg-[#0857d0] hover:text-white transition-all transform hover:scale-105"
                        title="Edit Listing"
                    >
                        <EditIcon fontSize="small" />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
                        title="Delete Listing"
                    >
                        <DeleteIcon fontSize="small" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyListingCard;
