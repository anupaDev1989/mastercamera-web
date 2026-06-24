import React from 'react';
import { motion } from 'motion/react';

/**
 * Subtle, GPU-friendly scroll reveal — opacity + translateY only (no blur/box-shadow
 * animation, which janks on mobile). Fires once when the element scrolls into view.
 * Respects prefers-reduced-motion via the app-level <MotionConfig reducedMotion="user">.
 */
const Reveal = ({ children, className, delay = 0, y = 24, as = 'div', amount = 0.3 }) => {
    const MotionTag = motion[as] || motion.div;
    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </MotionTag>
    );
};

export default Reveal;
