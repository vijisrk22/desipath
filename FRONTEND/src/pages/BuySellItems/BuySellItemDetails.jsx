import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../../utils/api';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const BuySellItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    setSubmittingReport(true);
    try {
      await api.post(`/api/buy-sell-items/${id}/report`, { reason: reportReason });
      setIsReportModalOpen(false);
      setReportReason('');
      navigate('/buy-sell-items/report-success', { state: { title: item.title } });
    } catch (error) {
      console.error("Error submitting report:", error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/api/buy-sell-items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#0857d0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-xl text-gray-500">Item not found.</p>
      </div>
    );
  }

  const isOwner = user && user.id === item.user_id;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center">
          <Link to="/buy-sell-items" className="hover:text-[#0857d0] hover:underline font-medium">Buy/Sell Items</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{item.category}</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{item.title}</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          {/* Images Section */}
          <div className="w-full p-6 bg-gray-50 border-b border-gray-100 flex flex-col">
            {item.pictures && item.pictures.length > 0 ? (
              <>
                <div className="w-full aspect-video bg-white rounded-xl overflow-hidden flex items-center justify-center shadow-inner mb-4 relative">
                  <img 
                    src={item.pictures[currentImageIndex].startsWith('http') ? item.pictures[currentImageIndex] : `${BASE_URL}${item.pictures[currentImageIndex]}`} 
                    alt={item.title} 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                     {item.pictures.map((_, idx) => (
                       <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-[#0857d0]' : 'bg-gray-300'}`}></div>
                     ))}
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar justify-center">
                  {item.pictures.map((pic, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${currentImageIndex === index ? 'border-[#0857d0] ring-2 ring-[#0857d0] ring-opacity-50' : 'border-transparent hover:border-gray-300'} transition-all`}
                    >
                      <img src={pic.startsWith('http') ? pic : `${BASE_URL}${pic}`} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="font-medium">No Images Available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full p-8 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight pr-4">{item.title}</h1>
              <div className="flex gap-2 flex-shrink-0">
                {!isOwner && item.user && (
                  <Link to={`/inbox?chatPartnerInfo=${encodeURIComponent(JSON.stringify({ chatPartnerId: item.user.id, chatPartnerName: item.user.name, profile_photo: item.user.profile_photo || '' }))}&initialMessage=${encodeURIComponent(`I am interested in your item for sale - ${item.title}`)}&adId=${item.id}&adType=buysellitem`} className="w-10 h-10 rounded-full bg-blue-50 text-[#0857d0] hover:bg-[#0857d0] hover:text-white transition-colors flex items-center justify-center shadow-sm" title="Message Seller">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  </Link>
                )}
                <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center shadow-sm" title="Share" onClick={() => {
                   if (navigator.share) {
                     navigator.share({ title: item.title, url: window.location.href });
                   } else {
                     navigator.clipboard.writeText(window.location.href);
                     alert('Link copied to clipboard');
                   }
                }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm" title="Report Listing" onClick={() => setIsReportModalOpen(true)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                </button>
                {isOwner && (
                  <Link to={`/buy-sell-items/edit/${item.id}`} className="flex-shrink-0 text-sm font-semibold text-[#0857d0] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 ml-2 flex items-center">
                    Edit Ad
                  </Link>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-6">Posted {new Date(item.created_at).toLocaleDateString()}</div>
            
            {item.price && (
              <div className="text-4xl font-extrabold text-[#0857d0] mb-8">
                ${Number(item.price).toLocaleString()}
              </div>
            )}

            <div className="space-y-5 mb-8 flex-1">
              <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Category</span>
                    <span className="text-base font-semibold text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Condition</span>
                    <span className="text-base font-semibold text-gray-900">{item.condition || 'Not specified'}</span>
                  </div>
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg col-span-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Location</span>
                    <span className="text-base font-semibold text-gray-900 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-[#0857d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {item.city ? `${item.city}, ` : ''}{item.state}
                    </span>
                  </div>
              </div>

              <div className="flex flex-col pt-4">
                <span className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Description</span>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base bg-white">{item.description || 'No description provided by the seller.'}</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mt-auto">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Seller Information</h3>
              {item.user ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0857d0] to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-md border-2 border-white">
                    {item.user.profile_photo ? (
                        <img src={item.user.profile_photo.startsWith('http') ? item.user.profile_photo : `${BASE_URL}${item.user.profile_photo}`} className="w-full h-full rounded-full object-cover" alt="Seller" />
                    ) : item.user.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{item.user.name}</div>
                    <div className="text-sm text-gray-600">Member</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Seller information not available.</p>
              )}
              
              {!isOwner && item.user && (
                <Link to={`/inbox?chatPartnerInfo=${encodeURIComponent(JSON.stringify({ chatPartnerId: item.user.id, chatPartnerName: item.user.name, profile_photo: item.user.profile_photo || '' }))}&initialMessage=${encodeURIComponent(`I am interested in your item for sale - ${item.title}`)}&adId=${item.id}&adType=buysellitem`} className="mt-5 w-full flex items-center justify-center gap-2 bg-[#0857d0] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  Message Seller
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
      </div>
      
      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Report Listing
            </h3>
            <p className="text-gray-600 mb-4 text-sm">Please provide a reason for reporting this listing. Our moderation team will review it shortly.</p>
            <textarea 
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0857d0] focus:border-transparent min-h-[120px] mb-6"
              placeholder="E.g., Fraudulent item, inappropriate content, etc."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            ></textarea>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={submittingReport}
              >
                Cancel
              </button>
              <button 
                onClick={handleReportSubmit}
                disabled={!reportReason.trim() || submittingReport}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer newsletter={"block"} />
    </div>
  );
};

export default BuySellItemDetails;
