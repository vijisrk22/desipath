import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function FinanceProfile() {
  const { slug } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/financial-advisors/${slug}`);
        setAdvisor(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Advisor Not Found</h1>
          <p className="text-gray-500 mb-8">The profile you are looking for does not exist or has been removed.</p>
          <Link to="/financial-advisors" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">Back to Search</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/img/')) return path;
    return `http://localhost:8000/storage/${path}`;
  };

  const profileImageUrl = getImageUrl(advisor.advisor_profile_image) || getImageUrl(advisor.user?.profile_photo) || null;
  const coverImageUrl = getImageUrl(advisor.cover_image) || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

  const displayName = advisor.consultant_name || advisor.user?.name;

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Disclaimer Banner */}
      <div className="bg-orange-50 text-orange-800 text-sm py-2 px-4 text-center border-b border-orange-200">
        ⚠️ Desipath is a directory and lead generation platform. Desipath does not provide financial, investment, tax, or legal advice. 
        All advisors listed are independent professionals. NRI users should independently verify advisor credentials before engaging services.
      </div>
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-0 sm:px-4 py-8 flex flex-col gap-6">
        
        {/* LinkedIn Style Header Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 w-full relative">
            <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
          
          <div className="px-6 pb-6 relative">
            {/* Profile Avatar */}
            <div className="absolute -top-16 md:-top-24 left-6">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-1 rounded-full overflow-hidden border-4 border-white shadow-md">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={displayName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-700 rounded-full">
                    {displayName?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>

            {/* Actions / CTA */}
            <div className="flex justify-end pt-4 pb-2 md:pb-0 h-16 md:h-24">
              {advisor.free_consultation && advisor.free_consultation !== 'None' && (
                <div className="hidden md:flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold border border-green-200 mr-4 shadow-sm">
                  <span className="mr-2 text-xl">🎁</span> Free {advisor.free_consultation} Consultation
                </div>
              )}
              <a href={`mailto:${advisor.contact_email || advisor.user?.email}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition shadow-sm self-start mt-2">
                Contact Advisor
              </a>
            </div>

            {/* Basic Info */}
            <div className="mt-4 md:mt-2">
              <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              {advisor.qualifications && <p className="text-gray-800 text-lg mt-1">{advisor.qualifications}</p>}
              
              <div className="text-gray-500 mt-1 flex flex-wrap items-center gap-x-2">
                <span>{advisor.firm_name}</span>
                {advisor.accreditations && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-gray-700">{advisor.accreditations}</span>
                  </>
                )}
              </div>

              <div className="text-gray-500 text-sm mt-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {advisor.primary_city}
                  {advisor.states_licensed && advisor.states_licensed.length > 0 && `, ${advisor.states_licensed.join(', ')}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* NRI Statement - Critical Focus Area */}
            {advisor.nri_specialist_statement && (
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#f15a29]">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  NRI Specialist Focus
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {advisor.nri_specialist_statement}
                </div>
              </div>
            )}

            {/* Specialties & Services */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
              
              {/* Highlighted Flags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {advisor.pfic_advisory && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                    PFIC / Form 8621
                  </div>
                )}
                {advisor.fbar_fatca_advisory && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                    FBAR & FATCA
                  </div>
                )}
                {advisor.dtaa_optimization && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg font-semibold flex items-center">
                    India-US DTAA
                  </div>
                )}
              </div>

              {/* General Services */}
              {advisor.services && advisor.services.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">Additional Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {advisor.services.map((service, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h2>
              
              <div className="space-y-4">
                {(advisor.contact_email || advisor.user?.email) && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                    <div className="truncate"><a href={`mailto:${advisor.contact_email || advisor.user?.email}`} className="text-blue-600 hover:underline">{advisor.contact_email || advisor.user?.email}</a></div>
                  </div>
                )}
                {advisor.contact_phone && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                    <div>{advisor.contact_phone}</div>
                  </div>
                )}
                {advisor.website && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg></div>
                    <div className="truncate"><a href={advisor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{advisor.website}</a></div>
                  </div>
                )}
              </div>
            </div>

            {/* At a Glance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">At a Glance</h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-gray-900">{advisor.years_experience} Years</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Fee Structure</span>
                  <span className="font-semibold text-gray-900 capitalize">{advisor.fee_structure_type?.replace('_', '-')}</span>
                </li>
                {advisor.finra_crd_number && (
                  <li className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-500">FINRA CRD</span>
                    <span className="font-semibold text-blue-600">{advisor.finra_crd_number}</span>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
