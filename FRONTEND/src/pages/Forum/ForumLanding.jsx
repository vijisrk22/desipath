import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

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

export default function ForumLanding() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });

  React.useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedCategory]);

  const fetchPosts = () => {
    setLoading(true);
    console.log("Fetching forum posts with search:", searchTerm, "category:", selectedCategory);
    api.get(`/api/forum/posts?search=${searchTerm}&category=${selectedCategory}`)
      .then(res => {
        console.log("Forum API Response:", res.data);
        if (res.data.success) {
          // Laravel pagination returns the array in the .data field of the pagination object
          const items = res.data.data.data || res.data.data;
          setPosts(Array.isArray(items) ? items : []);
        }
      })
      .catch(err => {
        console.error("Forum API Error:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return alert("Title and content are required");
    
    api.post('/api/forum/posts', newPost)
      .then(res => {
        if (res.data.success) {
          setIsPostModalOpen(false);
          setNewPost({ title: '', content: '', category: 'General' });
          fetchPosts();
        }
      })
      .catch(err => {
        alert("Please login to post in the community");
      });
  };

  return (
    <div className="min-h-screen bg-[#dae0e6] flex flex-col font-dmsans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex gap-6">
        
        {/* Left: Main Feed */}
        <div className="flex-grow space-y-4">
          
          {/* Create Post Input (Reddit Style) */}
          <div className="bg-white p-2 rounded-md border border-gray-300 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl grayscale">👤</div>
            <input 
              type="text" 
              placeholder="Create Post" 
              onClick={() => setIsPostModalOpen(true)}
              readOnly
              className="flex-grow bg-[#f6f7f8] border border-gray-200 rounded-md px-4 py-2 hover:bg-white hover:border-blue-500 transition-all outline-none cursor-pointer"
            />
          </div>

          {/* Post Creation Modal */}
          {isPostModalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl p-6 relative">
                <button onClick={() => setIsPostModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl">✕</button>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create a post</h2>
                
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm outline-none focus:border-blue-500"
                  >
                    <option>General</option>
                    <option>H1B Visa discussion</option>
                    <option>Indian Cooking</option>
                    <option>Real estate in USA</option>
                    <option>New to USA</option>
                    <option>About Studies</option>
                    <option>Kids</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder="Title"
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-blue-500"
                  />

                  <textarea 
                    rows="6"
                    placeholder="Text (optional)"
                    required
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                  ></textarea>

                  <div className="flex justify-end gap-3 border-t pt-4">
                    <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-black text-xs hover:bg-blue-50 transition">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-full bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition">Post</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-md border border-gray-300 flex items-center gap-6 shadow-sm overflow-x-auto">
            {['🔥 Hot', '✨ New', '🏆 Top', '📈 Rising'].map((tag, i) => (
              <button key={i} className={`px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition ${i === 0 ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tag}
              </button>
            ))}
          </div>

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
                  className="bg-white rounded-md border border-gray-300 flex hover:border-gray-400 transition-all cursor-pointer shadow-sm group"
                  onClick={() => navigate(`/forum/post/${post.id}`)}
                >
                  {/* Voting Sidebar */}
                  <div className="w-10 bg-[#f8f9fa] flex flex-col items-center py-2 gap-1 rounded-l-md shrink-0">
                    <button className="text-gray-400 hover:text-orange-600 hover:bg-gray-200 p-1 rounded transition text-lg" onClick={(e) => {e.stopPropagation(); /* handleVote(post.id, 'up') */}}>▲</button>
                    <span className="text-xs font-black text-gray-700">{post.votes}</span>
                    <button className="text-gray-400 hover:text-blue-600 hover:bg-gray-200 p-1 rounded transition text-lg" onClick={(e) => {e.stopPropagation(); /* handleVote(post.id, 'down') */}}>▼</button>
                  </div>

                  {/* Post Content */}
                  <div className="p-3 flex-grow">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-2">
                      <span className="text-gray-900 hover:underline">d/{post.category || 'General'}</span>
                      <span>•</span>
                      <span>Posted by u/{post.user?.name || 'Anonymous'}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">{post.content}</p>
                    
                    <div className="flex items-center gap-4 text-xs font-black text-gray-500 uppercase tracking-tighter">
                      <div className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded transition">
                        <span className="text-lg">💬</span> {post.comments_count} Comments
                      </div>
                      <div className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded transition">
                        <span className="text-lg">🎁</span> Award
                      </div>
                      <div className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded transition">
                        <span className="text-lg">📤</span> Share
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                <h3 className="font-bold text-gray-900 mt-[-10px]">r/DesipathForum</h3>
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

          {/* Trending Communities */}
          <div className="bg-white rounded-md border border-gray-300 shadow-sm p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-4">Communities</h3>
            <div className="space-y-4">
              <div 
                className={`flex items-center gap-3 cursor-pointer p-1 rounded hover:bg-gray-50 ${selectedCategory === '' ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">🌐</div>
                <span className="text-sm font-bold text-gray-900">All Communities</span>
              </div>
              {['H1B Visa discussion', 'Indian Cooking', 'Real estate in USA', 'New to USA', 'About Studies', 'Kids'].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between cursor-pointer group p-1 rounded hover:bg-gray-50 ${selectedCategory === item ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => setSelectedCategory(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-100">r/</div>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{item}</span>
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

      <Footer newsletter={"hidden"} />
    </div>
  );
}
