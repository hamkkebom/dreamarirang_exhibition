import "../../site.css";
import Shell from "@/components/Shell";
import { baseMetadata } from "@/lib/meta";
import { JsonLd, organizationLd } from "@/lib/jsonld";

export const metadata = baseMetadata();
export { viewport } from "@/lib/meta";

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell lang="en">
      {children}
      <JsonLd data={organizationLd("en")} />
    </Shell>
  );
}
