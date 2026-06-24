import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
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
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Navbar onPrivacyClick={goToPrivacyPolicy} />
        <main>
          <Hero />
          <Features />
          <Platforms />
          <Wishlist />
        </main>
        <Footer onPrivacyClick={goToPrivacyPolicy} />
      </div>
    </MotionConfig>
  );
}

export default App;
