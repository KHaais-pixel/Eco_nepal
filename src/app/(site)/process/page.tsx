import type { Metadata } from "next";
import Container from "@/components/Container";
import ProcessIntro from "@/components/process/ProcessIntro";
import PlantScrub from "@/components/process/PlantScrub";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "How Eco Nepal Energy processes waste tyres through pyrolysis to recover oil, fuel char, and steel — from collection to dispatch.",
};

export default function ProcessPage() {
  return (
    <>
      <ProcessIntro />

      <PlantScrub />

      <Container>
        <p className="mx-auto max-w-[640px] py-16 text-center text-sm leading-[1.6] text-muted-3">
          Process details such as exact operating temperatures, reactor specifications,
          and processing times are proprietary and subject to confirmation. Please
          contact us for further technical discussion under appropriate arrangements.
        </p>
      </Container>

      <CTABanner />
    </>
  );
}
