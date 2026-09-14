import { SmoothScrollProvider } from "@/features/landing/components";
import {
  Features,
  FinalCta,
  Footer,
  Hero,
  LandingHeader,
  Metrics,
  Problem,
  ProductShowcase,
  RouteJourney,
  SocialProof,
  Solution,
} from "@/features/landing/sections";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="flex flex-1 flex-col">
        <LandingHeader />
        <main className="flex-1">
          <Hero />
          <SocialProof />
          <RouteJourney />
          <Problem />
          <Solution />
          <Features />
          <ProductShowcase />
          <Metrics />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
