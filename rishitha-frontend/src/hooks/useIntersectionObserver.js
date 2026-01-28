
import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options = {}) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // Optional: Stop observing once visible to trigger only once
                if (options.triggerOnce) {
                    observer.unobserve(entry.target);
                }
            } else if (!options.triggerOnce) {
                setIsVisible(false);
            }
        }, { threshold: 0.1, ...options });

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options.triggerOnce]);

    return [elementRef, isVisible];
};

export default useIntersectionObserver;
