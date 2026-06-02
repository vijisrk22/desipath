import React from 'react';
import { Link } from 'react-router-dom';
import { getFullImageUrl } from '../../utils/imageHelper';

export default function RideCard({ ride }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'commute': return 'bg-green-500';
      case 'event': return 'bg-purple-500';
      case 'intercity': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getPostTypeBadge = (postType) => {
    if (postType === 'offering') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">Offering Ride</span>;
    }
    return <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full text-sm">Seeking Ride</span>;
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-sm border border-gray-200 p-5 pl-6 overflow-hidden flex flex-col md:flex-row gap-4 mb-4 hover:shadow-md transition-shadow`}>
      {/* Left border indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(ride.ride_type)}`} />
      
      {/* Avatar column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <Link to={`/profile/${ride.poster?.id}`} className="block">
          {ride.poster?.profile_photo ? (
            <img 
              src={getFullImageUrl(ride.poster?.profile_photo)} 
              alt={ride.poster?.name} 
              className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ 
              display: ride.poster?.profile_photo ? 'none' : 'flex',
              backgroundColor: `hsl(${(ride.poster?.name?.charCodeAt(0) || 0) * 137.5 % 360}, 70%, 50%)`
            }}
          >
            {ride.poster?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        </Link>
        <span className="text-xs font-medium text-gray-600 mt-2 truncate w-16 text-center">{ride.poster?.name}</span>
      </div>

      {/* Content column */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 pr-4">{ride.title}</h3>
          <div className="flex-shrink-0">
            {getPostTypeBadge(ride.post_type)}
          </div>
        </div>

        {/* Route Details */}
        <div className="flex items-center text-gray-700 font-medium mb-3 text-sm">
          <span className="truncate max-w-[40%]">{ride.from_city} {ride.from_state && `, ${ride.from_state}`}</span>
          <span className="mx-2 text-gray-400">→</span>
          <span className="truncate max-w-[40%]">{ride.to_city} {ride.to_state && `, ${ride.to_state}`}</span>
        </div>

        {/* Dynamic fields based on type */}
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          {ride.ride_type === 'commute' && (
            <p><strong>Schedule:</strong> {Array.isArray(ride.schedule_days_json) ? ride.schedule_days_json.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ') : 'Daily'} at {ride.departure_time}</p>
          )}
          {ride.ride_type === 'event' && (
            <p><strong>Date:</strong> {new Date(ride.trip_date).toLocaleDateString()} at {ride.departure_time}</p>
          )}
          {ride.ride_type === 'intercity' && (
            <p><strong>Date:</strong> {new Date(ride.trip_date).toLocaleDateString()} at {ride.departure_time}</p>
          )}
        </div>

        {/* Footer info pills */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className={`px-2 py-1 rounded-md font-medium ${ride.post_type === 'offering' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {ride.seats} {ride.post_type === 'offering' ? 'seats offered' : 'seats needed'}
          </span>
          
          {ride.gender_preference && ride.gender_preference !== 'any' && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
              {ride.gender_preference === 'women_only' ? 'Women only' : 'Men only'}
            </span>
          )}
          
          {ride.fuel_sharing === 'yes' && (
            <span className="text-gray-500 italic">Sharing gas cost</span>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col justify-between items-end min-w-[120px]">
        <span className="text-xs text-gray-400 mb-2 whitespace-nowrap">
          Posted {new Date(ride.created_at).toLocaleDateString()}
        </span>
        <Link 
          to={`/rides/${ride.ride_type}/${ride.slug}`}
          className="mt-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:from-blue-600 hover:to-blue-800 transition-all text-center w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
