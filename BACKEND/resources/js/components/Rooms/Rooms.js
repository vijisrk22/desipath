// pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F8FF' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px', position: 'relative' }}>
        {/* Section 1 */}
        <section style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: '29px', color: '#1F2937', fontFamily: 'DM Sans', fontWeight: '500' }}>
            Search a room or share accommodation in your area
          </h2>
          <button
            style={{
              padding: '16px 40px',
              background: '#FFA41C',
              borderRadius: '30px',
              fontSize: '24px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              color: '#1F2937',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Find a Room
          </button>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 style={{ fontSize: '29px', color: '#1F2937', fontFamily: 'DM Sans', fontWeight: '500' }}>
            Search for a roommate, share your home/room, and make money
          </h2>
          <button
            style={{
              padding: '16px 40px',
              background: '#FFA41C',
              borderRadius: '30px',
              fontSize: '24px',
              fontFamily: 'DM Sans',
              fontWeight: '600',
              color: '#1F2937',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Post an Add/Share My Room
          </button>
        </section>

        {/* Profile Section */}
        <section style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '227px', background: '#F5F5F5', padding: '20px', borderRadius: '8px' }}>
            <img
              src="https://via.placeholder.com/80x80"
              alt="Profile"
              style={{ borderRadius: '50%', marginBottom: '10px' }}
            />
            <h3 style={{ fontSize: '18px', fontFamily: 'Rubik', fontWeight: '400', color: '#545871' }}>Agency Dev</h3>
            <p style={{ fontSize: '14px', fontFamily: 'Rubik', fontWeight: '400', color: '#545871' }}>Indonesia</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
