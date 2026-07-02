import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Platforms from './sections/Platforms';
import Wishlist from './sections/Wishlist';
import PrivacyPolicy from './sections/PrivacyPolicy';
import TermsOfUse from './sections/TermsOfUse';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const goToPrivacyPolicy = () => setCurrentPage('privacy');
  const goToTerms = () => setCurrentPage('terms');
  const goHome = () => setCurrentPage('home');

  if (currentPage === 'privacy') {
    return (
      <div className="app">
        <Navbar onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
        <PrivacyPolicy onBack={goHome} />
        <Footer onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="app">
        <Navbar onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
        <TermsOfUse onBack={goHome} />
        <Footer onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
      <main>
        <Hero />
        <Features />
        <Platforms />
        <Wishlist />
      </main>
      <Footer onPrivacyClick={goToPrivacyPolicy} onTermsClick={goToTerms} />
    </div>
  );
}

export default App;
