import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';

const MOCK_COMMENTS = [
  {
    id: 101,
    author: "coder_ravi",
    time: "1 hour ago",
    content: "Definitely use the official AWS training material. Also, check out Jon Bonso's practice exams on Udemy, they are very close to the real thing.",
    votes: 42,
    replies: [
      {
        id: 1011,
        author: "tech_guru",
        time: "30 mins ago",
        content: "Thanks! I've heard good things about Bonso. Will check it out.",
        votes: 12
      }
    ]
  },
  {
    id: 102,
    author: "cloud_seeker",
    time: "45 mins ago",
    content: "I passed last week! My advice is to focus on VPC and IAM. Those are heavily tested.",
    votes: 28,
    replies: []
  }
];

import api from '../../utils/api';

export default function ForumPostDetail() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isCommentBoxExpanded, setIsCommentBoxExpanded] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const handleReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    api.post('/api/forum/comments', {
      post_id: post.id,
      parent_id: parentId,
      content: replyText
    })
    .then(res => {
      if (res.data.success) {
        toast.success("Reply posted successfully!");
        setReplyingTo(null);
        setReplyText("");
        fetchPost(false);
      }
    })
    .finally(() => {
      setIsSubmittingReply(false);
    });
  };

  const handleReplyClick = (commentId, replyUsername = null) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
      setReplyText(replyUsername ? `@${replyUsername} ` : "");
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSubmit = (e, commentId) => {
    e.preventDefault();
    if (!editContent.trim() || isSubmittingEdit) return;

    setIsSubmittingEdit(true);
    api.put(`/api/forum/comments/${commentId}`, { content: editContent })
      .then(res => {
        if (res.data.success) {
          toast.success("Comment updated successfully!");
          setEditingCommentId(null);
          fetchPost(false);
        }
      })
      .finally(() => {
        setIsSubmittingEdit(false);
      });
  };

  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
  };

  const confirmDelete = () => {
    if (!commentToDelete || isSubmittingDelete) return;
    setIsSubmittingDelete(true);
    api.delete(`/api/forum/comments/${commentToDelete}`)
      .then(res => {
        if (res.data.success) {
          toast.success("Comment deleted successfully!");
          setCommentToDelete(null);
          fetchPost(false);
        }
      })
      .finally(() => {
        setIsSubmittingDelete(false);
      });
  };

  React.useEffect(() => {
    fetchPost(true);
  }, [slug]);

  React.useEffect(() => {
    if (!loading && post) {
      const hash = window.location.hash;
      if (hash) {
        const commentId = hash.replace('#', '');
        setTimeout(() => {
          const element = document.getElementById(commentId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight border/background flash
            element.style.transition = 'background-color 0.8s ease';
            element.style.backgroundColor = '#eff6ff'; // bg-blue-50
            setTimeout(() => {
              element.style.backgroundColor = 'transparent';
            }, 1500);
          }
        }, 300);
      }
    }
  }, [loading, post]);

  const fetchPost = (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setNotFound(false);
    }
    api.get(`/api/forum/posts/${slug}`)
      .then(res => {
        if (res.data.success) {
          setPost(res.data.data);
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to fetch post details");
        }
      })
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    api.post('/api/forum/comments', {
      post_id: post.id,
      content: commentText
    })
    .then(res => {
      if (res.data.success) {
        toast.success("Comment posted successfully!");
        setCommentText("");
        setIsCommentBoxExpanded(false);
        fetchPost(false); // Refresh post to show new comment silently
      }
    })
    .finally(() => {
      setIsSubmittingComment(false);
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleCommentShare = (comment) => {
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}#comment-${comment.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Comment link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const renderCommentContent = (comment, isReply = false) => {
    const isOwner = user && (comment.user_id === user.id || comment.user?.id === user.id);
    
    if (editingCommentId === comment.id) {
      return (
        <form onSubmit={(e) => handleEditSubmit(e, comment.id)} className="mt-2 mb-3">
          <textarea 
            rows="2" 
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 transition-all text-sm mb-2"
            autoFocus
          ></textarea>
          <div className="flex gap-2">
            <button disabled={isSubmittingEdit} type="submit" className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-[10px] flex items-center justify-center disabled:opacity-50 min-w-[50px]">
              {isSubmittingEdit ? <CircularProgress size={12} color="inherit" /> : "Save"}
            </button>
            <button disabled={isSubmittingEdit} type="button" onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full text-[10px] disabled:opacity-50">Cancel</button>
          </div>
        </form>
      );
    }

    return (
      <>
        <p className={`${isReply ? 'text-xs' : 'text-sm'} text-gray-800 leading-relaxed mb-3 break-words`}>{comment.content}</p>
        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase">
          <button onClick={() => handleReplyClick(isReply ? comment.parent_id : comment.id, isReply ? comment.user?.name : null)} className="hover:underline">Reply</button>
          {!isReply && <button onClick={() => handleCommentShare(comment)} className="hover:underline">Share</button>}
          
          {isOwner && (
            <>
              <button onClick={() => handleEditClick(comment)} className="hover:underline hover:text-blue-600">Edit</button>
              <button onClick={() => handleDelete(comment.id)} className="hover:underline hover:text-red-600">Delete</button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-dmsans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex gap-6">
        
        {/* Left Column: Post and Comments */}
        <div className="flex-grow space-y-4">
          
          {loading ? (
            <div className="flex justify-center p-20">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notFound ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl">🚫</div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Post Not Found</h2>
                <p className="text-sm text-gray-500 font-medium">This page is not found or was removed by the moderator.</p>
              </div>
              <button 
                onClick={() => navigate('/forum')}
                className="px-8 py-3 bg-[#0857d0] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95 text-sm"
              >
                Back to Community
              </button>
            </div>
          ) : !post ? (
            <div className="bg-white rounded-md p-20 text-center border border-gray-300">
               <p className="text-gray-400 font-bold italic">Something went wrong.</p>
            </div>
          ) : (
            <>
              {/* Post Detail Card */}
              <div className="bg-white rounded-md border border-gray-300 flex flex-col shadow-sm">
                
                {/* Post Content */}
                <div className="p-4 flex-grow">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-2">
                    <span className="text-gray-900 hover:underline">d/{post.category || 'General'}</span>
                    <span>•</span>
                    <span>Posted by u/{post.user?.name || 'Anonymous'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.location_tag && (
                      <>
                        <span>•</span>
                        <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">{post.location_tag}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-8 leading-relaxed">
                    {post.content}
                  </p>
                  
                  {/* Action Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-700 mt-2 border-t pt-4">
                    
                    {/* Comments Pill */}
                    <div className="flex items-center gap-1.5 bg-[#eaedef] hover:bg-gray-300 px-3 py-2 rounded-full transition cursor-pointer">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>{post.comments?.length || 0}</span>
                    </div>

                    {/* Share Pill */}
                    <div 
                      onClick={handleShare}
                      className="flex items-center gap-1.5 bg-[#eaedef] hover:bg-gray-300 px-3 py-2 rounded-full transition cursor-pointer"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-2a4 4 0 0 1 4-4h14"/><path d="M14 2l7 7-7 7"/></svg>
                      <span>Share</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Comment Box */}
              <div className="bg-white rounded-md border border-gray-300 p-3 shadow-sm">
                {!isCommentBoxExpanded ? (
                  <div 
                    onClick={() => setIsCommentBoxExpanded(true)}
                    className="flex items-center gap-3 bg-[#f6f7f8] border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:border-blue-500 transition-all cursor-text"
                  >
                    <span className="text-gray-400 text-sm">Join the conversation</span>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-widest px-1">Comment as <span className="text-blue-600">{user?.name || 'User'}</span></p>
                    <form onSubmit={handleComment}>
                      <textarea 
                        rows="4" 
                        placeholder="What are your thoughts?"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all text-sm mb-3 resize-none bg-gray-50/30"
                        autoFocus
                      ></textarea>
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button" 
                          onClick={() => { setIsCommentBoxExpanded(false); setCommentText(""); }}
                          className="px-6 py-2 text-gray-500 hover:bg-gray-100 font-black rounded-full text-xs transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={isSubmittingComment || !commentText.trim()} 
                          type="submit" 
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[100px] disabled:opacity-50"
                        >
                          {isSubmittingComment ? <CircularProgress size={14} color="inherit" /> : "Comment"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Comments List */}
              <div className="space-y-6 mt-8 pb-10">
                {(post.comments || []).filter(c => !c.parent_id).map(comment => (
                  <div key={comment.id} id={`comment-${comment.id}`} className="flex gap-4 group">
                    <div className="flex flex-col items-center shrink-0">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-600">
                         {comment.user?.name?.charAt(0) || 'U'}
                       </div>
                       <div className="flex-grow w-px bg-gray-200 my-2 group-hover:bg-blue-200 transition-colors"></div>
                    </div>
                    <div className="flex-grow min-w-0">
                       <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-2">
                         <span className="text-gray-900 font-black hover:underline cursor-pointer">u/{comment.user?.name || 'Anonymous'}</span>
                         <span>•</span>
                         <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                       </div>
                       
                       {renderCommentContent(comment, false)}

                       {/* Reply Box for Top-Level Comment */}
                       {replyingTo === comment.id && (
                         <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                           <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                             <textarea 
                               rows="2" 
                               placeholder={`Replying to u/${comment.user?.name || 'Anonymous'}`}
                               value={replyText}
                               onChange={(e) => setReplyText(e.target.value)}
                               className="w-full p-2 border border-gray-200 rounded-md outline-none focus:border-blue-500 transition-all text-xs mb-2"
                               autoFocus
                             ></textarea>
                             <div className="flex justify-end gap-2">
                               <button disabled={isSubmittingReply} type="button" onClick={() => setReplyingTo(null)} className="px-4 py-1.5 text-gray-500 font-bold rounded-full text-[10px] hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                               <button disabled={isSubmittingReply} type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-[10px] transition-all flex items-center justify-center min-w-[70px] disabled:opacity-50">
                                 {isSubmittingReply ? <CircularProgress size={12} color="inherit" /> : "Reply"}
                               </button>
                             </div>
                           </form>
                         </div>
                       )}

                       {/* Threaded Replies */}
                       {(comment.replies || []).map(reply => (
                         <div key={reply.id} className="mt-4 flex gap-4">
                           <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                             {reply.user?.name?.charAt(0) || 'U'}
                           </div>
                           <div className="min-w-0 flex-grow">
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-1">
                                <span className="text-gray-900 font-black hover:underline">u/{reply.user?.name || 'Anonymous'}</span>
                                <span>•</span>
                                <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                              </div>
                              
                              {renderCommentContent(reply, true)}
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="hidden lg:block w-80 space-y-4">
           <div className="bg-white rounded-md border border-gray-300 shadow-sm overflow-hidden">
             <div className="h-9 bg-blue-600"></div>
             <div className="p-4">
               <h3 className="font-bold text-gray-900 mb-2">d/DesipathForum</h3>
               <p className="text-xs text-gray-500 leading-relaxed mb-4">Indian community in USA. Ask anything!</p>
               <div className="border-t pt-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Rules</p>
                  <ul className="text-[10px] space-y-3 font-bold text-gray-600">
                    <li className="flex gap-2"><span>1.</span> Be respectful to all members.</li>
                    <li className="flex gap-2"><span>2.</span> No political or religious hate speech.</li>
                    <li className="flex gap-2"><span>3.</span> Avoid spamming or self-promotion.</li>
                  </ul>
               </div>
             </div>
           </div>
           <button onClick={() => navigate('/forum')} className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-black rounded-full transition-all text-xs border border-gray-200">Back to Feed</button>
        </div>

      </main>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog 
        open={Boolean(commentToDelete)} 
        onClose={() => setCommentToDelete(null)}
        PaperProps={{
          sx: { borderRadius: "12px", p: 1, minWidth: "300px" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "700", color: "#111827", fontSize: "1.1rem" }}>
          Delete Comment
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#4b5563", fontSize: "0.95rem" }}>
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            disabled={isSubmittingDelete}
            onClick={() => setCommentToDelete(null)}
            sx={{ color: "#6b7280", fontWeight: "600", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button 
            disabled={isSubmittingDelete}
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: "8px", 
              fontWeight: "600", 
              textTransform: "none",
              boxShadow: "none",
              minWidth: "80px",
              "&:hover": { boxShadow: "none" }
            }}
          >
            {isSubmittingDelete ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer newsletter={"hidden"} hideOnMobile />
    </div>
  );
}
