import {
  FinalCta,
  Features,
  Footer,
  Hero,
  LandingHeader,
  Problem,
  ProductPreview,
  SocialProof,
  Solution,
} from "@/features/landing/sections";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <Features />
        <ProductPreview />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
