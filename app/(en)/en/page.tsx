import HomePage from "@/components/HomePage";
import { homeMetadata } from "@/lib/homeMeta";
import { JsonLd, eventLd, enWebPageLd } from "@/lib/jsonld";

export const metadata = homeMetadata("en");

export default function Page() {
  return (
    <>
      <HomePage locale="en" />
      <JsonLd data={[eventLd("en"), enWebPageLd()]} />
    </>
  );
}
