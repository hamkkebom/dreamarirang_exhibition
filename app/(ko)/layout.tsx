import "../site.css";
import Shell from "@/components/Shell";
import { baseMetadata } from "@/lib/meta";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";

export const metadata = baseMetadata();
export { viewport } from "@/lib/meta";

export default function KoreanRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="ko">
      {children}
      <JsonLd data={[organizationLd("ko"), websiteLd()]} />
    </Shell>
  );
}
