// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// Contact Form Submission
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

// Carousel Functionality
// Carousel Functionality
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const carousel = document.getElementById('carousel');
const nextButton = carousel.querySelector('.next-button');
const prevButton = carousel.querySelector('.prev-button');

let slidesToShow = 3;
let currentIndex = 0;
const totalSlides = slides.length;
let autoScrollInterval = 7000;
let autoScroll;
let isTransitioning = false;

// Clone slides for infinite scroll
function setupInfiniteScroll() {
  const slidesToClone = slidesToShow + 1;
  
  // Clone end slides and add to beginning
  for (let i = 0; i < slidesToClone; i++) {
    const index = totalSlides - 1 - i;
    const clone = slides[index].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.insertBefore(clone, track.firstChild);
  }
  
  // Clone start slides and add to end
  for (let i = 0; i < slidesToClone; i++) {
    const clone = slides[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }
  
  // Set initial position
  currentIndex = slidesToClone;
  moveSlides(false);
}

function updateSlidesToShow() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    slidesToShow = 1;
  } else if (screenWidth < 1024) {
    slidesToShow = 2;
  } else {
    slidesToShow = 3;
  }
}

function setSlidePositions() {
  const slideWidth = 100 / slidesToShow;
  const allSlides = Array.from(track.children);
  allSlides.forEach(slide => {
    slide.style.flex = `0 0 ${slideWidth}%`;
  });
}

function moveSlides(animate = true) {
  if (isTransitioning && animate) return;
  
  const slideWidth = 100 / slidesToShow;
  if (!animate) {
    track.style.transition = 'none';
  } else {
    track.style.transition = 'transform 0.5s ease-in-out';
    isTransitioning = true;
  }
  
  track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  
  if (!animate) {
    // Force browser reflow
    track.offsetHeight;
    track.style.transition = 'transform 0.5s ease-in-out';
  }
}

function handleTransitionEnd() {
  isTransitioning = false;
  const allSlides = Array.from(track.children);
  
  // If we've scrolled past the end clones
  if (currentIndex >= totalSlides + slidesToShow) {
    currentIndex = slidesToShow;
    moveSlides(false);
  }
  // If we've scrolled before the start clones
  else if (currentIndex <= slidesToShow - 1) {
    currentIndex = totalSlides + slidesToShow - 1;
    moveSlides(false);
  }
}

function moveToNextSlide() {
  if (isTransitioning) return;
  currentIndex++;
  moveSlides();
}

function moveToPrevSlide() {
  if (isTransitioning) return;
  currentIndex--;
  moveSlides();
}

function startAutoScroll() {
  stopAutoScroll();
  autoScroll = setInterval(moveToNextSlide, autoScrollInterval);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

// Event Listeners
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

track.addEventListener('transitionend', handleTransitionEnd);

// Touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  stopAutoScroll();
}, { passive: true });

carousel.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startAutoScroll();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      moveToNextSlide();
    } else {
      moveToPrevSlide();
    }
  }
}

// Keyboard navigation
carousel.setAttribute('tabindex', '0');
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

// Init
updateSlidesToShow();
setSlidePositions();
setupInfiniteScroll();
startAutoScroll();

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateSlidesToShow();
    setSlidePositions();
    moveSlides();
  }, 250);
});

// Pause on hover
carousel.addEventListener('mouseenter', stopAutoScroll);
carousel.addEventListener('mouseleave', startAutoScroll);