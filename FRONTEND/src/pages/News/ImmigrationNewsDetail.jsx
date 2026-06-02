import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/api/news/immigration/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!article) return <div className="text-center py-20 text-red-500">Article not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/immigration-news" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Immigration News</Link>
        
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
            <a href={article.source_url} target="_blank" rel="noopener noreferrer" 
               className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
              Read Full Story at {article.source_name} &rarr;
            </a>

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
      <Footer />
    </div>
  );
};

export default ImmigrationNewsDetail;
