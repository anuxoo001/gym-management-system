# GymPro Bhubaneswar — Premium Gym Management System

- **Project Name:** GymPro — Gym Management System (Bhubaneswar)
- **Industry:** Gym / Fitness Center — Premium Fitness Hub, Patia, Bhubaneswar
- **Location:** Patia, Near KIIT Campus, Infocity Road, Bhubaneswar, Odisha 751024
- **Contact:** +91 81446 85376 | anuxoo001@gmail.com
- **Live:** https://anuxoo001.github.io/gym-management-system/
- **Objective:** Build a professional, conversion-focused, responsive fitness website for SuuSri AI with GSAP animations, Indian pricing (₹), and advanced interactive features.

## Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure, SEO meta tags |
| CSS3 | Flexbox/Grid, custom properties, professional dark theme (landing + dashboard) |
| JavaScript (ES6+) | DOM logic, localStorage DB, QR, AI rules, invoice, charts |
| GSAP + ScrollTrigger 3.12.5 | Hero entrances, scroll reveals, parallax, counters |
| Chart.js 4.x | Analytics, progress, revenue charts |
| jsPDF 2.5.1 + QRServer API | Invoice PDF, QR generation |
| Font Awesome 6.5.0 | Icons |
| Google Fonts (Inter + Oswald) | Typography |

## Features

### Core Sections (Professional)
- **Top Bar** — Location, email, phone, offer banner (Bhubaneswar specific)
- **Hero** — Patia Bhubaneswar messaging, trust badges (4.9★ 2,847 reviews), dual CTA, stats card (₹ pricing)
- **Achievements Bar** — Awards, ISO, 5000+ members, lifetime support
- **About** — 12+ years story, Patia location, KIIT/Infocity proximity, exp badge, 4 feature points
- **Why Choose Us** — 4 cards: Equipment, Trainer Ratio, Ladies Batch, App Access
- **Programs/Classes** — 6 programs with Indian context, pricing tags, Odia diet mention
- **Gallery** — 8 items, filterable (All/Gym/Classes/Trainers/Events), hover overlays
- **Trainers** — 4 pro cards with experience badges, tags, Bhubaneswar credentials (Mr. Odisha, RYT-500 etc.)
- **Membership Plans** — **All in ₹ (INR)** — Starter ₹999/mo, Pro ₹1,999/mo, Elite ₹3,499/mo — Yearly save 25% (₹9,999 / ₹17,999 / ₹31,999) — GST inclusive
- **BMI Calculator** — Interactive tool (height cm, weight kg, age, gender) with category & advice, scroll to contact
- **Facilities** — 6 premium facilities with tags, Patia specifics (parking, AC, physio)
- **Testimonials** — 4 Bhubaneswar members (KIIT student, Infocity IT, Patia resident) with auto-slider + swipe + dots
- **Schedule** — 8 daily classes with instructor, chips (Free/Pro+/Ladies Only)
- **FAQ** — 7 Bhubaneswar-specific Qs (location, ₹ pricing, trial, ladies batch, diet)
- **Contact** — 2-column: info (location, phone, email, hours, map embed) + professional form (name, 10-digit phone, email, goal, plan) with validation & WhatsApp redirect
- **Newsletter** — Email capture with toast
- **Footer** — 4-column, full contact, GSTIN, social links, copyright
- **Floating Buttons** — WhatsApp & Call (8144685376) always visible

### Interactive Features (15+)
1. **Animated Navbar** — Top bar + scroll-triggered background, active link highlight
2. **Mobile Menu** — Hamburger with full-screen overlay
3. **FAQ Accordion** — Smooth max-height animation
4. **Testimonial Slider** — Auto 5s, dots, swipe, prev/next
5. **Membership Toggle — Rupees** — Monthly ₹999/₹1,999/₹3,499 ↔ Yearly ₹9,999/₹17,999/₹31,999 with animated price change
6. **BMI Calculator** — Real calculation, category colors, personalized advice
7. **Gallery Filter** — Category filter with fade animation
8. **Animated Counters** — Including decimal 4.9★
9. **Scroll Progress Bar**
10. **Back-to-Top + Floating WhatsApp/Call**
11. **Toast Notifications** — Contact, newsletter, BMI feedback
12. **Newsletter Form**
13. **Phone Validation** — 10-digit Indian mobile, auto strip non-digits
14. **Map Embed** — OpenStreetMap for Patia, Bhubaneswar
15. **Scroll-Triggered Animations** — Stagger for all grids, parallax on hero & about

### GSAP Animations Used
- Top bar + hero entrance (badge, title, subtitle, trust, buttons, stats card)
- Counter animation (including decimal) on scroll
- Section header title/desc reveals
- Stagger: programs, trainers, facilities, whyus, gallery, achievements
- Parallax: hero gradient + about image
- Membership price scale on toggle, BMI result fade
- Gallery filter fade, testimonial slide, navbar scroll

### All Prices in Rupees (₹)
- Monthly: **Starter ₹999**, **Pro ₹1,999** (Popular), **Elite ₹3,499** — per month
- Yearly (Save 25%): **₹9,999 / ₹17,999 / ₹31,999** — GST inclusive
- Registration ₹99 one-time (Starter/Pro), free for Elite. EMI via UPI/Card/Cash. Extra 10% off for Student/Couple/Corporate.

