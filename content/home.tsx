// 첫 화면(/ 와 /en/)의 글을 두 언어로 한곳에서 관리한다.
// 한국어를 고치면 바로 아래 영어도 함께 고친다. 화면 구조는 components/HomePage.tsx 하나뿐이다.
import type { ReactNode } from "react";

export type Locale = "ko" | "en";

type Block = { h3?: string; body?: ReactNode; list?: ReactNode[] };

export type HomeContent = {
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    keywords: string;
    siteName: string;
    posterAlt: string;
    ogLocale: string;
  };
  langSwitch: { href: string; label: string; lang: Locale };
  badge: string;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  description: ReactNode;
  info: { label: string; value: string; note: string }[];
  instagram: ReactNode;
  iconTitle: { instagram: string; arrow: string; kakao: string };
  arirang: { label: string; heading: string; blocks: Block[] };
  firstScore: { label: string; heading: string; blocks: Block[] };
  exhibition: { label: string; heading: string; blocks: Block[] };
  programs: {
    label: string;
    heading: string;
    blocks: Block[];
    contest: { title: string; prize: string; body: string };
  };
  links: { label: string; heading: string; items: { href: string; title: string; host: string; external: boolean }[] };
  contact: { label: string; heading: string; kakao: { name: string; handle: string }; instagram: { name: string; handle: string } };
  footer: string;
};

const br = <br className="mobile-br" />;

