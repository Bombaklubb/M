import MemoryGameClient from "./MemoryGameClient";
import { stageParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return stageParams();
}

export default function MemoryGamePage({ params }: { params: Promise<{ stage: string }> }) {
  return <MemoryGameClient params={params} />;
}
