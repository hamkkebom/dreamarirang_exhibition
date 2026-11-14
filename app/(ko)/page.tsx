import HomePage from "@/components/HomePage";
import { homeMetadata } from "@/lib/homeMeta";
import { JsonLd, eventLd } from "@/lib/jsonld";

export const metadata = homeMetadata("ko");

export default function Page() {
  return (
    <>
      <HomePage locale="ko" />
      <JsonLd data={eventLd("ko")} />
    </>
  );
}
