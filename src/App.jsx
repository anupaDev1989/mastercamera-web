import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Platforms from './sections/Platforms';
import Wishlist from './sections/Wishlist';
import PrivacyPolicy from './sections/PrivacyPolicy';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const goToPrivacyPolicy = () => setCurrentPage('privacy');
  const goHome = () => setCurrentPage('home');

  if (currentPage === 'privacy') {
    return (
      <div className="app">
        <Navbar onPrivacyClick={goToPrivacyPolicy} />
        <PrivacyPolicy onBack={goHome} />
        <Footer onPrivacyClick={goToPrivacyPolicy} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Coming Soon Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 pointer-events-none">
        <div className="pointer-events-auto bg-gradient-to-r from-primary/90 via-primary to-primary/90 backdrop-blur-sm px-6 py-1.5 rounded-full shadow-lg border border-primary/20 animate-fade-in">
          <p className="text-xs font-semibold text-primary-foreground tracking-wide">
            🚀 Coming Soon
          </p>
        </div>
      </div>

      <Navbar onPrivacyClick={goToPrivacyPolicy} />
      <main>
        <Hero />
        <Features />
        <Platforms />
        <Wishlist />
      </main>
      <Footer onPrivacyClick={goToPrivacyPolicy} />
    </div>
  );
}

export default App;
