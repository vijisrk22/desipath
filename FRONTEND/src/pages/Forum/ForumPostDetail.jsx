import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';



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

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [isSubmittingPostEdit, setIsSubmittingPostEdit] = useState(false);

  const handleEditPostClick = () => {
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setIsEditingPost(true);
  };

  const handleEditPostSubmit = (e) => {
    e.preventDefault();
    if (!editPostTitle.trim() || !editPostContent.trim() || isSubmittingPostEdit) return;

    setIsSubmittingPostEdit(true);
    api.put(`/api/forum/posts/${post.id}`, { title: editPostTitle, content: editPostContent })
      .then(res => {
        if (res.data.success) {
          toast.success("Post updated successfully!");
          setIsEditingPost(false);
          fetchPost(false);
        }
      })
      .finally(() => setIsSubmittingPostEdit(false));
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      api.delete(`/api/forum/posts/${post.id}`)
        .then(res => {
          if (res.data.success) {
            toast.success("Post deleted successfully!");
            navigate('/forum');
          }
        });
    }
  };

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

  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const stored = localStorage.getItem('forum_liked_posts');
      return stored ? JSON.parse(stored) : [];
    } catch (_e) {
      return [];
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.info("Please login to like this post");
      return;
    }

    const isLiked = likedPosts.includes(post.id);
    const newLikedPosts = isLiked
      ? likedPosts.filter(id => id !== post.id)
      : [...likedPosts, post.id];
    
    setLikedPosts(newLikedPosts);
    localStorage.setItem('forum_liked_posts', JSON.stringify(newLikedPosts));

    // Update locally
    setPost(prev => ({
      ...prev,
      votes: isLiked ? prev.votes - 1 : prev.votes + 1
    }));

    api.post(`/api/forum/posts/${post.id}/vote`, {
      type: isLiked ? 'down' : 'up'
    })
    .then(res => {
      if (res.data.success) {
        setPost(prev => ({
          ...prev,
          votes: res.data.votes
        }));
      }
    })
    .catch(err => {
      console.error("Failed to vote post:", err);
    });
  };

  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const handleShareFacebook = () => {
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    setShareMenuOpen(false);
  };

  const handleShareInstagram = () => {
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Link copied! Paste it in your Instagram post."))
      .catch(err => console.error("Failed to copy link:", err));
    setShareMenuOpen(false);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(err => console.error("Failed to copy link:", err));
    setShareMenuOpen(false);
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShareMenuOpen(false);
    if (shareMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [shareMenuOpen]);

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
            className="w-full p-3 border border-bordercol rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm mb-3 bg-card text-textprimary"
            autoFocus
          ></textarea>
          <div className="flex gap-2">
            <button disabled={isSubmittingEdit} type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-xs flex items-center justify-center disabled:opacity-50 min-w-[60px] shadow-sm shadow-primary/20">
              {isSubmittingEdit ? <CircularProgress size={12} color="inherit" /> : "Save"}
            </button>
            <button disabled={isSubmittingEdit} type="button" onClick={() => setEditingCommentId(null)} className="px-5 py-2 bg-pagebg hover:bg-bordercol/50 text-textsecondary font-bold rounded-full text-xs disabled:opacity-50 transition-colors">Cancel</button>
          </div>
        </form>
      );
    }

    return (
      <>
        <p className={`${isReply ? 'text-sm' : 'text-base'} text-textprimary leading-relaxed mb-3 break-words`}>{comment.content}</p>
        <div className="flex items-center gap-4 text-xs font-bold text-textsecondary">
          <button onClick={() => handleReplyClick(isReply ? comment.parent_id : comment.id, isReply ? comment.user?.name : null)} className="hover:text-primary transition-colors">Reply</button>
          {!isReply && <button onClick={() => handleCommentShare(comment)} className="hover:text-primary transition-colors">Share</button>}
          
          {isOwner && (
            <>
              <button onClick={() => handleEditClick(comment)} className="hover:text-primary transition-colors">Edit</button>
              <button onClick={() => handleDelete(comment.id)} className="hover:text-danger transition-colors">Delete</button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-pagebg flex flex-col font-inter text-textprimary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Back button */}
        <div className="hidden lg:block lg:col-span-2">
           <button onClick={() => navigate('/forum')} className="sticky top-24 w-full min-h-[48px] bg-card hover:bg-pagebg text-textsecondary hover:text-primary font-bold rounded-full transition-all border border-bordercol shadow-sm flex items-center justify-center gap-2">
             <span>←</span> Back
           </button>
        </div>

        {/* CENTER FEED: Post and Comments */}
        <div className="col-span-1 lg:col-span-7 space-y-6 min-w-0">
          
          {loading ? (
            <div className="flex justify-center py-20">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notFound ? (
            <div className="bg-card rounded-2xl shadow-sm border border-bordercol p-12 text-center flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center text-4xl">🚫</div>
              <div>
                <h2 className="text-2xl font-bold text-textprimary mb-2">Post Not Found</h2>
                <p className="text-textsecondary font-medium">This page is not found or was removed by the moderator.</p>
              </div>
              <button 
                onClick={() => navigate('/forum')}
                className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
              >
                Back to Community
              </button>
            </div>
          ) : !post ? (
            <div className="bg-card rounded-2xl p-20 text-center border border-bordercol shadow-sm">
               <p className="text-textsecondary font-bold italic">Something went wrong.</p>
            </div>
          ) : (
            <>
              {/* Post Detail Card */}
              <div className="bg-card rounded-2xl border border-bordercol flex flex-col shadow-sm p-6">
                
                {/* Post Content */}
                <div className="w-full min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-textsecondary mb-4">
                    <span className="font-bold text-textprimary hover:text-primary transition-colors cursor-pointer">d/{post.category || 'General'}</span>
                    <span className="text-bordercol">•</span>
                    <span>Posted by <span className="font-bold hover:underline cursor-pointer">u/{post.user?.name || 'Anonymous'}</span></span>
                    <span className="text-bordercol">•</span>
                    <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {post.location_tag && (
                      <>
                        <span className="text-bordercol">•</span>
                        <span className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold text-xs">{post.location_tag}</span>
                      </>
                    )}
                  </div>
                  {isEditingPost ? (
                    <form onSubmit={handleEditPostSubmit} className="mb-8">
                      <input 
                        type="text" 
                        value={editPostTitle}
                        onChange={e => setEditPostTitle(e.target.value)}
                        className="w-full p-3 border border-bordercol rounded-xl outline-none focus:border-primary text-[20px] font-bold mb-4 bg-card text-textprimary"
                        placeholder="Post Title"
                      />
                      <textarea 
                        rows="6" 
                        value={editPostContent}
                        onChange={e => setEditPostContent(e.target.value)}
                        className="w-full p-3 border border-bordercol rounded-xl outline-none focus:border-primary text-[16px] mb-4 bg-card text-textprimary"
                        placeholder="Post Content"
                      ></textarea>
                      <div className="flex gap-2">
                        <button disabled={isSubmittingPostEdit} type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-sm disabled:opacity-50 min-w-[80px] flex justify-center">
                          {isSubmittingPostEdit ? <CircularProgress size={16} color="inherit" /> : "Save"}
                        </button>
                        <button disabled={isSubmittingPostEdit} type="button" onClick={() => setIsEditingPost(false)} className="px-6 py-2 bg-pagebg hover:bg-bordercol/50 text-textsecondary font-bold rounded-full disabled:opacity-50">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h1 className="text-[24px] md:text-[28px] font-bold text-textprimary mb-4 leading-snug">{post.title}</h1>
                      <p className="text-[16px] text-textprimary whitespace-pre-line mb-8 leading-relaxed break-words">
                        {post.content}
                      </p>
                      {post.image_url && (
                        <div className="mb-8 rounded-xl overflow-hidden bg-pagebg border border-bordercol flex justify-center max-h-96">
                          <img src={`${api.defaults.baseURL}/storage/${post.image_url}`} alt="Post attached" className="object-contain w-full h-full" />
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Action Pills */}
                  <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-textsecondary pt-4 border-t border-bordercol">
                    
                    {/* Like (Heart) Pill */}
                    <div 
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-pointer ${
                        likedPosts.includes(post.id) 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-pagebg hover:bg-bordercol/50 text-textsecondary'
                      }`}
                    >
                      {likedPosts.includes(post.id) ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      )}
                      <span>{post.votes || 0}</span>
                    </div>

                    {/* Comments Pill */}
                    <div className="flex items-center gap-2 bg-pagebg hover:bg-bordercol/50 px-4 py-2 rounded-full transition-colors cursor-pointer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span>{post.comments?.length || 0}</span>
                    </div>

                    {/* Share Pill with Dropdown */}
                    <div className="relative">
                      <div 
                        onClick={(e) => { e.stopPropagation(); setShareMenuOpen(prev => !prev); }}
                        className="flex items-center gap-2 bg-pagebg hover:bg-bordercol/50 px-4 py-2 rounded-full transition-colors cursor-pointer"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-2a4 4 0 0 1 4-4h14"/><path d="M14 2l7 7-7 7"/></svg>
                        <span>Share</span>
                      </div>
                      {shareMenuOpen && (
                        <div className="absolute bottom-full mb-2 right-0 bg-card rounded-xl shadow-xl border border-bordercol py-2 w-48 z-50 animate-fadeIn" onClick={e => e.stopPropagation()}>
                          <button onClick={handleShareFacebook} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                            <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span> Facebook
                          </button>
                          <button onClick={handleShareInstagram} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                            <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span> Instagram
                          </button>
                          <div className="border-t border-bordercol my-1"></div>
                          <button onClick={handleCopyLink} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                            <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span> Copy Link
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit/Delete options for author */}
                    {user && (post.user_id === user.id || post.user?.id === user.id) && !isEditingPost && (
                      <>
                        <div onClick={handleEditPostClick} className="flex items-center gap-2 bg-pagebg hover:bg-bordercol/50 px-4 py-2 rounded-full transition-colors cursor-pointer text-primary">
                          <span>Edit</span>
                        </div>
                        <div onClick={handleDeletePost} className="flex items-center gap-2 bg-pagebg hover:bg-bordercol/50 px-4 py-2 rounded-full transition-colors cursor-pointer text-danger">
                          <span>Delete</span>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              </div>

              {/* Comment Box */}
              <div className="bg-card rounded-2xl border border-bordercol p-4 shadow-sm">
                {!isCommentBoxExpanded ? (
                  <div 
                    onClick={() => setIsCommentBoxExpanded(true)}
                    className="flex items-center gap-3 bg-pagebg border border-bordercol rounded-full px-5 py-3 hover:bg-white hover:border-primary transition-all cursor-text group"
                  >
                    <span className="text-textsecondary text-sm font-medium group-hover:text-textprimary transition-colors">Join the conversation...</span>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <p className="text-xs text-textsecondary font-bold mb-3 px-1">Comment as <span className="text-primary">{user?.name || 'User'}</span></p>
                    <form onSubmit={handleComment}>
                      <textarea 
                        rows="4" 
                        placeholder="What are your thoughts?"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-4 border border-bordercol rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm mb-4 resize-none bg-pagebg text-textprimary"
                        autoFocus
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => { setIsCommentBoxExpanded(false); setCommentText(""); }}
                          className="min-h-[40px] px-6 text-textsecondary hover:text-textprimary hover:bg-pagebg font-bold rounded-full text-sm transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={isSubmittingComment || !commentText.trim()} 
                          type="submit" 
                          className="min-h-[40px] px-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center min-w-[100px] disabled:opacity-50"
                        >
                          {isSubmittingComment ? <CircularProgress size={16} color="inherit" /> : "Comment"}
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
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                         {comment.user?.name?.charAt(0) || 'U'}
                       </div>
                       <div className="flex-grow w-[2px] bg-bordercol my-2 group-hover:bg-primary/20 transition-colors"></div>
                    </div>
                    <div className="flex-grow min-w-0">
                       <div className="flex items-center gap-2 text-sm text-textsecondary mb-2">
                         <span className="text-textprimary font-bold hover:underline cursor-pointer">u/{comment.user?.name || 'Anonymous'}</span>
                         <span className="text-bordercol">•</span>
                         <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                       </div>
                       
                       {renderCommentContent(comment, false)}

                       {/* Reply Box for Top-Level Comment */}
                       {replyingTo === comment.id && (
                         <div className="mt-4 bg-pagebg p-4 rounded-xl border border-bordercol">
                           <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                             <textarea 
                               rows="2" 
                               placeholder={`Replying to u/${comment.user?.name || 'Anonymous'}`}
                               value={replyText}
                               onChange={(e) => setReplyText(e.target.value)}
                               className="w-full p-3 border border-bordercol rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm mb-3 bg-card text-textprimary"
                               autoFocus
                             ></textarea>
                             <div className="flex justify-end gap-2">
                               <button disabled={isSubmittingReply} type="button" onClick={() => setReplyingTo(null)} className="px-5 py-2 text-textsecondary font-bold rounded-full text-sm hover:bg-bordercol/50 transition-colors disabled:opacity-50">Cancel</button>
                               <button disabled={isSubmittingReply} type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-sm transition-all flex items-center justify-center min-w-[80px] disabled:opacity-50 shadow-md shadow-primary/20">
                                 {isSubmittingReply ? <CircularProgress size={14} color="inherit" /> : "Reply"}
                               </button>
                             </div>
                           </form>
                         </div>
                       )}

                       {/* Threaded Replies */}
                       {(comment.replies || []).map(reply => (
                         <div key={reply.id} className="mt-5 flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-pagebg flex items-center justify-center text-xs font-bold shrink-0 text-textsecondary border border-bordercol">
                             {reply.user?.name?.charAt(0) || 'U'}
                           </div>
                           <div className="min-w-0 flex-grow">
                              <div className="flex items-center gap-2 text-sm text-textsecondary mb-1">
                                <span className="text-textprimary font-bold hover:underline cursor-pointer">u/{reply.user?.name || 'Anonymous'}</span>
                                <span className="text-bordercol">•</span>
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

        {/* RIGHT COLUMN: Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-card rounded-2xl border border-bordercol shadow-sm overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-primary to-blue-400"></div>
              <div className="p-5 relative">
                <div className="w-16 h-16 rounded-2xl border-4 border-card -mt-12 bg-white flex items-center justify-center text-3xl shadow-sm mb-4 overflow-hidden">
                  <img src="/favicon-192x192.png" alt="DP" className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText='DP'; e.target.parentNode.className='w-16 h-16 rounded-2xl border-4 border-card -mt-12 bg-primary flex items-center justify-center text-xl shadow-sm mb-4 text-white font-bold'; }} />
                </div>
                <h3 className="text-lg font-bold text-textprimary mb-1">d/DesipathForum</h3>
                <p className="text-sm text-textsecondary leading-relaxed mb-6">
                  Indian community in USA. Ask anything!
                </p>
                <div className="border-t border-bordercol pt-5">
                   <p className="text-xs font-bold text-textsecondary uppercase mb-4 tracking-widest">Community Rules</p>
                   <ul className="text-sm space-y-3 font-medium text-textprimary">
                     <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Be respectful to all members.</li>
                     <li className="flex gap-3"><span className="text-primary font-bold">2.</span> No political or religious hate speech.</li>
                     <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Avoid spamming or self-promotion.</li>
                   </ul>
                </div>
              </div>
            </div>
            
            <button onClick={() => navigate('/forum')} className="w-full min-h-[48px] bg-card hover:bg-pagebg text-textsecondary hover:text-primary font-bold rounded-full transition-all text-sm border border-bordercol shadow-sm">Back to Feed</button>
          </div>
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
