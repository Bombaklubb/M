import SpellingModuleClient from "./SpellingModuleClient";
import { moduleParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return moduleParams("spelling");
}

export default function SpellingModulePage({ params }: { params: Promise<{ stage: string; module: string }> }) {
  return <SpellingModuleClient params={params} />;
}
