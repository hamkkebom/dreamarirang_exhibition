import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 기존 정적 사이트의 주소(/en/)를 그대로 유지하기 위해 모든 주소를 슬래시로 끝낸다.
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    // 루트 레이아웃이 언어별·관리자용으로 나뉘어 있어 전역 404 화면이 필요하다.
    globalNotFound: true,
  },
  // 예전 정적 사이트에서 열리던 파일 주소를 새 주소로 영구 이동
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/en/index.html", destination: "/en/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
