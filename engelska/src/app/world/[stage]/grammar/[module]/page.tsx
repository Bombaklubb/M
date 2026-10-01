import GrammarModuleClient from "./GrammarModuleClient";
import { moduleParams } from "@/lib/staticParams";

// Byggs statiskt vid deploy, se lib/staticParams.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return moduleParams("grammar");
}

export default function GrammarModulePage({ params }: { params: Promise<{ stage: string; module: string }> }) {
  return <GrammarModuleClient params={params} />;
}
