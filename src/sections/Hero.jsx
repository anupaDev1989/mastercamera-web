import React from 'react';
import { CinematicHero } from '@/components/ui/cinematic-hero';

const Hero = () => {
    return (
        <CinematicHero
            tagline1="Your camera app wasn't built for work."
            tagline2={<><span style={{ WebkitTextFillColor: 'hsl(3, 96%, 66%)', color: 'hsl(3, 96%, 66%)' }}>Master</span>{" Camera was."}</>}
            cardTagline={<>Feels familiar.<br />Works harder.</>}
            cardDescription="Open it and shoot — no setup, no distractions. When your work needs more, it's all right there: categorization, metadata overlays, shot notes, markups, watermarks. Private. Offline. Yours."
            cardAudience="Engineered for DIY enthusiasts, scientists, and field professionals."
            ctaHeading="Start capturing."
            ctaDescription="Master Camera is available now on iOS. Download it and start shooting smarter today."
            appScreenSrc="/app_screen.png"
        />
    );
};

export default Hero;
