import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Expand, X } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import certificationsData from '../data/certifications.json';

interface Certification {
  id: string;
  title: string;
  category: string;
  year: string;
  overview: string;
  image: string;
}

const certifications = certificationsData as Certification[];

export const AllCertificationsPage = () => {
  const { mode, theme } = useMode();
  const [selectedCertificationId, setSelectedCertificationId] = useState<string | null>(null);

  const orderedCertifications = useMemo(
    () => [...certifications].sort((a, b) => Number(b.year) - Number(a.year) || a.title.localeCompare(b.title)),
    []
  );

  const selectedCertification = useMemo(
    () => orderedCertifications.find((item) => item.id === selectedCertificationId) ?? null,
    [orderedCertifications, selectedCertificationId]
  );

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-16 md:px-8">
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </a>

          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {orderedCertifications.length} certificates
          </span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-100 md:text-5xl">All Certifications</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            Complete certification gallery powered by a single source of truth JSON.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {orderedCertifications.map((certification, idx) => (
            <motion.button
              key={certification.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3), duration: 0.3 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedCertificationId(certification.id)}
              className="group rounded-2xl border border-slate-300/80 bg-white/75 p-4 text-left shadow-sm backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-900/65"
            >
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={certification.image}
                  alt={certification.title}
                  className="h-52 w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white">
                  <Expand className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{certification.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{certification.category}</p>
                </div>
                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  {certification.year}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{certification.overview}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCertification && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificationId(null)}
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
                onClick={() => setSelectedCertificationId(null)}
                aria-label="Close certificate image"
                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 transition hover:bg-white hover:text-slate-900 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 pr-12">
                <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-100 md:text-2xl">{selectedCertification.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedCertification.overview}</p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <img
                  src={selectedCertification.image}
                  alt={selectedCertification.title}
                  className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
