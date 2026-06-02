import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RideCard from '../../components/Rides/RideCard';
import { toast } from 'react-toastify';

export default function RidesHub() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, commute, event, intercity
  
  useEffect(() => {
    fetchRides();
  }, [filterType]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      let url = 'http://127.0.0.1:8000/api/rides';
      if (filterType !== 'all') {
        url += `?ride_type=${filterType}`;
      }
      const response = await axios.get(url);
      setRides(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error("Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Rides</h1>
            <p className="text-gray-600 mt-1">Casual carpooling notice board. Find or offer shared rides.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to="/rides/post/offer" className="flex-1 md:flex-none text-center bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Offer a Ride
            </Link>
            <Link to="/rides/post/request" className="flex-1 md:flex-none text-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Seek a Ride
            </Link>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Community Notice Board Only</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Desipath does not provide transportation services, verify drivers, guarantee seats, or take responsibility for any rides arranged here. All coordination is between community members directly. Always exercise your own judgment about your safety.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
          {['all', 'commute', 'event', 'intercity'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${filterType === type ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`}
            >
              {type === 'all' ? 'All Rides' : `${type} Rides`}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Active Rides</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rides.length > 0 ? (
            <div className="flex flex-col">
              {rides.map(ride => (
                <RideCard key={ride.ride_id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No rides found</h3>
              <p className="text-gray-500">There are currently no active community rides in this category.</p>
              <div className="mt-6 flex justify-center gap-4">
                <Link to="/rides/post/offer" className="text-[#f15a29] font-medium hover:underline">Post a Ride Offer</Link>
                <span className="text-gray-300">|</span>
                <Link to="/rides/post/request" className="text-[#f15a29] font-medium hover:underline">Post a Ride Request</Link>
              </div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
