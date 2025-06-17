// --- MOBILE MENU (unchanged) ---
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');
const navLinks = document.querySelectorAll('#nav-list li a');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// Close menu when a link is clicked (for single-page nav)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navList.classList.contains('active')) {
      navList.classList.remove('active');
    }
  });
});


// --- CONTACT FORM (unchanged) ---
document.getElementById('contactForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const formStatus = document.getElementById('formStatus');

  try {
    const response = await fetch('https://formspree.io/f/xwpkqpby', {
      method: 'POST',
      headers: {'Accept': 'application/json'},
      body: formData
    });

    if (response.ok) {
      form.reset();
      formStatus.textContent = 'Message sent successfully!';
      formStatus.style.color = 'green';
    } else {
      formStatus.textContent = 'There was an error sending your message.';
      formStatus.style.color = 'red';
    }
  } catch (error) {
    formStatus.textContent = 'There was an error sending your message.';
    formStatus.style.color = 'red';
  }
});


// --- ADVANCED CAROUSEL ---
const carousel = document.getElementById('carousel');
const track = carousel.querySelector('.carousel-track');
const nextButton = carousel.querySelector('.next-button');
const prevButton = carousel.querySelector('.prev-button');

// Make sure all elements exist before running the script
if (carousel && track && nextButton && prevButton) {
    const slides = Array.from(track.children);
    
    let currentIndex = 0;
    let autoScroll; 
    const autoScrollInterval = 7000; // 7 seconds
    let isTransitioning = false;
    let slideWidth = slides[0].getBoundingClientRect().width;

    // Clone first and last slides for infinite effect
    const setupInfiniteScroll = () => {
        const firstClone = slides[0].cloneNode(true);
        firstClone.setAttribute('aria-hidden', 'true');
        track.appendChild(firstClone);

        const lastClone = slides[slides.length - 1].cloneNode(true);
        lastClone.setAttribute('aria-hidden', 'true');
        track.insertBefore(lastClone, slides[0]);

        // Initial position
        track.style.transform = `translateX(-${slideWidth}px)`;
    };

    const setSlidePosition = (index, withTransition = true) => {
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    };

    const moveToNextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setSlidePosition(currentIndex + 1);
    };

    const moveToPrevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setSlidePosition(currentIndex + 1);
    };

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === slides.length) {
            currentIndex = 0;
            setSlidePosition(currentIndex + 1, false);
        } else if (currentIndex < 0) {
            currentIndex = slides.length - 1;
            setSlidePosition(currentIndex + 1, false);
        }
    });
    
    // Auto-scroll functionality
    const startAutoScroll = () => {
        stopAutoScroll();
        autoScroll = setInterval(moveToNextSlide, autoScrollInterval);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScroll);
    };
    
    // Event listeners for controls
    nextButton.addEventListener('click', () => {
        stopAutoScroll();
        moveToNextSlide();
        startAutoScroll();
    });

    prevButton.addEventListener('click', () => {
        stopAutoScroll();
        moveToPrevSlide();
        startAutoScroll();
    });

    // Touch (swipe) support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 50; // Minimum distance for a swipe
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) moveToNextSlide(); // Swiped left
            else moveToPrevSlide(); // Swiped right
        }
        startAutoScroll();
    }, { passive: true });

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0'); // Make it focusable
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            stopAutoScroll();
            moveToPrevSlide();
            startAutoScroll();
        } else if (e.key === 'ArrowRight') {
            stopAutoScroll();
            moveToNextSlide();
            startAutoScroll();
        }
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    // Recalculate width on window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        setSlidePosition(currentIndex + 1, false);
    });

    // Initialize
    if (slides.length > 0) {
        setupInfiniteScroll();
        startAutoScroll();
    }
}