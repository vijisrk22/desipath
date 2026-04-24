import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const CATEGORIES = [
  {
    name: "Indian Languages",
    color: "bg-orange-50 border-orange-200 text-orange-900 border",
    accent: "bg-orange-100 text-orange-600",
    slug: "indian-languages",
    icon: "🗣",
    subcategories: [
      { name: "Hindi", slug: "hindi", icon: "अ" },
      { name: "Tamil", slug: "tamil", icon: "அ" },
      { name: "Telugu", slug: "telugu", icon: "అ" },
      { name: "Kannada", slug: "kannada", icon: "ಅ" },
      { name: "Malayalam", slug: "malayalam", icon: "അ" },
      { name: "Gujarati", slug: "gujarati", icon: "અ" },
      { name: "Punjabi", slug: "punjabi", icon: "ਅ" },
    ],
  },
  {
    name: "Classical Arts",
    color: "bg-pink-50 border-pink-200 text-pink-900 border",
    accent: "bg-pink-100 text-pink-600",
    slug: "classical-arts",
    icon: "🎭",
    subcategories: [
      { name: "Bharatanatyam", slug: "bharatanatyam", icon: "💃" },
      { name: "Kathak", slug: "kathak", icon: "💃" },
    ],
  },
  {
    name: "Music",
    color: "bg-purple-50 border-purple-200 text-purple-900 border",
    accent: "bg-purple-100 text-purple-600",
    slug: "music",
    icon: "🎵",
    subcategories: [
      { name: "Carnatic Vocal", slug: "carnatic-vocal", icon: "🎤" },
      { name: "Hindustani Vocal", slug: "hindustani-vocal", icon: "🎤" },
      { name: "Veena", slug: "veena", icon: "🎸" },
      { name: "Keyboard", slug: "keyboard", icon: "🎹" },
      { name: "Mridangam", slug: "mridangam", icon: "🥁" },
      { name: "Tabla", slug: "tabla", icon: "🥁" },
    ],
  },
  {
    name: "Academic Classes",
    color: "bg-blue-50 border-blue-200 text-blue-900 border",
    accent: "bg-blue-100 text-blue-600",
    slug: "academic-classes",
    icon: "📚",
    subcategories: [
      { name: "Online Chess", slug: "online-chess", icon: "♟️" },
      { name: "Online English", slug: "online-english", icon: "📖" },
      { name: "Maths Class", slug: "maths", icon: "🧮" },
      { name: "Computer Programming", slug: "computer-programming", icon: "💻" },
    ],
  },
  {
    name: "Spiritual & Cultural",
    color: "bg-yellow-50 border-yellow-200 text-yellow-900 border",
    accent: "bg-yellow-100 text-yellow-700",
    slug: "spiritual-cultural",
    icon: "🕉",
    subcategories: [
      { name: "Sloka Chanting", slug: "sloka-chanting", icon: "🙏" },
      { name: "Vedic Math", slug: "vedic-math", icon: "🔢" },
      { name: "Shlokas w/ Meaning", slug: "shlokas-meaning", icon: "📝" },
    ],
  },
  {
    name: "Mythology Storytelling",
    color: "bg-red-50 border-red-200 text-red-900 border",
    accent: "bg-red-100 text-red-600",
    slug: "mythology-storytelling",
    icon: "📜",
    subcategories: [
      { name: "Ramayana", slug: "ramayana", icon: "🏹" },
      { name: "Mahabharata", slug: "mahabharata", icon: "⚔️" },
      { name: "Panchatantra", slug: "panchatantra", icon: "🐅" },
    ],
  },
];

export default function KidsClassLanding() {
  const [searchTerm, setSearchTerm] = useState("");

  // Real-time filtering logic
  const filteredCategories = CATEGORIES.map((category) => {
    // If the category name itself matches, show all its subcategories
    if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return category;
    }
    // Otherwise, filter subcategories
    const filteredSubs = category.subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, subcategories: filteredSubs };
  }).filter((category) => category.subcategories.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-r from-blue-100 via-[#e0f2fe] to-pink-100 py-5 px-[7%] relative overflow-hidden">
        {/* Top Right Action Button */}
        <div className="absolute top-4 right-[7%] z-20 hidden md:block">
          <Link 
            to="/kids-class/instructor-portal"
            className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] text-gray-800 text-sm font-bold rounded-[57px] shadow-md transition-all flex items-center gap-2"
          >
            <span>📢</span>
            Post Ad
          </Link>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#007185] font-dmsans mb-4">
            Explore Classes for Kids 🎨📚
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-medium mb-6 max-w-2xl">
            Discover a world of rich cultural learning, academics, and arts. Find the perfect classes to nurture your child's roots and talents!
          </p>

          {/* Search Bar Container */}
          <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Search for languages, math, music..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-12 pr-6 rounded-full border-2 border-white shadow-md focus:outline-none focus:border-[#ffa41c] text-base font-dmsans transition-colors"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </span>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
           <span className="text-9xl">🎒</span>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="flex-grow w-full px-[7%] py-6">
        {filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category, idx) => (
              <div key={idx} className={`p-5 md:p-6 rounded-2xl ${category.color} shadow-sm border`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`text-2xl md:text-3xl w-12 h-12 rounded-full flex items-center justify-center ${category.accent}`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-dmsans">
                    {category.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {category.subcategories.map((sub, jdx) => (
                    <Link
                      key={jdx}
                      to={`/kids-class/${category.slug}/${sub.slug}`}
                      className="bg-white hover:bg-gray-50 flex flex-nowrap items-center gap-2 p-3 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      <span className="text-lg md:text-xl shrink-0">{sub.icon}</span>
                      <span className="font-semibold text-gray-800 text-sm font-dmsans truncate">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium text-xl">
            No classes found matching "{searchTerm}" 😔
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
