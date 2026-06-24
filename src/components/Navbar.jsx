import React, { useState, useEffect } from 'react';
import Button from './Button';

const ComingSoonPill = ({ className = '' }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-gradient-to-r from-primary/90 via-primary to-primary/90 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.6)] ${className}`}
    >
        <span aria-hidden="true">🚀</span>
        Coming Soon
    </span>
);

const Navbar = ({ onPrivacyClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
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
            className={`fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                ? 'h-14 border-b border-border/40 bg-background/75 shadow-[0_4px_20px_rgba(0,0,0,0.08)] supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-xl'
                : 'h-16 border-b border-transparent bg-transparent'
                }`}
        >
            <div className="container mx-auto flex h-full items-center justify-between gap-3 px-4 sm:px-5">
                {/* LEFT: logo + wordmark */}
                <a href="#" className="group flex min-w-0 items-center gap-2">
                    <div
                        className={`flex-shrink-0 overflow-hidden rounded-[22%] shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-active:scale-95 ${isScrolled ? 'h-9 w-9 md:h-10 md:w-10' : 'h-10 w-10 md:h-12 md:w-12'
                            }`}
                    >
                        <img
                            src="/logo.png"
                            alt="Master Camera"
                            className="h-full w-full object-cover"
                            draggable={false}
                        />
                    </div>
                    <span
                        className={`flex items-baseline gap-1 overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                            ? 'max-w-0 -translate-x-2 opacity-0'
                            : 'max-w-[240px] translate-x-0 opacity-100'
                            }`}
                    >
                        <span className="text-lg font-bold tracking-tight text-primary sm:text-[1.45rem]">Master</span>
                        <span className="text-lg font-normal tracking-tight text-muted-foreground sm:text-[1.45rem]">Camera</span>
                    </span>
                </a>

                {/* CENTER (sm+): Coming Soon pill, absolutely centered in the bar */}
                <div
                    className={`pointer-events-none absolute inset-x-0 top-0 hidden h-full items-center justify-center transition-opacity duration-500 sm:flex ${isScrolled ? 'opacity-0' : 'opacity-100'
                        }`}
                    aria-hidden={isScrolled}
                >
                    <ComingSoonPill className="animate-fade-in" />
                </div>

                {/* RIGHT: CTA */}
                <Button
                    variant="primary"
                    size="sm"
                    onClick={scrollToWishlist}
                    className="flex-shrink-0 whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:shadow-md active:scale-95"
                >
                    Join waitlist
                </Button>
            </div>

            {/* MOBILE (<sm): Coming Soon pill floats just below the bar — no horizontal collision */}
            <div
                className={`pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 justify-center pt-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${isScrolled ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
                    }`}
                aria-hidden={isScrolled}
            >
                <ComingSoonPill className="animate-fade-in" />
            </div>
        </nav>
    );
};

export default Navbar;
