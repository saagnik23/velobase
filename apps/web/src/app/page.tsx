import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { ArchitectureSection } from '@/components/landing/architecture-section';
import { LatencyDemo } from '@/components/landing/latency-demo';
import { CTASection } from '@/components/landing/cta-section';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-basalt">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <LatencyDemo />
        <ArchitectureSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
