import Link from "next/link"

const landingStyles = `
  :root {
    --violet-950: #110820;
    --violet-900: #1A0F2E;
    --violet-800: #251642;
    --violet-700: #2D1B4E;
    --violet-600: #3D2470;
    --violet-500: #7C5CFF;
    --violet-400: #9B7BFF;
    --violet-300: #BDA8FF;
    --violet-200: #DCCEFF;
    --cream-50: #FBFAF5;
    --cream-100: #F4EFE6;
    --cream-200: #EAE3D0;
    --cream-300: #D9CFB6;
    --ink: #1A0F2E;
    --muted: #6B5C84;
    --rose: #E5654B;
    --green: #5BA378;
  }

  .landing {
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    background: var(--cream-50);
    color: var(--ink);
    min-height: 100vh;
  }

  /* NAV */
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(251, 250, 245, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(26, 15, 46, 0.08);
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .nav-logo {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--ink);
    text-decoration: none;
    letter-spacing: -0.03em;
  }
  .nav-logo span {
    color: var(--violet-500);
  }
  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  @media (max-width: 768px) {
    .nav-links { display: none; }
  }
  .nav-links a {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-links a:hover { color: var(--ink); }
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-ghost {
    display: none;
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ink);
    background: transparent;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }
  @media (min-width: 768px) { .btn-ghost { display: inline-flex; align-items: center; } }
  .btn-ghost:hover { background: rgba(26, 15, 46, 0.06); }
  .btn-primary {
    padding: 10px 20px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    background: var(--violet-500);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s;
    display: inline-flex;
    align-items: center;
  }
  .btn-primary:hover { opacity: 0.88; }

  /* HERO */
  .hero {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: center;
  }
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding-top: 48px; }
  }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(124, 92, 255, 0.1);
    border: 1px solid rgba(124, 92, 255, 0.25);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--violet-500);
    margin-bottom: 24px;
    animation: fadeSlideDown 0.6s ease both;
  }
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero-eyebrow .dot {
    width: 7px;
    height: 7px;
    background: var(--violet-500);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  .hero h1 {
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.04em;
    color: var(--ink);
    margin: 0 0 20px;
  }
  .hero h1 .accent {
    color: var(--violet-500);
    position: relative;
    display: inline-block;
  }
  .hero h1 .accent::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 4px;
    background: var(--violet-500);
    border-radius: 2px;
    opacity: 0.4;
  }
  .hero-lead {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--muted);
    margin-bottom: 32px;
    max-width: 480px;
  }
  .hero-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }
  .btn-hero-primary {
    padding: 14px 28px;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    background: var(--violet-500);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-hero-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-hero-secondary {
    padding: 14px 28px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--ink);
    background: #fff;
    border: 1.5px solid var(--cream-200);
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.15s;
  }
  .btn-hero-secondary:hover { background: var(--cream-100); }
  .hero-trust {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.875rem;
    color: var(--muted);
  }
  .hero-trust-avatars {
    display: flex;
    margin-right: 4px;
  }
  .hero-trust-avatars span {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #fff;
    margin-left: -10px;
  }
  .hero-trust-avatars span:first-child { margin-left: 0; background: var(--violet-400); }
  .hero-trust-avatars span:nth-child(2) { background: var(--violet-500); }
  .hero-trust-avatars span:nth-child(3) { background: var(--violet-600); }

  /* PRODUCT MOCKUP */
  .mockup {
    background: var(--violet-950);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 32px 80px rgba(17, 8, 32, 0.4), 0 0 0 1px rgba(124, 92, 255, 0.15);
    position: relative;
    overflow: hidden;
  }
  .mockup::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(124, 92, 255, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .mockup-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
  }
  .mockup-bar-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .mockup-label {
    font-size: 0.75rem;
    color: rgba(189, 168, 255, 0.5);
    font-family: var(--font-geist-mono), monospace;
    margin-left: auto;
  }
  .mockup-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--violet-300);
    margin-bottom: 16px;
    font-family: var(--font-geist-mono), monospace;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .waterfall {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .wf-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.875rem;
  }
  .wf-row:hover { background: rgba(124, 92, 255, 0.06); }
  .wf-row .label { color: rgba(221, 206, 255, 0.7); }
  .wf-row .bar-wrap {
    width: 120px;
    height: 6px;
    background: rgba(124, 92, 255, 0.12);
    border-radius: 3px;
    overflow: hidden;
  }
  .wf-row .bar-fill {
    height: 100%;
    border-radius: 3px;
  }
  .wf-row .amount {
    font-weight: 700;
    font-size: 0.875rem;
    text-align: right;
    min-width: 80px;
    font-family: var(--font-geist-mono), monospace;
  }
  .wf-divider {
    height: 1px;
    background: rgba(124, 92, 255, 0.12);
    margin: 4px 12px;
  }
  .wf-total .label { color: var(--violet-300); font-weight: 700; }
  .wf-total .amount { color: var(--green); font-size: 1.05rem; }
  .chips-bar {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .chip {
    padding: 5px 12px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid;
  }
  .chip-violet { color: var(--violet-300); border-color: rgba(124, 92, 255, 0.3); background: rgba(124, 92, 255, 0.08); }
  .chip-green { color: #6ee7a0; border-color: rgba(110, 231, 160, 0.3); background: rgba(110, 231, 160, 0.08); }
  .chip-rose { color: #f4a593; border-color: rgba(229, 101, 75, 0.3); background: rgba(229, 101, 75, 0.08); }

  /* LOGOS BAND */
  .logos-band {
    border-top: 1px solid rgba(26, 15, 46, 0.08);
    border-bottom: 1px solid rgba(26, 15, 46, 0.08);
    background: #fff;
    padding: 28px 24px;
  }
  .logos-band-inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  .logos-band p {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .logos-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
  }
  .logo-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--cream-300);
    letter-spacing: -0.02em;
  }

  /* SECTIONS SHARED */
  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--violet-500);
    margin-bottom: 16px;
  }
  .eyebrow-num {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--violet-400);
    opacity: 0.6;
  }
  .section-h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 1.08;
    color: var(--ink);
    margin: 0 0 8px;
  }

  /* PROBLEM */
  .problem-section {
    padding: 80px 0;
  }
  .problem-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 48px;
    align-items: start;
  }
  @media (max-width: 900px) { .problem-grid { grid-template-columns: 1fr; } }
  .quote-card {
    background: var(--violet-950);
    border-radius: 20px;
    padding: 32px;
    position: relative;
    overflow: hidden;
  }
  .quote-card::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 16px;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(124, 92, 255, 0.12);
    line-height: 1;
    pointer-events: none;
  }
  .quote-text {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.6;
    color: var(--violet-200);
    margin-bottom: 20px;
    position: relative;
  }
  .quote-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .quote-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--violet-600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--violet-200);
  }
  .quote-name { font-size: 0.875rem; font-weight: 700; color: var(--violet-300); }
  .quote-role { font-size: 0.75rem; color: var(--muted); }
  .pain-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pain-card {
    background: #fff;
    border: 1.5px solid var(--cream-200);
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .pain-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .pain-icon-rose { background: rgba(229, 101, 75, 0.1); }
  .pain-icon-yellow { background: rgba(245, 197, 66, 0.12); }
  .pain-icon-violet { background: rgba(124, 92, 255, 0.1); }
  .pain-card h4 { font-size: 0.9375rem; font-weight: 700; color: var(--ink); margin: 0 0 4px; }
  .pain-card p { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.6; }

  /* HOW */
  .how-section {
    padding: 80px 0;
    background: var(--cream-100);
  }
  .how-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-top: 48px;
  }
  @media (max-width: 768px) { .how-steps { grid-template-columns: 1fr; } }
  .how-step {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(26, 15, 46, 0.06);
  }
  .how-step-visual {
    background: var(--cream-50);
    padding: 24px;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--cream-200);
  }
  .how-step-body {
    padding: 24px;
  }
  .how-step-num {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--violet-400);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .how-step h3 { font-size: 1.0625rem; font-weight: 800; color: var(--ink); margin: 0 0 8px; }
  .how-step p { font-size: 0.875rem; color: var(--muted); margin: 0; line-height: 1.65; }

  /* Form input visual */
  .form-visual {
    width: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(26, 15, 46, 0.08);
  }
  .form-field {
    margin-bottom: 10px;
  }
  .form-field label {
    display: block;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 4px;
  }
  .form-field-input {
    background: var(--cream-50);
    border: 1.5px solid var(--cream-200);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--ink);
  }
  .form-field-input.filled {
    border-color: var(--violet-400);
    background: rgba(124, 92, 255, 0.05);
    color: var(--violet-600);
  }

  /* Calc visual */
  .calc-visual {
    width: 100%;
    background: var(--violet-950);
    border-radius: 12px;
    padding: 16px;
  }
  .calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    font-size: 0.8125rem;
  }
  .calc-row .clabel { color: rgba(189, 168, 255, 0.6); }
  .calc-row .cval { font-weight: 700; font-family: var(--font-geist-mono), monospace; }
  .calc-row .cval-green { color: var(--green); }
  .calc-row .cval-rose { color: #f4a593; }
  .calc-row .cval-white { color: #fff; }
  .calc-divider { height: 1px; background: rgba(124, 92, 255, 0.15); margin: 6px 0; }

  /* Result dark visual */
  .result-visual {
    width: 100%;
    background: var(--violet-900);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid rgba(124, 92, 255, 0.2);
  }
  .result-visual .rv-label {
    font-size: 0.75rem;
    color: var(--violet-300);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  .result-visual .rv-amount {
    font-size: 2rem;
    font-weight: 900;
    color: var(--green);
    font-family: var(--font-geist-mono), monospace;
    letter-spacing: -0.04em;
    margin-bottom: 4px;
  }
  .result-visual .rv-sub {
    font-size: 0.75rem;
    color: var(--muted);
  }

  /* FEATURES */
  .features-section {
    padding: 80px 0;
  }
  .feature-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
    margin-top: 64px;
  }
  .feature-row.reverse { direction: rtl; }
  .feature-row.reverse > * { direction: ltr; }
  @media (max-width: 900px) {
    .feature-row, .feature-row.reverse { grid-template-columns: 1fr; direction: ltr; }
  }
  .feature-text .feature-h3 {
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--ink);
    letter-spacing: -0.03em;
    margin: 0 0 16px;
  }
  .feature-text p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--muted);
    margin: 0 0 24px;
  }
  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .feature-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--ink);
  }
  .feature-list li::before {
    content: '✓';
    width: 22px;
    height: 22px;
    background: rgba(91, 163, 120, 0.12);
    color: var(--green);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  .feature-visual {
    background: var(--cream-100);
    border-radius: 20px;
    padding: 28px;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1.5px solid var(--cream-200);
  }

  /* Alert + jauge visual */
  .alert-card {
    background: rgba(229, 101, 75, 0.08);
    border: 1.5px solid rgba(229, 101, 75, 0.25);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .alert-icon { font-size: 1.1rem; flex-shrink: 0; }
  .alert-title { font-size: 0.875rem; font-weight: 700; color: var(--rose); margin-bottom: 2px; }
  .alert-text { font-size: 0.8125rem; color: var(--muted); }
  .gauge-wrap {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    border: 1.5px solid var(--cream-200);
  }
  .gauge-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 10px;
  }
  .gauge-track {
    height: 10px;
    background: var(--cream-200);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .gauge-fill {
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(90deg, var(--green) 0%, #84e8aa 100%);
  }
  .gauge-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--muted);
  }

  /* Coach IA visual */
  .chat-wrap {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    border: 1.5px solid var(--cream-200);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .chat-msg {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.8125rem;
    line-height: 1.55;
  }
  .chat-msg.user {
    align-self: flex-end;
    background: var(--violet-500);
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .chat-msg.ai {
    align-self: flex-start;
    background: var(--cream-50);
    color: var(--ink);
    border: 1px solid var(--cream-200);
    border-bottom-left-radius: 4px;
  }
  .coach-score {
    background: var(--violet-950);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .coach-score-label { font-size: 0.8125rem; color: var(--violet-300); }
  .coach-score-val { font-size: 1.5rem; font-weight: 900; color: #fff; font-family: var(--font-geist-mono), monospace; }

  /* Invoice visual */
  .invoice-stack {
    position: relative;
    height: 160px;
  }
  .invoice-card {
    position: absolute;
    background: #fff;
    border: 1.5px solid var(--cream-200);
    border-radius: 12px;
    padding: 14px 16px;
    width: 90%;
    box-shadow: 0 4px 16px rgba(26, 15, 46, 0.06);
  }
  .invoice-card:nth-child(1) { top: 0px; left: 5%; transform: rotate(-2deg); z-index: 1; }
  .invoice-card:nth-child(2) { top: 24px; left: 2.5%; transform: rotate(0.5deg); z-index: 2; }
  .invoice-card:nth-child(3) { top: 48px; left: 0%; transform: rotate(1deg); z-index: 3; background: var(--cream-50); }
  .invoice-meta { font-size: 0.6875rem; color: var(--muted); margin-bottom: 6px; }
  .invoice-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .invoice-client { font-size: 0.8125rem; font-weight: 700; color: var(--ink); }
  .invoice-amount { font-size: 0.9375rem; font-weight: 800; color: var(--violet-500); font-family: var(--font-geist-mono), monospace; }

  /* COMPARISON */
  .comparison-section {
    padding: 80px 0;
    background: var(--cream-100);
  }
  .comparison-table-wrap {
    margin-top: 48px;
    overflow-x: auto;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(26, 15, 46, 0.07);
  }
  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
  }
  .comparison-table th {
    padding: 20px 24px;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 700;
    background: var(--cream-50);
    border-bottom: 2px solid var(--cream-200);
    color: var(--ink);
  }
  .comparison-table th.highlight {
    background: var(--violet-500);
    color: #fff;
  }
  .comparison-table td {
    padding: 16px 24px;
    font-size: 0.875rem;
    color: var(--ink);
    border-bottom: 1px solid var(--cream-100);
    vertical-align: middle;
  }
  .comparison-table tr:last-child td { border-bottom: none; }
  .comparison-table td.feature-col { font-weight: 600; color: var(--ink); }
  .comparison-table td.highlight { background: rgba(124, 92, 255, 0.05); font-weight: 700; color: var(--violet-600); }
  .check { color: var(--green); font-weight: 800; }
  .cross { color: var(--rose); font-weight: 800; }
  .partial { color: #f5c542; font-weight: 700; }

  /* PRICING */
  .pricing-section {
    padding: 80px 0;
    background: var(--violet-950);
  }
  .pricing-section .eyebrow { color: var(--violet-300); }
  .pricing-section .section-h2 { color: #fff; }
  .pricing-sub { font-size: 1.0625rem; color: var(--muted); margin-bottom: 48px; }
  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    max-width: 760px;
  }
  @media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr; } }
  .price-card {
    border-radius: 20px;
    padding: 32px;
    position: relative;
  }
  .price-card-free {
    background: var(--violet-900);
    border: 1.5px solid rgba(124, 92, 255, 0.2);
  }
  .price-card-premium {
    background: #fff;
    border: 2px solid var(--violet-500);
    box-shadow: 0 16px 48px rgba(124, 92, 255, 0.3);
  }
  .price-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--violet-500);
    color: #fff;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .price-card-name { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
  .price-card-free .price-card-name { color: var(--violet-300); }
  .price-card-premium .price-card-name { color: var(--violet-500); }
  .price-amount { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 4px; }
  .price-card-free .price-amount { color: #fff; }
  .price-card-premium .price-amount { color: var(--ink); }
  .price-period { font-size: 0.875rem; margin-bottom: 24px; }
  .price-card-free .price-period { color: var(--muted); }
  .price-card-premium .price-period { color: var(--muted); }
  .price-features {
    list-style: none;
    padding: 0;
    margin: 0 0 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .price-features li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
  }
  .price-card-free .price-features li { color: var(--violet-300); }
  .price-card-premium .price-features li { color: var(--ink); }
  .price-features li .pcheck { color: var(--green); font-weight: 800; }
  .price-cta {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 700;
    cursor: pointer;
    border: none;
    text-align: center;
    text-decoration: none;
    display: block;
    transition: opacity 0.15s, transform 0.15s;
  }
  .price-cta:hover { opacity: 0.88; transform: translateY(-1px); }
  .price-cta-free { background: rgba(124, 92, 255, 0.12); color: var(--violet-300); }
  .price-cta-premium { background: var(--violet-500); color: #fff; }

  /* FAQ */
  .faq-section {
    padding: 80px 0;
  }
  .faq-list {
    max-width: 720px;
    margin: 48px auto 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .faq-list details {
    border-bottom: 1px solid var(--cream-200);
  }
  .faq-list details:first-child { border-top: 1px solid var(--cream-200); }
  .faq-list summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink);
    cursor: pointer;
    list-style: none;
    gap: 16px;
  }
  .faq-list summary::-webkit-details-marker { display: none; }
  .faq-list summary::after {
    content: '+';
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--violet-500);
    flex-shrink: 0;
    transition: transform 0.2s;
  }
  .faq-list details[open] summary::after { content: '−'; }
  .faq-answer {
    padding: 0 0 20px;
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--muted);
  }

  /* FINAL CTA */
  .final-cta-section {
    padding: 80px 24px;
  }
  .final-cta-card {
    max-width: 880px;
    margin: 0 auto;
    background: var(--violet-950);
    border-radius: 24px;
    padding: 56px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(124, 92, 255, 0.2);
    box-shadow: 0 24px 64px rgba(17, 8, 32, 0.3);
  }
  .final-cta-card::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(124, 92, 255, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .final-cta-card h2 {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.1;
    color: #fff;
    margin: 0 0 16px;
    position: relative;
  }
  .final-cta-card h2 span { color: var(--violet-400); }
  .final-cta-card p {
    font-size: 1.0625rem;
    color: var(--muted);
    margin: 0 0 32px;
    position: relative;
  }
  .final-cta-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    position: relative;
  }

  /* FOOTER */
  .footer {
    background: var(--violet-950);
    padding: 56px 24px 32px;
    color: var(--violet-300);
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
  @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
  .footer-brand-logo {
    font-size: 1.3rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }
  .footer-brand-logo span { color: var(--violet-500); }
  .footer-brand-desc {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--muted);
    max-width: 260px;
  }
  .footer-col-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(189, 168, 255, 0.5);
    margin-bottom: 16px;
  }
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .footer-links a {
    font-size: 0.875rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.15s;
  }
  .footer-links a:hover { color: var(--violet-300); }
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(124, 92, 255, 0.12);
    font-size: 0.8125rem;
    color: var(--muted);
    flex-wrap: wrap;
    gap: 12px;
  }
  .footer-bottom a { color: var(--muted); text-decoration: none; }
  .footer-bottom a:hover { color: var(--violet-300); }
`

