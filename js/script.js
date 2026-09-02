gsap.registerPlugin(ScrollTrigger);

// === Preloader ===
window.addEventListener('load', () => {
    setTimeout(() => {
        const pre = document.getElementById('preloader');
        if (pre) pre.classList.add('hidden');
    }, 1200);
});

// === Navbar Scroll ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// === Mobile Menu ===
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
if (hamburger && navMenu) {
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
}

// === GSAP Animations ===
gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1, delay: 0.4 });
gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.6 });
gsap.from('.hero-trust', { opacity: 0, y: 20, duration: 0.7, delay: 0.75 });
gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.85 });
gsap.from('.hero-stats-card, .hero-stats', { opacity: 0, y: 30, duration: 0.8, delay: 1.0 });
gsap.from('.top-bar', { opacity: 0, y: -20, duration: 0.6, delay: 0.1 });

// Animated counters - supports rupees and decimals
function animateCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
        const isDecimal = counter.getAttribute('data-decimal') === 'true';
        const target = parseFloat(counter.getAttribute('data-count'));
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            onUpdate: () => {
                counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
            }
        });
    });
}
animateCounters();

// Scroll animations
const sectionElements = document.querySelectorAll('.section-header, .about-grid, .programs-grid, .trainers-grid, .membership-card, .facilities-grid, .testimonial-card, .schedule-item, .faq-item, .achievements-grid, .whyus-grid, .gallery-grid, .bmi-grid');
sectionElements.forEach(el => {
    gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.8, ease: 'power2.out'
    });
});

gsap.utils.toArray('.programs-grid .program-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.6, delay: i * 0.08, ease: 'power2.out'
    });
});
gsap.utils.toArray('.trainers-grid .trainer-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
    });
});
gsap.utils.toArray('.facilities-grid .facility-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.6, delay: i * 0.08, ease: 'power2.out'
    });
});
gsap.utils.toArray('.whyus-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, duration: 0.6, delay: i * 0.08
    });
});
gsap.utils.toArray('.gallery-item').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' },
        opacity: 0, scale: 0.9, duration: 0.5, delay: i * 0.05
    });
});
gsap.utils.toArray('.achievement-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0, x: -20, duration: 0.6, delay: i * 0.1
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
            const a = faq.querySelector('.faq-answer');
            if (a) a.style.maxHeight = null;
        });
        if (!isActive && answer) {
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
if (track && cards.length && dotsContainer) {
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    function goToSlide(index) {
        if (!cards[0]) return;
        const cardWidth = cards[0].offsetWidth;
        // add gap? track is flex? We used x transform assuming equal width; for safety use offset
        const gap = 20;
        const offset = -index * (cardWidth + gap);
        // Instead use scroll? Use gsap x
        gsap.to(track, { x: offset, duration: 0.5, ease: 'power2.out' });
        currentIndex = index;
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    window.addEventListener('resize', () => goToSlide(currentIndex));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % cards.length));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + cards.length) % cards.length));
    // swipe
    let startX = 0;
    const sliderParent = track.parentElement;
    if (sliderParent) {
        sliderParent.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        sliderParent.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) { if (nextBtn) nextBtn.click(); }
            else if (endX - startX > 50) { if (prevBtn) prevBtn.click(); }
        });
    }
    // auto play
    setInterval(() => { if (nextBtn) nextBtn.click(); }, 5000);
}

// === Membership Toggle — Rupees ===
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.getAttribute('data-period');
        const prices = document.querySelectorAll('.price');
        const notes = document.querySelectorAll('.price-note');
        if (period === 'yearly') {
            if (prices[0]) prices[0].innerHTML = '\u20B99,999<span>/yr</span>';
            if (prices[1]) prices[1].innerHTML = '\u20B917,999<span>/yr</span>';
            if (prices[2]) prices[2].innerHTML = '\u20B931,999<span>/yr</span>';
            if (notes[0]) notes[0].textContent = '\u20B9833/mo billed yearly • Save \u20B91,989';
            if (notes[1]) notes[1].textContent = '\u20B91,499/mo billed yearly • Save \u20B95,989';
            if (notes[2]) notes[2].textContent = '\u20B92,666/mo billed yearly • Save \u20B99,989';
        } else {
            if (prices[0]) prices[0].innerHTML = '\u20B9999<span>/mo</span>';
            if (prices[1]) prices[1].innerHTML = '\u20B91,999<span>/mo</span>';
            if (prices[2]) prices[2].innerHTML = '\u20B93,499<span>/mo</span>';
            if (notes[0]) notes[0].textContent = '\u20B933/day \u2022 Ideal for beginners';
            if (notes[1]) notes[1].textContent = '\u20B966/day \u2022 70% Members Choose This';
            if (notes[2]) notes[2].textContent = '\u20B9116/day \u2022 90-Day Money Back';
        }
        // subtle animation
        prices.forEach(p => {
            gsap.fromTo(p, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
        });
    });
});

