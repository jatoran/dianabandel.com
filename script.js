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
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const carousel = document.getElementById('carousel');

let slidesToShow = 3;
let currentIndex = 0;
const totalSlides = slides.length;
let autoScrollInterval = 7000;
let autoScroll;

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
  slides.forEach((slide, index) => {
    slide.style.left = `${slide.offsetWidth * index}px`;
  });
}

function startAutoScroll() {
  autoScroll = setInterval(moveToNextSlide, autoScrollInterval);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
}

function moveToNextSlide() {
  currentIndex = currentIndex >= totalSlides - slidesToShow ? 0 : currentIndex + 1;
  track.style.transform = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;
}

function moveToPrevSlide() {
  currentIndex = currentIndex <= 0 ? totalSlides - slidesToShow : currentIndex - 1;
  track.style.transform = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;
}

// Init
updateSlidesToShow();
setSlidePositions();
startAutoScroll();

window.addEventListener('resize', () => {
  updateSlidesToShow();
  setSlidePositions();
  // Reset to the first slide on resize for consistency
  currentIndex = 0;
  track.style.transform = 'translateX(0)';
});

// Pause on hover
carousel.addEventListener('mouseenter', stopAutoScroll);
carousel.addEventListener('mouseleave', startAutoScroll);
