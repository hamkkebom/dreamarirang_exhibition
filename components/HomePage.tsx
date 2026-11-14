// 첫 화면. 예전 정적 HTML(index.html, en/index.html)의 구조와 class를 그대로 옮겼다.
import { Fragment } from "react";
import { home, type Locale } from "@/content/home";
import { ORG, POSTER } from "@/lib/site";

function InstagramIcon({ title }: { title: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Arrow({ className, title }: { className: string; title: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <title>{title}</title>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

type Block = { h3?: string; body?: React.ReactNode; list?: React.ReactNode[] };

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <div className="content-block" key={i}>
          {b.h3 && <h3>{b.h3}</h3>}
          {b.body && <p>{b.body}</p>}
          {b.list && (
            <ul>
              {b.list.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export default function HomePage({ locale }: { locale: Locale }) {
  const t = home[locale];
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <>
      <main>
        <section className="hero">
          <a className="lang-switch" href={t.langSwitch.href} lang={t.langSwitch.lang} hrefLang={t.langSwitch.lang}>
            {t.langSwitch.label}
          </a>
          <div className="site-container">
            <span className="badge">{t.badge}</span>
            <p className="hero-eyebrow">{t.eyebrow}</p>
            <h1 className="hero-title">{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>
            <p className="hero-description">{t.description}</p>

            <div className="hero-image">
              {/* 첫 화면의 가장 큰 이미지라 바로 불러온다 */}
              <img src={POSTER.path} alt={t.meta.posterAlt} width={POSTER.width} height={POSTER.height} loading="eager" fetchPriority="high" />
            </div>

            <div className="info-grid">
              {t.info.map((row) => (
                <div className="info-row" key={row.label}>
                  <span className="info-label">{row.label}</span>
                  <span className="info-value">
                    {row.value}
                    <small>{row.note}</small>
                  </span>
                </div>
              ))}
            </div>

            <a href={ORG.instagram} {...ext} className="instagram-notice">
              <InstagramIcon title={t.iconTitle.instagram} />
              <span>{t.instagram}</span>
              <Arrow className="instagram-arrow" title={t.iconTitle.arrow} />
            </a>
          </div>
        </section>

        <hr className="divider" />

        <section className="about-section" id="arirang">
          <div className="site-container">
            <p className="section-label">{t.arirang.label}</p>
            <h2 className="section-heading">{t.arirang.heading}</h2>
            <Blocks blocks={t.arirang.blocks} />
          </div>
        </section>

        <hr className="divider" />

        <section id="first-score">
          <div className="site-container">
            <p className="section-label">{t.firstScore.label}</p>
            <h2 className="section-heading">{t.firstScore.heading}</h2>
            <Blocks blocks={t.firstScore.blocks} />
          </div>
        </section>

        <hr className="divider" />

        <section className="about-section" id="exhibition">
          <div className="site-container">
            <p className="section-label">{t.exhibition.label}</p>
            <h2 className="section-heading">{t.exhibition.heading}</h2>
            <Blocks blocks={t.exhibition.blocks} />
          </div>
        </section>

        <hr className="divider" />

        <section>
          <div className="site-container">
            <p className="section-label">{t.programs.label}</p>
            <h2 className="section-heading">{t.programs.heading}</h2>
            <Blocks blocks={t.programs.blocks} />
            <div className="contest-highlight">
              <p className="contest-title">{t.programs.contest.title}</p>
              <p className="contest-prize">{t.programs.contest.prize}</p>
              <p>{t.programs.contest.body}</p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="links" style={{ backgroundColor: "var(--color-bg-white)" }}>
          <div className="site-container">
            <p className="section-label">{t.links.label}</p>
            <h2 className="section-heading">{t.links.heading}</h2>
            <div className="links-list">
              {t.links.items.map((l) => (
                <Fragment key={l.href}>
                  <a href={l.href} {...(l.external ? ext : {})} className="link-card">
                    <div className="link-card-content">
                      <span className="link-card-title">{l.title}</span>
                      <span className="link-card-url">{l.host}</span>
                    </div>
                    <Arrow className="link-card-arrow" title={t.iconTitle.arrow} />
                  </a>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="contact">
          <div className="site-container">
            <p className="section-label">{t.contact.label}</p>
            <h2 className="section-heading">{t.contact.heading}</h2>
            <div className="contact-list">
              <a href={ORG.kakao} {...ext} className="contact-card">
                <div className="contact-icon contact-icon--kakao">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <title>{t.iconTitle.kakao}</title>
                    <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.83 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.56.08 1.14.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
                  </svg>
                </div>
                <div className="contact-info">
                  <span className="contact-name">{t.contact.kakao.name}</span>
                  <span className="contact-handle">{t.contact.kakao.handle}</span>
                </div>
              </a>
              <a href={ORG.instagram} {...ext} className="contact-card">
                <div className="contact-icon contact-icon--instagram">
                  <InstagramIcon title={t.iconTitle.instagram} />
                </div>
                <div className="contact-info">
                  <span className="contact-name">{t.contact.instagram.name}</span>
                  <span className="contact-handle">{t.contact.instagram.handle}</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="site-container">
          <p>{t.footer}</p>
        </div>
      </footer>
    </>
  );
}
