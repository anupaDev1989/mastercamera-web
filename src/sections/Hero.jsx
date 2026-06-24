import React from 'react';
import { CinematicHero } from '@/components/ui/cinematic-hero';

const Hero = () => {
    const scrollToWishlist = () => {
        const element = document.getElementById('wishlist');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <CinematicHero
            tagline1="Your camera app wasn't built for work."
            tagline2={<><span style={{ WebkitTextFillColor: 'hsl(3, 96%, 66%)', color: 'hsl(3, 96%, 66%)' }}>Master</span>{" Camera was."}</>}
            cardTagline={<>Feels familiar.<br />Works harder.</>}
            cardDescription="Open it and shoot — no setup, no distractions. When your work needs more, it's all right there: categorization, metadata overlays, shot notes, markups, watermarks. Private. Offline. Yours."
            cardAudience="Engineered for DIY enthusiasts, scientists, and field professionals."
            ctaHeading="Start capturing."
            ctaDescription="Master Camera is coming to iOS. Join the waitlist and be the first to know when it launches."
            appScreenSrc="/app_screen.png"
            onJoinWaitlist={scrollToWishlist}
        />
    );
};

export default Hero;
