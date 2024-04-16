import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const FeaturePage = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <main>
          <section className="feature-section">
            <div className="container">
              <h2 className="text-gradient">Discover Unique Art NFTs</h2>
              <p>Explore a curated collection of digital artworks created by talented artists from around the world.</p>
            </div>
          </section>
          <section className="aim-section">
            <div className="container">
              <h2 className="text-gradient">Our Aim</h2>
              <p>At our NFT marketplace, we strive to empower artists, collectors, and enthusiasts by providing a decentralized platform for trading and showcasing digital art.</p>
            </div>
          </section>
          <section className="feature-section">
            <div className="container">
              <h2 className="text-gradient">Unique Features</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <h3>Decentralized Trading</h3>
                  <p>Trade digital artworks securely using blockchain technology without intermediaries.</p>
                </div>
                <div className="feature-item">
                  <h3>Royalty Mechanism</h3>
                  <p>Automatically distribute royalties to artists for each resale of their NFTs.</p>
                </div>
                {/* Add more feature items */}
              </div>
            </div>
          </section>
          <section className="testimonial-section">
            <div className="container">
              <h2 className="text-gradient">What Our Users Say</h2>
              <div className="testimonial">
                <blockquote>
                  "This platform has revolutionized the way I buy and sell digital art. It's intuitive, transparent, and supports artists like never before."
                </blockquote>
                <cite>- John Doe, Artist</cite>
              </div>
              {/* Add more testimonials */}
            </div>
          </section>
          {/* Add more sections */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FeaturePage;
