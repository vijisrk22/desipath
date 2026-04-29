import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BackWithHeader from "./BackWithHeader";
import MyListingCard from "./MyListingCard";

// Imports for Redux Actions
import { fetchRooms, deleteRoom, updateRoom } from "../../store/RoommatesSlice";
import { fetchCars, deleteCar, updateCar } from "../../store/CarsSlice";
import { fetchTravelCompanions, fetchTravelers, deleteTravelCompanion, updateTravelCompanion } from "../../store/TravelCompanionSlice";
import { fetchRentalHomes, deleteRentalHome, updateRentalHome } from "../../store/RentalHomesSlice";
import { fetchEvents, deleteEvent, updateEvent } from "../../store/EventsSlice";
import { fetchTrainings, deleteTraining, updateTraining } from "../../store/ITTrainingsSlice";
import { deleteHouse, updateHouse } from "../../store/HousesSlice";

// Imports for Edit Modals
import EditRoomPostModal from "../Roommates/EditRoomPostModal";
import EditCarPostModal from "../BuySellCar/EditCarPostModal";
import EditRentalHomePostModal from "../RentalHome/EditRentalHomePostModal";
import EditEventPostModal from "../Events/EditEventPostModal";
import EditTrainingPostModal from "../ITTrainings/EditTrainingPostModal";
import Loader from '../Loader';
import api from '../../utils/api';

