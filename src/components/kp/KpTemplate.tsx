'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export type KpCase = {
  title: string;
  tags: string;
  description: string | null;
  coverUrl: string | null;
  projectUrl: string;
};

export type KpTemplateProps = {
  code: string;
  kpId: string;
  clientName: string;
  objectType?: string | null;
  areaM2?: number | null;
  location?: string | null;
  service?: string | null;
  priceDesign?: number | null;
  supervisionMonthly?: number | null;
  startDate?: string | null;
  durationWeeks: string;
  introText?: string | null;
  validDays: number;
  createdAt: string;
  cases: KpCase[];
  telegramUrl: string;
};

function fmt(n: number) {
  return n.toLocaleString('uk-UA').replace(/,.*$/, '') + '$';
}

const CSS = `
.kp-page {
  --kp-ink: #0E0E0E;
  --kp-paper: #FFFFFF;
  --kp-paper-2: #F4F3F1;
  --kp-grey: #6F6E6B;
  --kp-line: #E2E1DD;
  --kp-ls: #0E0E0E;
  --kp-maxw: 1180px;
  background: var(--kp-paper);
  color: var(--kp-ink);
  font-family: var(--font-display), 'Manrope', sans-serif;
  font-size: 17px;
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
}
.kp-page * {
  margin: 0; padding: 0;
  box-sizing: border-box;
  border-radius: 0 !important;
}
.kp-page a { color: inherit; }
.kp-page .kp-wrap { max-width: var(--kp-maxw); margin: 0 auto; padding: 0 28px; }
.kp-page .kp-d { font-weight: 800; line-height: .96; letter-spacing: -.02em; }
.kp-page .kp-eye {
  font-size: 12px; letter-spacing: .2em;
  text-transform: uppercase; font-weight: 700; color: var(--kp-grey);
}

/* TOP BAR */
.kp-page .kp-topbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,.9); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--kp-line);
}
.kp-page .kp-topbar .kp-wrap {
  display: flex; align-items: center; justify-content: space-between; height: 66px;
}
.kp-page .kp-logo { font-weight: 800; font-size: 19px; letter-spacing: .01em; text-decoration: none; }
.kp-page .kp-logo i { font-style: italic; font-weight: 700; }
.kp-page .kp-cta-mini {
  font-size: 13px; font-weight: 700; text-decoration: none;
  color: var(--kp-paper); background: var(--kp-ink);
  padding: 11px 20px; transition: .2s;
  display: inline-flex; gap: 8px; align-items: center;
}
.kp-page .kp-cta-mini:hover { opacity: .78; }

/* HERO */
.kp-page .kp-hero { padding: 74px 0 60px; border-bottom: 1px solid var(--kp-ls); }
.kp-page .kp-hero .kp-eye { margin-bottom: 28px; }
.kp-page .kp-hero h1 { font-size: clamp(52px,10vw,128px); font-weight: 800; line-height: .96; letter-spacing: -.02em; }
.kp-page .kp-hero h1 .l2 { display: block; }
.kp-page .kp-hero .kp-for {
  display: flex; align-items: baseline; gap: 18px;
  flex-wrap: wrap; margin-top: 38px;
}
.kp-page .kp-hero .kp-for .lbl {
  font-size: 13px; letter-spacing: .16em; text-transform: uppercase;
  font-weight: 700; color: var(--kp-grey);
}
.kp-page .kp-hero .kp-for .nm {
  font-weight: 800; font-size: clamp(28px,4.4vw,48px);
  line-height: 1; letter-spacing: -.02em;
}
.kp-page .kp-meta {
  display: flex; flex-wrap: wrap;
  margin-top: 30px; border: 1px solid var(--kp-ls);
}
.kp-page .kp-chip {
  padding: 14px 22px; font-size: 14px; font-weight: 600;
  border-right: 1px solid var(--kp-line);
  display: flex; gap: 8px; align-items: baseline;
}
.kp-page .kp-chip:last-child { border-right: none; }
.kp-page .kp-chip span { color: var(--kp-grey); font-weight: 500; white-space: nowrap; }

/* SECTIONS */
.kp-page section { padding: 88px 0; border-bottom: 1px solid var(--kp-line); }
.kp-page .kp-sec-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; margin-bottom: 48px; flex-wrap: wrap;
}
.kp-page .kp-sec-head h2 { font-size: clamp(28px,4.4vw,54px); font-weight: 800; line-height: .96; letter-spacing: -.02em; }
.kp-page .kp-sec-note { max-width: 520px; color: var(--kp-grey); font-size: 16px; }

/* CASES */
.kp-page .kp-cases { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; border: 1px solid var(--kp-ls); }
.kp-page .kp-cases.one-col { grid-template-columns: 1fr; }
.kp-page .kp-case {
  position: relative; text-decoration: none; color: inherit;
  border-right: 1px solid var(--kp-ls); transition: .25s;
}
.kp-page .kp-case:last-child { border-right: none; }
.kp-page .kp-case:hover { background: var(--kp-paper-2); }
.kp-page .kp-case .kp-ph {
  aspect-ratio: 4/3; display: flex; align-items: flex-end;
  padding: 24px; background: linear-gradient(150deg,#1a1a1a,#454545);
  color: #fff; position: relative; border-bottom: 1px solid var(--kp-ls);
  overflow: hidden;
}
.kp-page .kp-case .kp-ph img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.kp-page .kp-case .kp-ph .kp-ph-title {
  font-weight: 800; text-transform: uppercase;
  font-size: 26px; line-height: .98; letter-spacing: -.01em;
  position: relative; z-index: 1;
  text-shadow: 0 2px 12px rgba(0,0,0,.6);
}
.kp-page .kp-case .kp-bd { padding: 20px 24px 26px; }
.kp-page .kp-case .kp-bd .kp-tags { font-size: 13px; color: var(--kp-grey); margin-bottom: 8px; font-weight: 600; letter-spacing: .02em; }
.kp-page .kp-case .kp-bd p { font-size: 15px; line-height: 1.5; }
.kp-page .kp-all-proj { display: flex; justify-content: flex-end; margin-top: 22px; }
.kp-page .kp-all-proj a {
  display: inline-flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--kp-ink); font-weight: 700; font-size: 15px;
  border: 1px solid var(--kp-ls); padding: 14px 24px; transition: .2s;
}
.kp-page .kp-all-proj a:hover { background: var(--kp-ink); color: #fff; }

/* TRUST */
.kp-page .kp-trust-top {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 20px; flex-wrap: wrap; margin-bottom: 34px;
}
.kp-page .kp-nums { display: flex; gap: 48px; }
.kp-page .kp-num b { display: block; font-weight: 800; font-size: clamp(34px,5vw,56px); line-height: 1; letter-spacing: -.02em; }
.kp-page .kp-num span { font-size: 13px; color: var(--kp-grey); font-weight: 600; letter-spacing: .04em; }
.kp-page .kp-logos { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--kp-ls); }
.kp-page .kp-lg {
  padding: 30px 20px; text-align: center; font-weight: 800; font-size: 16px;
  letter-spacing: .02em; border-right: 1px solid var(--kp-line);
  color: var(--kp-ink); display: flex; align-items: center;
  justify-content: center; flex-direction: column; min-height: 96px;
}
.kp-page .kp-lg:last-child { border-right: none; }
.kp-page .kp-lg small {
  display: block; font-weight: 600; font-size: 11px; color: var(--kp-grey);
  letter-spacing: .12em; text-transform: uppercase; margin-top: 4px;
}

/* PRICE */
.kp-page .kp-price-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 0; border: 1px solid var(--kp-ls); }
.kp-page .kp-calc { border-right: 1px solid var(--kp-ls); }
.kp-page .kp-row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 16px; padding: 20px 26px; border-bottom: 1px solid var(--kp-line);
}
.kp-page .kp-row span:first-child { color: var(--kp-grey); font-weight: 500; font-size: 15px; }
.kp-page .kp-row span:last-child { font-weight: 700; font-size: 17px; white-space: nowrap; }
.kp-page .kp-row.total { background: var(--kp-ink); color: #fff; border-bottom: none; }
.kp-page .kp-row.total span:first-child {
  color: rgba(255,255,255,.6); text-transform: uppercase;
  font-size: 12px; letter-spacing: .14em; font-weight: 700;
}
.kp-page .kp-row.total span:last-child { font-weight: 800; font-size: 30px; letter-spacing: -.02em; }
.kp-page .kp-price-aside { padding: 30px 30px 34px; }
.kp-page .kp-price-aside .kp-eye { margin-bottom: 14px; }
.kp-page .kp-price-aside h3 { font-size: 22px; margin-bottom: 12px; line-height: 1.2; font-weight: 800; letter-spacing: -.01em; }
.kp-page .kp-price-aside p { color: var(--kp-grey); font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
.kp-page .kp-incl { list-style: none; }
.kp-page .kp-incl li {
  padding: 11px 0 11px 28px; position: relative;
  border-top: 1px solid var(--kp-line); font-size: 15px; font-weight: 600;
}
.kp-page .kp-incl li::before { content: '✓'; position: absolute; left: 0; top: 11px; font-weight: 700; }

/* STAGES */
.kp-page .kp-stages { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border: 1px solid var(--kp-ls); }
.kp-page .kp-stage { padding: 28px 26px 32px; border-right: 1px solid var(--kp-line); }
.kp-page .kp-stage:last-child { border-right: none; }
.kp-page .kp-stage .stn { font-weight: 800; font-size: 13px; letter-spacing: .14em; margin-bottom: 14px; text-transform: uppercase; }
.kp-page .kp-stage h4 { font-size: 20px; margin-bottom: 6px; font-weight: 800; letter-spacing: -.01em; }
.kp-page .kp-stage .pay { font-size: 13px; font-weight: 700; color: var(--kp-grey); margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--kp-line); }
.kp-page .kp-stage ul { list-style: none; font-size: 14px; color: var(--kp-grey); line-height: 1.65; }
.kp-page .kp-stage ul li { padding: 5px 0; }

/* TERMS */
.kp-page .kp-terms { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border: 1px solid var(--kp-ls); }
.kp-page .kp-term { padding: 30px 28px; border-right: 1px solid var(--kp-line); }
.kp-page .kp-term:last-child { border-right: none; }
.kp-page .kp-term .k { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: var(--kp-grey); margin-bottom: 16px; }
.kp-page .kp-term .v { font-weight: 800; font-size: 30px; line-height: 1; letter-spacing: -.02em; }
.kp-page .kp-term .v small { display: block; font-size: 14px; font-weight: 600; color: var(--kp-grey); margin-top: 12px; letter-spacing: 0; line-height: 1.4; }

/* DEADLINE */
.kp-page .kp-deadline { background: var(--kp-ink); color: var(--kp-paper); border: none; }
.kp-page .kp-deadline .kp-wrap {
  display: flex; align-items: center; justify-content: space-between;
  gap: 30px; flex-wrap: wrap;
}
.kp-page .kp-deadline .kp-eye { color: rgba(255,255,255,.5); }
.kp-page .kp-deadline h2 {
  font-weight: 800; font-size: clamp(26px,3.8vw,44px);
  line-height: 1.05; margin-top: 12px; max-width: 640px; letter-spacing: -.02em;
}
.kp-page .kp-dl-count { text-align: right; }
.kp-page .kp-dl-count .d { font-weight: 800; font-size: clamp(64px,11vw,118px); line-height: .8; letter-spacing: -.03em; }
.kp-page .kp-dl-count .lbl { font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.55); font-weight: 700; margin-top: 6px; }

/* REVIEWS */
.kp-page .kp-revs { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; border: 1px solid var(--kp-ls); }
.kp-page .kp-rev { padding: 34px 32px 30px; border-right: 1px solid var(--kp-line); }
.kp-page .kp-rev:last-child { border-right: none; }
.kp-page .kp-rev .q { font-size: 19px; line-height: 1.45; font-weight: 600; letter-spacing: -.01em; margin-bottom: 22px; }
.kp-page .kp-rev .q::before { content: '“'; font-size: 40px; line-height: 0; position: relative; top: 14px; margin-right: 2px; }
.kp-page .kp-rev .who { font-size: 13px; color: var(--kp-grey); font-weight: 600; letter-spacing: .04em; border-top: 1px solid var(--kp-line); padding-top: 16px; }
.kp-page .kp-rev .who b { color: var(--kp-ink); font-weight: 700; }

/* CTA */
.kp-page .kp-cta { text-align: center; padding: 100px 0; border: none; }
.kp-page .kp-cta .kp-eye { margin-bottom: 22px; }
.kp-page .kp-cta h2 { font-size: clamp(36px,6vw,72px); margin-bottom: 34px; font-weight: 800; line-height: .96; letter-spacing: -.02em; }
.kp-page .kp-btn {
  display: inline-flex; align-items: center; gap: 12px;
  background: var(--kp-ink); color: #fff; text-decoration: none;
  font-weight: 700; font-size: 17px; padding: 20px 44px; transition: .2s;
}
.kp-page .kp-btn:hover { opacity: .8; }
.kp-page .kp-cta .alt { display: block; margin-top: 24px; color: var(--kp-grey); font-size: 15px; }
.kp-page .kp-cta .alt a { color: var(--kp-ink); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--kp-ink); }

/* FOOTER */
.kp-page footer { padding: 44px 0; text-align: center; color: var(--kp-grey); font-size: 13px; }
.kp-page footer .kp-logo { margin-bottom: 10px; display: inline-block; color: var(--kp-ink); }

/* SCROLL REVEAL */
.kp-page .rv { opacity: 0; transform: translateY(20px); transition: opacity .7s ease, transform .7s ease; }
.kp-page .rv.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .kp-page .rv { opacity: 1; transform: none; transition: none; } }

/* MOBILE */
@media (max-width: 820px) {
  .kp-page .kp-cases, .kp-page .kp-price-grid,
  .kp-page .kp-stages, .kp-page .kp-terms { grid-template-columns: 1fr; }
  .kp-page .kp-logos { grid-template-columns: repeat(2,1fr); }
  .kp-page .kp-lg:nth-child(2) { border-right: none; }
  .kp-page .kp-lg:nth-child(1), .kp-page .kp-lg:nth-child(2) { border-bottom: 1px solid var(--kp-line); }
  .kp-page .kp-revs { grid-template-columns: 1fr; }
  .kp-page .kp-rev { border-right: none; border-bottom: 1px solid var(--kp-ls); }
  .kp-page .kp-rev:last-child { border-bottom: none; }
  .kp-page .kp-nums { gap: 32px; }
  .kp-page .kp-meta { flex-direction: column; }
  .kp-page .kp-chip { border-right: none; border-bottom: 1px solid var(--kp-line); justify-content: space-between; }
  .kp-page .kp-chip:last-child { border-bottom: none; }
  .kp-page .kp-case { border-right: none; border-bottom: 1px solid var(--kp-ls); }
  .kp-page .kp-case:last-child { border-bottom: none; }
  .kp-page .kp-calc { border-right: none; border-bottom: 1px solid var(--kp-ls); }
  .kp-page .kp-stage, .kp-page .kp-term { border-right: none; border-bottom: 1px solid var(--kp-line); }
  .kp-page .kp-stage:last-child, .kp-page .kp-term:last-child { border-bottom: none; }
  .kp-page .kp-deadline .kp-wrap { flex-direction: column; align-items: flex-start; }
  .kp-page .kp-dl-count { text-align: left; }
  .kp-page .kp-row.total span:last-child { font-size: 26px; }
  .kp-page section { padding: 60px 0; }
  .kp-page .kp-trust-top { flex-direction: column; align-items: flex-start; }
}
`;

