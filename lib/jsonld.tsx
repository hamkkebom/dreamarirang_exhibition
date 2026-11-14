// 구조화 데이터(JSON-LD). 화면에 보이는 내용과 같은 값만 넣는다.
import { SITE_URL, SITE_NAME, POSTER, LOGO, ORG, LINKS, abs, type Author } from "./site";
import type { Post } from "./posts";
import type { Locale } from "@/content/home";

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationLd(locale: Locale = "ko") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: locale === "ko" ? ORG.name : ORG.nameEn,
    alternateName: locale === "ko" ? ORG.nameEn : ORG.name,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: abs(LOGO.path), width: LOGO.width, height: LOGO.height },
    sameAs: [ORG.instagram],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    alternateName: ["헐버트 전시회", "아리랑, 130년 전 한국의 보물을 찾다"],
    about: [
      { "@type": "MusicComposition", name: "아리랑", alternateName: "Arirang" },
      { "@type": "Person", name: "호머 헐버트", alternateName: "Homer B. Hulbert", birthDate: "1863", deathDate: "1949" },
    ],
    url: `${SITE_URL}/`,
    description: "아리랑 최초의 서양식 악보(1896년 헐버트 채보) 이야기와 제1회 헐버트 유물전(아리랑 채보 130주년 기념 전시) 기록",
    inLanguage: "ko",
    publisher: { "@id": ORG_ID },
  };
}

export function enWebPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arirang — the first Western score and the 1st Hulbert Relics Exhibition",
    alternateName: ["The 1st Hulbert Relics Exhibition", "Arirang, Discovering Korea's Treasure 130 Years Ago"],
    about: [
      { "@type": "MusicComposition", name: "Arirang", alternateName: "아리랑" },
      { "@type": "Person", name: "Homer B. Hulbert", alternateName: "호머 헐버트", birthDate: "1863", deathDate: "1949" },
    ],
    url: `${SITE_URL}/en/`,
    description: "The story of the first Western score of Arirang (Hulbert, 1896) and a record of the 1st Hulbert Relics Exhibition.",
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function eventLd(locale: Locale) {
  const ko = locale === "ko";
  const url = ko ? `${SITE_URL}/` : `${SITE_URL}/en/`;
  return {
    "@context": "https://schema.org",
    "@type": ["Event", "ExhibitionEvent"],
    name: ko
      ? "제1회 헐버트 유물전 — 아리랑, 130년 전 한국의 보물을 찾다"
      : "The 1st Hulbert Relics Exhibition — Arirang, Discovering Korea's Treasure 130 Years Ago",
    alternateName: ko
      ? "헐버트 아리랑 채보 130주년 기념 전시"
      : "Exhibition marking the 130th anniversary of Hulbert's transcription of Arirang",
    description: ko
      ? "호머 헐버트(Homer B. Hulbert)의 아리랑 채보 130주년을 기념하는 특별 전시. 헐버트의 저서·유품, 아리랑 채보 악보, 사민필지 원본 등 역사 자료와 AI 기반 영상·음악으로 재해석한 아리랑을 선보였습니다. 북콘서트, 전통 공연, 체험 프로그램 등 다양한 부대행사가 함께 마련되었습니다. 전시는 2026년 4월 19일 종료되었습니다."
      : "An exhibition marking the 130th anniversary of Homer B. Hulbert's transcription of Arirang. It showed Hulbert's books and belongings, his transcribed score of Arirang and Saminpilji, alongside AI-generated video and music reinterpreting the song. The exhibition ended on April 19, 2026.",
    startDate: "2026-03-19",
    endDate: "2026-04-19",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ko ? "함께봄 서촌 한옥" : "Hamkkebom Seochon Hanok",
      address: {
        "@type": "PostalAddress",
        streetAddress: ko ? "효자로7길 10" : "10 Hyoja-ro 7-gil",
        addressLocality: ko ? "종로구" : "Jongno-gu",
        addressRegion: ko ? "서울특별시" : "Seoul",
        postalCode: "03045",
        addressCountry: "KR",
      },
    },
    image: abs(POSTER.path),
    organizer: { "@type": "Organization", name: ko ? "헐버트박사기념사업회" : "Hulbert Memorial Society", url: LINKS.hulbert },
    performer: { "@type": "Organization", name: ko ? ORG.name : ORG.nameEn, url: ORG.instagram },
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW", validThrough: "2026-04-19", url },
    isAccessibleForFree: true,
    inLanguage: locale,
    url,
  };
}

export function postUrl(slug: string) {
  return `${SITE_URL}/blog/${slug}/`;
}

export function ogImagePath(slug: string) {
  return `/og/${slug}/`;
}

export function authorUrl(author: Author) {
  return `${SITE_URL}/authors/${author.slug}/`;
}

export function articleLd(post: Post, author: Author | undefined, images: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.published_at?.toISOString(),
    dateModified: post.updated_at.toISOString(),
    author: author
      ? { "@type": author.kind, name: author.name, url: authorUrl(author) }
      : { "@type": "Person", name: post.author_name },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: ORG.name,
      logo: { "@type": "ImageObject", url: abs(LOGO.path), width: LOGO.width, height: LOGO.height },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl(post.slug) },
    image: images,
    inLanguage: "ko",
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function faqLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq_json.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
