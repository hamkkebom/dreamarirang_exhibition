export default function NotFoundBody() {
  return (
    <main>
      <section className="hero">
        <div className="site-container">
          <span className="badge">404</span>
          <h1 className="hero-title">페이지를 찾을 수 없습니다</h1>
          <p className="hero-description">
            주소가 바뀌었거나 없는 페이지입니다. / Page not found.
          </p>
          <div className="links-list" style={{ textAlign: "left" }}>
            <a className="link-card" href="/">
              <span className="link-card-title">첫 화면으로</span>
            </a>
            <a className="link-card" href="/blog/">
              <span className="link-card-title">칼럼 목록</span>
            </a>
            <a className="link-card" href="/en/" lang="en">
              <span className="link-card-title">English</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
