import WorldClient from "./WorldClient";
import { stageParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy (se lib/staticParams.ts). Sidan själv är en
// klientkomponent som läser innehåll och elevens framsteg i webbläsaren.
export const dynamicParams = false;

export function generateStaticParams() {
  return stageParams();
}

export default function WorldPage({ params }: { params: Promise<{ stage: string }> }) {
  return <WorldClient params={params} />;
}
