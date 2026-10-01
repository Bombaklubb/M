import HangmanClient from "./HangmanClient";
import { stageParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return stageParams();
}

export default function HangmanPage({ params }: { params: Promise<{ stage: string }> }) {
  return <HangmanClient params={params} />;
}
