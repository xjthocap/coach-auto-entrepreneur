import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre histoire — keskireste.",
  description: "L'histoire d'un fichier Excel partagé entre potes freelances qui est devenu, sept ans plus tard, l'outil que je rêvais d'avoir à 19 ans.",
  alternates: { canonical: "https://keskireste.fr/histoire" },
  openGraph: {
    title: "Notre histoire — keskireste.",
    description: "Comment un fichier Excel partagé entre freelances est devenu un vrai produit. L'histoire honnête de keskireste. — keskireste.fr",
    url: "https://keskireste.fr/histoire",
  },
}

const css = `
  .histoire-page {
    font-family: 'Geist', var(--font-geist-sans), sans-serif;
    background: #F4EFE6;
    color: #1A0F2E;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    min-height: 100vh;
  }
  .histoire-page *, .histoire-page *::before, .histoire-page *::after { box-sizing: border-box; }
  .histoire-page ::selection { background: #7C5CFF; color: #FBFAF5; }

  /* ── Tokens ── */
  .histoire-page {
    --v950: #110820;
    --v900: #1A0F2E;
    --v700: #2D1B4E;
    --v500: #7C5CFF;
    --v400: #9B7BFF;
    --v300: #BDA8FF;
    --v200: #DCCEFF;
    --v100: #ECE4FF;
    --c50:  #FBFAF5;
    --c100: #F4EFE6;
    --c200: #EAE3D0;
    --c300: #D9CFB6;
    --ink:  #1A0F2E;
    --muted:#6B5C84;
    --rose: #E5654B;
    --green:#5BA378;
  }

  .h-wrap  { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
  .h-narrow{ max-width: 760px;  margin: 0 auto; padding: 0 32px; }
  .h-story { max-width: 680px;  margin: 0 auto; padding: 0 32px; }

  /* ── NAV ── */
  .h-nav {
    position: sticky; top: 0; z-index: 50;
    backdrop-filter: blur(18px);
    background: rgba(244,239,230,0.78);
    border-bottom: 1px solid rgba(26,15,46,0.06);
  }
  .h-nav-inner {
    max-width: 1240px; margin: 0 auto;
    padding: 14px 32px;
    display: flex; align-items: center; gap: 24px;
  }
  .h-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; color: var(--ink);
  }
  .h-logo-mark {
    width: 30px; height: 30px;
    background: var(--ink);
    border-radius: 9px;
    position: relative; flex-shrink: 0;
  }
  .h-logo-mark::after {
    content: '';
    position: absolute;
    bottom: 4px; right: 4px;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: var(--v400);
    box-shadow: 0 0 0 2px var(--ink);
  }
  .h-logo-name { font-weight: 600; font-size: 18px; letter-spacing: -0.03em; }
  .h-logo-name .dot { color: var(--v500); }
  .h-nav-links {
    display: flex; gap: 6px; margin-left: 32px;
  }
  .h-nav-links a {
    color: var(--ink); text-decoration: none;
    font-size: 14px; font-weight: 500;
    padding: 8px 14px; border-radius: 8px;
    transition: background 0.15s; white-space: nowrap;
  }
  .h-nav-links a:hover { background: rgba(26,15,46,0.05); }
  .h-nav-links a.current { background: rgba(124,92,255,0.12); color: var(--v500); }
  .h-nav-cta { margin-left: auto; display: flex; gap: 8px; align-items: center; }
  .h-btn {
    display: inline-flex; align-items: center; gap: 8px;
    border: none; cursor: pointer; text-decoration: none;
    font-family: inherit; font-weight: 500;
    transition: all 0.15s ease; white-space: nowrap;
    border-radius: 999px;
  }
  .h-btn-sm  { font-size: 13.5px; padding: 8px 16px; }
  .h-btn-lg  { font-size: 15.5px; padding: 16px 28px; }
  .h-btn-ghost { color: var(--ink); background: transparent; }
  .h-btn-ghost:hover { background: rgba(26,15,46,0.06); }
  .h-btn-dark { background: var(--ink); color: var(--c50); }
  .h-btn-dark:hover { background: var(--v700); transform: translateY(-1px); }
  .h-btn-violet { background: var(--v500); color: white; }
  .h-btn-violet:hover { background: var(--v400); transform: translateY(-1px); box-shadow: 0 12px 32px rgba(124,92,255,0.35); }

  /* ── HERO ── */
  .story-hero {
    padding: 80px 0 60px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .story-hero::before {
    content: '';
    position: absolute; top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 400px;
    background: radial-gradient(ellipse, rgba(124,92,255,0.12), transparent 70%);
    pointer-events: none;
  }
  .story-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--v500); margin-bottom: 24px;
    position: relative; white-space: nowrap;
  }
  .story-eyebrow::before, .story-eyebrow::after {
    content: ''; width: 32px; height: 1px; background: var(--v300);
  }
  .story-h1 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(48px, 7vw, 88px);
    line-height: 1.18; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 32px; position: relative;
  }
  .story-h1 em { font-style: italic; color: var(--v500); }
  .story-lead {
    font-size: 19px; line-height: 1.55; color: var(--muted);
    max-width: 580px; margin: 0 auto 40px;
  }
  .story-meta {
    display: inline-flex; gap: 28px; align-items: center;
    font-size: 13px; color: var(--muted);
    padding: 12px 24px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(26,15,46,0.08);
    border-radius: 100px;
  }
  .story-meta .by { display: inline-flex; align-items: center; gap: 8px; }
  .story-meta .avatar {
    width: 24px; height: 24px; border-radius: 50%;
    background: linear-gradient(135deg, var(--v500), var(--v300));
    color: white; display: grid; place-items: center;
    font-size: 11px; font-weight: 600;
  }
  .story-meta .sep { width: 3px; height: 3px; background: var(--c300); border-radius: 50%; }

  /* ── TIMELINE ── */
  .timeline-section { padding: 60px 0 100px; position: relative; }
  .timeline {
    position: relative; max-width: 760px;
    margin: 0 auto; padding: 0 32px;
  }
  .timeline::before {
    content: '';
    position: absolute; left: 50px; top: 20px; bottom: 20px;
    width: 2px;
    background: linear-gradient(180deg, transparent 0%, var(--v300) 8%, var(--v300) 92%, transparent 100%);
  }
  .chapter {
    position: relative; padding-left: 92px; padding-bottom: 64px;
  }
  .chapter:last-child { padding-bottom: 0; }
  .chapter-marker {
    position: absolute; left: 18px; top: 4px;
    width: 36px; height: 36px;
    background: var(--c100);
    border: 2px solid var(--v300);
    border-radius: 50%;
    display: grid; place-items: center;
    font-family: var(--font-geist-mono), monospace;
    font-size: 12px; font-weight: 500; color: var(--v500); z-index: 2;
  }
  .chapter.featured .chapter-marker {
    background: var(--v500); border-color: var(--v500); color: white;
    box-shadow: 0 0 0 6px rgba(124,92,255,0.18);
  }
  .chapter-year {
    font-family: var(--font-geist-mono), monospace;
    font-size: 12px; color: var(--v500); letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 8px; font-weight: 500;
  }
  .chapter-title {
    font-family: Georgia, serif;
    font-weight: 400; font-size: 32px;
    line-height: 1.15; letter-spacing: -0.01em;
    margin-bottom: 16px; color: var(--ink);
  }
  .chapter-title em { font-style: italic; color: var(--v500); }
  .chapter-body { font-size: 16px; line-height: 1.7; color: var(--ink); }
  .chapter-body p + p { margin-top: 16px; }
  .chapter-body em {
    font-family: Georgia, serif; font-style: italic;
    font-size: 1.06em; color: var(--v500);
  }

  /* Artifacts */
  .artifact {
    margin: 28px 0 8px; border-radius: 14px; overflow: hidden;
    background: white; border: 1px solid var(--c300);
    box-shadow: 0 4px 24px rgba(26,15,46,0.05);
  }
  .artifact-top {
    background: var(--c200); padding: 8px 14px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid var(--c300);
  }
  .artifact-dots { display: flex; gap: 5px; }
  .artifact-dots span { width: 9px; height: 9px; border-radius: 50%; background: var(--c300); }
  .artifact-dots span:nth-child(1) { background: #E76A6A; }
  .artifact-dots span:nth-child(2) { background: #E8B554; }
  .artifact-dots span:nth-child(3) { background: #6BB378; }
  .artifact-filename {
    font-family: var(--font-geist-mono), monospace;
    font-size: 11px; color: var(--muted);
  }

  /* Excel */
  .excel { font-family: var(--font-geist-mono), monospace; font-size: 11.5px; background: white; }
  .excel-formula {
    background: #F8F8F8; padding: 6px 10px; font-size: 10.5px; color: var(--muted);
    border-bottom: 1px solid #E0E0E0; display: flex; gap: 10px;
  }
  .excel-formula .fx { font-family: Georgia, serif; font-style: italic; color: var(--v500); font-size: 13px; }
  .excel-header {
    display: grid; grid-template-columns: 28px 1.5fr 1fr 1fr 1fr;
    background: #2C7A4D; color: white; font-weight: 500;
  }
  .excel-header > div, .excel-row > div {
    padding: 6px 10px; border-right: 1px solid rgba(255,255,255,0.2);
    text-align: center;
  }
  .excel-row {
    display: grid; grid-template-columns: 28px 1.5fr 1fr 1fr 1fr;
    border-bottom: 1px solid #E8E8E8;
  }
  .excel-row > div { border-right: 1px solid #E8E8E8; color: var(--ink); }
  .excel-row .idx { background: #F0F0F0; color: #666; text-align: center; font-size: 10px; }
  .excel-row .num { text-align: right; }
  .excel-row.total-row { background: #FFF7DD; font-weight: 600; }
  .excel-row.total-row .num { color: #2C7A4D; }

  /* DMs */
  .dms { background: var(--c50); padding: 16px; }
  .dm-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
  .dm-row:last-child { margin-bottom: 0; }
  .dm-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: grid; place-items: center; color: white;
    font-size: 11px; font-weight: 600;
  }
  .dm-bubble {
    background: white; border: 1px solid var(--c300);
    padding: 8px 12px; border-radius: 14px; border-top-left-radius: 4px;
    font-size: 13px; line-height: 1.4; max-width: 340px;
  }
  .dm-name { font-size: 11px; color: var(--muted); font-weight: 500; margin-bottom: 2px; }

  /* Pull quote */
  .pull-quote {
    margin: 32px -24px;
    padding: 28px 32px 28px 36px;
    background: var(--c50);
    border-left: 3px solid var(--v500);
    border-radius: 4px 14px 14px 4px;
    font-family: Georgia, serif; font-style: italic;
    font-size: 22px; line-height: 1.4; color: var(--ink);
  }
  .pull-quote::before {
    content: '"'; color: var(--v300); font-size: 64px;
    line-height: 0.4; margin-right: 4px; vertical-align: -16px;
  }

  /* Breakthrough badge */
  .breakthrough {
    display: inline-block; padding: 4px 10px;
    background: var(--v100); color: var(--v500);
    border-radius: 6px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;
  }

  /* ── BY THE NUMBERS ── */
  .by-numbers {
    background: var(--v900); color: white;
    padding: 80px 0; margin: 40px 0; position: relative; overflow: hidden;
  }
  .by-numbers::before {
    content: '';
    position: absolute; top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(124,92,255,0.25), transparent 60%);
    pointer-events: none;
  }
  .by-numbers-eyebrow {
    font-family: var(--font-geist-mono), monospace;
    font-size: 12px; color: var(--v300); letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 12px; text-align: center;
  }
  .by-numbers-h2 {
    font-family: Georgia, serif; font-weight: 400;
    font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1;
    letter-spacing: -0.015em; text-align: center; margin-bottom: 56px;
    max-width: 720px; margin-left: auto; margin-right: auto;
  }
  .by-numbers-h2 em { font-style: italic; color: var(--v300); }
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 20px; max-width: 1000px; margin: 0 auto;
  }
  .stat {
    text-align: center; padding: 24px 12px;
    border-right: 1px solid rgba(255,255,255,0.08);
    position: relative;
  }
  .stat:last-child { border-right: none; }
  .stat-num {
    font-family: var(--font-geist-mono), monospace;
    font-size: clamp(36px, 4.4vw, 56px); font-weight: 300;
    letter-spacing: -0.04em; color: white; line-height: 1;
    margin-bottom: 10px; white-space: nowrap;
  }
  .stat-num em { color: var(--v300); font-style: normal; font-size: 0.6em; }
  .stat-lbl { font-size: 12px; color: var(--v300); line-height: 1.4; }

  /* ── VALUES ── */
  .values-section { padding: 100px 0; }
  .values-eyebrow {
    text-align: center; font-family: var(--font-geist-mono), monospace;
    font-size: 12px; color: var(--v500); letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 16px;
  }
  .values-h2 {
    font-family: Georgia, serif; font-weight: 400;
    font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1;
    text-align: center; margin-bottom: 64px;
    max-width: 700px; margin-left: auto; margin-right: auto;
  }
  .values-h2 em { font-style: italic; color: var(--v500); }
  .values-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; max-width: 1100px; margin: 0 auto;
  }
  .value-card {
    background: var(--c50); border: 1px solid var(--c300);
    border-radius: 18px; padding: 32px 28px;
  }
  .value-num {
    font-family: Georgia, serif; font-style: italic;
    font-size: 36px; color: var(--v500); line-height: 1; margin-bottom: 16px;
  }
  .value-title {
    font-family: Georgia, serif; font-size: 24px;
    font-weight: 400; margin-bottom: 12px; line-height: 1.2;
  }
  .value-body { font-size: 14px; color: var(--muted); line-height: 1.65; }

  /* ── END CTA ── */
  .end-cta {
    background: linear-gradient(180deg, var(--c100) 0%, var(--c200) 100%);
    padding: 100px 0; text-align: center;
  }
  .end-cta h2 {
    font-family: Georgia, serif; font-weight: 400;
    font-size: clamp(36px, 5vw, 60px); line-height: 1.1;
    margin-bottom: 18px; max-width: 720px;
    margin-left: auto; margin-right: auto;
  }
  .end-cta h2 em { font-style: italic; color: var(--v500); }
  .end-cta p { font-size: 17px; color: var(--muted); max-width: 520px; margin: 0 auto 32px; }
  .end-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .signature {
    margin-top: 56px;
    display: inline-flex; align-items: center; gap: 14px;
    padding: 14px 24px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(26,15,46,0.08);
    border-radius: 100px;
  }
  .sig-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--v500), var(--v300));
    display: grid; place-items: center; color: white; font-weight: 600; font-size: 14px;
  }
  .sig-name { font-weight: 600; font-size: 14px; }
  .sig-role { font-family: Georgia, serif; font-style: italic; font-size: 13px; color: var(--muted); }

  /* ── FOOTER ── */
  .h-footer {
    background: var(--v950); color: #EAE3D0;
    padding: 64px 0 32px;
  }
  .h-footer-grid {
    display: grid; grid-template-columns: 1.4fr repeat(3, 1fr);
    gap: 48px; margin-bottom: 48px;
  }
  .h-footer-brand p { margin-top: 14px; color: var(--v300); font-size: 14px; line-height: 1.6; max-width: 280px; }
  .h-footer-logo-name { color: var(--c50); font-weight: 600; font-size: 18px; letter-spacing: -0.03em; }
  .h-footer-logo-name .dot { color: var(--v400); }
  .h-footer-col h4 {
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--v300); margin-bottom: 14px;
  }
  .h-footer-col a {
    display: block; color: #EAE3D0; text-decoration: none;
    font-size: 14px; padding: 5px 0; transition: color 0.15s;
  }
  .h-footer-col a:hover { color: var(--v400); }
  .h-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    font-size: 12px; color: var(--v300);
  }

  /* ── Responsive ── */
  @media (max-width: 1020px) { .h-nav-links { display: none; } }

  /* Boutons nav : cacher "Se connecter" sur mobile, garder "Essayer" */
  .h-btn-login { display: none; }
  @media (min-width: 640px) { .h-btn-login { display: inline-flex; } }

  @media (max-width: 880px) {
    .h-wrap, .h-narrow, .h-story { padding: 0 20px; }
    .h-nav-inner { padding: 12px 20px; }
    .timeline { padding: 0 16px; }
    .timeline::before { left: 22px; }
    .chapter { padding-left: 60px; }
    .chapter-marker { left: 4px; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 28px; }
    .values-grid { grid-template-columns: 1fr; }
    .h-footer-grid { grid-template-columns: 1fr 1fr; }
    .pull-quote { margin-left: -16px; margin-right: -16px; font-size: 18px; }
  }

  @media (max-width: 480px) {
    /* Hero */
    .story-hero { padding: 36px 0 28px; }
    .story-h1 { font-size: clamp(30px, 9vw, 48px); margin-bottom: 20px; }
    .story-lead { font-size: 16px; margin-bottom: 28px; }
    .story-meta {
      flex-wrap: wrap; gap: 6px 12px;
      border-radius: 14px; padding: 10px 16px;
      justify-content: center;
    }
    .story-meta .sep { display: none; }

    /* Timeline */
    .chapter-title { font-size: 22px; }
    .chapter-body { font-size: 15px; }
    .pull-quote { font-size: 16px; padding: 20px 20px 20px 22px; }

    /* Excel artifact */
    .excel { font-size: 10px; overflow-x: auto; }
    .excel-header, .excel-row {
      grid-template-columns: 18px 1.3fr 0.8fr 0.8fr 0.8fr;
    }
    .excel-header > div, .excel-row > div { padding: 5px 6px; }

    /* DMs */
    .dm-bubble { max-width: 260px; font-size: 12.5px; }

    /* By the numbers */
    .by-numbers { padding: 48px 0; margin: 24px 0; }
    .by-numbers-h2 { font-size: clamp(24px, 7vw, 36px); margin-bottom: 36px; }
    .stats-row { grid-template-columns: 1fr 1fr; gap: 0; }
    .stat-num { font-size: clamp(28px, 8vw, 44px); white-space: normal; }

    /* Values */
    .values-section { padding: 56px 0; }
    .value-card { padding: 24px 20px; }

    /* End CTA */
    .end-cta { padding: 56px 0; }
    .end-cta h2 { font-size: clamp(26px, 8vw, 44px); }
    .end-cta p { font-size: 15px; }
    .end-cta-btns { flex-direction: column; align-items: center; }
    .h-btn-lg { font-size: 14px; padding: 14px 24px; }

    /* Footer */
    .h-footer-grid { grid-template-columns: 1fr; gap: 28px; }
    .h-footer { padding: 40px 0 24px; }
    .h-footer-bottom { flex-direction: column; gap: 8px; }
  }
`