const MyListings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabData, setTabData] = useState({}); // Cache per tab
    
    // Edit Modal States
    const [reviewSession, setReviewSession] = useState(false);
    const [formDetails, setFormDetails] = useState(null);
    const [currentEditConfig, setCurrentEditConfig] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const categories = [
        { id: 'Houses', label: 'Sell home', icon: '🏡', listPath: '/api/homes/my-listings', del: deleteHouse, upd: updateHouse, redirect: '/services/BuyHome/edit' },
        { id: 'Rooms', label: 'Roommates', icon: '👥', listPath: '/api/roommates/my-listings', del: deleteRoom, upd: updateRoom, modal: EditRoomPostModal },
        { id: 'Cars', label: 'Cars', icon: '🚗', listPath: '/api/cars/my-listings', del: deleteCar, upd: updateCar, modal: EditCarPostModal },
        { id: 'Rental', label: 'Rental Homes', icon: '🏠', listPath: '/api/rentalhomes/my-listings', del: deleteRentalHome, upd: updateRentalHome, modal: EditRentalHomePostModal },
        { id: 'Travel', label: 'Travel', icon: '✈️', listPath: '/api/travelcompanions/my-listings', del: deleteTravelCompanion, upd: updateTravelCompanion },
        { id: 'Trainings', label: 'Trainings', icon: '💻', listPath: '/api/trainingads/my-listings', del: deleteTraining, upd: updateTraining, modal: EditTrainingPostModal },
        { id: 'Events', label: 'Events', icon: '🎟️', listPath: '/api/events/my-listings', del: deleteEvent, upd: updateEvent, redirect: '/services/events/edit' },
    ];

    const fetchCategoryData = async (catId) => {
        if (!user || !catId) return;
        const cat = categories.find(c => c.id === catId);
        if (!cat) return;

        setLoading(true);
        try {
            const response = await api.get(cat.listPath);
            const data = response.data || [];
            
            // Backend returns already filtered list
            const formatted = data.map(item => ({
                ...item,
                _categoryType: cat.label,
                _catId: cat.id,
                _config: cat
            }));
            
            setTabData(prev => ({ ...prev, [catId]: formatted }));
        } catch (error) {
            console.error(`Error fetching ${catId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (catId) => {
        setActiveTab(catId);
        if (!tabData[catId]) {
            fetchCategoryData(catId);
        }
    };

    const navigate = useNavigate();
    const handleEdit = (item) => {
        if (item._config.redirect) {
            navigate(`${item._config.redirect}/${item.id}`);
            return;
        }
        setFormDetails(item);
        setCurrentEditConfig(item._config);
        setReviewSession(true);
    };

    const handleDelete = async (item) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            await dispatch(item._config.del(item.id));
            fetchCategoryData(item._catId); // Refresh only this tab
        }
    };

    const handleToggleStatus = async (item) => {
        const newStatus = item.status === 'active' ? 'inactive' : 'active';
        
        // Optimistic UI Update: Instantly change status in local state for smoothness
        const previousData = tabData[activeTab];
        const updatedData = previousData.map(listing => 
            listing.id === item.id ? { ...listing, status: newStatus } : listing
        );
        setTabData(prev => ({ ...prev, [activeTab]: updatedData }));

        try {
            const idKey = item._catId.toLowerCase() === 'houses' ? 'houseId' : 
                         item._catId.toLowerCase() === 'cars' ? 'carId' :
                         item._catId.toLowerCase() === 'rooms' ? 'roomId' :
                         item._catId.toLowerCase() === 'rental' ? 'rentalHomeId' :
                         item._catId.toLowerCase() === 'travel' ? 'companionId' :
                         item._catId.toLowerCase() === 'events' ? 'eventId' :
                         item._catId.toLowerCase() === 'trainings' ? 'trainingId' : 'id';
            
            const dataKey = item._catId.toLowerCase() === 'houses' ? 'houseData' :
                           item._catId.toLowerCase() === 'cars' ? 'carData' :
                           item._catId.toLowerCase() === 'rooms' ? 'roomData' :
                           item._catId.toLowerCase() === 'rental' ? 'rentalHomeData' :
                           item._catId.toLowerCase() === 'travel' ? 'companionData' :
                           item._catId.toLowerCase() === 'events' ? 'eventData' :
                           item._catId.toLowerCase() === 'trainings' ? 'trainingData' : 'data';

            await dispatch(item._config.upd({ 
                [idKey]: item.id, 
                [dataKey]: { status: newStatus } 
            }));
            showToast('Listing updated', 'success');
            // We don't call fetchCategoryData here to keep the experience smooth and flicker-free
        } catch (error) {
            // Revert on failure
            setTabData(prev => ({ ...prev, [activeTab]: previousData }));
            console.error("Failed to toggle status:", error);
            showToast('Failed to update listing', 'error');
        }
    };

    const currentListings = activeTab ? (tabData[activeTab] || []) : [];

    return (
        <div className="bg-[#f8f9fa] min-h-[400px] flex flex-col items-center justify-start py-10">
             <div className="max-w-screen-xl w-full px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-800 font-dmsans">Select a Category to Manage</h3>
                    <p className="text-gray-400 text-sm">Listings will be loaded only when you select a tab.</p>
                </div>
                
                <div className="mb-10 flex flex-wrap gap-3 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleTabClick(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                                activeTab === cat.id 
                                ? 'bg-[#0857d0] text-white shadow-lg shadow-blue-200 scale-105' 
                                : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600'
                            }`}
                        >
                            <span className="text-lg">{cat.icon}</span>
                            {cat.label}
                            {tabData[cat.id] && (
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                                    {tabData[cat.id].length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto min-h-[200px] relative">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader />
                        </div>
                    ) : activeTab ? (
                        currentListings.length > 0 ? (
                            currentListings.map((item) => (
                                <MyListingCard 
                                    key={`${item._catId}-${item.id}`}
                                    item={item}
                                    category={item._categoryType}
                                    onEdit={() => handleEdit(item)}
                                    onDelete={() => handleDelete(item)}
                                    onToggleStatus={() => handleToggleStatus(item)}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                                <div className="text-5xl mb-4 opacity-20">📭</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 font-dmsans">No Active Listings</h3>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                    You haven't posted any advertisements in the {categories.find(c => c.id === activeTab)?.label} category.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-10 opacity-40">
                             <div className="text-6xl mb-4">👆</div>
                             <p className="font-bold text-gray-400">Click a tab above to view your listings</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal Controller */}
            {reviewSession && currentEditConfig?.modal && (
                <currentEditConfig.modal
                    open={reviewSession}
                    onClose={() => {
                        setReviewSession(false);
                        fetchCategoryData(activeTab);
                    }}
                    formDetails={formDetails}
                    editFunc={currentEditConfig.upd}
                />
            )}

            {/* Custom Toast Notification */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-10 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-white border-green-500 shadow-green-100' : 'bg-white border-red-500 shadow-red-100'}`}>
                        <span className={`text-2xl ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {toast.type === 'success' ? '✅' : '🚨'}
                        </span>
                        <p className="font-bold text-gray-800 font-dmsans">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyListings;