export default function HomePage() {
  return (
    <>
      <style>{landingStyles}</style>
      <div className="landing">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">keskireste<span>.</span></Link>
            <ul className="nav-links">
              <li><a href="#how">Comment ça marche</a></li>
              <li><a href="#features">Fonctionnalités</a></li>
              <li><a href="#pricing">Tarifs</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link href="/histoire">Notre histoire</Link></li>
            </ul>
            <div className="nav-actions">
              <Link href="/login" className="btn-ghost">Se connecter</Link>
              <Link href="/signup" className="btn-primary">Essayer gratuitement</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eyebrow">
              <span className="dot"></span>
              Le copilote financier des auto-entrepreneurs
            </div>
            <h1>
              Sache enfin<br />
              combien il te<br />
              reste <span className="accent">vraiment.</span>
            </h1>
            <p className="hero-lead">
              Tu encaisses des clients. Mais après les charges URSSAF, les impôts, les frais — il reste quoi ? KeskiReste te le dit en temps réel, sans Excel, sans comptable.
            </p>
            <div className="hero-actions">
              <Link href="/signup" className="btn-hero-primary">
                Essayer gratuitement
                <span style={{fontSize:'1.1em'}}>→</span>
              </Link>
              <a href="#how" className="btn-hero-secondary">
                Voir comment ça marche
              </a>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-avatars">
                <span>L</span>
                <span>M</span>
                <span>T</span>
              </div>
              <span>Plus de <strong>4 200 freelances</strong> nous font déjà confiance</span>
            </div>
          </div>

          {/* PRODUCT MOCKUP */}
          <div className="mockup">
            <div className="mockup-bar">
              <span className="mockup-bar-dot" style={{background:'#ff5f57'}}></span>
              <span className="mockup-bar-dot" style={{background:'#febc2e'}}></span>
              <span className="mockup-bar-dot" style={{background:'#28c840'}}></span>
              <span className="mockup-label">keskireste.fr / dashboard</span>
            </div>
            <div className="mockup-title">Décembre 2024 — Vue d&apos;ensemble</div>
            <div className="waterfall">
              <div className="wf-row">
                <span className="label">Chiffre d&apos;affaires encaissé</span>
                <div className="bar-wrap"><div className="bar-fill" style={{width:'100%', background:'rgba(124,92,255,0.5)'}}></div></div>
                <span className="amount" style={{color:'#fff'}}>4 800,00 €</span>
              </div>
              <div className="wf-row">
                <span className="label">Cotisations URSSAF (22%)</span>
                <div className="bar-wrap"><div className="bar-fill" style={{width:'45%', background:'rgba(229,101,75,0.6)'}}></div></div>
                <span className="amount" style={{color:'#f4a593'}}>− 1 056,00 €</span>
              </div>
              <div className="wf-row">
                <span className="label">Provision impôt (PAS)</span>
                <div className="bar-wrap"><div className="bar-fill" style={{width:'25%', background:'rgba(245,197,66,0.5)'}}></div></div>
                <span className="amount" style={{color:'#fde68a'}}>− 480,00 €</span>
              </div>
              <div className="wf-row">
                <span className="label">Dépenses professionnelles</span>
                <div className="bar-wrap"><div className="bar-fill" style={{width:'15%', background:'rgba(107,92,132,0.5)'}}></div></div>
                <span className="amount" style={{color:'rgba(189,168,255,0.7)'}}>− 214,00 €</span>
              </div>
              <div className="wf-divider"></div>
              <div className="wf-row wf-total">
                <span className="label">Il te reste</span>
                <div className="bar-wrap"><div className="bar-fill" style={{width:'65%', background:'rgba(91,163,120,0.7)'}}></div></div>
                <span className="amount">3 050,00 €</span>
              </div>
            </div>
            <div className="chips-bar">
              <span className="chip chip-violet">Déclaration dans 12 j</span>
              <span className="chip chip-green">Objectif dépassé ✓</span>
              <span className="chip chip-rose">Facture en attente</span>
            </div>
          </div>
        </section>

        {/* LOGOS BAND */}
        <div className="logos-band">
          <div className="logos-band-inner">
            <p>Plus de 4 200 freelances français nous font confiance</p>
            <div className="logos-row">
              <span className="logo-name">Malt</span>
              <span className="logo-name">Comet</span>
              <span className="logo-name">Collective</span>
              <span className="logo-name">Fiverr</span>
              <span className="logo-name">Upwork</span>
              <span className="logo-name">Welcome to the Jungle</span>
            </div>
          </div>
        </div>

        {/* PROBLEM */}
        <section className="problem-section">
          <div className="section-inner">
            <div className="eyebrow"><span className="eyebrow-num">01</span> Le problème</div>
            <h2 className="section-h2">Pourquoi la plupart des<br />indépendants perdent de l&apos;argent<br />sans le savoir</h2>
            <div className="problem-grid">
              <div className="quote-card">
                <p className="quote-text">
                  "J&apos;ai encaissé 6 000 € en novembre. J&apos;étais tellement content. Et puis le 5 décembre, l&apos;URSSAF a prélevé 1 320 €, le fisc 600 €, et j&apos;avais oublié l&apos;abonnement Figma, le coworking... Il me restait 3 400 €. Pas 6 000."
                </p>
                <div className="quote-author">
                  <div className="quote-avatar">L</div>
                  <div>
                    <div className="quote-name">Léa M.</div>
                    <div className="quote-role">Designer freelance, Lyon</div>
                  </div>
                </div>
              </div>
              <div className="pain-cards">
                <div className="pain-card">
                  <div className="pain-icon pain-icon-rose">🧮</div>
                  <div>
                    <h4>L&apos;Excel que tu ne remplis plus</h4>
                    <p>Au début tu le tiens à jour. Puis tu rates une semaine. Puis un mois. Et tu perds complètement le fil de ta situation réelle.</p>
                  </div>
                </div>
                <div className="pain-card">
                  <div className="pain-icon pain-icon-yellow">⚡</div>
                  <div>
                    <h4>La mauvaise surprise URSSAF</h4>
                    <p>Tu te crois à l&apos;aise, tu dépenses. Et puis le prélèvement tombe. C&apos;est pas 22% de ce que tu as en tête — c&apos;est 22% de ce que t&apos;as vraiment facturé.</p>
                  </div>
                </div>
                <div className="pain-card">
                  <div className="pain-icon pain-icon-violet">🌀</div>
                  <div>
                    <h4>Le comptable, c&apos;est pour les boîtes</h4>
                    <p>Un comptable pour auto-entrepreneur : 80-150 €/mois pour te sortir un bilan annuel. Toi t&apos;as besoin de savoir ce qu&apos;il reste aujourd&apos;hui.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="how-section">
          <div className="section-inner">
            <div className="eyebrow"><span className="eyebrow-num">02</span> Comment ça marche</div>
            <h2 className="section-h2">Trois étapes,<br />aucune prise de tête</h2>
            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-visual">
                  <div className="form-visual">
                    <div className="form-field">
                      <label htmlFor="ca-input">Chiffre d&apos;affaires du mois</label>
                      <div className="form-field-input filled">3 200,00 €</div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="status-input">Régime fiscal</label>
                      <div className="form-field-input">Micro-entrepreneur (BNC)</div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="acc-input">Acompte versement libératoire</label>
                      <div className="form-field-input">Non</div>
                    </div>
                  </div>
                </div>
                <div className="how-step-body">
                  <div className="how-step-num">Étape 01</div>
                  <h3>Tu renseignes tes revenus</h3>
                  <p>Ajoute tes encaissements en quelques secondes. Aucune formation requise. Aucun jargon comptable.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="how-step-visual">
                  <div className="calc-visual">
                    <div className="calc-row">
                      <span className="clabel">CA encaissé</span>
                      <span className="cval cval-white">3 200 €</span>
                    </div>
                    <div className="calc-row">
                      <span className="clabel">URSSAF (22%)</span>
                      <span className="cval cval-rose">− 704 €</span>
                    </div>
                    <div className="calc-row">
                      <span className="clabel">Impôt estimé (PAS)</span>
                      <span className="cval cval-rose">− 320 €</span>
                    </div>
                    <div className="calc-row">
                      <span className="clabel">CFE annualisée</span>
                      <span className="cval cval-rose">− 46 €</span>
                    </div>
                    <div className="calc-row">
                      <span className="clabel">Frais pro</span>
                      <span className="cval cval-rose">− 180 €</span>
                    </div>
                    <div className="calc-divider"></div>
                    <div className="calc-row">
                      <span className="clabel" style={{color:'#fff', fontWeight:700}}>Il te reste</span>
                      <span className="cval cval-green">1 950 €</span>
                    </div>
                  </div>
                </div>
                <div className="how-step-body">
                  <div className="how-step-num">Étape 02</div>
                  <h3>On calcule tout automatiquement</h3>
                  <p>URSSAF, impôt sur le revenu, CFE, frais pro — tout est soustrait. Tu vois le vrai net disponible, pas le brut qui fait rêver.</p>
                </div>
              </div>
              <div className="how-step">
                <div className="how-step-visual">
                  <div className="result-visual">
                    <div className="rv-label">Ton vrai disponible ce mois-ci</div>
                    <div className="rv-amount">1 950 €</div>
                    <div className="rv-sub">après toutes charges et provisions</div>
                    <div style={{marginTop:'16px', padding:'10px 12px', background:'rgba(124,92,255,0.1)', borderRadius:'8px', border:'1px solid rgba(124,92,255,0.2)', fontSize:'0.8125rem', color:'var(--violet-300)', textAlign:'left', lineHeight:'1.55'}}>
                      💡 Tu pourrais te verser un salaire de 1 800 €/mois en gardant 150 € de réserve.
                    </div>
                  </div>
                </div>
                <div className="how-step-body">
                  <div className="how-step-num">Étape 03</div>
                  <h3>Tu sais exactement quoi faire</h3>
                  <p>Combien te verser, quoi mettre de côté, si tu peux faire cette dépense. Des réponses claires, pas des graphiques inutiles.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="features-section">
          <div className="section-inner">
            {/* Feature 1 — Alertes */}
            <div className="feature-row">
              <div className="feature-text">
                <div className="eyebrow"><span className="eyebrow-num">03</span> Alertes intelligentes</div>
                <h3 className="feature-h3">Ne sois plus jamais<br />pris par surprise</h3>
                <p>KeskiReste surveille ta trésorerie et t&apos;alerte avant que tu débordes. Echéance URSSAF dans 15 jours ? Provision insuffisante ? Tu le sais avant que ça arrive.</p>
                <ul className="feature-list">
                  <li>Alertes avant chaque échéance sociale</li>
                  <li>Indicateur de sécurité en temps réel</li>
                  <li>Projection de trésorerie sur 3 mois</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="alert-card">
                  <span className="alert-icon">⚠️</span>
                  <div>
                    <div className="alert-title">Échéance URSSAF dans 14 jours</div>
                    <div className="alert-text">Tu dois verser 1 056 € le 31 janv. Ta provision actuelle est de 980 €. Il manque 76 €.</div>
                  </div>
                </div>
                <div className="gauge-wrap">
                  <div className="gauge-label">
                    <span>Provision URSSAF</span>
                    <span style={{color:'var(--green)'}}>93 %</span>
                  </div>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{width:'93%'}}></div>
                  </div>
                  <div className="gauge-meta">
                    <span>980 € provisionnés</span>
                    <span>Objectif : 1 056 €</span>
                  </div>
                </div>
                <div className="gauge-wrap" style={{marginTop:0}}>
                  <div className="gauge-label">
                    <span>Provision impôt</span>
                    <span style={{color:'var(--green)'}}>100 %</span>
                  </div>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{width:'100%', background:'linear-gradient(90deg, var(--violet-500) 0%, var(--violet-400) 100%)'}}></div>
                  </div>
                  <div className="gauge-meta">
                    <span>480 € provisionnés</span>
                    <span>Objectif : 480 €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — Coach IA */}
            <div className="feature-row reverse">
              <div className="feature-text">
                <div className="eyebrow"><span className="eyebrow-num">04</span> Coach IA</div>
                <h3 className="feature-h3">Un conseiller financier<br />dans ta poche</h3>
                <p>Pose tes questions en langage naturel. &quot;Est-ce que je peux m&apos;acheter un Mac à 1 500 € ce mois-ci ?&quot; — Il sait, il répond, il argumente.</p>
                <ul className="feature-list">
                  <li>Réponses personnalisées à ta situation réelle</li>
                  <li>Analyse de tes patterns de revenus</li>
                  <li>Conseils concrets, jamais génériques</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="chat-wrap">
                  <div className="chat-msg user">Est-ce que je peux m&apos;acheter un MacBook Pro à 2 499 € ce mois-ci ?</div>
                  <div className="chat-msg ai">
                    Oui, mais avec précautions 🟡<br /><br />
                    Tu as actuellement <strong>1 950 € de disponible réel</strong>. Le Mac coûte 2 499 €, soit 549 € de plus que ton dispo.<br /><br />
                    Option : attendre ton prochain encaissement prévu le 15 (+2 800 €) — tu seras alors largement à l&apos;aise.
                  </div>
                </div>
                <div className="coach-score">
                  <div>
                    <div className="coach-score-label">Score de santé financière</div>
                    <div style={{fontSize:'0.75rem', color:'var(--muted)', marginTop:'2px'}}>Basé sur tes 3 derniers mois</div>
                  </div>
                  <div className="coach-score-val">82<span style={{fontSize:'1rem', color:'var(--muted)'}}>/100</span></div>
                </div>
              </div>
            </div>

            {/* Feature 3 — Factures PDF */}
            <div className="feature-row">
              <div className="feature-text">
                <div className="eyebrow"><span className="eyebrow-num">05</span> Factures PDF</div>
                <h3 className="feature-h3">Tes factures en 30 secondes,<br />conformes et prêtes</h3>
                <p>Génère des factures professionnelles conformes à la législation française. Numérotation automatique, mentions légales, export PDF d&apos;un clic.</p>
                <ul className="feature-list">
                  <li>Conformes aux exigences françaises (TVA, mentions)</li>
                  <li>Numérotation automatique et séquentielle</li>
                  <li>Export PDF instantané + envoi par email</li>
                </ul>
              </div>
              <div className="feature-visual" style={{position:'relative'}}>
                <div className="invoice-stack">
                  <div className="invoice-card">
                    <div className="invoice-meta">Facture #2024-011 • 28 nov. 2024</div>
                    <div className="invoice-row">
                      <span className="invoice-client">Studio Margaux</span>
                      <span className="invoice-amount" style={{color:'var(--muted)', fontSize:'0.75rem'}}>1 200 €</span>
                    </div>
                  </div>
                  <div className="invoice-card">
                    <div className="invoice-meta">Facture #2024-012 • 5 déc. 2024</div>
                    <div className="invoice-row">
                      <span className="invoice-client">Agence Bloom</span>
                      <span className="invoice-amount" style={{color:'var(--muted)', fontSize:'0.75rem'}}>2 400 €</span>
                    </div>
                  </div>
                  <div className="invoice-card">
                    <div className="invoice-meta">Facture #2024-013 • 12 déc. 2024</div>
                    <div className="invoice-row">
                      <span className="invoice-client">Startup Helix</span>
                      <span className="invoice-amount">1 800 €</span>
                    </div>
                  </div>
                </div>
                <div style={{marginTop:'120px', background:'#fff', borderRadius:'12px', padding:'14px 16px', border:'1.5px solid var(--cream-200)'}}>
                  <div style={{fontSize:'0.75rem', color:'var(--muted)', marginBottom:'8px'}}>Décembre 2024 — 3 factures émises</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'0.875rem', fontWeight:600, color:'var(--ink)'}}>Total encaissé</span>
                    <span style={{fontSize:'1.125rem', fontWeight:800, color:'var(--violet-500)', fontFamily:'var(--font-geist-mono), monospace'}}>5 400 €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="comparison-section">
          <div className="section-inner">
            <div style={{textAlign:'center', marginBottom:'0'}}>
              <div className="eyebrow" style={{justifyContent:'center'}}>Comparatif</div>
              <h2 className="section-h2">Pourquoi keskireste ?</h2>
            </div>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Fonctionnalité</th>
                    <th>Excel maison</th>
                    <th>Logiciel comptabilité</th>
                    <th className="highlight">keskireste.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-col">Calcul automatique URSSAF / impôt</td>
                    <td><span className="cross">✗</span> Manuel</td>
                    <td><span className="partial">~ </span>Partiel</td>
                    <td className="highlight"><span className="check">✓</span> Automatique</td>
                  </tr>
                  <tr>
                    <td className="feature-col">Disponible réel en temps réel</td>
                    <td><span className="cross">✗</span></td>
                    <td><span className="cross">✗</span></td>
                    <td className="highlight"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td className="feature-col">Alertes avant échéances</td>
                    <td><span className="cross">✗</span></td>
                    <td><span className="partial">~ </span>Basiques</td>
                    <td className="highlight"><span className="check">✓</span> Intelligentes</td>
                  </tr>
                  <tr>
                    <td className="feature-col">Coach IA personnalisé</td>
                    <td><span className="cross">✗</span></td>
                    <td><span className="cross">✗</span></td>
                    <td className="highlight"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td className="feature-col">Génération de factures PDF</td>
                    <td><span className="cross">✗</span></td>
                    <td><span className="check">✓</span></td>
                    <td className="highlight"><span className="check">✓</span></td>
                  </tr>
                  <tr>
                    <td className="feature-col">Pensé pour les auto-entrepreneurs</td>
                    <td><span className="cross">✗</span></td>
                    <td><span className="cross">✗</span></td>
                    <td className="highlight"><span className="check">✓</span> 100%</td>
                  </tr>
                  <tr>
                    <td className="feature-col">Temps de prise en main</td>
                    <td>Plusieurs heures</td>
                    <td>Plusieurs jours</td>
                    <td className="highlight"><span className="check">✓</span> 5 minutes</td>
                  </tr>
                  <tr>
                    <td className="feature-col">Prix mensuel</td>
                    <td>0 € (+ temps perdu)</td>
                    <td>50 – 150 €/mois</td>
                    <td className="highlight"><span className="check">✓</span> 19,90 €/mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing-section">
          <div className="section-inner">
            <div className="eyebrow"><span className="eyebrow-num" style={{color:'rgba(189,168,255,0.5)'}}>06</span> Tarifs</div>
            <h2 className="section-h2">Simple. Transparent.<br />Sans mauvaises surprises.</h2>
            <p className="pricing-sub">Commence gratuitement, passe Premium quand tu es convaincu.</p>
            <div className="pricing-grid">
              {/* Free */}
              <div className="price-card price-card-free">
                <div className="price-card-name">Gratuit</div>
                <div className="price-amount">0 €</div>
                <div className="price-period">pour toujours</div>
                <ul className="price-features">
                  <li><span className="pcheck">✓</span> Dashboard basique</li>
                  <li><span className="pcheck">✓</span> Suivi des revenus (3 mois)</li>
                  <li><span className="pcheck">✓</span> Calcul URSSAF automatique</li>
                  <li><span className="pcheck">✓</span> 3 factures / mois</li>
                  <li><span className="pcheck">✓</span> 1 question IA / semaine</li>
                </ul>
                <Link href="/signup" className="price-cta price-cta-free">Commencer gratuitement</Link>
              </div>
              {/* Premium */}
              <div className="price-card price-card-premium">
                <div className="price-badge">Le plus populaire</div>
                <div className="price-card-name">Premium</div>
                <div className="price-amount">19,90 €</div>
                <div className="price-period">/ mois · sans engagement</div>
                <ul className="price-features">
                  <li><span className="pcheck">✓</span> Tout le gratuit +</li>
                  <li><span className="pcheck">✓</span> Historique illimité</li>
                  <li><span className="pcheck">✓</span> Factures illimitées + PDF</li>
                  <li><span className="pcheck">✓</span> Coach IA illimité</li>
                  <li><span className="pcheck">✓</span> Alertes intelligentes</li>
                  <li><span className="pcheck">✓</span> Export comptable</li>
                  <li><span className="pcheck">✓</span> Support prioritaire</li>
                </ul>
                <Link href="/signup" className="price-cta price-cta-premium">Essayer 14 jours gratuits</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq-section">
          <div className="section-inner">
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{justifyContent:'center'}}>FAQ</div>
              <h2 className="section-h2">Questions fréquentes</h2>
            </div>
            <div className="faq-list">
              <details open>
                <summary>C&apos;est quoi exactement keskireste ?</summary>
                <div className="faq-answer">
                  KeskiReste est un tableau de bord financier conçu spécifiquement pour les auto-entrepreneurs français. Il calcule automatiquement tes charges URSSAF, tes provisions d&apos;impôt et te dit en temps réel combien tu peux réellement dépenser ou te verser, sans Excel ni comptable.
                </div>
              </details>
              <details>
                <summary>Est-ce que c&apos;est fait pour mon activité ?</summary>
                <div className="faq-answer">
                  Oui, si tu es auto-entrepreneur (micro-entrepreneur) en France — freelance, consultant, designer, développeur, coach, artisan, créateur de contenu. L&apos;outil gère les régimes BIC et BNC, avec ou sans versement libératoire.
                </div>
              </details>
              <details>
                <summary>Quelle différence avec mon comptable ou Excel ?</summary>
                <div className="faq-answer">
                  Un comptable pour auto-entrepreneur coûte 80-150 €/mois pour un bilan annuel. Excel, tu l&apos;abandonnes au bout de 3 semaines. KeskiReste te donne une vision temps réel, automatiquement mise à jour, pour 19,90 €/mois — et ça prend 5 minutes à prendre en main.
                </div>
              </details>
              <details>
                <summary>Est-ce que mes données sont sécurisées ?</summary>
                <div className="faq-answer">
                  Tes données sont hébergées en France, chiffrées en transit et au repos, et ne sont jamais revendues ni partagées. Nous sommes conformes au RGPD. Tu peux exporter ou supprimer tes données à tout moment.
                </div>
              </details>
              <details>
                <summary>Est-ce que je peux annuler quand je veux ?</summary>
                <div className="faq-answer">
                  Oui, sans frais ni engagement. Tu peux annuler depuis ton espace client en 2 clics. Ton accès Premium reste actif jusqu&apos;à la fin de la période payée.
                </div>
              </details>
              <details>
                <summary>Comment fonctionne le coach IA ?</summary>
                <div className="faq-answer">
                  Le coach IA a accès à ta situation financière réelle (revenus, charges, provisions) et répond à tes questions en connaissance de cause. &quot;Est-ce que je peux me payer cette dépense ?&quot;, &quot;Quel salaire me verser ce mois-ci ?&quot;, &quot;Combien mettre de côté pour l&apos;impôt ?&quot; — des réponses concrètes, pas génériques.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta-section">
          <div className="final-cta-card">
            <h2>Tu encaisses.<br /><span>On te dit ce qu&apos;il reste.</span></h2>
            <p>Rejoins les 4 200 freelances qui ont repris le contrôle de leurs finances.</p>
            <div className="final-cta-actions">
              <Link href="/signup" className="btn-hero-primary">Essayer gratuitement — 0 €</Link>
              <Link href="/histoire" className="btn-hero-secondary">Notre histoire →</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <div className="footer-brand-logo">keskireste<span>.</span></div>
                <p className="footer-brand-desc">Le copilote financier des auto-entrepreneurs français. Simple, honnête, utile.</p>
              </div>
              <div>
                <div className="footer-col-title">Produit</div>
                <ul className="footer-links">
                  <li><a href="#how">Comment ça marche</a></li>
                  <li><a href="#features">Fonctionnalités</a></li>
                  <li><a href="#pricing">Tarifs</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Entreprise</div>
                <ul className="footer-links">
                  <li><Link href="/histoire">Notre histoire</Link></li>
                  <li><a href="mailto:hello@keskireste.fr">Contact</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Légal</div>
                <ul className="footer-links">
                  <li><Link href="/legal/mentions">Mentions légales</Link></li>
                  <li><Link href="/legal/confidentialite">Confidentialité</Link></li>
                  <li><Link href="/legal/cgv">CGV</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2025 keskireste. Fait avec ♥ en France.</span>
              <div style={{display:'flex', gap:'20px'}}>
                <Link href="/legal/mentions">Mentions légales</Link>
                <Link href="/legal/confidentialite">Politique de confidentialité</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
