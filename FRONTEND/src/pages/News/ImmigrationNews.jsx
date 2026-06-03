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

  // Mobile Swipe and Popup states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [popupUrl, setPopupUrl] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');
  const [swipeClass, setSwipeClass] = useState('transition-all duration-300 ease-out translate-x-0 opacity-100 rotate-0');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    const touch = e.nativeEvent.changedTouches?.[0] || e.changedTouches?.[0];
    if (!touch) return;
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const onTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const touch = e.nativeEvent.changedTouches?.[0] || e.changedTouches?.[0];
    if (!touch) return;

    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = touchStartX - endX;
    const diffY = touchStartY - endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handleNext(); // Swipe Left -> Next
        } else {
          handlePrev(); // Swipe Right -> Previous
        }
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const animateCard = (direction, callback) => {
    setSwipeClass(
      direction === 'left'
        ? 'transition-all duration-200 ease-in translate-x-[-120%] opacity-0 -rotate-6'
        : 'transition-all duration-200 ease-in translate-x-[120%] opacity-0 rotate-6'
    );

    setTimeout(() => {
      callback();
      setSwipeClass(
        direction === 'left'
          ? 'translate-x-[120%] opacity-0 rotate-6'
          : 'translate-x-[-120%] opacity-0 -rotate-6'
      );

      setTimeout(() => {
        setSwipeClass('transition-all duration-300 ease-out translate-x-0 opacity-100 rotate-0');
      }, 30);
    }, 200);
  };

  const handleNext = () => {
    if (currentIndex < news.length - 1) {
      animateCard('left', () => setCurrentIndex(prev => prev + 1));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateCard('right', () => setCurrentIndex(prev => prev - 1));
    }
  };

  const openPopupModal = (url, title) => {
    setPopupTitle(title);
    setPopupUrl(url);
  };

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
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-5 md:py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-5xl font-extrabold text-white mb-2">Immigration News</h1>
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto">AI-curated daily news for Indian-Americans in the USA & Canada. Updated every 3–4 hours.</p>
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

      {isMobile ? (
        <div className="max-w-md mx-auto px-4 py-6 flex-1 flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 180px)', paddingBottom: '90px' }}>
          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading latest news...</p>
          ) : news.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No news found for this category.</p>
          ) : (
            <>
              {/* Navigation Indicators (Top) */}
              <div className="flex items-center justify-between mb-2 px-2 select-none">
                <button 
                  onClick={handlePrev} 
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition"
                >
                  &larr; Prev
                </button>
                <span className="text-xs font-extrabold text-gray-400 tracking-wider">
                  {currentIndex + 1} of {news.length}
                </span>
                <button 
                  onClick={handleNext} 
                  disabled={currentIndex === news.length - 1}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition"
                >
                  Next &rarr;
                </button>
              </div>
              <div className="text-center text-[10px] text-gray-400 mb-4 font-medium">
                Swipe left for next, swipe right for previous
              </div>

              {/* Swipeable Card */}
              <div 
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
                className={`bg-white rounded-3xl border border-gray-100 p-6 shadow-lg flex-1 flex flex-col justify-between min-h-[420px] relative active:scale-[0.99] touch-pan-y ${swipeClass}`}
                style={{ touchAction: 'pan-y' }}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    {news[currentIndex].is_government_source && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Official</span>
                    )}
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-sm font-medium">
                      {CATEGORY_NAMES[news[currentIndex].category] || news[currentIndex].category}
                    </span>
                    {news[currentIndex].urgency === 'high' && (
                      <span className="flex items-center text-red-600 text-[10px] font-bold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span> Breaking
                      </span>
                    )}
                  </div>

                  <Link to={`/immigration-news/${news[currentIndex].slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors leading-snug">
                      {news[currentIndex].ai_headline}
                    </h2>
                  </Link>

                  {news[currentIndex].ai_nri_angle && (
                    <div className="bg-orange-50 border border-orange-200 p-4 mb-4 rounded-xl text-xs text-gray-800 shadow-inner">
                      <span className="font-semibold text-orange-800 block mb-1">What this means for you:</span>
                      <p>{news[currentIndex].ai_nri_angle}</p>
                    </div>
                  )}

                  {news[currentIndex].ai_action_required && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-xs text-red-900 rounded-r">
                      <span className="font-bold">Action Required: </span> 
                      {news[currentIndex].ai_action_required}
                    </div>
                  )}

                  <div className="text-gray-600 text-xs leading-relaxed mb-4 whitespace-pre-line">
                    {news[currentIndex].ai_summary}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-[10px] text-gray-400 mb-4">
                    Source: {news[currentIndex].source_name} &bull; {new Date(news[currentIndex].published_at).toLocaleDateString()}
                  </div>
                  
                  <button 
                    onClick={() => openPopupModal(news[currentIndex].source_url, news[currentIndex].ai_headline)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5"
                  >
                    Read Full Story at {news[currentIndex].source_name} &rarr;
                  </button>
                </div>
              </div>

              {/* Navigation Indicators */}
              <div className="flex items-center justify-between mt-4 px-2 select-none">
                <button 
                  onClick={handlePrev} 
                  disabled={currentIndex === 0}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition"
                >
                  &larr; Prev
                </button>
                <span className="text-xs font-extrabold text-gray-400 tracking-wider">
                  {currentIndex + 1} of {news.length}
                </span>
                <button 
                  onClick={handleNext} 
                  disabled={currentIndex === news.length - 1}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition"
                >
                  Next &rarr;
                </button>
              </div>
              <div className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                Swipe left for next, swipe right for previous
              </div>
            </>
          )}
        </div>
      ) : (
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
                    <Link 
                      to={`/immigration-news/${article.slug}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Read more &rarr;
                    </Link>
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
      )}

      {/* Popup Iframe Modal */}
      {popupUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="truncate mr-4">
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block mb-0.5">Read Full Story</span>
                <h4 className="font-bold text-sm md:text-base truncate">{popupTitle}</h4>
              </div>
              <div className="flex items-center gap-3">
                <a href={popupUrl} target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-white">
                  Open in Tab ↗
                </a>
                <button onClick={() => setPopupUrl(null)} className="text-gray-400 hover:text-white transition-all text-xl font-bold p-1">
                  ✕
                </button>
              </div>
            </div>
            {/* Modal Body (Iframe) */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe 
                src={popupUrl} 
                title="News Source" 
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        </div>
      )}

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