export function KpTemplate({
  code, kpId, clientName, objectType, areaM2, location, service,
  priceDesign, supervisionMonthly, startDate, durationWeeks,
  introText, validDays, createdAt, cases, telegramUrl,
}: KpTemplateProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  function sendEvent(eventType: string, value?: number) {
    const payload = JSON.stringify({ kpId, eventType, ...(value !== undefined && { value }) });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/kp/event', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/kp/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
    }
  }

  // Scroll reveal
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    el.querySelectorAll('.rv').forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  // Track view
  useEffect(() => {
    fetch(`/api/kp/${code}/view`, { method: 'POST' }).catch(() => {});
  }, [code]);

  // Time on page — beacon on leave
  useEffect(() => {
    startTimeRef.current = Date.now();
    const onLeave = () => {
      const secs = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (secs > 2) sendEvent('time_on_page', secs);
    };
    document.addEventListener('visibilitychange', onLeave);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onLeave);
      window.removeEventListener('beforeunload', onLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpId]);

  // Scroll milestones — price block + CTA block
  useEffect(() => {
    const targets: { id: string; event: string }[] = [
      { id: 'kp-price', event: 'scroll_price' },
      { id: 'kp-cta', event: 'scroll_end' },
    ];
    const fired = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !fired.has(e.target.id)) {
          fired.add(e.target.id);
          const t = targets.find((t) => t.id === e.target.id);
          if (t) sendEvent(t.event);
        }
      });
    }, { threshold: 0.3 });
    targets.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpId]);

  const serviceLabel = service ?? 'дизайн інтер\'єру';
  const date = new Date(createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kp-page" ref={pageRef}>

        {/* TOP BAR */}
        <div className="kp-topbar">
          <div className="kp-wrap">
            <a href="/" className="kp-logo">bureau <i>X</i></a>
            <a href="#kp-cta" className="kp-cta-mini">Обговорити проект ▶</a>
          </div>
        </div>

        {/* HERO */}
        <header className="kp-hero">
          <div className="kp-wrap">
            <div className="kp-eye">Комерційна пропозиція · {date}</div>
            <h1 className="kp-d">Ваш простір<span className="l2">починається тут</span></h1>
            <div className="kp-for">
              <span className="lbl">Підготовлено для</span>
              <span className="nm">{clientName}</span>
            </div>
            <div className="kp-meta">
              {objectType && <span className="kp-chip"><span>Тип</span>{objectType}</span>}
              {areaM2 && <span className="kp-chip"><span>Площа</span>{areaM2} м²</span>}
              {location && <span className="kp-chip"><span>Локація</span>{location}</span>}
              {serviceLabel && <span className="kp-chip"><span>Послуга</span>{serviceLabel}</span>}
            </div>
          </div>
        </header>

        {/* INTRO */}
        {introText && (
          <section style={{ padding: '64px 0' }}>
            <div className="kp-wrap rv" style={{ maxWidth: 840, margin: '0 auto' }}>
              <p style={{ fontSize: 'clamp(20px,2.6vw,28px)', lineHeight: 1.5, fontWeight: 600, letterSpacing: '-.01em' }}>
                {introText}
              </p>
            </div>
          </section>
        )}

        {/* CASES */}
        {cases.length > 0 && (
          <section id="kp-cases">
            <div className="kp-wrap">
              <div className="kp-sec-head rv">
                <div>
                  <div className="kp-eye">01 — Наші проекти</div>
                  <h2 className="kp-d">Кожен простір —<br />у нашому стилі</h2>
                </div>
                <p className="kp-sec-note">Ми не повторюємо проекти — кожен створюємо з нуля під людину та її спосіб життя. Ось кілька проектів, близьких до вашого за форматом.</p>
              </div>
              <div className={`kp-cases${cases.length === 1 ? ' one-col' : ''}`}>
                {cases.map((c, i) => (
                  <Link key={i} className="kp-case rv" href={c.projectUrl}>
                    <div className="kp-ph">
                      {c.coverUrl
                        ? <img src={c.coverUrl} alt={c.title} />
                        : null}
                      <span className="kp-ph-title">{c.title}</span>
                    </div>
                    <div className="kp-bd">
                      <div className="kp-tags">{c.tags}</div>
                      {c.description && <p>{c.description}</p>}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="kp-all-proj rv"><Link href="/projects" onClick={() => sendEvent('click_projects')}>Усі проекти ▶</Link></div>
            </div>
          </section>
        )}

        {/* TRUST */}
        <section id="kp-trust">
          <div className="kp-wrap">
            <div className="kp-trust-top rv">
              <div>
                <div className="kp-eye" style={{ marginBottom: 14 }}>Нам довіряють</div>
                <h2 className="kp-d" style={{ fontSize: 'clamp(28px,4.4vw,54px)' }}>Понад 15 компаній<br />і 200+ проектів</h2>
              </div>
              <div className="kp-nums">
                <div className="kp-num"><b>200+</b><span>реалізованих<br />проектів</span></div>
                <div className="kp-num"><b>6</b><span>років<br />на ринку</span></div>
              </div>
            </div>
            <div className="kp-logos rv">
              <div className="kp-lg">Stolitsa<small>Group</small></div>
              <div className="kp-lg">Bukovel</div>
              <div className="kp-lg">Smart<small>Development</small></div>
              <div className="kp-lg">Dogoda</div>
            </div>
          </div>
        </section>

        {/* PRICE */}
        {priceDesign && (
          <section id="kp-price">
            <div className="kp-wrap">
              <div className="kp-sec-head rv">
                <div>
                  <div className="kp-eye">02 — Вартість</div>
                  <h2 className="kp-d">Вартість проекту</h2>
                </div>
                <p className="kp-sec-note">Жодних прихованих сум. Ось як формується вартість саме для вашого об&apos;єкта.</p>
              </div>
              <div className="kp-price-grid">
                <div className="kp-calc rv">
                  {areaM2 && service && (
                    <div className="kp-row">
                      <span>Дизайн-проект · {areaM2} м²</span>
                      <span>{fmt(priceDesign)}</span>
                    </div>
                  )}
                  {supervisionMonthly && (
                    <div className="kp-row">
                      <span>Авторський супровід · щомісячно</span>
                      <span>{fmt(supervisionMonthly)}/міс</span>
                    </div>
                  )}
                  <div className="kp-row total">
                    <span>{serviceLabel}</span>
                    <span>{fmt(priceDesign)}</span>
                  </div>
                </div>
                <div className="kp-price-aside rv">
                  <div className="kp-eye">Що входить</div>
                  <h3>Повний пакет для реалізації</h3>
                  <p>З цим проектом ви реалізуєте ремонт і виконаєте закупки самостійно або з нашим супроводом.</p>
                  <ul className="kp-incl">
                    <li>Планувальне рішення</li>
                    <li>3D-візуалізація кожного приміщення</li>
                    <li>Робочі креслення</li>
                    <li>Специфікація матеріалів</li>
                    <li>Безкоштовні онлайн-консультації</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STAGES */}
        <section id="kp-stages">
          <div className="kp-wrap">
            <div className="kp-sec-head rv">
              <div>
                <div className="kp-eye">03 — Як ми працюємо</div>
                <h2 className="kp-d">Три етапи<br />до результату</h2>
              </div>
              <p className="kp-sec-note">Оплата поетапна — ви платите за зроблене й бачите прогрес на кожному кроці.</p>
            </div>
            <div className="kp-stages">
              <div className="kp-stage rv">
                <div className="stn">Етап 01</div>
                <h4>Концепція</h4>
                <div className="pay">Аванс 50% · 1–2 тижні</div>
                <ul><li>Обміри приміщення</li><li>Бриф і технічне завдання</li><li>Планувальне рішення</li><li>Концепція дизайну</li></ul>
              </div>
              <div className="kp-stage rv">
                <div className="stn">Етап 02</div>
                <h4>Візуалізація</h4>
                <div className="pay">25% · 3–4 тижні</div>
                <ul><li>Візуалізація для затвердження концепції</li><li>Фіналізація всіх приміщень і зон</li></ul>
              </div>
              <div className="kp-stage rv">
                <div className="stn">Етап 03</div>
                <h4>Креслення + специфікація</h4>
                <div className="pay">25% · 2–4 тижні</div>
                <ul><li>Повний пакет робочих креслень</li><li>Розгортки стін та інженерні вузли</li><li>Відомість усіх цифрових матеріалів</li></ul>
              </div>
            </div>
          </div>
        </section>

        {/* TERMS */}
        <section id="kp-terms">
          <div className="kp-wrap">
            <div className="kp-sec-head rv">
              <div>
                <div className="kp-eye">04 — Терміни</div>
                <h2 className="kp-d">Коли і скільки</h2>
              </div>
            </div>
            <div className="kp-terms">
              <div className="kp-term rv">
                <div className="k">Старт можливий</div>
                <div className="v">{startDate ?? 'За домовленістю'}<small>з урахуванням поточного завантаження бюро</small></div>
              </div>
              <div className="kp-term rv">
                <div className="k">Тривалість</div>
                <div className="v">{durationWeeks}<small>від авансу до повного пакета документації</small></div>
              </div>
              <div className="kp-term rv">
                <div className="k">Над проектом</div>
                <div className="v">4+ спеціалісти<small>головний дизайнер, проджект-менеджер, проектувальники</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="kp-reviews">
          <div className="kp-wrap">
            <div className="kp-sec-head rv">
              <div>
                <div className="kp-eye">05 — Відгуки</div>
                <h2 className="kp-d">Що кажуть<br />наші клієнти</h2>
              </div>
            </div>
            <div className="kp-revs">
              <div className="kp-rev rv">
                <div className="q">За загальним враженням — це космос. Особливо рішення збірних сходів і зелена зона під ними — максимально сміливо, прям хочеться вилетіти!</div>
                <div className="who"><b>Власниця квартири</b> · реалізований проект</div>
              </div>
              <div className="kp-rev rv">
                <div className="q">Безмежно дякую за чудову роботу! З вами приємно мати справу. Через півроку-рік прийду вже до вас за дизайном своєї квартири.</div>
                <div className="who"><b>Клієнтка bureau X</b> · повертається за новим проектом</div>
              </div>
            </div>
          </div>
        </section>

        {/* DEADLINE */}
        <section className="kp-deadline">
          <div className="kp-wrap rv">
            <div>
              <div className="kp-eye">Пропозиція дійсна</div>
              <h2>Фіксуємо ціну та місце у графіку за вами протягом {validDays} днів</h2>
            </div>
            <div className="kp-dl-count">
              <div className="d">{validDays}</div>
              <div className="lbl">днів</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="kp-cta" id="kp-cta">
          <div className="kp-wrap rv">
            <div className="kp-eye">Наступний крок</div>
            <h2 className="kp-d">Обговоримо<br />ваш проект?</h2>
            <a href={telegramUrl} className="kp-btn" target="_blank" rel="noopener noreferrer"
              onClick={() => sendEvent('click_cta')}>
              Обрати зручний час зустрічі ▶
            </a>
            <span className="alt">або напишіть напряму — <a href={telegramUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => sendEvent('click_contact')}>Telegram</a></span>
          </div>
        </section>

        <footer>
          <div className="kp-wrap">
            <div className="kp-logo">bureau <i>X</i></div>
            <div>architecture &amp; design · простір під ваш спосіб життя</div>
            <div style={{ marginTop: 6 }}>© 2026 bureau X · 200+ реалізованих проектів</div>
          </div>
        </footer>

      </div>
    </>
  );
}