// === BMI Calculator ===
const bmiForm = document.getElementById('bmiForm');
const bmiResult = document.getElementById('bmiResult');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiMessage = document.getElementById('bmiMessage');
if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const h = parseFloat(document.getElementById('bmiHeight').value);
        const w = parseFloat(document.getElementById('bmiWeight').value);
        const age = parseInt(document.getElementById('bmiAge').value);
        if (!h || !w || h < 50 || w < 20) { showToast('Please enter valid height & weight'); return; }
        const hm = h / 100;
        const bmi = w / (hm * hm);
        const rounded = bmi.toFixed(1);
        let cat = '', msg = '', color = '';
        if (bmi < 18.5) { cat = 'Underweight'; msg = 'You may need to gain healthy weight. Our nutritionist at Patia can create an Odia diet plan for you.'; color = '#00b8d4'; }
        else if (bmi < 25) { cat = 'Normal — Keep Going!'; msg = 'Great! Maintain with balanced diet & regular workouts at GymPro Patia.'; color = '#00e5a0'; }
        else if (bmi < 30) { cat = 'Overweight'; msg = 'Don’t worry — our 90-day Weight Loss Challenge at Bhubaneswar has helped 1000+ members lose 10–20kg.'; color = '#ffc107'; }
        else { cat = 'Obese'; msg = 'Let our experts help you. Book a free body analysis at Patia centre — personal coaching available.'; color = '#ff4d00'; }
        if (bmiValue) bmiValue.textContent = rounded;
        if (bmiCategory) { bmiCategory.textContent = cat; bmiCategory.style.color = color; }
        if (bmiMessage) bmiMessage.textContent = msg + (age ? ' Age ' + age + ' considered — visit us for InBody scan.' : '');
        if (bmiResult) {
            bmiResult.classList.remove('hidden');
            gsap.from(bmiResult, { opacity: 0, y: 20, duration: 0.5 });
            bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('BMI: ' + rounded + ' — ' + cat + ' — Visit Patia for free consultation! ');
    });
}

// === Gallery Filter ===
document.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.gallery-item').forEach(item => {
            const cat = item.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
                item.classList.remove('hidden');
                gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// === Contact Form — Bhubaneswar ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const goal = document.getElementById('goal') ? document.getElementById('goal').value : '';
        if (!/^[0-9]{10}$/.test(phone)) { showToast('Please enter valid 10-digit mobile number (e.g. 8144685376)'); return; }
        // Simulate success
        showToast('Thank you, ' + name + '! Our team from Patia, Bhubaneswar will call/WhatsApp you within 30 mins on ' + phone + ' \uD83C\uDF89');
        // Open WhatsApp optionally
        const waMsg = encodeURIComponent('Hi GymPro Bhubaneswar, I am ' + name + ' (' + phone + ') interested in ' + (goal || 'fitness') + '. Please share details — from website.');
        setTimeout(() => window.open('https://wa.me/918144685376?text=' + waMsg, '_blank'), 1200);
        this.reset();
    });
}

// === Newsletter ===
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value.trim();
        if (!email) return;
        showToast('Subscribed! Weekly fitness tips will be sent to ' + email + ' \u2709\uFE0F');
        newsletterForm.reset();
    });
}

// === Phone input — auto format ===
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 10);
        e.target.value = v;
    });
}

// === Scroll Progress ===
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    });
}

// === Back to Top ===
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === Toast ===
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) { alert(message); return; }
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// === Active Nav Link ===
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// === Parallax ===
gsap.to('.hero-gradient', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
});
gsap.to('.about-img-wrapper', {
    y: -30, ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
});

// === Section Highlights ===
gsap.utils.toArray('.section-header').forEach(header => {
    const t = header.querySelector('.section-title');
    const d = header.querySelector('.section-desc');
    if (t) gsap.from(t, { scrollTrigger: { trigger: header, start: 'top 82%', toggleActions: 'play none none none' }, opacity: 0, y: 24, duration: 0.7 });
    if (d) gsap.from(d, { scrollTrigger: { trigger: header, start: 'top 82%', toggleActions: 'play none none none' }, opacity: 0, y: 24, duration: 0.7, delay: 0.12 });
});

gsap.utils.toArray('.about-feature').forEach((feature, i) => {
    gsap.from(feature, {
        scrollTrigger: { trigger: feature, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0, x: -24, duration: 0.6, delay: i * 0.12, ease: 'power2.out'
    });
});

console.log('GymPro Bhubaneswar — Professional Site Loaded \u2705 | Contact: 8144685376 | anuxoo001@gmail.com | Patia, Bhubaneswar');
