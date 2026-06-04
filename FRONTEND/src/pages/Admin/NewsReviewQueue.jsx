import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const NewsReviewQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editSummary, setEditSummary] = useState('');
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'
  
  // Dashboard Analytics
  const [stats, setStats] = useState({
    pending: 0,
    legalFlagCount: 0,
    toneFlagCount: 0
  });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/news/queue');
      const data = response.data || [];
      setQueue(data);

      // Distinguish flags for the stats tiles
      const legal = data.filter(item => 
        (item.flag_reason || '').toLowerCase().includes('legal') || 
        (item.flag_reason || '').toLowerCase().includes('lawyer') ||
        (item.flag_reason || '').toLowerCase().includes('attorney')
      ).length;

      setStats({
        pending: data.length,
        legalFlagCount: legal,
        toneFlagCount: data.length - legal
      });
    } catch (error) {
      console.error('Error fetching review queue:', error);
      toast.error('Failed to load moderation review queue.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, useEdits = false) => {
    setActioningId(id);
    setActionType('approve');
    try {
      const payload = useEdits ? { edited_summary: editSummary } : {};
      await api.post(`/api/admin/news/queue/${id}/approve`, payload);
      toast.success(useEdits ? 'Article edited and published live!' : 'Article approved and published live!');
      setEditingId(null);
      setEditSummary('');
      fetchQueue();
    } catch (error) {
      console.error('Error approving article:', error);
      toast.error('Could not complete approval operation.');
    } finally {
      setActioningId(null);
      setActionType('');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to permanently reject this article? It will not be published.')) return;
    setActioningId(id);
    setActionType('reject');
    try {
      await api.post(`/api/admin/news/queue/${id}/reject`);
      toast.warn('Article rejected and archived.');
      fetchQueue();
    } catch (error) {
      console.error('Error rejecting article:', error);
      toast.error('Could not complete rejection operation.');
    } finally {
      setActioningId(null);
      setActionType('');
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditSummary(item.ai_summary || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditSummary('');
  };

  // Helper to visually highlight sensitive terms in summary
  const renderHighlightedSummary = (text) => {
    if (!text) return '';
    const terms = [
      /you should file/gi,
      /you must apply/gi,
      /contact a lawyer/gi,
      /consult an attorney/gi,
      /legal advice/gi,
      /immediately file/gi,
      /must hire/gi
    ];
    let highlighted = text;
    terms.forEach(term => {
      highlighted = highlighted.replace(term, (match) => `<mark class="bg-red-100 text-red-900 border-b border-red-300 font-semibold px-1 rounded">${match}</mark>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-bold tracking-wide">Loading moderation queue...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-24 px-4 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="text-4xl">🛡️</span> News Moderation Console
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Manual review for news items flagged during Stage 3 validation (legal advice, sensationalist tone, or timing warnings).
        </p>
      </div>

      {/* Analytics Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest block mb-1">Total Pending</span>
            <span className="text-3xl font-black text-amber-900">{stats.pending}</span>
          </div>
          <span className="text-3xl bg-white p-3 rounded-2xl shadow-sm">⏳</span>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-red-700 uppercase tracking-widest block mb-1">Legal Warnings</span>
            <span className="text-3xl font-black text-red-900">{stats.legalFlagCount}</span>
          </div>
          <span className="text-3xl bg-white p-3 rounded-2xl shadow-sm">⚖️</span>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/60 p-6 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest block mb-1">Tone & Other Warnings</span>
            <span className="text-3xl font-black text-indigo-900">{stats.toneFlagCount}</span>
          </div>
          <span className="text-3xl bg-white p-3 rounded-2xl shadow-sm">📢</span>
        </div>
      </div>

      {/* Queue Cards */}
      {queue.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm animate-scaleUp">
          <span className="text-6xl block mb-4">🏆</span>
          <h2 className="text-2xl font-bold text-gray-800">Clear Queue!</h2>
          <p className="text-gray-500 mt-1.5 font-medium">There are currently no articles flagged for review.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {queue.map(item => {
            const isEditing = editingId === item.id;
            const isActioning = actioningId === item.id;
            const isLegalWarning = (item.flag_reason || '').toLowerCase().includes('legal') || 
                                  (item.flag_reason || '').toLowerCase().includes('attorney');

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col animate-scaleUp"
              >
                
                {/* Card Title & Flag Alert Ribbon */}
                <div className={`px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b ${
                  isLegalWarning ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'
                }`}>
                  <div className="max-w-3xl">
                    <h2 className="text-xl font-bold text-gray-900 leading-snug">{item.ai_headline}</h2>
                    <a 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-bold mt-1.5 inline-flex items-center gap-1"
                    >
                      🔗 Verify Original Source Article &rarr;
                    </a>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-xs font-bold border flex items-center gap-2 w-fit h-fit shrink-0 ${
                    isLegalWarning 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    <span>{isLegalWarning ? '⚖️' : '⚠️'}</span>
                    <span className="uppercase tracking-wider">Flag: {item.flag_reason}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  {isEditing ? (
                    <div className="space-y-4 flex-1">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-extrabold text-blue-600 uppercase tracking-widest">
                          ✏️ Summary Editor (Refine AI outputs below)
                        </label>
                        <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded border">
                          Word Count: {editSummary.trim().split(/\s+/).filter(Boolean).length}
                        </span>
                      </div>
                      <textarea
                        className="w-full bg-slate-50 border border-gray-200 rounded-2xl shadow-inner p-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y leading-relaxed"
                        rows="6"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        placeholder="Refine summary text here..."
                      />
                      <p className="text-[10px] text-gray-400 font-medium italic">
                        Tip: Ensure you strip any direct directives such as "you should apply" or "consult an attorney" to align with safe informational summaries.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1">
                      <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                        🤖 AI Summary & Angle
                      </span>
                      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 text-gray-800 text-sm leading-relaxed font-medium">
                        {renderHighlightedSummary(item.ai_summary)}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-gray-100 my-6"></div>

                  {/* Actions footer */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {isEditing ? (
                        <>
                          <button 
                            onClick={() => handleApprove(item.id, true)}
                            disabled={isActioning}
                            className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isActioning && actionType === 'approve' ? (
                              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : '🚀'}
                            Publish with Edits
                          </button>
                          <button 
                            onClick={cancelEditing}
                            disabled={isActioning}
                            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition disabled:opacity-50"
                          >
                            Cancel Edit
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleApprove(item.id, false)}
                            disabled={isActioning}
                            className="w-full sm:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isActioning && actionType === 'approve' ? (
                              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : '✅'}
                            Approve as Published
                          </button>
                          <button 
                            onClick={() => startEditing(item)}
                            disabled={isActioning}
                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            📝 Edit Summary
                          </button>
                        </>
                      )}
                    </div>

                    <button 
                      onClick={() => handleReject(item.id)}
                      disabled={isActioning}
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 ml-auto"
                    >
                      {isActioning && actionType === 'reject' ? (
                        <span className="h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                      ) : '❌'}
                      Reject Article
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default NewsReviewQueue;
