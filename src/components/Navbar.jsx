import React, { useState, useEffect } from 'react';
import Button from './Button';

const Navbar = ({ onPrivacyClick }) => {
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
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                ? 'h-12 border-b border-border/40 bg-background/75 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-md:-translate-y-full max-md:opacity-0'
                : 'h-16 border-b border-transparent bg-transparent'
                }`}
        >
            <div className="container mx-auto flex h-full items-center justify-between px-5">
                <a href="#" className="group flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Master Camera"
                        className={`w-auto drop-shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-active:scale-95 ${isScrolled ? 'h-7 md:h-8' : 'h-9 md:h-10'
                            }`}
                    />
                    <span
                        className={`flex items-baseline gap-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                            ? 'max-w-0 opacity-0 -translate-x-2'
                            : 'max-w-[240px] opacity-100 translate-x-0'
                            }`}
                    >
                        <span className="whitespace-nowrap text-[1.3rem] font-bold tracking-tight text-primary">Master</span>
                        <span className="whitespace-nowrap text-[1.3rem] font-normal tracking-tight text-muted-foreground">Camera</span>
                    </span>
                </a>
                <div className="flex items-center">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={scrollToWishlist}
                        className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:shadow-md active:scale-95"
                    >
                        Join the waitlist
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
