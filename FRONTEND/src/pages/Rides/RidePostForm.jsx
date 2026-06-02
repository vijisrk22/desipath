import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';

export default function RidePostForm({ postType: initialPostType, mode = 'post' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [rideType, setRideType] = useState('commute');
  const [postType, setPostType] = useState(initialPostType || 'offering');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    from_location_text: '',
    from_city: '',
    from_state: '',
    to_location_text: '',
    to_city: '',
    to_state: '',
    seats: 1,
    fuel_sharing: 'yes',
    contact_preference: 'desipath_only',
    whatsapp_number: '',
    notes: '',
    schedule_days_json: ['mon', 'tue', 'wed', 'thu', 'fri'],
    departure_time: '08:00',
    trip_date: '',
    event_name: ''
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchRideForEdit();
    }
  }, [mode, id]);

  const fetchRideForEdit = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/rides/${id}`);
      const data = res.data.data || res.data;
      
      setRideType(data.ride_type);
      setPostType(data.post_type);
      
      setFormData({
        title: data.title || '',
        from_location_text: data.from_location_text || '',
        from_city: data.from_city || '',
        from_state: data.from_state || '',
        to_location_text: data.to_location_text || '',
        to_city: data.to_city || '',
        to_state: data.to_state || '',
        seats: data.seats || 1,
        fuel_sharing: data.fuel_sharing || 'yes',
        contact_preference: data.contact_preference || 'desipath_only',
        whatsapp_number: data.whatsapp_number || '',
        notes: data.notes || '',
        schedule_days_json: Array.isArray(data.schedule_days_json) ? data.schedule_days_json : ['mon', 'tue', 'wed', 'thu', 'fri'],
        departure_time: data.departure_time ? data.departure_time.substring(0,5) : '08:00',
        trip_date: data.trip_date ? data.trip_date.split(' ')[0] : '',
        event_name: data.event_name || ''
      });
      setAgreed(true); // Pre-agree if editing
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ride for editing");
      navigate('/profile/myListings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const days = [...prev.schedule_days_json];
      if (days.includes(day)) {
        return { ...prev, schedule_days_json: days.filter(d => d !== day) };
      } else {
        return { ...prev, schedule_days_json: [...days, day] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the community guidelines.");
      return;
    }
    
    const restrictedWords = ['fare', 'price', 'booking', 'passenger', 'driver', 'guaranteed'];
    const textToCheck = `${formData.title} ${formData.notes}`.toLowerCase();
    
    for (let word of restrictedWords) {
      if (textToCheck.includes(word)) {
        toast.error(`The word "${word}" is not allowed. This is a community board, not a taxi service.`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        ride_type: rideType,
        post_type: postType
      };

      if (mode === 'edit') {
        await api.put(`/api/rides/${id}`, payload);
        toast.success("Ride updated successfully!");
        navigate('/profile/myListings');
      } else {
        await api.post('/api/rides', payload);
        toast.success("Ride posted successfully!");
        navigate('/rides');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Error ${mode === 'edit' ? 'updating' : 'posting'} ride`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6">
          <button onClick={() => navigate('/rides')} className="text-[#f15a29] hover:underline font-medium flex items-center">
            ← Back to Community Rides
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Your Ride' : (postType === 'offering' ? 'Post a Ride Offer' : 'Post a Ride Request')}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'edit' ? 'Update your ride details below.' : 'Fill out the details below to share your route with the community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Step 1: Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Ride Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'commute', label: 'Daily Commute', icon: '🚗' },
                  { id: 'event', label: 'Event Ride', icon: '🎉' },
                  { id: 'intercity', label: 'Intercity Trip', icon: '🛣️' }
                ].map(type => (
                  <div 
                    key={type.id}
                    onClick={() => setRideType(type.id)}
                    className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${rideType === type.id ? 'border-[#f15a29] bg-orange-50 ring-2 ring-orange-200' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            {/* Step 2: Common Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ride Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Edison to Manhattan weekday commute" className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
                  <input required name="from_location_text" value={formData.from_location_text} onChange={handleChange} placeholder="Neighborhood or Landmark" className="w-full rounded-md border border-gray-300 p-2.5 mb-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  <div className="grid grid-cols-2 gap-2">
                    <input required name="from_city" value={formData.from_city} onChange={handleChange} placeholder="City" className="w-full rounded-md border border-gray-300 p-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                    <input name="from_state" value={formData.from_state} onChange={handleChange} placeholder="State (e.g. NJ)" maxLength="2" className="w-full rounded-md border border-gray-300 p-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
                  <input required name="to_location_text" value={formData.to_location_text} onChange={handleChange} placeholder="Neighborhood or Landmark" className="w-full rounded-md border border-gray-300 p-2.5 mb-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  <div className="grid grid-cols-2 gap-2">
                    <input required name="to_city" value={formData.to_city} onChange={handleChange} placeholder="City" className="w-full rounded-md border border-gray-300 p-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                    <input name="to_state" value={formData.to_state} onChange={handleChange} placeholder="State (e.g. NY)" maxLength="2" className="w-full rounded-md border border-gray-300 p-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats {postType === 'offering' ? 'Available' : 'Needed'}</label>
                  <select name="seats" value={formData.seats} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]">
                    {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Cost Sharing</label>
                  <select name="fuel_sharing" value={formData.fuel_sharing} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]">
                    <option value="yes">Yes - Split gas cost evenly</option>
                    <option value="no">No - Offering for free</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Type Fields */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100">
              {rideType === 'commute' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                    <div className="flex flex-wrap gap-2">
                      {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                        <button
                          type="button"
                          key={day}
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize border ${formData.schedule_days_json.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <input type="time" name="departure_time" value={formData.departure_time} onChange={handleChange} className="rounded-md border border-gray-300 p-2 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                </>
              )}

              {rideType === 'event' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input required name="event_name" value={formData.event_name} onChange={handleChange} placeholder="e.g. Navratri Garba 2026" className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input required type="date" name="trip_date" value={formData.trip_date} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                      <input required type="time" name="departure_time" value={formData.departure_time} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                    </div>
                  </div>
                </>
              )}

              {rideType === 'intercity' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip Date</label>
                    <input required type="date" name="trip_date" value={formData.trip_date} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <input required type="time" name="departure_time" value={formData.departure_time} onChange={handleChange} className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Meeting point, luggage space, etc..." className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#0857d0] focus:ring-1 focus:ring-[#0857d0]"></textarea>
            </div>

            {/* Disclaimer and Submit */}
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
              <label className="flex items-start">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-[#0857d0] rounded border-gray-300 focus:ring-[#0857d0]" />
                <span className="text-sm text-gray-700">
                  <strong>Mandatory Agreement:</strong> By posting this ride, you confirm that this is a casual community carpool arrangement, not a commercial transportation service. Any fuel cost sharing is between you and your co-riders directly. Desipath is not responsible for any aspect of the ride or user safety.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${loading ? 'bg-gray-400' : 'bg-[#0857d0] hover:bg-blue-700'}`}
            >
              {loading ? 'Posting...' : 'Post Ride'}
            </button>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
