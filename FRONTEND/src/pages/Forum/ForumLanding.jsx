import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';

const US_STATES = [
  { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' }, { name: 'Arizona', abbr: 'AZ' }, { name: 'Arkansas', abbr: 'AR' },
  { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' }, { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' },
  { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' }, { name: 'Hawaii', abbr: 'HI' }, { name: 'Idaho', abbr: 'ID' },
  { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' }, { name: 'Iowa', abbr: 'IA' }, { name: 'Kansas', abbr: 'KS' },
  { name: 'Kentucky', abbr: 'KY' }, { name: 'Louisiana', abbr: 'LA' }, { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' },
  { name: 'Massachusetts', abbr: 'MA' }, { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' }, { name: 'Mississippi', abbr: 'MS' },
  { name: 'Missouri', abbr: 'MO' }, { name: 'Montana', abbr: 'MT' }, { name: 'Nebraska', abbr: 'NE' }, { name: 'Nevada', abbr: 'NV' },
  { name: 'New Hampshire', abbr: 'NH' }, { name: 'New Jersey', abbr: 'NJ' }, { name: 'New Mexico', abbr: 'NM' }, { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' }, { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' }, { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' }, { name: 'Rhode Island', abbr: 'RI' }, { name: 'South Carolina', abbr: 'SC' },
  { name: 'South Dakota', abbr: 'SD' }, { name: 'Tennessee', abbr: 'TN' }, { name: 'Texas', abbr: 'TX' }, { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' }, { name: 'Virginia', abbr: 'VA' }, { name: 'Washington', abbr: 'WA' }, { name: 'West Virginia', abbr: 'WV' },
  { name: 'Wisconsin', abbr: 'WI' }, { name: 'Wyoming', abbr: 'WY' }
];

const MOCK_POSTS = [
  {
    id: 1,
    author: "tech_guru",
    time: "2 hours ago",
    title: "How to prepare for AWS Solution Architect exam in 30 days?",
    content: "I have some experience with EC2 and S3, but need a structured plan for the exam. Any recommended resources or practice tests?",
    votes: 124,
    comments: 45,
    category: "Cloud Computing"
  },
  {
    id: 2,
    author: "moving_to_us",
    time: "5 hours ago",
    title: "Best neighborhoods in Chicago for Indian families?",
    content: "Looking for areas with good schools and grocery stores nearby. Is Naperville the only option?",
    votes: 89,
    comments: 62,
    category: "Living in USA"
  },
  {
    id: 3,
    author: "js_wizard",
    time: "1 day ago",
    title: "React Server Components vs Client Components - When to use what?",
    content: "I'm still confused about the hydration boundary. Can someone explain it with a real-world example?",
    votes: 215,
    comments: 18,
    category: "Web Development"
  }
];

import api from '../../utils/api';
import { useForm } from 'react-hook-form';
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';

export default function ForumLanding() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubforumModalOpen, setIsSubforumModalOpen] = useState(false);
  const [subforums, setSubforums] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [forumState, setForumState] = useState("");
  const [shareMenuPostId, setShareMenuPostId] = useState(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      category: 'General',
      location: '',
      location_tag: '',
      is_location_specific: false
    }
  });

  const isLocationSpecific = watch("is_location_specific");
  const locationValue = watch("location");

  React.useEffect(() => {
    if (isPostModalOpen) {
      reset({
        title: '',
        content: '',
        category: subforums.length > 0 ? subforums[0].name : 'General',
        location: user?.location || '',
        location_tag: user?.location ? getTagFromLocation(user.location) : '',
        is_location_specific: false
      });
    }
  }, [isPostModalOpen, user, subforums]);

  const getTagFromLocation = (location) => {
    if (!location) return "";
    const stateToTag = {
      'Alabama': '#DesiATLSouth',
      'Alaska': '#DesiPacificNW',
      'Arizona': '#DesiAZ',
      'Arkansas': '#DesiNWA',
      'California': '#DesiCA',
      'Colorado': '#DesiDenverUtahWyoming',
      'Connecticut': '#DesiMACTNewEngland',
      'Delaware': '#DesiPhillyDEWV',
      'District of Columbia': '#DesiDMVArea',
      'Florida': '#DesiFL',
      'Georgia': '#DesiATLSouth',
      'Hawaii': '#DesiCA',
      'Idaho': '#DesiPacificNW',
      'Illinois': '#DesiChicagoIL',
      'Indiana': '#DesiIndy',
      'Iowa': '#DesiWisconsinIO',
      'Kansas': '#DesiMOKS',
      'Kentucky': '#DesiLouisville',
      'Louisiana': '#DesiLouisiana',
      'Maine': '#DesiMACTNewEngland',
      'Maryland': '#DesiDMVArea',
      'Massachusetts': '#DesiMACTNewEngland',
      'Michigan': '#DesiMichigan',
      'Minnesota': '#DesiMinnesotaNDSD',
      'Mississippi': '#DesiATLSouth',
      'Missouri': '#DesiMOKS',
      'Montana': '#DesiPacificNW',
      'Nebraska': '#DesiOmaha',
      'Nevada': '#DesiLasVegas',
      'New Hampshire': '#DesiMACTNewEngland',
      'New Jersey': '#DesiNYNJ',
      'New York': '#DesiNYNJ',
      'North Carolina': '#DesiCarolinas',
      'North Dakota': '#DesiMinnesotaNDSD',
      'Ohio': '#DesiOhio',
      'Oklahoma': '#DesiOKNM',
      'Oregon': '#DesiPacificNW',
      'Pennsylvania': '#DesiPhillyDEWV',
      'Rhode Island': '#DesiMACTNewEngland',
      'South Carolina': '#DesiCarolinas',
      'South Dakota': '#DesiMinnesotaNDSD',
      'Tennessee': '#DesiNashville',
      'Texas': '#DesiTX',
      'Utah': '#DesiDenverUtahWyoming',
      'Vermont': '#DesiMACTNewEngland',
      'Virginia': '#DesiDMVArea',
      'Washington': '#DesiPacificNW',
      'West Virginia': '#DesiPhillyDEWV',
      'Wisconsin': '#DesiWisconsinIO',
      'Wyoming': '#DesiDenverUtahWyoming',
      'Ontario': '#DesiGTA',
      'British Columbia': '#DesiVancouver',
    };
    for (const [state, tag] of Object.entries(stateToTag)) {
      if (location.toLowerCase().includes(state.toLowerCase())) return tag;
    }
    return "";
  };
  
  const tagData = [
    { tag: '#DesiATLSouth', states: 'al, ga, ms' },
    { tag: '#DesiPacificNW', states: 'ak, id, mt, or, wa' },
    { tag: '#DesiAZ', states: 'az' },
    { tag: '#DesiNWA', states: 'ar' },
    { tag: '#DesiCA', states: 'ca, hi' },
    { tag: '#DesiDenverUtahWyoming', states: 'co, ut, wy' },
    { tag: '#DesiMACTNewEngland', states: 'ct, me, ma, ri, vt' },
    { tag: '#DesiPhillyDEWV', states: 'de, pa, wv' },
    { tag: '#DesiDMVArea', states: 'dc, md, va' },
    { tag: '#DesiFL', states: 'fl' },
    { tag: '#DesiChicagoIL', states: 'il' },
    { tag: '#DesiIndy', states: 'in' },
    { tag: '#DesiWisconsinIO', states: 'ia, wi' },
    { tag: '#DesiMOKS', states: 'ks, mo' },
    { tag: '#DesiLouisville', states: 'ky' },
    { tag: '#DesiLouisiana', states: 'la' },
    { tag: '#DesiMichigan', states: 'mi' },
    { tag: '#DesiMinnesotaNDSD', states: 'mn, nd, sd' },
    { tag: '#DesiOmaha', states: 'ne' },
    { tag: '#DesiLasVegas', states: 'nv' },
    { tag: '#DesiCTMANewEngland', states: 'nh' },
    { tag: '#DesiNYNJ', states: 'nj, ny' },
    { tag: '#DesiOKNM', states: 'nm, ok' },
    { tag: '#DesiCarolinas', states: 'nc, sc' },
    { tag: '#DesiOhio', states: 'oh' },
    { tag: '#DesiNashville', states: 'tn' },
    { tag: '#DesiTX', states: 'tx' },
    { tag: '#DesiGTA', states: 'on' },
    { tag: '#DesiVancouver', states: 'bc' }
  ].sort((a, b) => a.tag.localeCompare(b.tag));

  // Sync auto tag when location changes in form
  React.useEffect(() => {
    const tag = getTagFromLocation(locationValue);
    setValue("location_tag", tag);
  }, [locationValue, setValue]);

  const fetchSubforums = () => {
    api.get('/api/forum/subforums')
      .then(res => {
        if (res.data.success) {
          setSubforums(res.data.data);
          if (res.data.data.length > 0) {
             setValue("category", res.data.data[0].name);
          }
        }
      });
  };

  React.useEffect(() => {
    if (user?.location) {
      const locationUpper = user.location.toUpperCase();
      let foundState = US_STATES.find(s => locationUpper.includes(s.name.toUpperCase()));
      
      if (!foundState) {
        const parts = locationUpper.split(/[\s,]+/);
        foundState = US_STATES.find(s => parts.includes(s.abbr));
      }

      if (foundState) {
        setForumState(foundState.abbr);
      }
    }
  }, [user]);

  React.useEffect(() => {
    fetchSubforums();
  }, []);

  React.useEffect(() => {
    setPage(1);
    fetchPosts(1, false);
  }, [searchTerm, selectedCategory, selectedTags, forumState]);

  const fetchPosts = (currentPage = 1, append = false) => {
    setLoading(true);
    loadingRef.current = true;
    const tagsParam = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
    const stateParam = forumState ? `&state=${forumState}` : '';
    api.get(`/api/forum/posts?search=${searchTerm}&category=${selectedCategory}&page=${currentPage}${tagsParam}${stateParam}`)
      .then(res => {
        if (res.data.success) {
          const newPosts = res.data.data.data || res.data.data;
          setPosts(append ? prev => [...prev, ...(Array.isArray(newPosts) ? newPosts : [])] : (Array.isArray(newPosts) ? newPosts : []));
          setHasMore(res.data.data.current_page < res.data.data.last_page);
        }
      })
      .catch(err => console.error("Forum API Error:", err))
      .finally(() => { setLoading(false); loadingRef.current = false; });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handleCreatePost = (data) => {
    if (!data.title || !data.content) return alert("Title and content are required");
    
    const finalData = {
      ...data,
      location: data.is_location_specific ? data.location : '',
      location_tag: data.is_location_specific ? data.location_tag : ''
    };

    api.post('/api/forum/posts', finalData)
      .then(res => {
        if (res.data.success) {
          setIsPostModalOpen(false);
          reset();
          fetchPosts();
        }
      })
      .catch(err => {
        alert("Please login to post in the community");
      });
  };
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const stored = localStorage.getItem('forum_liked_posts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const handleLike = (e, post) => {
    e.stopPropagation();
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

    // Update locally first
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === post.id 
          ? { ...p, votes: isLiked ? p.votes - 1 : p.votes + 1 }
          : p
      )
    );

    api.post(`/api/forum/posts/${post.id}/vote`, {
      type: isLiked ? 'down' : 'up'
    })
    .then(res => {
      if (res.data.success) {
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p.id === post.id 
              ? { ...p, votes: res.data.votes }
              : p
          )
        );
      }
    })
    .catch(err => {
      console.error("Failed to vote post:", err);
    });
  };

  const handleShareFacebook = (e, post) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    setShareMenuPostId(null);
  };

  const handleShareInstagram = (e, post) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Link copied! Paste it in your Instagram post."))
      .catch(err => console.error("Failed to copy link:", err));
    setShareMenuPostId(null);
  };

  const handleCopyLink = (e, post) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/forum/post/${post.slug || post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(err => console.error("Failed to copy link:", err));
    setShareMenuPostId(null);
  };

  const toggleShareMenu = (e, postId) => {
    e.stopPropagation();
    setShareMenuPostId(prev => prev === postId ? null : postId);
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShareMenuPostId(null);
    if (shareMenuPostId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [shareMenuPostId]);

  // Infinite scroll with IntersectionObserver (auto-load first 100 posts only)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || posts.length >= 100) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, page, posts.length]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex gap-6">
        
        {/* Left: Main Feed */}
        <div className="flex-grow min-w-0 space-y-4">
          
          {/* Create Post Input (Reddit Style) */}
          <div className="bg-white p-2 rounded-md border border-gray-300 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0 grayscale">👤</div>
            <input 
              type="text" 
              placeholder="Create Post" 
              onClick={() => setIsPostModalOpen(true)}
              readOnly
              className="flex-grow min-w-0 bg-[#f6f7f8] border border-gray-200 rounded-md px-4 py-2 hover:bg-white hover:border-blue-500 transition-all outline-none cursor-pointer text-sm"
            />
          </div>

          {/* Post Creation Modal */}
          {isPostModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl p-6 relative">
                <button onClick={() => setIsPostModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create a post</h2>
                
                <form onSubmit={handleFormSubmit(handleCreatePost)} className="space-y-4">
                  <select 
                    {...register("category")}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-xs outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {subforums.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>

                  <input 
                    type="text" 
                    placeholder="Title"
                    required
                    {...register("title")}
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500"
                  />

                  <textarea 
                    rows="4"
                    placeholder="Text (optional)"
                    required
                    {...register("content")}
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 resize-none"
                  ></textarea>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Is this post related to a specific location?</span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setValue("is_location_specific", true)}
                        className={`px-4 py-1 rounded-full text-[10px] font-black transition ${isLocationSpecific ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
                      >
                        Yes
                      </button>
                      <button 
                        type="button"
                        onClick={() => setValue("is_location_specific", false)}
                        className={`px-4 py-1 rounded-full text-[10px] font-black transition ${!isLocationSpecific ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {isLocationSpecific && (
                    <div className="animate-fadeIn space-y-3">
                      <div className="bg-white rounded-lg overflow-visible">
                        <LocationAutocompleteInput 
                          control={control}
                          setValue={setValue}
                          type="search"
                          placeholder="Location (City, State, Zip)"
                        />
                      </div>

                      {watch("location_tag") && (
                        <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-lg border border-orange-100">
                          <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest">Auto Tag:</span>
                          <span className="text-orange-600 text-[10px] font-black">{watch("location_tag")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 border-t pt-4">
                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-black text-xs hover:bg-blue-50 transition">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-full bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition">Post</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Mobile Subforum Selector Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsSubforumModalOpen(true)}
              className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">d/</div>
                <span className="font-bold text-sm text-gray-700">
                  {selectedCategory || "Browse all Subforums"}
                </span>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${isSubforumModalOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Subforum Popup Modal (Mobile Only) */}
          {isSubforumModalOpen && (
            <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
              <div className="bg-white rounded-t-3xl sm:rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Explore Subforums</h3>
                  <button onClick={() => setIsSubforumModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-4 space-y-2 no-scrollbar">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${selectedCategory === '' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-700'}`}
                    onClick={() => { setSelectedCategory(''); setIsSubforumModalOpen(false); }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg">🌐</div>
                    <span className="font-bold text-sm">All Subforums</span>
                  </div>
                  {subforums.map((sub, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 p-3 rounded-xl transition ${selectedCategory === sub.name ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-700'}`}
                      onClick={() => { setSelectedCategory(sub.name); setIsSubforumModalOpen(false); }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-indigo-600">{sub.icon || 'd/'}</div>
                      <span className="font-bold text-sm">{sub.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tag Filter Popup Modal */}
          {isTagFilterOpen && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-600 text-white">
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">Filter by Location Tag</h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Select one or more regions</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors">🔍</span>
                      <input 
                        type="text" 
                        placeholder="Search State (e.g. NY)"
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                        className="bg-white/20 border border-white/30 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-white/60 outline-none focus:bg-white/30 focus:border-white/50 transition-all w-48 sm:w-64"
                      />
                      {tagSearchTerm && (
                        <button 
                          onClick={() => setTagSearchTerm("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                        >✕</button>
                      )}
                    </div>
                    <button onClick={() => { setIsTagFilterOpen(false); setTagSearchTerm(""); }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">✕</button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 no-scrollbar min-h-[300px]">
                  {tagData
                    .filter(({ states, tag }) => 
                      states.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
                      tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="col-span-full py-12 text-center text-gray-400 font-bold italic">
                        No regional tags found for "{tagSearchTerm}"
                      </div>
                    )}
                  {tagData
                    .filter(({ states, tag }) => 
                      states.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
                      tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
                    )
                    .map(({ tag, states }) => {
                    const isActive = selectedTags.includes(tag);
                    return (
                      <div 
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev => 
                            isActive ? prev.filter(t => t !== tag) : [...prev, tag]
                          );
                        }}
                        className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col gap-1 group ${
                          isActive 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black ${isActive ? 'scale-105' : ''} transition-transform`}>{tag}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isActive ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                          {states}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="text-[11px] font-bold text-gray-500">{selectedTags.length} tags selected</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedTags([])}
                      className="px-6 py-2 text-gray-500 font-bold text-xs hover:underline"
                    >Reset</button>
                    <button 
                      onClick={() => setIsTagFilterOpen(false)}
                      className="px-8 py-2 bg-blue-600 text-white font-black rounded-full text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                    >Apply Filter</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-3 rounded-md border border-gray-300 flex items-center gap-4 sm:gap-6 shadow-sm overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setIsTagFilterOpen(true)}
              className={`p-2 rounded-full transition flex items-center gap-2 hover:bg-gray-100 ${selectedTags.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
              title="Filter by Location Tag"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              {selectedTags.length > 0 && <span className="text-xs font-bold">{selectedTags.length}</span>}
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition min-w-max">
              <span className="text-gray-500 text-sm">📍</span>
              <select 
                value={forumState}
                onChange={(e) => setForumState(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-4 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .2rem top 50%', backgroundSize: '.65rem auto' }}
              >
                <option value="">All States</option>
                {US_STATES.map(s => (
                  <option key={s.abbr} value={s.abbr}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="h-6 w-px bg-gray-200"></div>

            {['🔥 Hot', '✨ New'].map((tag, i) => (
              <button key={i} className={`px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition ${i === 0 ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tag}
              </button>
            ))}
          </div>

          {/* Active Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center px-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filtered by:</span>
              {selectedTags.map(tag => (
                <div key={tag} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
                  {tag}
                  <button 
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="hover:text-blue-200 transition-colors"
                  >✕</button>
                </div>
              ))}
              <button 
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-bold text-blue-600 hover:underline ml-2"
              >Clear All</button>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-md p-20 text-center border border-gray-300">
                <p className="text-gray-400 font-bold italic">No posts found in the community.</p>
              </div>
            ) : (
              posts.map(post => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-md border border-gray-300 flex flex-col hover:border-gray-400 transition-all cursor-pointer shadow-sm group p-3"
                  onClick={() => navigate(`/forum/post/${post.slug || post.id}`)}
                >
                  {/* Post Content */}
                  <div className="w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 mb-2">
                      <img src="/reddit-avatar.png" alt="" className="w-5 h-5 rounded-full bg-gray-200" onError={(e) => e.target.style.display='none'} />
                      <span className="text-gray-900 font-bold hover:underline break-all">d/{post.category || 'General'}</span>
                      <span>•</span>
                      <span className="truncate">{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.location_tag && (
                        <>
                          <span>•</span>
                          <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">{post.location_tag}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors break-words">{post.title}</h2>
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed break-words">{post.content}</p>
                    
                    {/* Action Pills */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-gray-700 mt-2">
                      
                      {/* Like (Heart) Pill */}
                      <div 
                        onClick={(e) => handleLike(e, post)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition cursor-pointer ${
                          likedPosts.includes(post.id) 
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                            : 'bg-[#eaedef] hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {likedPosts.includes(post.id) ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        )}
                        <span>{post.votes || 0}</span>
                      </div>

                      {/* Comments Pill */}
                      <div className="flex items-center gap-1.5 bg-[#eaedef] hover:bg-gray-300 px-3 py-2 rounded-full transition cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>{post.comments_count}</span>
                      </div>

                      {/* Share Pill with Dropdown */}
                      <div className="relative">
                        <div 
                          onClick={(e) => toggleShareMenu(e, post.id)}
                          className="flex items-center gap-1.5 bg-[#eaedef] hover:bg-gray-300 px-3 py-2 rounded-full transition cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-2a4 4 0 0 1 4-4h14"/><path d="M14 2l7 7-7 7"/></svg>
                          <span className="hidden sm:inline">Share</span>
                        </div>
                        {shareMenuPostId === post.id && (
                          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-48 z-50 animate-in fade-in slide-in-from-bottom-2" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => handleShareFacebook(e, post)} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-blue-50 flex items-center gap-3 transition-colors">
                              <span className="text-lg">📘</span> Facebook
                            </button>
                            <button onClick={(e) => handleShareInstagram(e, post)} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-pink-50 flex items-center gap-3 transition-colors">
                              <span className="text-lg">📸</span> Instagram
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={(e) => handleCopyLink(e, post)} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 flex items-center gap-3 transition-colors">
                              <span className="text-lg">🔗</span> Copy Link
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Infinite Scroll Sentinel / Load More */}
            <div ref={sentinelRef} className="flex flex-col items-center mt-6 pb-6 min-h-[40px] gap-3">
              {loading && posts.length > 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading more posts...
                </div>
              )}
              {/* Show Load More button after 100 posts */}
              {hasMore && !loading && posts.length >= 100 && (
                <button 
                  onClick={loadMore}
                  className="px-6 py-2.5 bg-white border border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition shadow-sm active:scale-95"
                >
                  Load More
                </button>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-gray-400 text-sm">You've reached the end 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="hidden lg:block w-80 space-y-4">
          
          {/* Search Box */}
          <div className="bg-white rounded-md border border-gray-300 shadow-sm p-3">
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search Forum"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f6f7f8] border border-transparent focus:border-blue-500 focus:bg-white rounded-full pl-10 pr-4 py-2 text-sm outline-none transition-all"
                />
             </div>
          </div>

          {/* About Community */}
          <div className="bg-white rounded-md border border-gray-300 shadow-sm overflow-hidden">
            <div className="h-9 bg-blue-600"></div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full border-4 border-white -mt-10 bg-blue-500 flex items-center justify-center text-2xl text-white font-fredoka">D</div>
                <h3 className="font-bold text-gray-900 mt-[-10px]">d/DesipathForum</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                The hub for Indian students, professionals, and families in the USA. Share stories, ask for advice, and grow together.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><p className="font-bold text-sm">24.5k</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Members</p></div>
                <div><p className="font-bold text-sm text-emerald-500 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 452</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Online</p></div>
              </div>
              <button onClick={() => setIsPostModalOpen(true)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full transition-all shadow-lg shadow-blue-500/20">Create Post</button>
            </div>
          </div>

          {/* Trending Subforums */}
          <div className="bg-white rounded-md border border-gray-300 shadow-sm p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Subforums</h3>
            <div className="space-y-4">
              <div 
                className={`flex items-center gap-3 cursor-pointer p-1 rounded hover:bg-gray-50 ${selectedCategory === '' ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">🌐</div>
                <span className="text-sm font-bold text-gray-900">All Subforums</span>
              </div>
              {subforums.map((sub, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between cursor-pointer group p-1 rounded hover:bg-gray-50 ${selectedCategory === sub.name ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => setSelectedCategory(sub.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-100">{sub.icon || 'd/'}</div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{sub.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer links in sidebar */}
          <div className="bg-white rounded-md border border-gray-300 shadow-sm p-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest grid grid-cols-2 gap-y-2">
            <span className="hover:underline cursor-pointer">User Agreement</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Content Policy</span>
            <span className="hover:underline cursor-pointer">Moderator Code</span>
            <div className="col-span-full border-t mt-2 pt-2 text-center">
              Desipath Inc © 2026. All rights reserved.
            </div>
          </div>

        </div>

      </main>

      <Footer newsletter={"hidden"} hideOnMobile />
    </div>
  );
}
