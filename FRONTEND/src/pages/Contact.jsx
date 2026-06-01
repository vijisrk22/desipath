import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since this is a frontend-only request for now, we'll construct a mailto link
        // or just show a success message as instructed.
        // For real functionality, we'd typically hit a backend endpoint.
        
        const mailtoLink = `mailto:vivekaa@gmail.com?subject=Contact Form Submission from ${formData.name}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AMessage: ${formData.message}`;
        
        // Open the email client
        window.location.href = mailtoLink;
        
        setSubmitted(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-[#f8faff] min-h-screen">
            <Navbar />

            <div className="container mx-auto px-[7%] py-20">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Contact Info */}
                    <div className="lg:w-1/3">
                        <h1 className="text-5xl font-bold font-dmsans text-gray-900 mb-6">Let's <span className="text-[#0857d0]">talk.</span></h1>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                            Have questions about a listing? Need help with your account? Our team is here to support the Desi community 24/7.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl text-[#0857d0]">
                                    ✉️
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Us</div>
                                    <div className="text-xl font-bold text-gray-900">support@desipath.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl text-[#ffa41c]">
                                    📞
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Support Line</div>
                                    <div className="text-xl font-bold text-gray-900">+1 (800) DESI-PATH</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 p-8 bg-[#0857d0] rounded-[32px] text-white overflow-hidden relative group">
                            <h3 className="text-2xl font-bold mb-2 relative z-10">North America HQ</h3>
                            <p className="text-blue-100 relative z-10">Serving Indian, Pakistani, and all South Asian communities across USA & Canada.</p>
                            <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 group-hover:scale-110 transition-transform">🌍</div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:w-2/3 w-full">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name" 
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                        <input 
                                            required
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000" 
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-8">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@email.com" 
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800"
                                    />
                                </div>

                                <div className="space-y-2 mb-10">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Your Message</label>
                                    <textarea 
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="How can we help you today?" 
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-[#0857d0] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800 resize-none"
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full bg-[#0857d0] text-white font-bold py-5 rounded-2xl text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-1">
                                    Send Message
                                </button>
                                
                                <p className="text-center text-gray-400 text-xs mt-6">
                                    By submitting this form, you agree to our <span className="underline cursor-pointer">Terms of Service</span>.
                                </p>
                            </form>
                        ) : (
                            <div className="bg-white p-16 rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-gray-100 text-center py-32">
                                <div className="text-7xl mb-8">🚀</div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                                <p className="text-gray-500 text-lg mb-10">Thank you for reaching out, {formData.name}. We've received your inquiry and will get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="px-10 py-4 border-2 border-blue-50 text-[#0857d0] font-bold rounded-2xl hover:bg-blue-50 transition-all">
                                    Send Another
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer newsletter={"block"} />
        </div>
    );
};

export default Contact;