## Contact — Bhubaneswar
- **Address:** GymPro Fitness, 2nd Floor, Patia Square, Near KIIT Campus, Infocity Road, **Bhubaneswar, Odisha 751024**
- **Phone / WhatsApp:** **+91 81446 85376** — [Call](tel:+918144685376) | [WhatsApp](https://wa.me/918144685376)
- **Email:** **anuxoo001@gmail.com** — [Mail](mailto:anuxoo001@gmail.com)
- **Hours:** Mon–Sun 5:00 AM – 11:00 PM (Pro/Elite 24/7 card). Free trial 6AM–9PM.

## How to Run
1. Clone: `git clone https://github.com/anuxoo001/gym-management-system.git`
2. Open `index.html` directly, or:
```bash
cd gym-management-system
python -m http.server 8000
# or
npx serve .
```
3. Open http://localhost:8000

No build tools required.

## Deployment
- GitHub: https://github.com/anuxoo001/gym-management-system
- Live (after Pages enabled): https://anuxoo001.github.io/gym-management-system/
- Enable: Repo → Settings → Pages → Deploy from branch → `main` / `(root)` → Save

## Design — Professional + Energetic + Trustworthy

- Primary: Vibrant orange #ff4d00 (energy, CTA)
- Secondary: Fresh green #00e5a0 (health)
- Background: Deep dark #0a0a0f (premium)
- Cards: #14141e with border #252535
- Typography: Inter (body) + Oswald (headings when needed)
- Gradients, glow, glassmorphism, rounded corners (16px), shadows

## Responsiveness
- Desktop 1200px+: Full grids, hover, side-by-side
- Tablet 768–1024px: 2-col grids
- Mobile <768px: Single col, hamburger, stacked, floating buttons icon-only, gallery 2→1 col

## Gym Management System — Role Based Dashboards (NEW)

**Login:** `login.html` → Choose Admin / Trainer / Member → Demo auto-fill → `dashboard.html?role=...`
- **Admin:** anuxoo001@gmail.com (full access) — Patia, Bhubaneswar
- **Trainer:** Select from 4 trainers (Ranjan, Priya, Amit, Sneha)
- **Member:** Select from 5 members (M001–M005) — QR & progress demo

| Role | Sidebar Modules |
|------|-----------------|
| **Admin** | Members, Trainers, Payments, QR Attendance, Reports, Settings — with Equipment Management |
| **Trainer** | My Members, Workout Plans, Diet Plans, Appointments, Progress |
| **Member** | My Profile, Workout, Diet, Attendance, Payments, Progress (+ Goals), Appointment Booking |

**15 Professional Features Implemented:**

1. 👥 **Member Management** — Admin CRUD (ID, name, phone, plan ₹999/₹1999/₹3499, trainer, status) — `admin-members`
2. 👨‍🏫 **Trainer Management** — Admin CRUD (specialty, exp, cert) — `admin-trainers`
3. 💳 **Membership & Payment Management** — Record payment, status paid/pending/overdue, invoiceNo, CSV export — `admin-payments` + `member-payments`
4. 📱 **QR-Based Attendance** — Member shows QR (api.qrserver.com), admin scans Member ID → mark present, today + history — `admin-attendance` + `member-attendance`
5. 🏋️ **Workout Plan Management** — Trainer creates/assigns plans with exercises (sets×reps) — `trainer-workouts` → `member-workout`
6. 🥗 **Diet & Nutrition Management** — Trainer creates diet (calories, Odia meals) — `trainer-diets` → `member-diet`
7. 📊 **Fitness Progress Tracking** — Log weight/body fat, Chart.js line chart — `trainer-progress` + `member-progress`
8. 📅 **Appointment Booking** — Member books with trainer (date/time/type), trainer confirms/pending — `member-appointments` ↔ `trainer-appointments`
9. 🔔 **Email & In-App Notifications** — Bell icon, unread dot, GymPro.notify() for all actions + Email toasts (anuxoo001@gmail.com) — all dashboards
10. 📈 **Admin Analytics Dashboard** — KPIs, revenue bar, member growth line, plan doughnut, report summary — `admin-overview` + `admin-reports`
11. 🏆 **Fitness Goals & Achievements** — Member adds goals (target/current/deadline), progress bar, +1 update, 🏆 on 100% — `member-progress`
12. 🧰 **Gym Equipment Management** — Admin CRUD (name, category, qty, condition working/maintenance, last maintenance) — `admin-equipment`
13. 🤖 **AI Workout & Diet Recommendations** — Rule-based: goal+weight → workout+diet (HIIT/muscle/balanced), Odia diet option, Apply to account — `member-overview` + trainer AI buttons
14. 📄 **Automatic Invoice & Progress Report** — Invoice modal (GST inclusive, print/PDF via window.print), Progress report PDF (weights, goals, trainer remark) — `admin-payments` + `member-progress`

**Data:** All in `localStorage` (`gympro_*`) — seed data for Bhubaneswar (Patia) — QR uses `https://api.qrserver.com/v1/create-qr-code/`

**How to Demo:**
1. Open `login.html` → Click **Member Demo** → Login → `member-overview` shows QR, AI box, goals
2. Click **Trainer Demo** → `trainer-workouts` → AI Generate → Assign → Member sees it instantly (localStorage)
3. Click **Admin Demo** → `admin-payments` → Record Payment ₹1,999 → View Invoice → Print

## Developer
- **Developer:** Anu (anuxoo001@gmail.com) — SuuSri AI Internship
- **Date:** September 2025 (Professional Bhubaneswar + Full Management System Edition)
- **Phone:** 8144685376 — Patia, Bhubaneswar, Odisha 751024
