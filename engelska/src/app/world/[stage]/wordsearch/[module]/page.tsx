import WordSearchModuleClient from "./WordSearchModuleClient";
import { moduleParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return moduleParams("wordsearch");
}

export default function WordSearchModulePage({ params }: { params: Promise<{ stage: string; module: string }> }) {
  return <WordSearchModuleClient params={params} />;
}
