// 칼럼 본문(마크다운) → 시맨틱 HTML + 목차.
// - 본문 안의 h1은 h2로 낮춘다 (화면에 h1은 글 제목 하나만)
// - h2/h3에 고유한 id를 붙이고 목차를 만든다
// - h2마다 그 아래 내용을 <section>으로 묶는다
// - 이미지는 늦게 불러오고, ![대체 글](주소 "가로x세로") 형식이면 크기를 넣는다
// - 날것의 HTML은 허용하지 않는다 (remark-rehype 기본값) + sanitize
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import GithubSlugger from "github-slugger";
import { toString as hastToString } from "hast-util-to-string";
import type { Root, Element, ElementContent, RootContent } from "hast";

export type TocItem = { depth: 2 | 3; id: string; text: string };
export type ImageInfo = { src: string; alt: string; width?: number; height?: number };
export type Rendered = { html: string; toc: TocItem[]; images: ImageInfo[]; warnings: string[] };

const schema = {
  ...defaultSchema,
  clobberPrefix: "",
  clobber: [],
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), "width", "height", "loading", "decoding"],
  },
};

function isHeading(n: RootContent | ElementContent, tag: string): n is Element {
  return n.type === "element" && n.tagName === tag;
}

function transform(collect: { toc: TocItem[]; images: ImageInfo[]; warnings: string[] }) {
  return (tree: Root) => {
    const slugger = new GithubSlugger();

    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if (child.tagName === "h1") child.tagName = "h2";
        if (child.tagName === "h2" || child.tagName === "h3") {
          const text = hastToString(child).trim();
          const id = slugger.slug(text || "section");
          child.properties = { ...child.properties, id };
          collect.toc.push({ depth: child.tagName === "h2" ? 2 : 3, id, text });
        }
        if (child.tagName === "img") {
          const p = child.properties ?? {};
          const src = String(p.src ?? "");
          const alt = String(p.alt ?? "").trim();
          let width: number | undefined;
          let height: number | undefined;
          const m = /^(\d{2,5})\s*[xX×]\s*(\d{2,5})$/.exec(String(p.title ?? "").trim());
          if (m) {
            width = Number(m[1]);
            height = Number(m[2]);
            delete p.title;
          }
          child.properties = { ...p, loading: "lazy", decoding: "async", ...(width ? { width, height } : {}) };
          collect.images.push({ src, alt, width, height });
          if (!alt) collect.warnings.push(`이미지에 대체 글이 없습니다: ${src}`);
          if (!width) collect.warnings.push(`이미지 크기가 없습니다: ${src} — ![대체 글](주소 "800x450") 형식으로 적어 주세요`);
        }
        if (child.tagName === "a") {
          const href = String(child.properties?.href ?? "");
          if (/^https?:\/\//.test(href) && !href.startsWith("https://dreamarirang.com")) {
            child.properties = { ...child.properties, rel: ["noopener", "noreferrer"], target: "_blank" };
          }
        }
        walk(child);
      }
    };
    walk(tree);

    // h2 단위로 <section> 묶기
    const out: RootContent[] = [];
    let current: Element | null = null;
    for (const node of tree.children) {
      if (isHeading(node, "h2")) {
        const section: Element = {
          type: "element",
          tagName: "section",
          properties: { ariaLabelledBy: [String(node.properties?.id ?? "")] },
          children: [node],
        };
        current = section;
        out.push(section);
      } else if (current) {
        current.children.push(node as ElementContent);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

export async function renderMarkdown(source: string): Promise<Rendered> {
  const collect = { toc: [] as TocItem[], images: [] as ImageInfo[], warnings: [] as string[] };
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(() => transform(collect))
    .use(rehypeStringify)
    .process(source);
  return { html: String(file), ...collect };
}
