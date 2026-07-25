import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Platforms from './sections/Platforms';
import Wishlist from './sections/Wishlist';
import PrivacyPolicy from './sections/PrivacyPolicy';
import TermsOfUse from './sections/TermsOfUse';
import Footer from './components/Footer';
import './index.css';

// Map a URL path to a page so /privacy and /terms can be linked directly
// (App Store Connect and the app's paywall point at these URLs).
const pageFromPath = (path) => {
  if (path === '/privacy' || path === '/privacy/') return 'privacy';
  if (path === '/terms' || path === '/terms/') return 'terms';
  return 'home';
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const goToPrivacyPolicy = () => navigate('privacy');
  const goToTerms = () => navigate('terms');
  const goHome = () => navigate('home');

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