export const home: Record<Locale, HomeContent> = {
  ko: {
    meta: {
      title: "아리랑 — 최초의 서양식 악보와 헐버트 채보 130주년 | 제1회 헐버트 유물전",
      description:
        "아리랑은 한국을 대표하는 민요입니다. 1896년 호머 헐버트가 아리랑을 처음 서양식 오선보로 채보해 세계에 소개했습니다. 그 이야기와 채보 130주년 기념 제1회 헐버트 유물전(2026.3.19~4.19, 종료)의 기록.",
      ogDescription:
        "아리랑을 처음 서양식 오선보로 옮긴 사람은 1896년의 헐버트였습니다. 아리랑 채보 130주년을 기념한 제1회 헐버트 유물전(2026.3.19~4.19, 종료)의 기록.",
      keywords:
        "아리랑, 아리랑 악보, 아리랑 최초 악보, 아리랑 채보, 아리랑 역사, 헐버트 아리랑, 조선의 성악, 호머 헐버트, 헐버트 유물전, 헐버트 전시회, 함께봄",
      siteName: "제1회 헐버트 유물전 | 함께봄",
      posterAlt: "제1회 헐버트 유물전 — 아리랑, 130년 전 한국의 보물을 찾다 전시 포스터",
      ogLocale: "ko_KR",
    },
    langSwitch: { href: "/en/", label: "English", lang: "en" },
    badge: "전시 종료",
    eyebrow: "제1회 헐버트 유물전",
    title: (
      <>
        아리랑,
        <br />
        130년 전 한국의
        {br}보물을 찾다
      </>
    ),
    subtitle: "헐버트가 시작한 K-컬쳐",
    description: (
      <>
        1896년 처음 오선보에 기록된 아리랑,
        {br}헐버트의 저서와 유품으로 만나는 이야기
      </>
    ),
    info: [
      { label: "기간", value: "2026. 3. 19 (목) — 4. 19 (일)", note: "전시가 종료되었습니다. 찾아주셔서 감사합니다." },
      { label: "장소", value: "함께봄 서촌 한옥", note: "서울 종로구 효자로 7길 10" },
    ],
    instagram: (
      <>
        함께봄의 다음 소식은 {br}인스타그램에서 만나보세요.
      </>
    ),
    iconTitle: { instagram: "인스타그램", arrow: "바로가기 화살표", kakao: "카카오톡" },
    arirang: {
      label: "Arirang",
      heading: "아리랑이란",
      blocks: [
        {
          body: (
            <>
              <strong>아리랑</strong>은 한국을 대표하는 민요입니다. 한 사람이 지은 노래가 아니라 오랜 세월 여러 지역에서
              입에서 입으로 전해지며 불린 노래로, 정선아리랑·진도아리랑·밀양아리랑처럼 지역마다 가락과 노랫말이 다른
              아리랑이 전해집니다.
            </>
          ),
        },
        {
          body: (
            <>
              아리랑은 2012년 유네스코 인류무형문화유산 대표목록에 등재되었습니다. 입에서 입으로 전해지던 이 노래가{" "}
              <strong>처음 서양식 오선보로 기록된 것은 1896년</strong>, 한 미국인의 손에서였습니다.
            </>
          ),
        },
      ],
    },
    firstScore: {
      label: "First Score",
      heading: "아리랑 최초의 서양식 악보, 1896년 헐버트의 채보",
      blocks: [
        {
          h3: "아리랑을 오선보에 옮기다",
          body: (
            <>
              호머 헐버트(Homer B. Hulbert, 1863~1949)는{" "}
              <strong>1896년 한국의 구전 민요 아리랑을 서양식 오선보로 최초 채보</strong>했습니다. 이 악보는 영문 잡지
              《코리안 리포지터리(The Korean Repository)》 1896년 2월호에 실린 논문{" "}
              <strong>「조선의 성악(Korean Vocal Music)」</strong>에 담겨 국제사회에 소개되었습니다. 아리랑이 세계에
              알려지는 결정적 계기였으며, 오늘날 K-컬처의 출발점으로 재조명받고 있습니다.
            </>
          ),
        },
        {
          h3: "아리랑은 한국인에게 쌀과 같은 노래",
          body: "헐버트는 이 글에서 아리랑이 한국인에게 음식의 쌀과 같은 노래라고 소개했습니다. 한국인의 삶에서 빼놓을 수 없는 노래라는 뜻입니다.",
        },
        {
          h3: "호머 헐버트는 누구인가",
          body: (
            <>
              헐버트는 미국 출신 교육자이자 대한제국의 독립을 위해 헌신한 독립운동가입니다. 1886년 23세의 나이로 조선에
              도착해 육영공원 교사로 활동하며, 최초의 한글 세계지리 교과서 <strong>《사민필지》</strong>를 집필하고
              한글의 우수성을 세계에 알렸습니다.
            </>
          ),
        },
        {
          h3: "아리랑 연표",
          list: [
            <><strong>1886년</strong> — 헐버트, 조선 입국</>,
            <><strong>1896년</strong> — 헐버트, 아리랑을 서양식 오선보로 최초 채보 (「조선의 성악」)</>,
            <><strong>1926년</strong> — 나운규 감독의 영화 〈아리랑〉 개봉</>,
            <><strong>2012년</strong> — 아리랑, 유네스코 인류무형문화유산 등재</>,
            <><strong>2026년</strong> — 아리랑 채보 130주년, 제1회 헐버트 유물전 개최</>,
          ],
        },
        {
          body: (
            <>
              2026년은 헐버트의 아리랑 채보 <strong>130주년</strong>이자, 조선에 처음 입국한 지 <strong>140주년</strong>이
              되는 뜻깊은 해입니다. 제1회 헐버트 유물전은 헐버트박사기념사업회가 추진하는 &apos;헐버트 박사 내한 140주년
              기념사업&apos;의 첫 번째 행사로 마련되었습니다.
            </>
          ),
        },
      ],
    },
    exhibition: {
      label: "Exhibition",
      heading: "제1회 헐버트 유물전 — 아리랑 전시 기록",
      blocks: [
        {
          h3: "주요 전시 자료",
          list: [
            "헐버트가 기록한 아리랑 채보 악보 및 관련 사료",
            "논문 「조선의 성악(Korean Vocal Music)」 원문",
            "최초의 한글 세계지리 교과서 《사민필지》",
            "헐버트의 유품과 조선 풍속 사진",
          ],
        },
        {
          h3: "AI 융합 콘텐츠",
          body: "단순한 역사 자료 전시를 넘어, AI 기반 영상과 음악으로 아리랑을 재해석한 작품을 함께 선보였습니다. 전통문화와 현대 기술이 만나는 새로운 시도였습니다.",
        },
      ],
    },
    programs: {
      label: "Programs",
      heading: "행사 프로그램",
      blocks: [
        { h3: "북 콘서트", body: "「헐버트의 꿈, 조선은 피어나리!」 — 김동진 작가와 함께하는 헐버트 이야기" },
        { h3: "축하 공연", list: ["아리랑 전통 공연 (판소리·국악 연주)", "포크 콘서트 (김광석 기타리스트)"] },
        { h3: "체험 프로그램", list: ["슈링클스 아트"] },
      ],
      contest: {
        title: "제1회 꿈꾸는 아리랑 AI 영상 공모전",
        prize: "총상금 1,300만 원",
        body: "아리랑을 주제로 AI 영상 콘텐츠를 제작하는 공모전이 전시와 함께 마련되었습니다. 한국의 전통 가락 아리랑과 현대 AI 기술, 그리고 참가자들의 꿈을 하나로 연결하는 시도입니다. 공모전 관련 내용은 아래 관련 링크에서 확인하실 수 있습니다.",
      },
    },
    links: {
      label: "Links",
      heading: "관련 링크",
      items: [
        { href: "/blog/", title: "아리랑 칼럼", host: "dreamarirang.com/blog", external: false },
        { href: "http://hulbert.or.kr/bbs/board.php?bo_table=donation", title: "헐버트 흉상 건립 기금 모금", host: "hulbert.or.kr", external: true },
        { href: "http://hulbert.or.kr/", title: "헐버트 홈페이지", host: "hulbert.or.kr", external: true },
        { href: "https://www.aikkumhub.com", title: "꿈꾸는 아리랑 공모전", host: "aikkumhub.com", external: true },
      ],
    },
    contact: {
      label: "Contact",
      heading: "문의",
      kakao: { name: "함께봄 카카오톡 채널", handle: "채팅 상담" },
      instagram: { name: "함께봄 인스타그램", handle: "@hamkkebom_official" },
    },
    footer: "© 2026 함께봄 주식회사. All rights reserved.",
  },

  en: {
    meta: {
      title: "Arirang — The First Western Score and Hulbert's 1896 Transcription",
      description:
        "Arirang is Korea's signature folk song. In 1896 Homer B. Hulbert first set it down in Western staff notation. The story of that score and the 2026 Seoul exhibition.",
      ogDescription:
        "In 1896 Homer B. Hulbert made the earliest known Western staff notation of Arirang. The story of that score, and a record of the 130th-anniversary exhibition in Seoul (ended).",
      keywords:
        "Arirang, Arirang sheet music, first Arirang score, Arirang history, Hulbert Arirang, Korean Vocal Music, Homer Hulbert, Korean folk song, Hulbert exhibition, Hamkkebom",
      siteName: "The 1st Hulbert Relics Exhibition | Hamkkebom",
      posterAlt: "Poster of the 1st Hulbert Relics Exhibition — Arirang, Discovering Korea's Treasure 130 Years Ago",
      ogLocale: "en_US",
    },
    langSwitch: { href: "/", label: "한국어", lang: "ko" },
    badge: "Exhibition ended",
    eyebrow: "The 1st Hulbert Relics Exhibition",
    title: (
      <>
        Arirang,
        <br />
        Discovering Korea&apos;s Treasure
        {br} 130 Years Ago
      </>
    ),
    subtitle: "Where K-culture began, with Hulbert",
    description: (
      <>
        Arirang, set on a Western staff in 1896,
        {br} told through Hulbert&apos;s books and belongings
      </>
    ),
    info: [
      { label: "Dates", value: "March 19 (Thu) — April 19 (Sun), 2026", note: "The exhibition has ended. Thank you for visiting." },
      { label: "Venue", value: "Hamkkebom Seochon Hanok", note: "10 Hyoja-ro 7-gil, Jongno-gu, Seoul" },
    ],
    instagram: (
      <>
        Follow Hamkkebom on Instagram {br}for what comes next.
      </>
    ),
    iconTitle: { instagram: "Instagram", arrow: "Arrow", kakao: "KakaoTalk" },
    arirang: {
      label: "Arirang",
      heading: "What is Arirang?",
      blocks: [
        {
          body: (
            <>
              <strong>Arirang</strong> is Korea&apos;s signature folk song. No single person composed it. It was passed
              down by word of mouth over generations and across regions, so the melody and the words differ from place to
              place, as in Jeongseon Arirang, Jindo Arirang and Miryang Arirang.
            </>
          ),
        },
        {
          body: (
            <>
              In 2012 Arirang was inscribed on UNESCO&apos;s Representative List of the Intangible Cultural Heritage of
              Humanity. The earliest known <strong>Western staff notation of the song dates from 1896</strong>, written by
              an American.
            </>
          ),
        },
      ],
    },
    firstScore: {
      label: "First Score",
      heading: "The first Western score of Arirang: Hulbert's 1896 transcription",
      blocks: [
        {
          h3: "Setting Arirang on the staff",
          body: (
            <>
              Homer B. Hulbert (1863–1949) made{" "}
              <strong>the earliest known transcription of Arirang in Western staff notation, in 1896</strong>. The score
              appeared in his essay <strong>“Korean Vocal Music”</strong>, published in the February 1896 issue of the
              English-language journal <em>The Korean Repository</em>, which introduced the song to readers abroad. It was
              a turning point in how Arirang reached the world, and it is now revisited as a starting point of K-culture.
            </>
          ),
        },
        {
          h3: "A song like rice",
          body: "In that essay Hulbert wrote that Arirang is to Koreans what rice is to their food: a song they could not do without.",
        },
        {
          h3: "Who was Homer Hulbert?",
          body: (
            <>
              Hulbert was an American educator who devoted himself to the independence of the Korean Empire. He arrived in
              Joseon in 1886 at the age of 23, taught at Yugyeong Gongwon (the Royal English School), wrote{" "}
              <strong>
                <em>Saminpilji</em>
              </strong>
              , the first world geography textbook in Hangul, and made the merits of the Korean alphabet known abroad.
            </>
          ),
        },
        {
          h3: "An Arirang timeline",
          list: [
            <><strong>1886</strong> — Hulbert arrives in Joseon</>,
            <><strong>1896</strong> — Hulbert transcribes Arirang in Western staff notation (“Korean Vocal Music”)</>,
            <><strong>1926</strong> — Na Woon-gyu&apos;s film <em>Arirang</em> is released</>,
            <><strong>2012</strong> — Arirang is inscribed on UNESCO&apos;s Intangible Cultural Heritage list</>,
            <><strong>2026</strong> — 130th anniversary of the transcription; the 1st Hulbert Relics Exhibition is held</>,
          ],
        },
        {
          body: (
            <>
              2026 marks the <strong>130th anniversary</strong> of Hulbert&apos;s transcription of Arirang and the{" "}
              <strong>140th anniversary</strong> of his arrival in Korea. The 1st Hulbert Relics Exhibition was the first
              event of the Hulbert Memorial Society&apos;s program commemorating 140 years since his arrival.
            </>
          ),
        },
      ],
    },
    exhibition: {
      label: "Exhibition",
      heading: "The 1st Hulbert Relics Exhibition — a record of the Arirang exhibition",
      blocks: [
        {
          h3: "What was on display",
          list: [
            "Hulbert's transcribed score of Arirang and related historical materials",
            "The original text of the essay “Korean Vocal Music”",
            <><em>Saminpilji</em>, the first world geography textbook in Hangul</>,
            "Hulbert's personal belongings and photographs of life in Joseon",
          ],
        },
        {
          h3: "AI works",
          body: "Beyond historical materials, the exhibition also showed works that reinterpret Arirang through AI-generated video and music, a new attempt to bring traditional culture and current technology together.",
        },
      ],
    },
    programs: {
      label: "Programs",
      heading: "Programs",
      blocks: [
        { h3: "Book concert", body: "“Hulbert's Dream: Joseon Shall Bloom!” — the story of Hulbert, with author Kim Dong-jin" },
        { h3: "Celebration performances", list: ["Traditional Arirang performance (pansori and gugak)", "Folk concert (guitarist Kim Kwang-seok)"] },
        { h3: "Hands-on program", list: ["Shrink-plastic art"] },
      ],
      contest: {
        title: "The 1st Dreaming Arirang AI Video Contest",
        prize: "Total prize money: KRW 13 million",
        body: "An AI video contest on the theme of Arirang was organized alongside the exhibition, an attempt to connect Korea's traditional melody, current AI technology and the dreams of its participants. Details are available through the links below.",
      },
    },
    links: {
      label: "Links",
      heading: "Links",
      items: [
        { href: "http://hulbert.or.kr/bbs/board.php?bo_table=donation", title: "Fundraising for a Hulbert bust", host: "hulbert.or.kr", external: true },
        { href: "http://hulbert.or.kr/", title: "Hulbert Memorial Society", host: "hulbert.or.kr", external: true },
        { href: "https://www.aikkumhub.com", title: "Dreaming Arirang contest", host: "aikkumhub.com", external: true },
      ],
    },
    contact: {
      label: "Contact",
      heading: "Contact",
      kakao: { name: "Hamkkebom KakaoTalk channel", handle: "Chat (Korean)" },
      instagram: { name: "Hamkkebom Instagram", handle: "@hamkkebom_official" },
    },
    footer: "© 2026 Hamkkebom Co., Ltd. All rights reserved.",
  },
};
