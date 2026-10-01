import SpelModuleClient from "./SpelModuleClient";
import { moduleParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return moduleParams("spel");
}

export default function SpelModulePage({ params }: { params: Promise<{ stage: string; module: string }> }) {
  return <SpelModuleClient params={params} />;
}
