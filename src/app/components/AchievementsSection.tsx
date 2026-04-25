import { useMemo, useState } from 'react';
import { useMode } from '../context/ModeContext';
import { AnimatePresence, motion } from 'motion/react';
import { Award, ArrowUpRight, Expand, X } from 'lucide-react';
import certificationsData from '../data/certifications.json';

interface Certification {
  id: string;
  title: string;
  category: string;
  year: string;
  overview: string;
  image: string;
  featured?: boolean;
}

const certifications = certificationsData as Certification[];

const FEATURED_CERT_IDS = [
  'iirc-innovation-award-2026',
  'seo-certified-i-2026',
  'seo-certified-ii-2026',
  'batang-techno-programming-2026',
];

export const AchievementsSection = () => {
  const { mode, theme } = useMode();
  const [selectedCertificationId, setSelectedCertificationId] = useState<string | null>(null);
  const [isAllCertificationsOpen, setIsAllCertificationsOpen] = useState(false);

  const featuredCertifications = useMemo(() => {
    const selected = FEATURED_CERT_IDS
      .map((id) => certifications.find((item) => item.id === id))
      .filter((item): item is Certification => Boolean(item));

    if (selected.length > 0) {
      return selected;
    }

    return certifications.filter((item) => item.featured).slice(0, 4);
  }, []);

  const selectedCertification = useMemo(
    () => certifications.find((item) => item.id === selectedCertificationId) ?? null,
    [selectedCertificationId]
  );

  const orderedCertifications = useMemo(
    () => [...certifications].sort((a, b) => Number(b.year) - Number(a.year) || a.title.localeCompare(b.title)),
    []
  );

  const closeAllCertifications = () => {
    setIsAllCertificationsOpen(false);
    setSelectedCertificationId(null);
  };

  return (
    <section id="achievements" className="relative min-h-screen overflow-hidden px-6 py-24 md:px-8">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background:
            theme === 'dark'
              ? mode === 'developer'
                ? 'linear-gradient(180deg, #030712 0%, #082f49 100%)'
                : 'linear-gradient(180deg, #0b0b10 0%, #431407 100%)'
              : mode === 'developer'
                ? 'linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)',
        }}
        transition={{ duration: 0.55 }}
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            animate={{ color: mode === 'developer' ? '#06b6d4' : '#f97316' }}
          >
            Certifications
          </motion.span>
          <h2 className="mt-4 text-balance text-4xl font-semibold text-slate-950 dark:text-slate-100 md:text-5xl">
            Featured Certifications
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Showing key highlights: IIRC, SEO I, SEO II, and Batang Techno.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredCertifications.map((certification, idx) => (
            <CertificationThumbnailCard
              key={certification.id}
              certification={certification}
              mode={mode}
              delay={idx * 0.08}
              onOpen={() => setSelectedCertificationId(certification.id)}
            />
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <button
            type="button"
            onClick={() => setIsAllCertificationsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/75 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/65 dark:text-slate-100"
          >
            Show all cert
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAllCertificationsOpen && (
          <AllCertificationsModal
            certifications={orderedCertifications}
            onOpenCertification={(certificationId) => setSelectedCertificationId(certificationId)}
            onClose={closeAllCertifications}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCertification && (
          <CertificationImageModal
            certification={selectedCertification}
            mode={mode}
            onClose={() => setSelectedCertificationId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

interface AllCertificationsModalProps {
  certifications: Certification[];
  onOpenCertification: (certificationId: string) => void;
  onClose: () => void;
}

const AllCertificationsModal = ({ certifications, onOpenCertification, onClose }: AllCertificationsModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto bg-black/65 p-4 backdrop-blur-sm md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-300/80 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-950 md:p-6"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 14, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-slate-100 md:text-3xl">All Certifications</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Browse every certification without leaving the home page.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close certifications list"
            className="rounded-full bg-white/90 p-2 text-slate-600 transition hover:bg-white hover:text-slate-900 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certifications.map((certification) => (
            <button
              key={certification.id}
              type="button"
              onClick={() => onOpenCertification(certification.id)}
              className="group rounded-2xl border border-slate-300/80 bg-white/75 p-4 text-left shadow-sm transition-colors hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/65 dark:hover:border-slate-500"
            >
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={certification.image}
                  alt={certification.title}
                  className="h-48 w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white">
                  <Expand className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{certification.title}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{certification.category}</p>
                </div>
                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  {certification.year}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{certification.overview}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface CertificationThumbnailCardProps {
  certification: Certification;
  mode: 'developer' | 'editor';
  delay: number;
  onOpen: () => void;
}

const CertificationThumbnailCard = ({ certification, mode, delay, onOpen }: CertificationThumbnailCardProps) => {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3 }}
      onClick={onOpen}
      className="group relative h-full rounded-2xl border border-slate-300/80 bg-white/75 p-4 text-left shadow-sm backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-900/65"
      style={{
        borderColor: mode === 'developer' ? 'rgba(6, 182, 212, 0.35)' : 'rgba(249, 115, 22, 0.35)',
      }}
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <img
          src={certification.image}
          alt={certification.title}
          className="h-56 w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-black/0 p-4 text-white opacity-0 transition-opacity duration-250 md:flex md:group-hover:opacity-100">
          <p className="text-sm leading-relaxed">{certification.overview}</p>
          <span className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">Click to open full image</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 md:hidden">
          <div className="rounded-lg bg-black/65 p-3 text-xs leading-relaxed text-white">{certification.overview}</div>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{certification.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{certification.category}</p>
        </div>
        <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300">
          {certification.year}
        </span>
      </div>
    </motion.button>
  );
};

interface CertificationImageModalProps {
  certification: Certification;
  mode: 'developer' | 'editor';
  onClose: () => void;
}

const CertificationImageModal = ({ certification, mode, onClose }: CertificationImageModalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-6xl rounded-2xl border border-slate-300/80 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-950 md:p-6"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate image"
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 transition hover:bg-white hover:text-slate-900 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 pr-12">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white"
            animate={{
              background:
                mode === 'developer'
                  ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                  : 'linear-gradient(135deg, #f97316 0%, #fb7185 100%)',
            }}
          >
            <Award className="h-3.5 w-3.5" />
            {certification.year}
          </motion.span>
          <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-100 md:text-2xl">{certification.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{certification.overview}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <img
            src={certification.image}
            alt={certification.title}
            className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
