// 사이트 전체에서 쓰는 고정 정보. 화면과 구조화 데이터가 같은 값을 쓰도록 한곳에 둔다.

export const SITE_URL = "https://dreamarirang.com";
export const SITE_NAME = "제1회 헐버트 유물전";
export const SITE_NAME_EN = "The 1st Hulbert Relics Exhibition";

export const POSTER = {
  path: "/arirang-exhibition-poster.jpg",
  width: 848,
  height: 1264,
};

export const LOGO = { path: "/hamkkebom-logo.png", width: 640, height: 640 };

export const ORG = {
  name: "함께봄 주식회사",
  nameEn: "Hamkkebom Co., Ltd.",
  instagram: "https://www.instagram.com/hamkkebom_official",
  kakao: "http://pf.kakao.com/_cFfIX/chat",
};

export const LINKS = {
  hulbertDonation: "http://hulbert.or.kr/bbs/board.php?bo_table=donation",
  hulbert: "http://hulbert.or.kr/",
  aikkumhub: "https://www.aikkumhub.com",
};

// 칼럼 작성자. 작성자 이름 → 소개 화면 주소를 정한다.
export type Author = {
  slug: string;
  kind: "Organization" | "Person";
  name: string;
  description: string;
  sameAs: string[];
};

export const AUTHORS: Author[] = [
  {
    slug: "hamkkebom-editorial",
    kind: "Organization",
    name: "함께봄 편집팀",
    description:
      "이 사이트를 운영하는 함께봄 주식회사의 편집팀입니다. 아리랑 채보 130주년을 기념한 제1회 헐버트 유물전(2026년 3월 19일~4월 19일, 함께봄 서촌 한옥)의 기록을 정리하고, 아리랑과 호머 헐버트에 관한 칼럼을 씁니다.",
    sameAs: [ORG.instagram],
  },
];

export const DEFAULT_AUTHOR = AUTHORS[0];

export function authorByName(name: string): Author | undefined {
  return AUTHORS.find((a) => a.name === name.trim());
}

export function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function verification() {
  const naver = process.env.NAVER_SITE_VERIFICATION || "28fad59ab5e9f84c14ea944acfd02e112caefe0a";
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    ...(google ? { google } : {}),
    other: { "naver-site-verification": naver },
  };
}
