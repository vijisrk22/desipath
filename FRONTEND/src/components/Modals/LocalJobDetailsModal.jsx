import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocalJobDetailsModal = ({ isOpen, onClose, job }) => {
  const navigate = useNavigate();

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-50 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
              {job.category}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Posted on {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{job.title}</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {(job.city || job.state || job.zipcode) && (
              <span className="text-gray-700 font-medium flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <svg className="w-5 h-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {[job.city, job.state, job.zipcode].filter(Boolean).join(', ')}
              </span>
            )}
            
            {job.pay_rate && (
              <span className="text-green-700 font-bold flex items-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {job.pay_rate}
              </span>
            )}
          </div>

          <div className="prose prose-sm sm:prose max-w-none text-gray-700 mb-8 whitespace-pre-wrap">
            {job.description}
          </div>

          <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {job.user?.profile_photo ? (
                  <img src={job.user.profile_photo.startsWith('http') ? job.user.profile_photo : `http://localhost:8000${job.user.profile_photo}`} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    {job.user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 font-medium">Posted by</p>
                <p className="text-base font-bold text-gray-900">{job.user?.name || 'User'}</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const chatInfo = encodeURIComponent(JSON.stringify({ 
                  chatPartnerId: job.user_id,
                  chatPartnerName: job.user?.name || "User"
                }));
                const initialMessage = encodeURIComponent(`I am interested in the job ${job.title} - ${[job.city, job.state, job.zipcode].filter(Boolean).join(', ')}`);
                navigate(`/inbox?chatPartnerInfo=${chatInfo}&initialMessage=${initialMessage}&adId=${job.id}&adType=localjob`);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalJobDetailsModal;
