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

if (carousel && track && nextButton && prevButton) {
    let slides = Array.from(track.children);
    let currentIndex = 0;
    let autoScroll;
    const autoScrollInterval = 4000; // FASTER: Changed from 7000ms to 4000ms
    let isTransitioning = false;

    const setupCarousel = () => {
        // Clone first and last slides for infinite loop
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        firstClone.setAttribute('aria-hidden', 'true');
        lastClone.setAttribute('aria-hidden', 'true');
        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);
        // Update slides array to include clones for easy reference
        slides = Array.from(track.children);
    };

    const updateActiveClasses = () => {
        slides.forEach(slide => slide.classList.remove('active-slide'));
        // The real active slide is at currentIndex + 1 because of the prepended clone
        slides[currentIndex + 1].classList.add('active-slide');
    };
    
    const setSlidePosition = (withTransition = true) => {
        const targetSlide = slides[currentIndex + 1];
        // Calculate the offset to center the target slide
        const newTransform = targetSlide.offsetLeft - (carousel.offsetWidth / 2) + (targetSlide.offsetWidth / 2);
        track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${newTransform}px)`;
        updateActiveClasses();
    };

    const moveToNextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setSlidePosition();
    };

    const moveToPrevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setSlidePosition();
    };

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        // Handle the jump from clone to real slide
        if (currentIndex >= slides.length - 2) { // At last real slide's clone
            currentIndex = 0;
            setSlidePosition(false);
        } else if (currentIndex < 0) { // At first real slide's clone
            currentIndex = slides.length - 3;
            setSlidePosition(false);
        }
    });
    
    const startAutoScroll = () => {
        stopAutoScroll();
        autoScroll = setInterval(moveToNextSlide, autoScrollInterval);
    };

    const stopAutoScroll = () => clearInterval(autoScroll);

    // --- Event Listeners ---
    nextButton.addEventListener('click', () => { stopAutoScroll(); moveToNextSlide(); startAutoScroll(); });
    prevButton.addEventListener('click', () => { stopAutoScroll(); moveToPrevSlide(); startAutoScroll(); });
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; stopAutoScroll(); }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? moveToNextSlide() : moveToPrevSlide();
        }
        startAutoScroll();
    }, { passive: true });
    
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { stopAutoScroll(); moveToPrevSlide(); startAutoScroll(); }
        if (e.key === 'ArrowRight') { stopAutoScroll(); moveToNextSlide(); startAutoScroll(); }
    });

    window.addEventListener('resize', () => setSlidePosition(false));

    // --- Initialize ---
    if (slides.length > 0) {
        setupCarousel();
        setSlidePosition(false); // Initial position without transition
        startAutoScroll();
    }
}