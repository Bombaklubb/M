import SamlaMyntClient from "./SamlaMyntClient";
import { stageParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return stageParams();
}

export default function SamlaMyntPage({ params }: { params: Promise<{ stage: string }> }) {
  return <SamlaMyntClient params={params} />;
}
