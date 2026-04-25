import { Suspense, lazy, type FC } from 'react';
import { ModeProvider } from './context/ModeContext';
import { ModeToggle } from './components/ModeToggle';
import { HeroSection } from './components/HeroSection';
import { OverviewSection } from './components/OverviewSection';
import { Footer } from './components/Footer';

const AchievementsSection = lazy(() =>
  import('./components/AchievementsSection').then((module) => ({ default: module.AchievementsSection }))
);

const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((module) => ({ default: module.ProjectsSection }))
);

const ContactSection = lazy(() =>
  import('./components/ContactSection').then((module) => ({ default: module.ContactSection }))
);

const SectionLoader: FC = () => (
  <div className="px-8 py-16">
    <div className="mx-auto h-24 max-w-7xl rounded-2xl border border-slate-300/50 bg-white/70 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70" />
  </div>
);

export default function App() {
  return (
    <ModeProvider>
      <div className="min-h-screen bg-[var(--portfolio-bg)] text-[var(--portfolio-text)] transition-colors duration-500">
        <ModeToggle />
        <main>
          <HeroSection />
          <OverviewSection />
          <Suspense fallback={<SectionLoader />}>
            <AchievementsSection />
            <ProjectsSection />
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ModeProvider>
  );
}