# Gym Management System

- **Project Name:** Gym Management System
- **Industry:** Gym / Fitness Center
- **Objective:** Build a modern, responsive fitness website with GSAP animations, interactive features, and a compelling user experience that drives membership sign-ups.

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure and content |
| CSS3 | Layout, responsive design, visual styling (Flexbox/Grid, custom properties) |
| JavaScript (ES6+) | Interactivity, DOM logic, form handling |
| GSAP + ScrollTrigger | Timeline-based animations, scroll-triggered reveals, hover effects |
| Font Awesome 6 | Icons |
| Google Fonts (Inter) | Typography |

## Features

### Core Sections
- **Hero** — Full-screen hero with animated badge, gradient background, stats, and dual CTA buttons
- **About** — Company overview with feature highlights and side shapes
- **Programs/Classes** — 6 training programs with difficulty and duration badges
- **Trainers** — 4 trainer cards with hover social links overlay
- **Membership Plans** — Monthly/yearly toggle with 3 tiers (Starter, Pro, Elite)
- **Facilities** — 6 facility cards covering gym amenities
- **Testimonials** — Auto-sliding testimonial carousel with navigation dots
- **Schedule** — Daily class schedule grid
- **FAQ** — Animated accordion with smooth expand/collapse
- **Contact** — Full validation form with name, email, phone, goal, and message fields
- **Footer** — 4-column layout with links, social media, and copyright

### Interactive Features (min. 3)
1. **Animated Navbar** — Scroll-triggered background change with active link highlighting
2. **Mobile Menu** — Hamburger menu with smooth open/close animation
3. **FAQ Accordion** — Click-to-expand accordion with smooth animation
4. **Testimonial Slider** — Auto-sliding carousel with prev/next buttons and touch swipe support
5. **Membership Toggle** — Monthly/yearly pricing toggle
6. **Animated Counters** — Scroll-triggered number counting animation
7. **Scroll Progress Bar** — Top progress indicator
8. **Back-to-Top Button** — Appears on scroll with smooth scroll behavior
9. **Toast Notifications** — Form submission feedback
10. **Scroll-Triggered Animations** — GSAP ScrollTrigger for section reveals, stagger effects, parallax

### GSAP Animations Used
- Hero entrance animations (badge, title, subtitle, buttons, stats)
- Scroll-triggered section header reveals with stagger
- Counter animation on scroll
- Program/trainer/facility card stagger reveals
- FAQ accordion expand/collapse
- Testimonial slider transition
- Navbar scroll background transition
- Parallax effect on hero gradient
- Back-to-top fade in/out

## How to Run

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build tools or server required — works directly via file:// protocol

### Optional: Local Server
```bash
# Using Python
cd gym-management-system
python -m http.server 8000

# Using Node.js
npx serve .
```
Then open `http://localhost:8000` in your browser.

## Design Direction

**Industry:** Gym / Fitness
**Design Direction:** Energetic + Modern
- Primary color: Vibrant orange (#ff4d00) — energy, motivation, action
- Secondary: Fresh green (#00e5a0) — health, vitality, growth
- Background: Deep dark (#0a0a0f) — premium, gym atmosphere
- Typography: Inter — modern, clean, energetic
- Gradients and glow effects — dynamic, high-energy feel

## Responsiveness

Fully responsive across:
- **Desktop** (1200px+) — Full grid layouts, hover effects, side-by-side sections
- **Tablet** (768px–1024px) — 2-column grids, adjusted typography
- **Mobile** (<768px) — Single column, hamburger menu, stacked layouts, simplified schedule

## Developer

**Team/Developer:** SuuSri AI Intern
**Date:** September 2025
**Contact:** info@gympro.com