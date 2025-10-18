document.addEventListener("DOMContentLoaded", function () {
  // Get the iPad content image element
  const ipadImage = document.querySelector(".ipad-content img");
  const originalImageSrc = ipadImage.src;

  // Get all benefit cards
  const benefitCards = document.querySelectorAll(
    ".benefit-card, .bottom-benefit-card"
  );

  let hoverTimeout;
  let currentActiveCard = null;

  // Add hover event listeners to each benefit card
  benefitCards.forEach((card) => {
    const contentImage = card.getAttribute("data-content-image");

    // Mouse enter event - immediate change
    card.addEventListener("mouseenter", function () {
      // Clear any existing hover timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // Only change image if this is a different card or no card is currently active
      if (contentImage && currentActiveCard !== card) {
        currentActiveCard = card;
        
        // Immediate image change - no opacity transition
        ipadImage.src = contentImage;
      }
    });

    // Optional: Add visual feedback for active card
    card.addEventListener("mouseenter", function () {
      // Remove active class from all cards
      benefitCards.forEach(c => c.classList.remove('active-benefit-card'));
      // Add active class to current card
      card.classList.add('active-benefit-card');
    });
  });
});
