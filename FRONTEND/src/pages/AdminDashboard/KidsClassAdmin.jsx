import React, { useState, useEffect } from 'react';
import Step6Preview from '../KidsClass/InstructorPortal/Step6Preview';

// Removed MOCK_MASSIVE_DATA

export default function KidsClassAdmin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_review');
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/kids-classes/admin-listings')
      .then(res => res.json())
      .then(result => {
        if (result.success) setListings(result.data);
      })
      .finally(() => setLoading(false));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/kids-classes/${id}/approve`, { method: 'POST' });
      setListings(listings.map(l => l.id === id ? { ...l, status: 'active' } : l));
      showToast(`Listing ${id} Approved!`, 'success');
    } catch (err) {
      showToast('API Error during approval.', 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason to email the instructor:");
    if (reason !== null && reason.trim() !== '') {
      try {
        await fetch(`http://localhost:8000/api/kids-classes/${id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        });
        setListings(listings.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
        showToast(`Listing Rejected!`, 'error');
      } catch (err) {
        showToast('API Error during rejection.', 'error');
      }
    }
  };

  const openDetails = (listing) => {
    setSelectedListing(listing);
    setModalLoading(true);
    fetch(`http://localhost:8000/api/kids-classes/admin/details/${listing.id}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const { classBasic, instructor, schedule, about, pricing, reqs, modules } = result.data;
          
          const formattedData = {
            instructorInfo: {
              accountType: instructor?.account_type,
              name: instructor?.name,
              email: instructor?.email,
              phone: instructor?.phone,
              bio: instructor?.bio,
              yearsExperience: instructor?.years_experience,
              photoUrl: instructor?.profile_photo_url,
            },
            classBasic: {
              title: classBasic?.title,
              category: classBasic?.category,
              subcategory: classBasic?.subcategory,
              level: classBasic?.level,
              format: classBasic?.format,
              shortDescription: classBasic?.short_description,
              tags: classBasic?.tags,
              ageGroup: [`Min: ${classBasic?.age_group_min} yrs, Max: ${classBasic?.age_group_max} yrs`],
            },
            schedule: {
              duration: schedule?.duration_label,
              totalSessions: schedule?.total_sessions,
              sessionLength: schedule?.session_length_minutes,
              daysOfWeek: schedule?.days_of_week,
              timeStart: schedule?.time_start,
              timeEnd: schedule?.time_end,
              startDate: schedule?.batch_start_date,
              location: schedule?.location_address,
              platform: schedule?.online_platform,
              maxStudents: schedule?.max_students,
              trialAvailable: schedule?.trial_available,
            },
            about: {
              overview: {
                detailedDescription: about?.detailed_description,
                whoIsItFor: about?.who_is_it_for,
                whatWillKidsLearn: about?.what_will_kids_learn,
                highlights: about?.highlights,
              },
              curriculum: modules?.map(m => ({ title: m.title, description: m.description, duration: m.estimated_duration })),
              requirements: {
                prerequisites: reqs?.prerequisites,
                materialsNeeded: reqs?.materials_needed,
                techRequirements: reqs?.tech_requirements,
                parentalInvolvement: reqs?.parental_involvement,
              }
            },
            pricing: {
              feeAmount: pricing?.fee_amount,
              feeType: pricing?.fee_type?.replace('_', ' '),
              discountLabel: pricing?.discount_label,
              certificateProvided: pricing?.certificate_provided,
            }
          };
          setModalData(formattedData);
        }
      })
      .finally(() => setModalLoading(false));
  };

  // Filter listings based on the active tab
  const filteredListings = listings.filter(l => l.status === activeTab);

  const TABS = [
    { id: 'pending_review', label: 'Pending Review', count: listings.filter(l => l.status === 'pending_review').length },
    { id: 'active', label: 'Approved & Live', count: listings.filter(l => l.status === 'active').length },
    { id: 'rejected', label: 'Rejected', count: listings.filter(l => l.status === 'rejected').length },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kids Classes Hub</h1>
          <p className="text-gray-500 font-medium mt-1">Unified view of all marketplace class applications.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-bold transition-colors border-b-2 ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
          <span className="text-6xl block mb-4">✨</span>
          <h2 className="text-2xl font-bold text-gray-800">Empty View</h2>
          <p className="text-gray-500">No classes found in the "{activeTab}" status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 text-2xl overflow-hidden border">
                  {listing.photoUrl ? (
                    <img 
                      src={listing.photoUrl} 
                      alt={listing.instructorName} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-blue-600', 'flex', 'items-center', 'justify-center');
                        e.target.parentElement.innerText = listing.instructorName?.charAt(0);
                        e.target.parentElement.classList.add('text-white');
                      }}
                    />
                  ) : (
                    listing.instructorName?.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                  <p className="text-gray-600 font-medium">by {listing.instructorName}</p>
                  <div className="flex gap-2 mt-2 items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {listing.category} {listing.subcategory && `→ ${listing.subcategory}`}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs font-medium">ID: {listing.id}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs font-bold italic" title={listing.submittedAtFull}>{listing.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex w-full md:w-auto gap-3 shrink-0 flex-wrap justify-end">
                <button 
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                  onClick={() => openDetails(listing)}
                >
                  View Details
                </button>
                
                {activeTab === 'pending_review' && (
                  <>
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
                      Approve
                    </button>
                  </>
                )}

                {activeTab === 'rejected' && (
                  <button 
                    onClick={() => handleApprove(listing.id)}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition hover:-translate-y-0.5"
                  >
                    Move to Approved
                  </button>
                )}
                
                {activeTab === 'active' && (
                  <button 
                    onClick={() => handleReject(listing.id)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold rounded-xl transition"
                  >
                    Revoke & Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
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
              {modalLoading || !modalData ? (
                <div className="flex justify-center p-20">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <Step6Preview 
                  data={modalData} 
                  onEditStep={() => window.open(`/kids-class/instructor-portal/edit/${selectedListing.id}`, '_blank')} 
                />
              )}
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
