import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const AboutUs = () => {
    const services = [
        { title: "Home & Roommates", icon: "🏠", desc: "Finding the right place to live is the first step in building a life in a new home." },
        { title: "Cars & Transport", icon: "🚗", desc: "Buy or sell vehicles within the community with trust and transparency." },
        { title: "Events & Culture", icon: "🎉", desc: "Never miss a community gathering, concert, or festival happening near you." },
        { title: "Professional Services", icon: "💼", desc: "Connect with Desi doctors, lawyers, and IT trainers who understand your needs." },
        { title: "Travel Companions", icon: "✈️", desc: "Traveling back home? Find friends and companions to share the journey with." },
        { title: "Kids Education", icon: "🎓", desc: "Preserve our heritage with classes for kids focusing on language, music, and arts." }
    ];

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-[7%] flex flex-col lg:flex-row items-center gap-16">
                    <div 
                        className="flex-1 text-center lg:text-left relative z-10"
                    >
                        <span className="text-[#0857d0] font-bold tracking-widest uppercase text-sm mb-4 inline-block">Established 2024</span>
                        <h1 className="text-5xl lg:text-7xl font-bold font-dmsans text-gray-900 leading-tight mb-6">
                            Connecting the <span className="text-[#ffa41c]">Desi Heart</span> in North America.
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Desipath is more than a platform; it's a digital bridge for millions of Desi people across the US and Canada. We believe in the power of community to make life in a new country feel like home.
                        </p>
                    </div>
                    
                    <div 
                        className="flex-1 relative"
                    >
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl z-10">
                            <img src="/about_us_hero.png" alt="Desi Community" className="w-full h-auto" />
                        </div>
                        {/* Decorative Blobs */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 -z-0"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-60 -z-0"></div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-[#0857d0] py-20">
                <div className="container mx-auto px-[7%] grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    <div>
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">1M+</div>
                        <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Active Users</div>
                    </div>
                    <div>
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">50+</div>
                        <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Cities Covered</div>
                    </div>
                    <div>
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">10k+</div>
                        <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Daily Ads</div>
                    </div>
                    <div>
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">100%</div>
                        <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">Desi Focused</div>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-32 px-[7%]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold font-dmsans mb-10 text-gray-900">Why Desipath?</h2>
                    <p className="text-lg text-gray-600 leading-loose mb-8">
                        The journey of a Desi in the US or Canada is unique—filled with ambition, culture, and often, a search for home. Whether it's finding a roommate who understands your food preferences, a doctor who speaks your language, or an event that celebrates your heritage, these "little" things are what make a life.
                    </p>
                    <p className="text-lg text-gray-600 leading-loose">
                        Desipath was built to bring all these scattered needs under one roof. We empower our users to trade, learn, and grow together, making the vast North American landscape feel just a little bit smaller and a lot more welcoming.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="bg-gray-50 py-32 px-[7%]">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-bold font-dmsans mb-4">Our Ecosystem</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Explore the diverse range of services we cater to the South Asian diaspora.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-10 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-5xl mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-32 px-[7%] text-center relative overflow-hidden">
                 <div className="relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-bold font-dmsans mb-8">Become a part of the path.</h2>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">Join thousands of others who are already finding their way with Desipath.</p>
                    <button onClick={() => window.location.href='/register'} className="px-12 py-5 bg-[#ffa41c] text-gray-900 font-bold rounded-2xl hover:bg-[#ff9900] transition-all transform hover:scale-105 shadow-xl shadow-amber-200">
                        Join Community Now
                    </button>
                 </div>
                 {/* Decorative Background Icons */}
                 <div className="absolute top-20 left-10 text-8xl opacity-5 select-none">🪔</div>
                 <div className="absolute bottom-20 right-10 text-8xl opacity-5 select-none">🕌</div>
            </div>

            <Footer newsletter={"block"} />
        </div>
    );
};

export default AboutUs;
