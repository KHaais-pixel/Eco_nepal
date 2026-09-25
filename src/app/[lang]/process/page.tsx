import type { Metadata } from "next";
import Container from "@/components/Container";
import ProcessIntro from "@/components/process/ProcessIntro";
import PlantScrub from "@/components/process/PlantScrub";
import CTABanner from "@/components/CTABanner";
import { processSteps } from "@/lib/site-data";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.process.metaTitle, description: t.process.metaDescription };
}

export default async function ProcessPage() {
  const { t } = await getI18n();
  const p = t.process;
  const labels = {
    steps: processSteps.map((s, i) => ({ number: s.number, ...p.steps[i] })),
    short: p.short,
    stepLabel: p.stepLabel,
    sceneAria: p.sceneAria,
    diagram: p.diagram,
  };
  return (
    <>
      <ProcessIntro eyebrow={p.eyebrow} title={p.title} />

      <PlantScrub labels={labels} />

      <Container>
        <p className="mx-auto max-w-[640px] py-16 text-center text-sm leading-[1.6] text-muted-3">{p.disclaimer}</p>
      </Container>

      <CTABanner />
    </>
  );
}
