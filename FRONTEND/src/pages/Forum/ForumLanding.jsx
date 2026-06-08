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
  
  const STATE_MAP = {
    al: "alabama", ak: "alaska", az: "arizona", ar: "arkansas", ca: "california",
    co: "colorado", ct: "connecticut", de: "delaware", fl: "florida", ga: "georgia",
    hi: "hawaii", id: "idaho", il: "illinois", in: "indiana", ia: "iowa",
    ks: "kansas", ky: "kentucky", la: "louisiana", me: "maine", md: "maryland",
    ma: "massachusetts", mi: "michigan", mn: "minnesota", ms: "mississippi",
    mo: "missouri", mt: "montana", ne: "nebraska", nv: "nevada", nh: "new hampshire",
    nj: "new jersey", nm: "new mexico", ny: "new york", nc: "north carolina",
    nd: "north dakota", oh: "ohio", ok: "oklahoma", or: "oregon", pa: "pennsylvania",
    ri: "rhode island", sc: "south carolina", sd: "south dakota", tn: "tennessee",
    tx: "texas", ut: "utah", vt: "vermont", va: "virginia", wa: "washington",
    wv: "west virginia", wi: "wisconsin", wy: "wyoming", dc: "district of columbia"
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
    <div className="min-h-screen bg-pagebg flex flex-col font-inter text-textprimary">
      <Navbar />
      
      <main className="max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-card rounded-2xl border border-bordercol shadow-sm p-4">
              <h3 className="text-sm font-bold text-textsecondary uppercase tracking-widest border-b border-bordercol pb-3 mb-3">Popular Communities</h3>
              <div className="space-y-1">
                <div 
                  className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all ${selectedCategory === '' ? 'bg-primary/10 text-primary font-bold' : 'text-textsecondary hover:bg-pagebg hover:text-textprimary font-medium'}`}
                  onClick={() => setSelectedCategory('')}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${selectedCategory === '' ? 'bg-primary text-white' : 'bg-pagebg text-textsecondary'}`}>🌐</div>
                  <span>All Subforums</span>
                </div>
                {subforums.map((sub, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all ${selectedCategory === sub.name ? 'bg-primary/10 text-primary font-bold' : 'text-textsecondary hover:bg-pagebg hover:text-textprimary font-medium'}`}
                    onClick={() => setSelectedCategory(sub.name)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${selectedCategory === sub.name ? 'bg-primary text-white' : 'bg-pagebg text-textsecondary'}`}>{sub.icon || 'd/'}</div>
                    <span>{sub.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer Links (Moved to Left Sidebar for clean look) */}
            <div className="p-4 text-[12px] text-textsecondary font-medium space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <span className="hover:text-primary cursor-pointer transition-colors">User Agreement</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Content Policy</span>
              </div>
              <div className="pt-3 border-t border-bordercol">
                Desipath Inc © 2026. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="col-span-1 lg:col-span-6 space-y-6 min-w-0">
          
          {/* Create Post Input */}
          <div className="bg-card p-4 rounded-2xl border border-bordercol shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-pagebg flex items-center justify-center text-xl shrink-0">👤</div>
            <input 
              type="text" 
              placeholder="Create Post" 
              onClick={() => setIsPostModalOpen(true)}
              readOnly
              className="flex-grow min-w-0 bg-pagebg border border-bordercol rounded-full px-5 py-3 hover:bg-white hover:border-primary transition-all outline-none cursor-pointer text-sm font-medium text-textprimary placeholder:text-textsecondary"
            />
          </div>

          {/* Create Post Modal */}
          {isPostModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl p-6 relative animate-scaleUp">
                <button onClick={() => setIsPostModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-textsecondary hover:bg-gray-100 hover:text-textprimary text-xl transition-colors">✕</button>
                <h2 className="text-2xl font-bold text-textprimary mb-6">Create a post</h2>
                
                <form onSubmit={handleFormSubmit(handleCreatePost)} className="space-y-4">
                  <select 
                    {...register("category")}
                    className="w-full p-3 bg-pagebg border border-bordercol rounded-xl font-medium text-sm text-textprimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                    className="w-full p-3 bg-pagebg border border-bordercol rounded-xl font-medium text-sm text-textprimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />

                  <textarea 
                    rows="5"
                    placeholder="Text (optional)"
                    required
                    {...register("content")}
                    className="w-full p-3 bg-pagebg border border-bordercol rounded-xl font-medium text-sm text-textprimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  ></textarea>

                  <div className="flex items-center justify-between p-3 bg-pagebg rounded-xl border border-bordercol">
                    <span className="text-sm font-medium text-textsecondary">Location specific?</span>
                    <div className="flex gap-2 bg-bordercol/30 p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setValue("is_location_specific", true)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isLocationSpecific ? 'bg-card text-primary shadow-sm' : 'text-textsecondary hover:text-textprimary'}`}
                      >
                        Yes
                      </button>
                      <button 
                        type="button"
                        onClick={() => setValue("is_location_specific", false)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!isLocationSpecific ? 'bg-card text-primary shadow-sm' : 'text-textsecondary hover:text-textprimary'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {isLocationSpecific && (
                    <div className="animate-fadeIn space-y-3">
                      <div className="bg-card rounded-xl overflow-visible border border-bordercol">
                        <LocationAutocompleteInput 
                          control={control}
                          setValue={setValue}
                          type="search"
                          placeholder="Location (City, State, Zip)"
                        />
                      </div>
                      {watch("location_tag") && (
                        <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-xl border border-primary/20">
                          <span className="text-primary text-xs font-bold uppercase tracking-widest">Auto Tag:</span>
                          <span className="text-primary font-bold">{watch("location_tag")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t border-bordercol">
                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="min-h-[48px] px-6 rounded-full border-2 border-bordercol text-textprimary font-bold hover:bg-pagebg transition-all">Cancel</button>
                    <button type="submit" className="min-h-[48px] px-8 rounded-full bg-primary text-white font-bold hover:bg-primary-hover shadow-[0_8px_30px_rgb(37,99,235,0.4)] transition-all hover:-translate-y-1">Post</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filter Tabs & Tools */}
          <div className="bg-card p-2 rounded-2xl border border-bordercol shadow-sm flex flex-wrap items-center gap-2">
            {['🔥 Hot', '✨ Latest', '📈 Trending', '💬 Unanswered'].map((tag, i) => (
              <button key={i} className={`min-h-[44px] px-5 rounded-full font-bold text-sm transition-all ${i === 0 ? 'bg-primary/10 text-primary' : 'text-textsecondary hover:bg-pagebg hover:text-textprimary'}`}>
                {tag}
              </button>
            ))}
            <div className="flex-grow"></div>
            
            <button 
              onClick={() => setIsTagFilterOpen(true)}
              className={`min-h-[44px] px-4 rounded-full transition-all flex items-center gap-2 ${selectedTags.length > 0 ? 'bg-primary text-white shadow-md' : 'bg-pagebg text-textsecondary hover:bg-bordercol'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span className="font-bold text-sm">Location Filters {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
            </button>
          </div>

          {/* Filter Tags UI */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center px-2">
              <span className="text-xs font-bold text-textsecondary uppercase tracking-widest mr-2">Filtered by:</span>
              {selectedTags.map(tag => (
                <div key={tag} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold border border-primary/20">
                  {tag}
                  <button 
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="hover:text-primary-hover ml-1"
                  >✕</button>
                </div>
              ))}
              <button 
                onClick={() => setSelectedTags([])}
                className="text-sm font-bold text-textsecondary hover:text-primary hover:underline ml-2 transition-colors"
              >Clear All</button>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-card rounded-2xl p-20 text-center border border-bordercol shadow-sm">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-textprimary mb-2">No posts found</h3>
                <p className="text-textsecondary">Be the first to start a discussion in this community.</p>
                <button onClick={() => setIsPostModalOpen(true)} className="mt-6 min-h-[48px] px-8 rounded-full bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">Create Post</button>
              </div>
            ) : (
              posts.map(post => (
                <div 
                  key={post.id} 
                  className="bg-card rounded-2xl border border-bordercol flex flex-col hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer p-5"
                  onClick={() => navigate(`/forum/post/${post.slug || post.id}`)}
                >
                  <div className="w-full min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 text-sm text-textsecondary mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{post.category?.[0] || 'G'}</div>
                        <span className="font-bold text-textprimary hover:text-primary transition-colors">d/{post.category || 'General'}</span>
                      </div>
                      <span className="text-bordercol">•</span>
                      <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {post.location_tag && (
                        <>
                          <span className="text-bordercol">•</span>
                          <span className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold text-xs">{post.location_tag}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Title & Content */}
                    <h2 className="text-[20px] font-bold text-textprimary mb-2 leading-snug break-words">{post.title}</h2>
                    <p className="text-[16px] text-textsecondary line-clamp-3 mb-5 leading-relaxed break-words">{post.content}</p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3 text-sm font-bold text-textsecondary">
                      
                      {/* Like */}
                      <button 
                        onClick={(e) => handleLike(e, post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                          likedPosts.includes(post.id) 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-gray-100 hover:bg-gray-200 text-textsecondary'
                        }`}
                      >
                        {likedPosts.includes(post.id) ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        )}
                        <span>{post.votes || 0}</span>
                      </button>

                      {/* Comments */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/forum/post/${post.slug || post.id}`); }}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors text-textsecondary"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>{post.comments_count}</span>
                      </button>

                      {/* Share */}
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleShareMenu(e, post.id)}
                          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors text-textsecondary"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-2a4 4 0 0 1 4-4h14"/><path d="M14 2l7 7-7 7"/></svg>
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        {shareMenuPostId === post.id && (
                          <div className="absolute bottom-full mb-2 right-0 bg-card rounded-xl shadow-xl border border-bordercol py-2 w-48 z-50 animate-fadeIn" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => handleShareFacebook(e, post)} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                              <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span> Facebook
                            </button>
                            <button onClick={(e) => handleShareInstagram(e, post)} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                              <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span> Instagram
                            </button>
                            <div className="border-t border-bordercol my-1"></div>
                            <button onClick={(e) => handleCopyLink(e, post)} className="w-full text-left px-4 py-3 text-sm font-medium text-textprimary hover:bg-pagebg flex items-center gap-3 transition-colors">
                              <span className="w-5 flex justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span> Copy Link
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
            
            <div ref={sentinelRef} className="flex flex-col items-center mt-8 pb-8 min-h-[40px] gap-4">
              {loading && posts.length > 0 && (
                <div className="flex items-center gap-3 text-textsecondary font-medium">
                  <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading more posts...
                </div>
              )}
              {hasMore && !loading && posts.length >= 100 && (
                <button 
                  onClick={loadMore}
                  className="min-h-[48px] px-8 bg-card border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                >
                  Load More
                </button>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-textsecondary font-medium">You&apos;ve reached the end 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            
            {/* Search Box */}
            <div className="bg-card rounded-2xl border border-bordercol shadow-sm p-4">
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textsecondary text-lg">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search Forum"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-pagebg border border-bordercol focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all text-textprimary placeholder:text-textsecondary"
                  />
               </div>
            </div>

            {/* About Community */}
            <div className="bg-card rounded-2xl border border-bordercol shadow-sm overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-primary to-blue-400"></div>
              <div className="p-5 relative">
                <div className="w-16 h-16 rounded-2xl border-4 border-card -mt-12 bg-white flex items-center justify-center text-3xl shadow-sm mb-4 overflow-hidden">
                  <img src="/favicon-192x192.png" alt="DP" className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText='DP'; e.target.parentNode.className='w-16 h-16 rounded-2xl border-4 border-card -mt-12 bg-primary flex items-center justify-center text-xl shadow-sm mb-4 text-white font-bold'; }} />
                </div>
                <h3 className="text-lg font-bold text-textprimary mb-1">d/DesipathForum</h3>
                <p className="text-sm text-textsecondary leading-relaxed mb-6">
                  The premier hub for Indian students, professionals, and families in North America. Share stories, ask for advice, and grow together.
                </p>
                
                <div className="flex items-center gap-6 mb-6 pt-6 border-t border-bordercol">
                  <div>
                    <p className="font-bold text-lg text-textprimary">24.5k</p>
                    <p className="text-xs text-textsecondary font-bold uppercase tracking-widest">Members</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-success flex items-center gap-1.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                      </span>
                      452
                    </p>
                    <p className="text-xs text-textsecondary font-bold uppercase tracking-widest">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsPostModalOpen(true)} className="w-full min-h-[48px] bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">Create Post</button>
              </div>
            </div>

            {/* Rules / Guidelines */}
            <div className="bg-card rounded-2xl border border-bordercol shadow-sm p-5">
              <h3 className="text-sm font-bold text-textprimary uppercase tracking-widest border-b border-bordercol pb-3 mb-4">Community Rules</h3>
              <ol className="space-y-3 text-sm text-textsecondary font-medium list-decimal list-inside">
                <li>Be respectful and welcoming.</li>
                <li>No spam or self-promotion.</li>
                <li>Keep discussions relevant.</li>
                <li>Protect personal information.</li>
              </ol>
            </div>

          </div>
        </div>

      </main>

      {/* Tag Filter Modal */}
      {isTagFilterOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-textprimary/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
            <div className="p-5 border-b border-bordercol flex items-center justify-between bg-primary text-white">
              <div className="flex-grow">
                <h3 className="font-bold text-xl mb-1">Filter by Location Tag</h3>
                <p className="text-xs opacity-90 uppercase tracking-widest font-bold">Select one or more regions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search State (e.g. NY)"
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/70 outline-none focus:bg-white/30 focus:border-white/50 transition-all w-48 sm:w-64"
                  />
                  {tagSearchTerm && (
                    <button 
                      onClick={() => setTagSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >✕</button>
                  )}
                </div>
                <button onClick={() => { setIsTagFilterOpen(false); setTagSearchTerm(""); }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-lg">✕</button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 bg-pagebg no-scrollbar min-h-[300px]">
              {tagData
                .filter(({ states, tag }) => {
                  const searchTerm = tagSearchTerm.toLowerCase();
                  if (tag.toLowerCase().includes(searchTerm)) return true;
                  if (states.toLowerCase().includes(searchTerm)) return true;
                  const stateCodes = states.toLowerCase().split(',').map(s => s.trim());
                  return stateCodes.some(code => STATE_MAP[code] && STATE_MAP[code].includes(searchTerm));
                }).length === 0 && (
                  <div className="col-span-full py-16 text-center text-textsecondary font-bold text-lg">
                    No regional tags found for &quot;{tagSearchTerm}&quot;
                  </div>
                )}
              {tagData
                .filter(({ states, tag }) => {
                  const searchTerm = tagSearchTerm.toLowerCase();
                  if (tag.toLowerCase().includes(searchTerm)) return true;
                  if (states.toLowerCase().includes(searchTerm)) return true;
                  const stateCodes = states.toLowerCase().split(',').map(s => s.trim());
                  return stateCodes.some(code => STATE_MAP[code] && STATE_MAP[code].includes(searchTerm));
                })
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
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1.5 group ${
                      isActive 
                        ? 'border-primary bg-primary/5 shadow-md -translate-y-0.5' 
                        : 'border-bordercol bg-card hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-textprimary'}`}>{tag}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isActive ? 'bg-primary border-primary' : 'border-bordercol'
                      }`}>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary/70' : 'text-textsecondary'}`}>
                      {states}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t border-bordercol flex justify-between items-center bg-card">
              <span className="text-sm font-bold text-textsecondary">{selectedTags.length} tags selected</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedTags([])}
                  className="px-4 text-textsecondary font-bold text-sm hover:text-primary transition-colors"
                >Reset</button>
                <button 
                  onClick={() => setIsTagFilterOpen(false)}
                  className="min-h-[48px] px-8 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
                >Apply Filter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer newsletter={"hidden"} hideOnMobile />
    </div>
  );
}
