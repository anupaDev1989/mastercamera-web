import React, { useState, useEffect } from 'react';
import Button from './Button';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToWishlist = () => {
        const element = document.getElementById('wishlist');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-20 border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'max-md:-translate-y-full max-md:opacity-0' : ''}`}>
            <div className="container relative mx-auto flex h-full items-center justify-end px-4">
                <a href="#" className={`absolute left-4 z-50 -top-6 block transition-all duration-300`}>
                    <img
                        src="/logo.png"
                        alt="RiGG"
                        className={`w-auto drop-shadow-md transition-all duration-300 ease-out hover:scale-105 ${isScrolled ? 'h-20 md:h-24' : 'h-24 md:h-32'
                            }`}
                    />
                </a>
                <div className="flex items-center gap-4">
                    <Button variant="primary" onClick={scrollToWishlist}>
                        Join the waitlist
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
