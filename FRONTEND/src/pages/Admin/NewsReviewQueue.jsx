import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';

const NewsReviewQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editSummary, setEditSummary] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/admin/news/queue');
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching review queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const payload = editingId === id ? { edited_summary: editSummary } : {};
      await api.post(`/admin/news/queue/${id}/approve`, payload);
      alert('Article approved and published!');
      setEditingId(null);
      fetchQueue();
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/news/queue/${id}/reject`);
      fetchQueue();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading review queue...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">News Review Queue</h1>
      <p className="text-gray-600 mb-8">Articles flagged by AI Stage 3 for manual review (e.g. contains legal advice, overly urgent tone).</p>
      
      {queue.length === 0 ? (
        <div className="bg-gray-50 border p-8 text-center rounded text-gray-500">
          No articles pending review.
        </div>
      ) : (
        <div className="space-y-6">
          {queue.map(item => (
            <div key={item.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{item.ai_headline}</h2>
                  <a href={item.source_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                    View Original Source Article &rarr;
                  </a>
                </div>
                <div className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm font-medium border border-red-200">
                  Flag: {item.flag_reason}
                </div>
              </div>
              
              {editingId === item.id ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edit AI Summary (Remove legal advice before approving):</label>
                  <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm p-3 border"
                    rows="4"
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p className="text-gray-800">{item.ai_summary}</p>
                </div>
              )}

              <div className="flex gap-4">
                {editingId === item.id ? (
                  <>
                    <button onClick={() => handleApprove(item.id)} className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
                      Publish with Edits
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300">
                      Cancel Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleApprove(item.id)} className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
                      Approve &amp; Publish As-Is
                    </button>
                    <button onClick={() => { setEditingId(item.id); setEditSummary(item.ai_summary); }} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
                      Edit Summary
                    </button>
                    <button onClick={() => handleReject(item.id)} className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 ml-auto">
                      Reject Permanently
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsReviewQueue;