export default function HistoirePage() {
  return (
    <>
      <style>{css}</style>
      <div className="histoire-page">

        {/* ══ NAV ══ */}
        <nav className="h-nav">
          <div className="h-nav-inner">
            <Link href="/" className="h-logo">
              <Image src="/logos/logo-dark.png" alt="keskireste." width={140} height={34} style={{ height: 30, width: "auto" }} priority />
            </Link>
            <div className="h-nav-links">
              <a href="/#how">Comment ça marche</a>
              <a href="/#features">Fonctionnalités</a>
              <a href="/#pricing">Tarifs</a>
              <a href="/histoire" className="current">Notre histoire</a>
            </div>
            <div className="h-nav-cta">
              <Link href="/login" className="h-btn h-btn-ghost h-btn-sm h-btn-login">Se connecter</Link>
              <Link href="/signup" className="h-btn h-btn-violet h-btn-sm">Essayer gratuitement</Link>
            </div>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section className="story-hero">
          <div className="h-narrow">
            <div className="story-eyebrow">Notre histoire</div>
            <h1 className="story-h1">Sept ans de <em>combien il me reste&nbsp;?</em></h1>
            <p className="story-lead">L&apos;histoire d&apos;un fichier Excel partagé entre potes freelances qui est devenu, sept ans plus tard, l&apos;outil que je rêvais d&apos;avoir à 19 ans.</p>
            <div className="story-meta">
              <div className="by">
                <div className="avatar">T</div>
                <span>Par Thomas, fondateur</span>
              </div>
              <span className="sep" />
              <span>Lecture · 4 min</span>
              <span className="sep" />
              <span>Avril 2026</span>
            </div>
          </div>
        </section>

        {/* ══ TIMELINE ══ */}
        <section className="timeline-section">
          <div className="timeline">

            {/* Chapitre 1 */}
            <div className="chapter">
              <div className="chapter-marker">01</div>
              <div className="chapter-year">Été 2018 · 18 ans</div>
              <h2 className="chapter-title">Diplôme du bac d&apos;une main, <em>SIRET</em> de l&apos;autre.</h2>
              <div className="chapter-body">
                <p>Je viens d&apos;avoir le bac. Pendant que mes potes partent en vacances, je m&apos;inscris à l&apos;URSSAF et je crée mon auto-entreprise en création de sites internet. J&apos;avais commencé à bricoler du HTML au lycée, et j&apos;avais déjà deux clients qui attendaient.</p>
                <p>Premier mois : 1&nbsp;200&nbsp;€ de chiffre d&apos;affaires. Je me dis <em>« génial, je peux m&apos;acheter le MacBook »</em>. Trois mois plus tard, l&apos;URSSAF prélève 270&nbsp;€ que je n&apos;avais pas mis de côté. Je termine l&apos;année avec 80&nbsp;€ sur le compte et un beau crédit MacBook à rembourser.</p>
              </div>
            </div>

            {/* Chapitre 2 */}
            <div className="chapter">
              <div className="chapter-marker">02</div>
              <div className="chapter-year">Hiver 2018-2019</div>
              <h2 className="chapter-title">Le tableur qui a tout changé.</h2>
              <div className="chapter-body">
                <p>Pendant les vacances de Noël, je m&apos;enferme deux jours avec mon ordi et je me construis un fichier Excel maison. Une feuille par mois. Une colonne pour le CA brut, une colonne pour ce que l&apos;URSSAF allait me piquer, une autre pour la CFE, et tout en bas, en gros, en gras, en jaune fluo : <em>combien il me reste vraiment</em>.</p>

                <div className="artifact">
                  <div className="artifact-top">
                    <div className="artifact-dots"><span /><span /><span /></div>
                    <span className="artifact-filename">budget-thomas-2019.xlsx — Feuille1</span>
                  </div>
                  <div className="excel">
                    <div className="excel-formula">
                      <span><strong>D8</strong></span>
                      <span className="fx">ƒx</span>
                      <span>=B8-(B8*0,22)-(B8*0,022)-C8</span>
                    </div>
                    <div className="excel-header">
                      <div></div>
                      <div>A</div>
                      <div>B (CA)</div>
                      <div>C (Charges)</div>
                      <div>D (Reste)</div>
                    </div>
                    <div className="excel-row">
                      <div className="idx">1</div>
                      <div>Janvier</div>
                      <div className="num">1&nbsp;850,00</div>
                      <div className="num">120,00</div>
                      <div className="num">1&nbsp;323,30</div>
                    </div>
                    <div className="excel-row">
                      <div className="idx">2</div>
                      <div>Février</div>
                      <div className="num">2&nbsp;200,00</div>
                      <div className="num">120,00</div>
                      <div className="num">1&nbsp;597,60</div>
                    </div>
                    <div className="excel-row">
                      <div className="idx">3</div>
                      <div>Mars</div>
                      <div className="num">3&nbsp;100,00</div>
                      <div className="num">340,00</div>
                      <div className="num">2&nbsp;215,80</div>
                    </div>
                    <div className="excel-row total-row">
                      <div className="idx">4</div>
                      <div>T1 — TOTAL</div>
                      <div className="num">7&nbsp;150,00</div>
                      <div className="num">580,00</div>
                      <div className="num">5&nbsp;136,70</div>
                    </div>
                  </div>
                </div>

                <p>Pour la première fois de ma vie, je savais à 5&nbsp;€ près combien j&apos;avais le droit de dépenser sans me mettre dans le rouge. Le sentiment était… presque irréel.</p>
              </div>
            </div>

            {/* Chapitre 3 */}
            <div className="chapter">
              <div className="chapter-marker">03</div>
              <div className="chapter-year">2019 → 2024 · 5 années</div>
              <h2 className="chapter-title">Le fichier qui s&apos;invitait dans toutes les <em>conversations.</em></h2>
              <div className="chapter-body">
                <p>Au fur et à mesure que mon réseau de freelances grandit, le même scénario se répète à chaque dîner, chaque coworking, chaque DM Instagram&nbsp;:</p>

                <div className="artifact">
                  <div className="artifact-top">
                    <div className="artifact-dots"><span /><span /><span /></div>
                    <span className="artifact-filename">Messages — freelances</span>
                  </div>
                  <div className="dms">
                    <div className="dm-row">
                      <div className="dm-avatar" style={{background:'linear-gradient(135deg,#E5654B,#E8A93B)'}}>L</div>
                      <div className="dm-bubble">
                        <div className="dm-name">Léa, graphiste</div>
                        Mec, ton fichier Excel là pour calculer ce qu&apos;il reste après URSSAF, tu peux me l&apos;envoyer&nbsp;? Je suis perdue.
                      </div>
                    </div>
                    <div className="dm-row">
                      <div className="dm-avatar" style={{background:'linear-gradient(135deg,#5BA378,#7C5CFF)'}}>M</div>
                      <div className="dm-bubble">
                        <div className="dm-name">Marc, dev</div>
                        Salut Thomas, j&apos;ai eu ton tableur par Sarah. C&apos;est exactement ce qu&apos;il me fallait. Tu fais payer&nbsp;? 😅
                      </div>
                    </div>
                    <div className="dm-row">
                      <div className="dm-avatar" style={{background:'linear-gradient(135deg,#7C5CFF,#BDA8FF)'}}>N</div>
                      <div className="dm-bubble">
                        <div className="dm-name">Naïm, photographe</div>
                        Ton Excel m&apos;a sauvé la vie pour mes impôts. Sérieusement, tu devrais en faire une app.
                      </div>
                    </div>
                  </div>
                </div>

                <p>Je l&apos;envoyais. À tout le monde. Mais à chaque fois, la même galère : le fichier finissait cassé. Quelqu&apos;un effaçait une formule, un autre changeait le taux URSSAF en dur, une troisième ajoutait des onglets qui pétaient les références. Je passais mes soirées à dépanner des gens à distance.</p>
                <p><em>« Tu devrais en faire une app »</em> — j&apos;ai dû entendre cette phrase une centaine de fois. Mais je n&apos;étais pas développeur d&apos;app, je faisais des sites vitrines. L&apos;idée me tournait dans la tête, mais je ne savais pas par où commencer.</p>
              </div>
            </div>

            {/* Chapitre 4 — featured */}
            <div className="chapter featured">
              <div className="chapter-marker">04</div>
              <div className="chapter-year">Printemps 2025 · le déclic</div>
              <span className="breakthrough">★ Le déclic</span>
              <h2 className="chapter-title">Sept ans plus tard, <em>les outils m&apos;ont rattrapé.</em></h2>
              <div className="chapter-body">
                <p>Début 2025, je commence à utiliser sérieusement les outils d&apos;IA et les nouveaux frameworks pour mes clients. Et un soir, en remettant à jour mon fichier Excel pour la énième fois, j&apos;ai un déclic&nbsp;:</p>

                <div className="pull-quote">
                  Et si je transformais enfin ce tableur en vraie app&nbsp;? Pas pour faire un truc compliqué. Juste pour que ce que je fais à la main dans Excel depuis sept ans, n&apos;importe quel freelance puisse l&apos;avoir en deux clics.
                </div>

                <p>J&apos;arrête mes deux clients les moins prioritaires. Je consacre mes soirées et mes week-ends pendant six mois à construire ce qui allait devenir <strong>keskireste</strong>. Pas un ERP. Pas une plateforme de comptabilité. Juste mon Excel, en propre, en temps réel, accessible à tous.</p>
              </div>
            </div>

            {/* Chapitre 5 */}
            <div className="chapter">
              <div className="chapter-marker">05</div>
              <div className="chapter-year">Aujourd&apos;hui</div>
              <h2 className="chapter-title">Le tableur, <em>enfin une vraie app.</em></h2>
              <div className="chapter-body">
                <p>keskireste, c&apos;est mon fichier Excel — sans les bugs, sans les onglets cassés, sans avoir à m&apos;envoyer un message le 15 du mois pour demander la nouvelle version. C&apos;est aussi ce que je n&apos;aurais jamais pu coder seul dans Excel&nbsp;: un coach IA qui regarde tes chiffres et te dit quoi faire, des factures PDF générées en un clic, une projection annuelle qui anticipe avant que la mauvaise surprise n&apos;arrive.</p>
                <p>On vient de lancer. Il n&apos;y a pas encore des milliers d&apos;utilisateurs — et c&apos;est précisément pour ça que c&apos;est le bon moment de rejoindre. Les premiers seront ceux qui auront façonné l&apos;outil. Mais l&apos;idée de base, elle n&apos;a pas bougé depuis cette nuit de décembre 2018. Une seule question. <em>Combien il me reste vraiment&nbsp;?</em></p>
              </div>
            </div>

          </div>
        </section>

        {/* ══ BY THE NUMBERS ══ */}
        <section className="by-numbers">
          <div className="h-wrap">
            <div className="by-numbers-eyebrow">Sept ans en chiffres</div>
            <h2 className="by-numbers-h2">Un fichier Excel, devenu <em>un outil</em>.</h2>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-num">7<em> ans</em></div>
                <div className="stat-lbl">d&apos;utilisation perso<br />du tableur d&apos;origine</div>
              </div>
              <div className="stat">
                <div className="stat-num">~140</div>
                <div className="stat-lbl">copies envoyées<br />à des amis freelances</div>
              </div>
              <div className="stat">
                <div className="stat-num">J<em>-1</em></div>
                <div className="stat-lbl">tout juste lancé —<br />sois parmi les premiers</div>
              </div>
              <div className="stat">
                <div className="stat-num">0<em> €</em></div>
                <div className="stat-lbl">de levée de fonds.<br />100% bootstrappé</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section className="values-section">
          <div className="h-wrap">
            <div className="values-eyebrow">Ce qui guide l&apos;app</div>
            <h2 className="values-h2">Trois principes qui n&apos;ont <em>pas changé</em> depuis le tableur.</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-num">01.</div>
                <h3 className="value-title">Une seule question, une seule réponse.</h3>
                <p className="value-body">L&apos;app entière est construite autour d&apos;un chiffre&nbsp;: ce qu&apos;il te reste vraiment. Tout le reste — les graphes, les filtres, les rapports — n&apos;existe que pour rendre ce chiffre plus précis.</p>
              </div>
              <div className="value-card">
                <div className="value-num">02.</div>
                <h3 className="value-title">Comme à un pote au comptoir.</h3>
                <p className="value-body">Le tableur, je l&apos;expliquais à mes amis sans jargon. L&apos;app pareil. Pas de &ldquo;P&amp;L&rdquo;, pas de &ldquo;trésorerie nette d&apos;exploitation&rdquo;. Tu rentres tes revenus, tes dépenses, tu regardes ce qui reste.</p>
              </div>
              <div className="value-card">
                <div className="value-num">03.</div>
                <h3 className="value-title">Les bonnes surprises devant, pas derrière.</h3>
                <p className="value-body">L&apos;objectif n&apos;a jamais été de faire de la compta propre. C&apos;est de t&apos;éviter le coup du <em>« mince, je croyais avoir 8 000&nbsp;€ »</em>. Si l&apos;app fait ça, elle a gagné.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ END CTA ══ */}
        <section className="end-cta">
          <div className="h-narrow">
            <h2>Tu veux voir <em>combien il te reste&nbsp;?</em></h2>
            <p>Sept jours gratuits. Sans engagement. Sans carte bancaire à dégainer. Juste l&apos;outil que j&apos;aurais aimé avoir à 19 ans.</p>
            <div className="end-cta-btns">
              <Link href="/signup" className="h-btn h-btn-violet h-btn-lg">Commencer gratuitement →</Link>
              <Link href="/" className="h-btn h-btn-ghost h-btn-lg">Découvrir l&apos;app</Link>
            </div>
            <div className="signature">
              <div className="sig-avatar">T</div>
              <div>
                <div className="sig-name">Thomas Capron</div>
                <div className="sig-role">fondateur, ex-utilisateur d&apos;Excel</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="h-footer">
          <div className="h-wrap">
            <div className="h-footer-grid">
              <div className="h-footer-brand">
                <Link href="/" className="h-logo" style={{marginBottom:14}}>
                  <Image src="/logos/logo-light.png" alt="keskireste." width={130} height={32} style={{ height: 28, width: "auto" }} />
                </Link>
                <p>L&apos;outil de pilotage financier conçu pour les auto-entrepreneurs français. Né d&apos;un fichier Excel, en 2018.</p>
              </div>
              <div className="h-footer-col">
                <h4>Produit</h4>
                <a href="/#how">Comment ça marche</a>
                <a href="/#features">Fonctionnalités</a>
                <a href="/#pricing">Tarifs</a>
                <a href="/#faq">FAQ</a>
              </div>
              <div className="h-footer-col">
                <h4>Entreprise</h4>
                <a href="/histoire">Notre histoire</a>
                <a href="#">Blog</a>
                <a href="#">Programme partenaires</a>
                <a href="mailto:hello@keskireste.fr">Nous contacter</a>
              </div>
              <div className="h-footer-col">
                <h4>Légal</h4>
                <Link href="/legal/terms">CGU</Link>
                <Link href="/legal/privacy">Politique de confidentialité</Link>
                <a href="#">Mentions légales</a>
                <a href="#">RGPD</a>
              </div>
            </div>
            <div className="h-footer-bottom">
              <span>© 2025 keskireste — Fait à Mpl, avec beaucoup de café.</span>
              <span>données chiffrées · hébergé en 🇫🇷</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
