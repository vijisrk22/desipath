import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CATEGORIES = ['All', 'h1b', 'green_card', 'uscis_policy', 'travel_passport', 'student_visa', 'employment', 'family_immigration', 'nri_india', 'legal_court', 'community', 'other'];

const CATEGORY_NAMES = {
  h1b: 'H-1B',
  green_card: 'Green Card',
  uscis_policy: 'USCIS Policy',
  travel_passport: 'Travel & Passport',
  student_visa: 'Student Visa',
  employment: 'Employment',
  family_immigration: 'Family',
  nri_india: 'NRI India',
  legal_court: 'Legal',
  community: 'Community',
  other: 'Other'
};

const ImmigrationNews = () => {
  const [news, setNews] = useState([]);
  const [urgentNews, setUrgentNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  useEffect(() => {
    fetchUrgent();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/news/immigration`, { params: { category: activeCategory } });
      setNews(res.data.data || res.data); // Handle pagination
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrgent = async () => {
    try {
      const res = await api.get('/api/news/immigration/latest-urgent');
      setUrgentNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Urgent Banner */}
      {urgentNews.length > 0 && (
        <div className="bg-red-600 text-white p-3 text-center">
          <span className="font-bold">Breaking: </span> 
          {urgentNews[0].ai_headline} 
          <Link to={`/immigration-news/${urgentNews[0].slug}`} className="ml-2 underline font-semibold">Read now</Link>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">Immigration News</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">AI-curated daily news for Indian-Americans in the USA & Canada. Updated every 3–4 hours.</p>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 py-3 flex space-x-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'All' : CATEGORY_NAMES[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading latest news...</p>
          ) : news.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No news found for this category.</p>
          ) : (
            news.map(article => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                
                <div className="flex items-center space-x-2 mb-3">
                  {article.is_government_source && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Official</span>
                  )}
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-sm font-medium">
                    {CATEGORY_NAMES[article.category] || article.category}
                  </span>
                  {article.urgency === 'high' && (
                    <span className="flex items-center text-red-600 text-xs font-bold uppercase tracking-wider">
                      <span className="h-2 w-2 bg-red-600 rounded-full mr-1 animate-pulse"></span> Breaking
                    </span>
                  )}
                </div>

                <Link to={`/immigration-news/${article.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {article.ai_headline}
                  </h2>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-2">{article.ai_summary}</p>

                {article.ai_nri_angle && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4 rounded-r text-sm text-gray-800">
                    <span className="font-semibold text-orange-800">What this means for you: </span>
                    {article.ai_nri_angle}
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-50">
                  <span>Source: {article.source_name} &bull; {new Date(article.published_at).toLocaleDateString()}</span>
                  <Link to={`/immigration-news/${article.slug}`} className="font-semibold text-blue-600">Read more &rarr;</Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-4">Never miss an important immigration update. Get high-urgency alerts pushed straight to your phone or email.</p>
            <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
              Manage Alert Settings
            </button>
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 mt-10 text-center">
        <p className="text-xs text-gray-400">
          Desipath curates and summarises immigration news from third-party sources. Summaries are AI-generated. Always verify with original sources. Not legal advice.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default ImmigrationNews;
