gsap.registerPlugin(ScrollTrigger);

// === Preloader ===
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1500);
});

// === Navbar Scroll ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// === Mobile Menu ===
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// === GSAP Animations ===
gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.6 });
gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });
gsap.from('.hero-stats', { opacity: 0, y: 30, duration: 0.8, delay: 1.0 });

// Animated counters
function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        gsap.to(counter, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}
animateCounters();

// Scroll animations for sections
const sectionElements = document.querySelectorAll('.section-header, .about-grid, .programs-grid, .trainers-grid, .membership-card, .facilities-grid, .testimonial-card, .schedule-item, .faq-item');
sectionElements.forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
    });
});

// Stagger animations for grids
gsap.utils.toArray('.programs-grid .program-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
    });
});

gsap.utils.toArray('.trainers-grid .trainer-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
    });
});

gsap.utils.toArray('.facilities-grid .facility-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
    });
});

// === FAQ Accordion ===
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// === Testimonial Slider ===
const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

// Create dots
cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function goToSlide(index) {
    const cardWidth = cards[0].offsetWidth;
    const offset = -index * cardWidth;
    gsap.to(track, { x: offset, duration: 0.5, ease: 'power2.out' });
    currentIndex = index;
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// Handle window resize for slider
window.addEventListener('resize', () => {
    goToSlide(currentIndex);
});

nextBtn.addEventListener('click', () => {
    const next = (currentIndex + 1) % cards.length;
    goToSlide(next);
});
prevBtn.addEventListener('click', () => {
    const prev = (currentIndex - 1 + cards.length) % cards.length;
    goToSlide(prev);
});

// Auto slide on desktop, swipe on mobile
let startX = 0;
track.parentElement.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});
track.parentElement.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        nextBtn.click();
    } else if (endX - startX > 50) {
        prevBtn.click();
    }
});

// === Membership Toggle ===
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.getAttribute('data-period');
        const prices = document.querySelectorAll('.price');
        if (period === 'yearly') {
            prices[0].innerHTML = '$290<span>/yr</span>';
            prices[1].innerHTML = '$590<span>/yr</span>';
            prices[2].innerHTML = '$890<span>/yr</span>';
        } else {
            prices[0].innerHTML = '$29<span>/mo</span>';
            prices[1].innerHTML = '$59<span>/mo</span>';
            prices[2].innerHTML = '$89<span>/mo</span>';
        }
    });
});

// === Contact Form ===
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    showToast(`Welcome aboard, ${name}! Your fitness journey starts now. 🎉`);
    this.reset();
});

// === Scroll Progress ===
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// === Back to Top ===
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Toast ===
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// === Active Nav Link on Scroll ===
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// === Parallax on Hero ===
gsap.to('.hero-gradient', {
    y: -100,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

// === Section Highlights ===
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.querySelector('.section-title'), {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8
    });
    gsap.from(header.querySelector('.section-desc'), {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.15
    });
});

// === Feature Items Stagger ===
gsap.utils.toArray('.about-feature').forEach((feature, i) => {
    gsap.from(feature, {
        scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'power2.out'
    });
});

console.log('GymPro loaded successfully!');