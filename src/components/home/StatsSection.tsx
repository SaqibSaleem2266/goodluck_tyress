import React, { useEffect, useRef, useState } from 'react';
import {
  COMPANY_STATS,
  computeAnimatedStatValue,
  formatAnimatedStat,
} from '../../utils/statsFormat.ts';

export const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [values, setValues] = useState<number[]>(() =>
    COMPANY_STATS.map(() => 0)
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasAnimated) return;

    const runAnimation = () => {
      setHasAnimated(true);
      const durationMs = 1400;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        setValues(
          COMPANY_STATS.map((stat) =>
            computeAnimatedStatValue(stat.target, progress)
          )
        );

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    // Fallback check if element is already visible on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runAnimation();
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      aria-label="Years in Commercial Tyre Trading Statistics"
      className="py-16 px-4 lg:px-8 bg-[#0A3C6E] text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest mb-1">
            National Scale & Reliability
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            Proven Commercial Distribution Track Record
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_STATS.map((stat, idx) => (
            <div
              key={stat.id}
              data-testid={`stat-card-${stat.id}`}
              className="bg-[#06284B] border border-white/15 rounded-xl p-6 text-center flex flex-col items-center justify-between"
            >
              <div
                data-testid={`stat-value-${stat.id}`}
                className="text-4xl sm:text-5xl font-display font-black text-white tabular-nums tracking-tight mb-2"
              >
                {formatAnimatedStat(values[idx], stat.suffix)}
              </div>
              <div className="text-sm font-bold text-sky-300 mb-1.5">
                {stat.label}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
