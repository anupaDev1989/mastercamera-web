import React, { useRef } from 'react';
import { HeroSection } from '@/components/ui/feature-carousel';
import { Button } from '@/components/ui/button';
import { TextRotate } from '@/components/ui/text-rotate';

const Hero = () => {
    const textRotateRef = useRef(null);

    const scrollToWishlist = () => {
        const element = document.getElementById('wishlist');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const images = [
        { src: "/hero-screenshot.png", alt: "RiGG App Interface" },
        { src: "/tracking-screenshot.png", alt: "RiGG Tracking Interface" },
        { src: "/projects-screenshot.png", alt: "RiGG Projects Interface" },
        { src: "/Rented-tracking-screenshot.png", alt: "RiGG Rented Gear Tracking" },
    ];

    const handleIndexChange = (index) => {
        if (textRotateRef.current) {
            textRotateRef.current.jumpTo(index);
        }
    };

    const title = (
        <span className="flex flex-col items-center justify-center md:flex-row md:gap-4">
            Stay on top of {' '}
            <span className="inline-flex items-center justify-center h-[1.2em] overflow-hidden">
                <TextRotate
                    ref={textRotateRef}
                    texts={["your gear", "gear maintenance", "gear planning", "what you rented"]}
                    mainClassName="text-primary overflow-hidden justify-center rounded-lg"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-2"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    auto={false} // Disable auto rotation, controlled by carousel
                />
            </span>
        </span>
    );

    return (
        <HeroSection
            title={title}
            subtitle="Gear chaos ends here. The all-in-one inventory management solution for creators and production teams."
            images={images}
            onIndexChange={handleIndexChange}
        >
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="default" size="lg" onClick={scrollToWishlist} className="min-w-[200px] text-lg h-12 w-full sm:w-auto">
                    Join the Wishlist
                </Button>
                <Button variant="outline" size="lg" onClick={scrollToFeatures} className="min-w-[200px] text-lg h-12 w-full sm:w-auto">
                    See How It Works
                </Button>
            </div>
        </HeroSection>
    );
};

export default Hero;
