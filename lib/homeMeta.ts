import type { Metadata } from "next";
import { home, type Locale } from "@/content/home";
import { POSTER } from "./site";

export function homeMetadata(locale: Locale): Metadata {
  const m = home[locale].meta;
  const url = locale === "ko" ? "/" : "/en/";
  const image = { url: POSTER.path, width: POSTER.width, height: POSTER.height, alt: m.posterAlt };
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: locale === "ko" ? "함께봄 주식회사" : "Hamkkebom Co., Ltd." }],
    alternates: {
      canonical: url,
      languages: { ko: "/", en: "/en/", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      locale: m.ogLocale,
      url,
      siteName: m.siteName,
      title: m.title,
      description: m.ogDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.ogDescription,
      images: [{ url: POSTER.path, alt: m.posterAlt }],
    },
  };
}
