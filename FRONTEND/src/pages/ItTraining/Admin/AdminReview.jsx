import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import Step6Preview from '../InstructorPortal/Step6Preview';

const MOCK_MASSIVE_DATA = {
  instructorInfo: { name: 'Sam Krishnan', accountType: 'individual', yearsExperience: 5, bio: 'A passionate music teacher', photoUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop' },
  classBasic: { title: 'Beginner Piano & Keyboard Mastery', category: 'Music', subcategory: 'Keyboard', ageGroup: ['5-8 yrs', '9-12 yrs'], level: ['Beginner'], format: ['Online'], tags: ['music', 'piano'], shortDescription: 'Learn piano from scratch.' },
  schedule: { duration: '3 months', totalSessions: 24, sessionLength: '1 hr', daysOfWeek: ['Mon', 'Wed'], timeStart: '16:00', timeEnd: '17:00', platform: 'Zoom' },
  about: { 
    overview: { detailedDescription: 'This is a great class.', whoIsItFor: ['Absolute beginners'], whatWillKidsLearn: ['Reading music', 'Playing chords'], highlights: ['Weekly assignments'] },
    curriculum: [{ title: 'Intro to Keys', duration: '1 week', description: 'White and black keys.' }],
    requirements: { prerequisites: ['None'], materialsNeeded: ['A keyboard'], parentalInvolvement: 'none' }
  },
  pricing: { feeAmount: '4000', feeType: 'per_month', certificateProvided: true }
};

import api from '../../../utils/api';

export default function AdminReview() {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get('/api/kids-classes/pending')
      .then(res => {
        if (res.data.success) {
          setPendingListings(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const [selectedListing, setSelectedListing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/kids-classes/${id}/approve`);
      setPendingListings(pendingListings.filter(listing => listing.id !== id));
      showToast(`Listing ${id} Approved and Live!`, 'success');
    } catch (err) {
      showToast('API Error during approval.', 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason to email the instructor:");
    if (reason !== null && reason.trim() !== '') {
      try {
        await api.post(`/api/kids-classes/${id}/reject`, { reason });
        setPendingListings(pendingListings.filter(listing => listing.id !== id));
        showToast(`Listing Rejected! Instructor automatically emailed.`, 'error');
      } catch (err) {
        showToast('API Error during rejection.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Kids Class Admin Dashboard</h1>
            <p className="text-gray-500 font-medium mt-1">Review and manage instructor submissions</p>
          </div>
          <div className="bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-lg border border-orange-200">
            {pendingListings.length} Pending Review
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pendingListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
            <span className="text-6xl block mb-4">✨</span>
            <h2 className="text-2xl font-bold text-gray-800">Inbox Zero!</h2>
            <p className="text-gray-500">All instructor listings have been reviewed and processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 text-2xl overflow-hidden border">
                    {listing.photoUrl ? <img src={listing.photoUrl} alt="logo" className="w-full h-full object-cover" /> : listing.instructorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                    <p className="text-gray-600 font-medium">by {listing.instructorName}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">{listing.category} → {listing.subcategory}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                        ⏱️ Submitted {listing.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full md:w-auto gap-3 shrink-0">
                  <button 
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                    onClick={() => setSelectedListing(listing)}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleReject(listing.id)}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(listing.id)}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 font-bold rounded-xl transition hover:-translate-y-0.5"
                  >
                    Approve Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer newsletter={"block"} />

      {selectedListing && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/60 p-4 pt-10 overflow-y-auto w-full h-full">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative my-8">
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center font-bold transition z-50"
            >
              ×
            </button>
            <div className="p-8 max-h-[85vh] overflow-y-auto hide-scrollbar">
              <Step6Preview 
                data={MOCK_MASSIVE_DATA} 
                onEditStep={() => {}} // Disabled in admin view
              />
            </div>
            <div className="bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl flex justify-end gap-4 relative">
               <button 
                  onClick={() => { handleReject(selectedListing.id); setSelectedListing(null); }}
                  className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition"
                >
                  Reject & Close
                </button>
                <button 
                  onClick={() => { handleApprove(selectedListing.id); setSelectedListing(null); }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white shadow-lg font-bold rounded-xl transition"
                >
                  Approve Application
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-white border-green-500 shadow-green-100' : 'bg-white border-red-500 shadow-red-100'}`}>
            <span className={`text-2xl ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {toast.type === 'success' ? '✅' : '🚨'}
            </span>
            <p className="font-bold text-gray-800">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
