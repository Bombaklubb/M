import TidsattackClient from "./TidsattackClient";
import { stageParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return stageParams();
}

export default function TidsattackPage({ params }: { params: Promise<{ stage: string }> }) {
  return <TidsattackClient params={params} />;
}
