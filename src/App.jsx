import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Wishlist from './sections/Wishlist';
import Footer from './components/Footer';
import './index.css';

function App() {
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

      <Navbar />
      <main>
        <Hero />
        <Features />
        <Wishlist />
      </main>
      <Footer />
    </div>
  );
}

export default App;
