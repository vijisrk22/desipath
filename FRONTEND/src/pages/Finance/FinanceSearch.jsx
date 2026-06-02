import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function FinanceSearch() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    pfic_advisory: false,
    fbar_fatca_advisory: false,
    dtaa_optimization: false,
    fee_structure: '',
    category: ''
  });

  const categoriesList = [
    "401k", "Annuity", "Health Insurance", "Life Insurance", 
    "Travel Insurance", "Auto Insurance", "Will & Trust", 
    "College Savings", "US-Tax", "India-Tax"
  ];

  const fetchAdvisors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.pfic_advisory) params.append('pfic_advisory', '1');
      if (filters.fbar_fatca_advisory) params.append('fbar_fatca_advisory', '1');
      if (filters.dtaa_optimization) params.append('dtaa_optimization', '1');
      if (filters.fee_structure) params.append('fee_structure', filters.fee_structure);

      const res = await api.get(`/api/financial-advisors?${params.toString()}`);
      setAdvisors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, [filters.category, filters.pfic_advisory, filters.fbar_fatca_advisory, filters.dtaa_optimization, filters.fee_structure]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdvisors();
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Cross-Border Financial Expertise
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6 font-light">
            Connect with specialized advisors for NRIs. Navigate PFIC, DTAA, and complex tax regulations with confidence.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search by name, firm, or city..." 
                className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-lg"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
              />
            </div>
            <button type="submit" className="bg-[#f15a29] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Find Advisors
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              <h2 className="text-lg font-bold text-gray-900">Refine Search</h2>
            </div>

            <div className="space-y-6">
              {/* Service Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={filters.category === ''} 
                      onChange={() => setFilters(prev => ({...prev, category: ''}))} 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition text-sm">All Categories</span>
                  </label>
                  {categoriesList.map(cat => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={filters.category === cat} 
                        onChange={() => setFilters(prev => ({...prev, category: cat}))} 
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* NRI Specialties */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">NRI Specialties</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.pfic_advisory} onChange={(e) => setFilters(prev => ({...prev, pfic_advisory: e.target.checked}))} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700 group-hover:text-blue-600 transition">PFIC Advisory (Form 8621)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.fbar_fatca_advisory} onChange={(e) => setFilters(prev => ({...prev, fbar_fatca_advisory: e.target.checked}))} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700 group-hover:text-blue-600 transition">FBAR & FATCA Compliance</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.dtaa_optimization} onChange={(e) => setFilters(prev => ({...prev, dtaa_optimization: e.target.checked}))} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700 group-hover:text-blue-600 transition">India-US DTAA</span>
                  </label>
                </div>
              </div>

              {/* Fee Structure */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Fee Structure</h3>
                <select 
                  value={filters.fee_structure}
                  onChange={(e) => setFilters(prev => ({...prev, fee_structure: e.target.value}))}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Fee Structure</option>
                  <option value="fee_only">Fee-Only</option>
                  <option value="fee_based">Fee-Based</option>
                  <option value="aum">AUM %</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/financial-advisors/post" className="block w-full py-3 px-4 bg-gray-900 text-white text-center rounded-xl font-bold hover:bg-gray-800 transition">
                I am an Advisor
              </Link>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{advisors.length} Verified Advisors Found</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : advisors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No advisors found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query to find more results.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {advisors.map(advisor => (
                <div key={advisor.advisor_id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition duration-300 group">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-blue-700 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition transform">
                      {advisor.user?.profile_photo ? (
                        <img src={`http://localhost:8000/storage/${advisor.user.profile_photo}`} alt={advisor.user.name} className="w-full h-full object-cover" />
                      ) : (
                        advisor.user?.name?.charAt(0) || 'A'
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/financial-advisors/${advisor.slug}`} className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                            {advisor.user?.name}
                          </Link>
                          <p className="text-gray-600 font-medium">{advisor.firm_name}</p>
                        </div>
                        <div className="flex items-center bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm font-semibold border border-green-100">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Verified
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {advisor.primary_city}, {advisor.state}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          {advisor.years_experience} Yrs Exp.
                        </div>
                        <div className="flex items-center capitalize">
                          <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {advisor.fee_structure_type.replace('_', '-')}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {advisor.pfic_advisory && <span className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-md font-medium border border-orange-100">PFIC Advisory</span>}
                        {advisor.fbar_fatca_advisory && <span className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-md font-medium border border-orange-100">FBAR/FATCA</span>}
                        {advisor.dtaa_optimization && <span className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-md font-medium border border-orange-100">DTAA Spec.</span>}
                      </div>

                    </div>
                    
                    {/* Action */}
                    <div className="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                      <Link to={`/financial-advisors/${advisor.slug}`} className="bg-white border-2 border-[#f15a29] text-[#f15a29] hover:bg-[#f15a29] hover:text-white px-6 py-2.5 rounded-xl font-bold text-center transition duration-300">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
