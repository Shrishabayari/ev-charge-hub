import React, { useState, useEffect, useRef } from 'react';

// Custom hook for intersection observer
export const useIntersectionObserver = (options) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasIntersected, setHasIntersected] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options, hasIntersected]);

    return [ref, isIntersecting, hasIntersected];
};

// Animation component wrapper
export const AnimatedSection = ({ children, className = "", delay = 0, animation = "fadeInUp" }) => {
    const [ref, hasIntersected] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: '-50px'
    });

    const animations = {
        fadeInUp: hasIntersected ? 'animate-fade-in-up' : 'opacity-0 translate-y-10',
        fadeInDown: hasIntersected ? 'animate-fade-in-down' : 'opacity-0 -translate-y-10',
        fadeInLeft: hasIntersected ? 'animate-fade-in-left' : 'opacity-0 -translate-x-10',
        fadeInRight: hasIntersected ? 'animate-fade-in-right' : 'opacity-0 translate-x-10',
        fadeIn: hasIntersected ? 'animate-fade-in' : 'opacity-0',
        scaleIn: hasIntersected ? 'animate-scale-in' : 'opacity-0 scale-95'
    };

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ease-out ${animations[animation]} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};