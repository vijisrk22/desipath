import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MyListings from '../components/User/MyListings';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import api from '../utils/api';

// Static configuration outside component
const categories = [
    { id: 'Rooms', label: "Find Roommate", icon: "👥", postPath: "/services/roommates/postRoom", viewPath: "/profile/myListings", description: "List your space and find the perfect roommate.", countPath: "/api/roommates/my-count" },
    { id: 'Houses', label: "Sell Your Home", icon: "🏡", postPath: "/services/BuyHome/sellHouse", viewPath: "/profile/myListings", description: "Get the best value for your property today.", countPath: "/api/homes/my-count" },
    { id: 'Rental', label: "Rent Out Your Home", icon: "🏠", postPath: "/services/rentalhomes/postRentalHome", viewPath: "/profile/myListings", description: "Find reliable tenants for your rental property.", countPath: "/api/rentalhomes/my-count" },
    { id: 'Cars', label: "Sell Your Car", icon: "🚗", postPath: "/services/cars/sellCar", viewPath: "/profile/myListings", description: "Reach thousands of buyers for your vehicle.", countPath: "/api/cars/my-count" },
    { id: 'Travel', label: "Find Travel Companion", icon: "✈️", postPath: "/travel-companion/post-request", viewPath: "/profile/myListings", description: "Connect with others for your next journey.", countPath: "/api/travelcompanions/my-count" },
    { id: 'Doctor', label: "List my Business - Doctor", icon: "👨‍⚕️", postPath: "/desi-doctors/post", viewPath: "/profile/myListings", description: "Professional business listing for medical services.", countPath: "/api/doctors/my-count" },
    { id: 'Lawyer', label: "List my Business - Desi Attorneys", icon: "⚖️", postPath: "#", comingSoon: true, description: "Professional business listing for legal services." },
    { id: 'Trainings', label: "List my IT Trainings", icon: "💻", postPath: "/it-training/instructor-portal", viewPath: "/profile/myListings", description: "Share your expertise and train the next generation.", countPath: "/api/trainingads/my-count" },
    { id: 'Events', label: "List my Event", icon: "🎟️", postPath: "/services/events/postEvent", viewPath: "/profile/myListings", description: "Promote your events and sell tickets easily.", countPath: "/api/events/my-count" },
    { id: 'KidsClass', label: "Kids Class", icon: "🎨", postPath: "/kids-class/instructor-portal", viewPath: "/profile/myListings", description: "Inspire the next generation with your classes.", countPath: "/api/kids-classes/my-count" },
    { id: 'RealEstate', label: "Real Estate (India/Dubai)", icon: "🏢", postPath: "/real-estate/post", viewPath: "/profile/myListings", description: "List premium residential or commercial properties in India and Dubai.", countPath: "/api/realestate/my-count" },
    { id: 'Photography', label: "Photography & Video", icon: "📸", postPath: "/services/photography/post", viewPath: "/profile/myListings", description: "List your photography or videography services.", countPath: "/api/photography/my-count" },
    { id: 'LocalAds', label: "Post Local Deal", icon: "🏷️", postPath: "/services/Localdeals/post", viewPath: "/profile/myListings", description: "Create a vibrant deal for your local business.", countPath: "/api/local-ads/my-count" },
];

import { fetchAdCounts } from '../store/StatsSlice';

const PostAdPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const { counts, lastFetched, loading } = useSelector((state) => state.stats);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (user?.id) {
            // Stability Guard: Only allow a refresh if it hasn't been fetched in the last 2 seconds.
            // This definitively kills any recursive trigger cycles.
            const now = Date.now();
            if (!loading && (!lastFetched || (now - lastFetched > 2000))) {
                console.log("PostAdPage: Stabilized refresh triggered.");
                dispatch(fetchAdCounts(categories));
            }
        }
    }, [user?.id, dispatch]); // Only depend on User ID stability

    return (
        <div className="bg-[#f8faff] min-h-screen">
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-[#0857d0] text-white py-16 px-[7%] relative overflow-hidden">
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-dmsans tracking-tight">
                        Increase your reach with <span className="text-[#ffa41c]">Desipath</span>
                    </h1>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl font-medium">
                        Post your ad in minutes and connect with thousands of local community members. 
                        Management of your active listings is easier than ever.
                    </p>
                </div>
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
            
            {/* Main Categories Section */}
            <div className="px-[7%] -mt-8 relative z-20 pb-20 max-w-5xl mx-auto">
                <div className="flex flex-col gap-3">
                    {categories.map((cat, idx) => {
                        const isExpanded = expandedId === cat.id;
                        return (
                            <div 
                                key={idx} 
                                className={`bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-[1.01]' : 'hover:bg-gray-50/50 cursor-pointer'}`}
                                onClick={() => !cat.comingSoon && setExpandedId(isExpanded ? null : cat.id)}
                            >
                                {/* Horizontal Bar Header */}
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 font-dmsans">{cat.label}</h3>
                                            {!isExpanded && !cat.comingSoon && user && (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {counts[cat.id] || 0} ACTIVE
                                                    </span>
                                                </div>
                                            )}
                                            {cat.comingSoon && (
                                                <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest border border-amber-100">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {!cat.comingSoon && (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Collapsible Content */}
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking buttons
                                >
                                    <div className="px-5 pb-6 pt-2 ml-16 border-t border-gray-50">
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl">
                                            {cat.description}
                                        </p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link 
                                                to={cat.postPath} 
                                                className="px-8 bg-[#ffa41c] text-center text-gray-900 font-bold py-3 rounded-xl text-sm hover:bg-[#ff9900] transition-all hover:shadow-md active:scale-95"
                                            >
                                                Post New Ad
                                            </Link>
                                            <Link 
                                                to={cat.viewPath} 
                                                className="px-8 bg-white border border-gray-200 text-center text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-all active:scale-95"
                                            >
                                                Manage My Listings
                                            </Link>
                                            
                                            {user && (
                                                <div className="flex-1 flex items-center justify-end px-4">
                                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        <span className="text-xs font-bold uppercase tracking-wider">
                                                            {counts[cat.id] || 0} Active Advertisements
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dashboard / Manage Section */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-2 bg-[#ffa41c] rounded-full"></div>
                        <h2 className="text-3xl font-bold text-gray-900 font-dmsans">Manage Your Active Ads</h2>
                    </div>
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <div className="p-2 sm:p-6 lg:p-10">
                            {user ? (
                                <MyListings />
                            ) : (
                                <div className="text-center py-20 px-6">
                                    <div className="text-6xl mb-6">🔒</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Please Login to Manage Ads</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You need to be logged in to view, edit, or delete your previously posted advertisements.</p>
                                    <Link to="/login" className="px-10 py-3 bg-[#0857d0] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-block text-sm">
                                        Login Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Help Section */}
            <div className="bg-gray-900 text-white py-16 px-[7%]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold font-dmsans mb-4">Need help with your listing?</h2>
                        <p className="text-gray-400">Our support team is available 24/7 to help you get the most out of your Desipath advertisements.</p>
                    </div>
                    <Link to="/contact" className="px-10 py-4 border-2 border-white/20 rounded-2xl hover:bg-white hover:text-gray-900 transition-all font-bold">
                        Contact Support
                    </Link>
                </div>
            </div>

            <Footer newsletter={"block"} hideOnMobile />
        </div>
    );
};

export default PostAdPage;
