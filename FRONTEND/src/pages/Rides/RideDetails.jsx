import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getFullImageUrl } from '../../utils/imageHelper';
import { toast } from 'react-toastify';

export default function RideDetails() {
  const { slug } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRideDetails();
  }, [slug]);

  const fetchRideDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/rides/${slug}`);
      setRide(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      toast.error("Ride not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Ride not found</h2>
          <Link to="/rides" className="text-[#f15a29] hover:underline">Back to Rides</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/rides" className="text-[#f15a29] hover:underline font-medium flex items-center mb-6">
          ← Back to Community Rides
        </Link>

        {/* Legal Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> Desipath is not a transportation provider. Connect and ride at your own risk. Do not transfer funds upfront.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 text-white flex justify-between items-center bg-[#0857d0]">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {ride.ride_type} • {ride.post_type}
              </span>
              <h1 className="text-2xl font-bold mt-3">{ride.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">From</p>
                  <p className="font-bold text-gray-900">{ride.from_location_text}</p>
                  <p className="text-gray-600">{ride.from_city}, {ride.from_state}</p>
                </div>
                <div className="text-3xl text-gray-300">→</div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">To</p>
                  <p className="font-bold text-gray-900">{ride.to_location_text}</p>
                  <p className="text-gray-600">{ride.to_city}, {ride.to_state}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Schedule / Date</p>
                  <p className="font-medium text-gray-900">
                    {ride.ride_type === 'commute' 
                      ? (Array.isArray(ride.schedule_days_json) ? ride.schedule_days_json.join(', ') : 'Daily') 
                      : new Date(ride.trip_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Departure Time</p>
                  <p className="font-medium text-gray-900">{ride.departure_time || 'Flexible'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Ride Details</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex justify-between">
                    <span>Seats {ride.post_type === 'offering' ? 'Available' : 'Needed'}:</span>
                    <span className="font-medium">{ride.seats}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Fuel Cost Sharing:</span>
                    <span className="font-medium capitalize">{ride.fuel_sharing}</span>
                  </li>
                  {ride.gender_preference && ride.gender_preference !== 'any' && (
                    <li className="flex justify-between">
                      <span>Preference:</span>
                      <span className="font-medium capitalize">{ride.gender_preference.replace('_', ' ')}</span>
                    </li>
                  )}
                </ul>
              </div>

              {ride.notes && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Additional Notes</h3>
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {ride.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar / Poster Info */}
            <div className="md:w-1/3 flex flex-col gap-4">
              <div className="border border-blue-200 rounded-lg p-5 flex flex-col items-center text-center bg-blue-50 shadow-sm">
                <Link to={`/profile/${ride.poster?.id}`}>
                  {ride.poster?.profile_photo ? (
                    <img 
                      src={getFullImageUrl(ride.poster.profile_photo)} 
                      alt={ride.poster.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md mb-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md mb-3 border-2 border-white mx-auto"
                    style={{ 
                      display: ride.poster?.profile_photo ? 'none' : 'flex',
                      backgroundColor: `hsl(${(ride.poster?.name?.charCodeAt(0) || 0) * 137.5 % 360}, 70%, 50%)`
                    }}
                  >
                    {ride.poster?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                </Link>
                <h3 className="font-bold text-lg text-gray-900">{ride.poster?.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Joined {new Date(ride.poster?.created_at).getFullYear()}</p>
                
                <button 
                  onClick={() => toast.info("Connect flow coming in Phase 2!")}
                  className="w-full bg-green-700 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  Connect with {ride.poster?.name?.split(' ')[0] || 'User'}
                </button>
                <p className="text-xs text-gray-400 mt-2">Via Desipath Chat</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
