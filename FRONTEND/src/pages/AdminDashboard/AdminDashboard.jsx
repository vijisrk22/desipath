import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function AdminDashboard() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard Home', path: '/admindashboard', icon: '🏠' },
    { name: 'Registered Users', path: '/admindashboard/users', icon: '👤' },
    { name: 'Kids Classes', path: '/admindashboard/kids-class', icon: '🎨' },
    { name: 'Rental Homes', path: '/admindashboard/rental-homes', icon: '🏘️' },
    { name: 'Roommates', path: '/admindashboard/roommates', icon: '👥' },
    { name: 'Buy/Sell Cars', path: '/admindashboard/cars', icon: '🚗' },
    { name: 'Buy/Sell House', path: '/admindashboard/houses', icon: '🏡' },
    { name: 'Events', path: '/admindashboard/events', icon: '🎟️' },
    { name: 'Travel Companion', path: '/admindashboard/travel', icon: '✈️' },
    { name: 'IT Trainings', path: '/admindashboard/trainings', icon: '💻' },
    { name: 'Local Deals', path: '/admindashboard/local-ads', icon: '📢' },
    { name: 'Category Management', path: '/admindashboard/categories', icon: '📁' },
    { name: 'Zipcodes', path: '/admindashboard/zipcodes', icon: '📍' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex items-start gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 shrink-0 sticky top-24">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4 mb-4 mt-2">Admin Modules</h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admindashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area (Nested Routes injected via Outlet) */}
        <div className="flex-grow w-full min-w-0">
          <Outlet />
        </div>

      </div>
      
      <Footer newsletter={"block"} />
    </div>
  );
}
