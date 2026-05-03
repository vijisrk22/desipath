import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  React.useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = () => {
    setLoading(true);
    api.get(`/api/forum/posts/${id}`)
      .then(res => {
        if (res.data.success) {
          setPost(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    api.post('/api/forum/comments', {
      post_id: id,
      content: commentText
    })
    .then(res => {
      if (res.data.success) {
        setCommentText("");
        fetchPost(); // Refresh post to show new comment
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#dae0e6] flex flex-col font-dmsans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex gap-6">
        
        {/* Left Column: Post and Comments */}
        <div className="flex-grow space-y-4">
          
          {loading || !post ? (
            <div className="flex justify-center p-20">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Post Detail Card */}
              <div className="bg-white rounded-md border border-gray-300 flex shadow-sm">
                {/* Voting Sidebar */}
                <div className="w-10 bg-white flex flex-col items-center py-4 gap-1 rounded-l-md shrink-0 border-r border-gray-50">
                  <button className="text-gray-400 hover:text-orange-600 hover:bg-gray-100 p-1 rounded transition text-xl">▲</button>
                  <span className="text-xs font-black text-gray-700">{post.votes}</span>
                  <button className="text-gray-400 hover:text-blue-600 hover:bg-gray-100 p-1 rounded transition text-xl">▼</button>
                </div>

                {/* Post Content */}
                <div className="p-4 flex-grow">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-2">
                    <span className="text-gray-900 hover:underline">d/{post.category || 'General'}</span>
                    <span>•</span>
                    <span>Posted by u/{post.user?.name || 'Anonymous'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-8 leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-6 text-[11px] font-black text-gray-400 uppercase tracking-tighter border-t pt-4">
                    <div className="flex items-center gap-2">💬 {post.comments?.length || 0} Comments</div>
                    <div className="flex items-center gap-2">🎁 Give Award</div>
                    <div className="flex items-center gap-2">📤 Share</div>
                    <div className="flex items-center gap-2">💾 Save</div>
                  </div>
                </div>
              </div>

              {/* Comment Box */}
              <div className="bg-white rounded-md border border-gray-300 p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-widest">Comment as <span className="text-blue-600">User</span></p>
                <form onSubmit={handleComment}>
                  <textarea 
                    rows="4" 
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-blue-500 transition-all text-sm mb-3"
                  ></textarea>
                  <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full text-xs transition-all shadow-lg shadow-blue-500/20">Comment</button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6 mt-8 pb-10">
                {(post.comments || []).map(comment => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center shrink-0">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-600">
                         {comment.user?.name?.charAt(0) || 'U'}
                       </div>
                       <div className="flex-grow w-px bg-gray-200 my-2 group-hover:bg-blue-200 transition-colors"></div>
                    </div>
                    <div className="flex-grow">
                       <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-2">
                         <span className="text-gray-900 font-black hover:underline cursor-pointer">u/{comment.user?.name || 'Anonymous'}</span>
                         <span>•</span>
                         <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                       </div>
                       <p className="text-sm text-gray-800 leading-relaxed mb-3">{comment.content}</p>
                       
                       <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase">
                          <div className="flex items-center gap-1">
                            <button className="hover:text-orange-600 text-sm">▲</button>
                            <span>{comment.votes}</span>
                            <button className="hover:text-blue-600 text-sm">▼</button>
                          </div>
                          <button className="hover:underline">Reply</button>
                          <button className="hover:underline">Share</button>
                       </div>

                       {/* Threaded Replies */}
                       {(comment.replies || []).map(reply => (
                         <div key={reply.id} className="mt-4 flex gap-4">
                           <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                             {reply.user?.name?.charAt(0) || 'U'}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-1">
                                <span className="text-gray-900 font-black hover:underline">u/{reply.user?.name || 'Anonymous'}</span>
                                <span>•</span>
                                <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed mb-2">{reply.content}</p>
                              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase">
                                <div className="flex items-center gap-1">
                                  <button className="hover:text-orange-600 text-xs">▲</button>
                                  <span>{reply.votes}</span>
                                  <button className="hover:text-blue-600 text-xs">▼</button>
                                </div>
                                <button className="hover:underline">Reply</button>
                              </div>
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
               <h3 className="font-bold text-gray-900 mb-2">r/DesipathForum</h3>
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
           <button onClick={() => navigate('/forum')} className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-full transition-all text-xs border border-gray-200">Back to Feed</button>
        </div>

      </main>

      <Footer newsletter={"hidden"} />
    </div>
  );
}
