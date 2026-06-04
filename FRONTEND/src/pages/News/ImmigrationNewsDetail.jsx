import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CATEGORY_NAMES = {
  h1b: 'H-1B', green_card: 'Green Card', uscis_policy: 'USCIS Policy', 
  travel_passport: 'Travel & Passport', student_visa: 'Student Visa', 
  employment: 'Employment', family_immigration: 'Family', nri_india: 'NRI India', 
  legal_court: 'Legal', community: 'Community', other: 'Other'
};

const ImmigrationNewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mobile Swipe and Popup states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
    const loadData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch active article
        const detailRes = await api.get(`/api/news/immigration/${slug}`);
        const activeArticle = detailRes.data;
        setArticle(activeArticle);

        // Step 2: Fetch all articles (to enable swiping)
        const listRes = await api.get('/api/news/immigration');
        const articlesList = listRes.data.data || listRes.data;
        setNews(articlesList);

        // Step 3: Find active article index in list
        const idx = articlesList.findIndex(a => a.id === activeArticle.id || a.slug === slug);
        if (idx !== -1) {
          setCurrentIndex(idx);
        } else {
          // If active article not in list, add it at the start
          setNews(prev => [activeArticle, ...prev]);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Synchronize browser URL when currentIndex changes on mobile
  const changeCard = (newIndex) => {
    setCurrentIndex(newIndex);
    const nextArticle = news[newIndex];
    if (nextArticle) {
      setArticle(nextArticle);
      navigate(`/daily-news/${nextArticle.slug}`, { replace: true });
    }
  };

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
      animateCard('left', () => changeCard(currentIndex + 1));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateCard('right', () => changeCard(currentIndex - 1));
    }
  };

  const openPopupModal = (url, title) => {
    setPopupTitle(title);
    setPopupUrl(url);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!article) return <div className="text-center py-20 text-red-500">Article not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {isMobile ? (
        <div className="max-w-md mx-auto px-4 py-6 flex-1 flex flex-col justify-between" style={{ minHeight: 'calc(100vh - 180px)', paddingBottom: '90px' }}>
          <div>
            <Link to="/daily-news" className="text-blue-600 hover:underline text-sm font-medium block mb-4">&larr; Back to Desi News</Link>
            
            {/* Navigation Indicators (Top) */}
            {news.length > 0 && (
              <>
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
              </>
            )}

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
                  {article.is_government_source && (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Official</span>
                  )}
                  <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-sm font-medium">
                    {CATEGORY_NAMES[article.category] || article.category}
                  </span>
                  {article.urgency === 'high' && (
                    <span className="flex items-center text-red-600 text-[10px] font-bold uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 bg-red-600 rounded-full mr-1 animate-pulse"></span> Breaking
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {article.ai_headline}
                </h2>

                {article.ai_nri_angle && (
                  <div className="bg-orange-50 border border-orange-200 p-4 mb-4 rounded-xl text-xs text-gray-800 shadow-inner">
                    <span className="font-semibold text-orange-800 block mb-1">What this means for you:</span>
                    <p>{article.ai_nri_angle}</p>
                  </div>
                )}

                {article.ai_action_required && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-xs text-red-900 rounded-r">
                    <span className="font-bold">Action Required: </span> 
                    {article.ai_action_required}
                  </div>
                )}

                <div className="text-gray-600 text-xs leading-relaxed mb-4 whitespace-pre-line">
                  {article.ai_summary}
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-[10px] text-gray-400 mb-4">
                  Source: {article.source_name} &bull; {new Date(article.published_at).toLocaleDateString()}
                </div>
                
                <button 
                  onClick={() => openPopupModal(article.source_url, article.ai_headline)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5"
                >
                  Read Full Story at {article.source_name} &rarr;
                </button>
              </div>
            </div>

            {/* Navigation Indicators */}
            {news.length > 0 && (
              <>
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
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/daily-news" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Desi News</Link>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-sm font-semibold uppercase tracking-wider">
                {CATEGORY_NAMES[article.category] || article.category}
              </span>
              <span className="text-gray-500 text-sm">
                Source: {article.source_name} &bull; {new Date(article.published_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {article.ai_headline}
            </h1>

            {article.is_government_source && (
               <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-green-900 rounded-r">
                 <span className="font-bold">Official Government Source: </span> 
                 This is an official announcement. Desipath summarises it below — read the full official text via the link at the bottom.
               </div>
            )}

            {article.ai_nri_angle && (
              <div className="bg-orange-50 border border-orange-200 p-5 mb-8 rounded-lg shadow-inner">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  What this means for you
                </h3>
                <p className="text-gray-800 text-lg">{article.ai_nri_angle}</p>
              </div>
            )}

            {article.ai_action_required && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-900 rounded-r">
                 <span className="font-bold">Action Required: </span> 
                 {article.ai_action_required}
               </div>
            )}

            <div className="prose prose-lg prose-blue max-w-none text-gray-700 mb-10">
              <p className="whitespace-pre-line text-lg leading-relaxed">{article.ai_summary}</p>
              <p className="text-xs text-gray-400 mt-4 italic">AI-generated summary (3-5 sentences)</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-10">
              {(article.tags_json || []).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">#{tag}</span>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-8 mt-8 text-center bg-gray-50 rounded-b-xl -mx-6 md:-mx-10 -mb-6 md:-mb-10 p-10">
              <button 
                onClick={() => openPopupModal(article.source_url, article.ai_headline)}
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Read Full Story at {article.source_name} &rarr;
              </button>

              {article.attorney_referral && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-700 mb-3 font-medium">This article raises immigration legal questions.</p>
                  <Link to="/financial-advisors" className="text-blue-600 hover:underline font-semibold">
                    Find a verified NRI immigration attorney on Desipath
                  </Link>
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-8 max-w-2xl mx-auto">
                This summary was AI-generated by Desipath from the original article at {article.source_name}. It may not capture all nuances. Always read the original and consult a qualified professional for legal matters.
              </p>
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

      <Footer />
    </div>
  );
};

export default ImmigrationNewsDetail;
