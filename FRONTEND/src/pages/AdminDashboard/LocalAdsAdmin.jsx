import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';
import { Link } from 'react-router-dom';

export default function LocalAdsAdmin() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedAd, setSelectedAd] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [expiryAd, setExpiryAd] = useState(null);
    const [expiryDate, setExpiryDate] = useState('');

    useEffect(() => {
        fetchAds();
    }, [filter, page]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            console.log(`Fetching ads with filter: "${filter}", page: ${page}`);
            const res = await api.get(`/api/admin/local-ads?status=${filter}&page=${page}`);
            console.log('Admin ads response:', res.data);
            
            if (res.data && res.data.data) {
                setAds(res.data.data);
                setTotalPages(res.data.last_page);
            } else {
                console.error('Unexpected response format:', res.data);
                showToast('Unexpected response from server', 'error');
            }
        } catch (err) {
            console.error('Error fetching ads:', err);
            const msg = err.response?.data?.message || 'Error fetching moderation queue.';
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleStatusUpdate = async (adId, status) => {
        if (status === 'rejected' && !rejectionReason) {
            alert('Please provide a reason for rejection.');
            return;
        }

        try {
            console.log(`Updating ad ${adId} to ${status}`);
            const response = await api.patch(`/api/admin/local-ads/${adId}/status`, {
                status,
                rejection_reason: status === 'rejected' ? rejectionReason : null
            });
            console.log('Status update response:', response.data);
            showToast(`Ad ${status} successfully!`);
            setSelectedAd(null);
            setRejectionReason('');
            fetchAds();
        } catch (err) {
            console.error('Error updating status:', err.response?.data || err.message);
            showToast(err.response?.data?.message || 'Error updating status.', 'error');
        }
    };

    const handleExpiryUpdate = async (adId) => {
        try {
            await api.patch(`/api/admin/local-ads/${adId}/expiry`, {
                expires_at: expiryDate
            });
            showToast('Expiry date updated successfully!');
            setExpiryAd(null);
            fetchAds();
        } catch (err) {
            showToast(err.response?.data?.message || 'Error updating expiry.', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-50';
            case 'rejected': return 'text-red-600 bg-red-50';
            case 'pending': return 'text-amber-600 bg-amber-50';
            case 'expired': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <span className="text-4xl">📢</span> Local Deals Moderation
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Review and approve business advertisements.</p>
                </div>

                <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
                    {['pending', 'approved', 'rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f === 'all' ? '' : f); setPage(1); }}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize ${
                                (filter === f || (f === 'all' && filter === '')) ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : ads.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
                    <span className="text-6xl block mb-4">🏜️</span>
                    <h2 className="text-2xl font-bold text-gray-800">No Ads Found</h2>
                    <p className="text-gray-500">There are no ads matching the current filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {ads.map((ad) => (
                        <div key={ad.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                <img 
                                    src={getFullImageUrl(ad.poster_urls[0])} 
                                    className="w-full h-full object-cover" 
                                    alt="Ad Poster" 
                                />
                            </div>
                            
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block ${getStatusColor(ad.status)}`}>
                                            {ad.status}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900">{ad.title}</h3>
                                        <p className="text-blue-600 font-bold text-sm">By {ad.business_account?.business_name}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-400">
                                        <div>Submitted: {new Date(ad.created_at).toLocaleDateString()}</div>
                                        {ad.status === 'approved' && ad.expires_at && (
                                            <div className="text-blue-500 font-bold mt-1">
                                                Expires: {new Date(ad.expires_at).toLocaleDateString()}
                                                <button 
                                                    onClick={() => {
                                                        setExpiryAd(ad);
                                                        setExpiryDate(ad.expires_at.split('T')[0]);
                                                    }}
                                                    className="ml-2 text-[10px] underline hover:text-blue-700"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{ad.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {ad.tags?.map((tag, i) => (
                                        <span key={i} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">#{tag}</span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {ad.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleStatusUpdate(ad.id, 'approved')}
                                                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => setSelectedAd(ad)}
                                                className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {ad.status === 'approved' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(ad.id, 'suspended')}
                                            className="px-6 py-2 bg-white border border-amber-200 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-50 transition-colors"
                                        >
                                            Revoke/Suspend
                                        </button>
                                    )}
                                    
                                    <Link 
                                        to={`/services/Localdeals/edit/${ad.id}`}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
                                    >
                                        Edit Ad
                                    </Link>

                                    <button 
                                        onClick={async () => {
                                            if(window.confirm('Are you sure you want to delete this ad?')) {
                                                try {
                                                    await api.delete(`/api/local-ads/${ad.id}`);
                                                    showToast('Ad deleted successfully');
                                                    fetchAds();
                                                } catch(e) {
                                                    showToast('Error deleting ad', 'error');
                                                }
                                            }
                                        }}
                                        className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                                    >
                                        Delete
                                    </button>

                                    {ad.status === 'rejected' && (
                                        <div className="mt-2 text-xs text-red-500 italic bg-red-50 p-2 rounded-lg w-full">
                                            Reason: {ad.rejection_reason}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            {selectedAd && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reject Advertisement</h2>
                        <p className="text-gray-500 mb-6 font-medium">Please provide a reason why this ad is being rejected. This will be shown to the business owner.</p>
                        
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. Inappropriate content, poor image quality..."
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:outline-none h-32 mb-6 font-medium"
                        />

                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleStatusUpdate(selectedAd.id, 'rejected')}
                                className="flex-grow py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                            >
                                Confirm Rejection
                            </button>
                            <button 
                                onClick={() => { setSelectedAd(null); setRejectionReason(''); }}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expiry Modal */}
            {expiryAd && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Expiry Date</h2>
                        <p className="text-gray-500 mb-6 font-medium">Select a new expiration date for this advertisement.</p>
                        
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6 font-bold text-lg"
                        />

                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleExpiryUpdate(expiryAd.id)}
                                className="flex-grow py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={() => setExpiryAd(null)}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-30"
                    >
                        Prev
                    </button>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Custom Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[110] animate-fade-in-up">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border bg-white ${toast.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
                        <span className="text-xl">{toast.type === 'error' ? '🚨' : '✅'}</span>
                        <p className="font-bold text-gray-800">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
