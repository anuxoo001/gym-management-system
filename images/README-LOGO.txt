Suusri AI Logo — Usage Instructions
================================
1. Save the white-background image you received as:
   D:\Suusri AI\gym-management-system\images\suusri-ai-logo.png
   (the site already references this exact path)

   - Right-click the image in chat -> Save As -> choose
     D:\Suusri AI\gym-management-system\images\suusri-ai-logo.png
   - Also save a copy as suusri-ai-logo-white.png for light backgrounds

2. For best result on dark theme (navbar, dashboard, preloader):
   - The SVG files already placed are transparent-background vectors:
     images/suusri-ai-logo.svg  (full horizontal lotus + Suusri AI text)
     images/suusri-ai-icon.svg  (lotus icon only for favicon/small)
   - The HTML is configured to try SVG first, then fall back to PNG:
     <img src="images/suusri-ai-logo.svg" onerror="this.src='images/suusri-ai-logo.png'">

3. Favicon & PWA:
   - Place a 512x512 version as images/favicon.png (or copy suusri-ai-icon.svg)
   - Browsers will use the SVG + PNG fallback already linked in <head>

4. If PNG has white background and you see a white rectangle on dark navbar:
   - Edit style.css .nav-logo-img: add background:#fff; padding:3px 8px; border-radius:8px;
   - OR replace PNG with transparent version (recommended): export logo with transparent background from design tool.

5. Duplicate for week-2 project:
   - Copy images/suusri-ai-logo.svg and .png to
     D:\Suusri AI\Int-001-6A8F2C15\week-2\gym-management-system\images\

The site already shows the SVG logo everywhere (navbar, preloader, footer, login hero, dashboard sidebar, browser tab). Once you save the PNG, it will be used as high-res fallback and for social sharing.
