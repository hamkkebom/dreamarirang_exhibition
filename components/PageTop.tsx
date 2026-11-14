import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

/** 칼럼 화면 위쪽: 사이트 이름(첫 화면으로)과 칼럼 목록 링크 */
export default function PageTop() {
  return (
    <header className="page-top">
      <div className="site-container">
        <a className="site-home" href="/">
          {SITE_NAME}
        </a>
        <Link className="lang-switch" style={{ position: "static" }} href="/blog/">
          칼럼
        </Link>
      </div>
    </header>
  );
}

export function Breadcrumb({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="현재 위치">
      <ol>
        {items.map((it, i) => (
          <li key={i}>{it.href ? <a href={it.href}>{it.name}</a> : <span aria-current="page">{it.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="site-container">
        <p>© 2026 함께봄 주식회사. All rights reserved.</p>
      </div>
    </footer>
  );
}
