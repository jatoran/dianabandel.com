// --- MOBILE MENU (unchanged) ---
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('active');
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

// --- CAROUSEL ---
const carousel = document.getElementById('carousel');
const track = document.querySelector('.carousel-track');
const nextButton = carousel.querySelector('.next-button');
const prevButton = carousel.querySelector('.prev-button');
const slides = Array.from(track.children);

let currentIndex = 0;
let autoScroll; 
const autoScrollInterval = 7000; // 7s
let isTransitioning = false;

// Clone first and last slides for infinite effect
function setupInfiniteScroll() {
  // Clone last slide to front
  const firstClone = slides[slides.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  track.insertBefore(firstClone, track.firstChild);

  // Clone first slide to end
  const lastClone = slides[0].cloneNode(true);
  lastClone.setAttribute('aria-hidden', 'true');
  track.appendChild(lastClone);
  
  // Adjust currentIndex to account for prepended clone
  currentIndex = 1;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function moveSlides() {
  if (isTransitioning) return;
  isTransitioning = true;
  track.style.transition = 'transform 0.5s ease-in-out';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function handleTransitionEnd() {
  isTransitioning = false;
  // If at a clone slide, jump to the real slide
  const realSlidesCount = slides.length; // not counting the clones we added

  // If we moved past the last real slide...
  if (currentIndex === realSlidesCount + 1) {
    track.style.transition = 'none'; 
    currentIndex = 1; // jump back to first real slide
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    requestAnimationFrame(() => { 
      // force reflow to ensure no visible flash
      track.offsetHeight; 
      track.style.transition = 'transform 0.5s ease-in-out';
    });
  }
  // If we moved before the first real slide...
  else if (currentIndex === 0) {
    track.style.transition = 'none'; 
    currentIndex = realSlidesCount; // jump to last real slide
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    requestAnimationFrame(() => {
      track.offsetHeight;
      track.style.transition = 'transform 0.5s ease-in-out';
    });
  }
}

function moveToNextSlide() {
  if (!isTransitioning) {
    currentIndex++;
    moveSlides();
  }
}

function moveToPrevSlide() {
  if (!isTransitioning) {
    currentIndex--;
    moveSlides();
  }
}

function startAutoScroll() {
  stopAutoScroll();
  autoScroll = setInterval(moveToNextSlide, autoScrollInterval);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

// Arrow buttons
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

// Listen for the transition end to handle infinite looping
track.addEventListener('transitionend', handleTransitionEnd);

// Touch (swipe) support
let touchStartX = 0;
carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  stopAutoScroll();
}, { passive: true });

carousel.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  const swipeThreshold = 50;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) moveToNextSlide();
    else moveToPrevSlide();
  }
  startAutoScroll();
}, { passive: true });

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

// Hover pause (optional)
carousel.addEventListener('mouseenter', stopAutoScroll);
carousel.addEventListener('mouseleave', startAutoScroll);

// INIT
setupInfiniteScroll();
startAutoScroll();


