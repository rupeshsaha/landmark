document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const guidingPrinciplesSection = document.querySelector('.guiding-principles-section');
    const imageContainer = document.querySelector('.guiding-principles-image-container');
    const contentContainer = document.querySelector('.guiding-principles-content');
    
    if (!guidingPrinciplesSection || !imageContainer || !contentContainer) {
        console.log('Guiding Principles section elements not found');
        return;
    }

    let isSticky = false;
    let sectionTop = 0;
    let sectionBottom = 0;
    let originalPosition = null;
    let ticking = false;

    // Initialize dimensions and store original position
    function initDimensions() {
        // Reset to original state first
        resetStickyState();
        
        const sectionRect = guidingPrinciplesSection.getBoundingClientRect();
        const containerElement = imageContainer.closest('.col-lg-7');
        
        sectionTop = sectionRect.top + window.pageYOffset;
        sectionBottom = sectionTop + sectionRect.height;
        
        if (containerElement) {
            const containerRect = containerElement.getBoundingClientRect();
            originalPosition = {
                width: containerRect.width,
                left: containerRect.left,
                right: containerRect.right
            };
        }
    }

    // Reset sticky state completely
    function resetStickyState() {
        isSticky = false;
        imageContainer.classList.remove('guiding-principles-sticky', 'guiding-principles-sticky-animate', 'guiding-principles-fade-out');
        imageContainer.style.cssText = ''; // Clear all inline styles
    }

    // Smooth scroll handler with requestAnimationFrame
    function updateSticky() {
        if (!originalPosition) return;

        const scrollY = window.pageYOffset;
        const triggerPoint = 120;
        const windowHeight = window.innerHeight;
        
        // Check if we're in the section area
        const inSectionArea = scrollY < sectionBottom && scrollY + windowHeight > sectionTop;
        
        // Start sticky when section comes into view from top
        const startSticky = scrollY + triggerPoint >= sectionTop;
        
        // End sticky when we've scrolled past most of the section content
        const endSticky = scrollY + windowHeight >= sectionBottom - 100;
        
        // Check if we're scrolling up and in the section
        const shouldShowWhenScrollingUp = inSectionArea && scrollY + windowHeight > sectionTop + 200;

        if (startSticky && !endSticky && !isSticky) {
            // Start sticky (scrolling down)
            isSticky = true;
            imageContainer.classList.add('guiding-principles-sticky');
            imageContainer.classList.remove('guiding-principles-fade-out');
            imageContainer.style.opacity = '1';

            // Set exact positioning to match original column
            imageContainer.style.width = originalPosition.width + 'px';
            imageContainer.style.left = originalPosition.left + 'px';

        } else if (endSticky && isSticky) {
            // End sticky with fade animation
            isSticky = false;
            imageContainer.classList.remove('guiding-principles-sticky', 'guiding-principles-sticky-animate');
            imageContainer.classList.add('guiding-principles-fade-out');
            
            // Position at bottom of section to fill the space
            imageContainer.style.position = 'absolute';
            imageContainer.style.bottom = '0';
            imageContainer.style.top = 'auto';
            imageContainer.style.width = originalPosition.width + 'px';
            imageContainer.style.left = '0';
            
            // Remove fade class after animation
            setTimeout(() => {
                imageContainer.classList.remove('guiding-principles-fade-out');
            }, 500);
            
        } else if (!startSticky && isSticky) {
            // Reset if scrolled back up past start
            resetStickyState();
        } else if (shouldShowWhenScrollingUp && !isSticky && !startSticky) {
            // When scrolling up from bottom, show image in normal position
            resetStickyState();
            imageContainer.style.opacity = '1';
            imageContainer.classList.remove('guiding-principles-fade-out');
        }

        ticking = false;
    }

    // Throttled scroll handler
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateSticky);
            ticking = true;
        }
    }

    // Debounced resize handler
    let resizeTimeout;
    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initDimensions();
            updateSticky();
        }, 250);
    }

    // Initialize with a small delay to ensure layout is complete
    setTimeout(() => {
        initDimensions();

        // Add event listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        // Initial check
        updateSticky();
    }, 200);

    // Clean up function
    window.guidingPrinciplesSticky = {
        destroy: function () {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            resetStickyState();
        }
    };
});
