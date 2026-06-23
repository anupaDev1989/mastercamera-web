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
            cardTagline={<>The simplicity you want.<br />The features your work demands.</>}
            cardDescription="Master Camera pairs the effortless feel of the native Camera app with powerful metadata workflows and total offline privacy."
            cardAudience="Engineered for DIY enthusiasts, scientists, and field professionals."
            ctaHeading="Start capturing."
            ctaDescription="Master Camera is coming to iOS. Join the waitlist and be the first to know when it launches."
            appScreenSrc="/app_screen.png"
            onJoinWaitlist={scrollToWishlist}
        />
    );
};

export default Hero;
