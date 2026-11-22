import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MANUSCRIPT_META } from '../data/manuscript';

const RESEARCH_QUESTIONS = [
  {
    id: 'RQ1',
    text: 'How much cooling energy does converting the 25 cm solid wall into a cavity wall save, and how much more does insulating the cavity add?',
  },
  {
    id: 'RQ2',
    text: 'How do insulation material (EPS, XPS, PIR/PUR, mineral wool) and thickness (2, 4, 6 cm) shape the saving, and how does the saving relate to U-value?',
  },
  {
    id: 'RQ3',
    text: 'What does each alternative cost under August 2026 Cairo BOQ and tariff conditions, and which gives the best payback, NPV, and BCR?',
  },
  {
    id: 'RQ4',
    text: 'Does the economically best option coincide with the thermally best one, and does the answer hold across economic scenarios, orientations, and glazing types?',
  },
];

export const ResearchAbstract: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [showRqs, setShowRqs] = useState<boolean>(false);

  const isAr = lang === 'ar';

  return (
    <section
      id="abstract"
      aria-labelledby="research-title"
      className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 scroll-mt-20"
    >
      {/* Top Publication Metadata Line & Language Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-slate-400">
          <span className="font-medium text-neutral-700 dark:text-slate-300">
            {MANUSCRIPT_META.journal}
          </span>
          <span aria-hidden="true">·</span>
          <span>{MANUSCRIPT_META.section}</span>
          <span aria-hidden="true">·</span>
          <span>Cairo, Egypt</span>
        </div>

        <div
          role="group"
          aria-label="Abstract language"
          className="inline-flex items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md self-start shrink-0"
        >
          <button
            type="button"
            onClick={() => setLang('en')}
            aria-pressed={!isAr}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              !isAr
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('ar')}
            aria-pressed={isAr}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              isAr
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Main Title + Editorial Abstract Column */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        lang={isAr ? 'ar' : 'en'}
        className="pt-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        <div className="xl:col-span-8 space-y-4">
          <p className="text-xs font-mono tracking-wide text-blue-700 dark:text-blue-400 font-medium">
            {isAr ? 'ملخص البحث' : '01. Research Abstract'}
          </p>

          <h1
            id="research-title"
            className={`font-display font-bold tracking-tight text-neutral-950 dark:text-white [text-wrap:balance] ${
              isAr
                ? 'text-2xl sm:text-3xl leading-[1.45]'
                : 'text-2xl sm:text-3xl lg:text-[34px] leading-[1.15]'
            }`}
          >
            {isAr ? MANUSCRIPT_META.titleAr : MANUSCRIPT_META.titleEn}
          </h1>

          <p
            className={`text-neutral-700 dark:text-slate-300 max-w-[74ch] ${
              isAr ? 'text-[15.5px] leading-[1.9]' : 'text-[15px] leading-[1.72]'
            }`}
          >
            {isAr ? MANUSCRIPT_META.abstractAr : MANUSCRIPT_META.abstractEn}
          </p>

          {/* Unboxed Keywords Line */}
          <div className="pt-3 border-t border-neutral-200 dark:border-slate-800 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-slate-400">
            <span className="font-semibold text-neutral-800 dark:text-slate-200">
              {isAr ? 'الكلمات المفتاحية:' : 'Keywords:'}
            </span>
            {(isAr ? MANUSCRIPT_META.keywordsAr : MANUSCRIPT_META.keywordsEn).map(
              (kw, idx, arr) => (
                <React.Fragment key={kw}>
                  <span>{kw}</span>
                  {idx < arr.length - 1 && (
                    <span aria-hidden="true" className="text-neutral-300 dark:text-slate-600">
                      ·
                    </span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>

        {/* Right Margin Summary Rail: Core Study Takeaways */}
        <aside
          dir="ltr"
          className="xl:col-span-4 xl:border-l border-t xl:border-t-0 border-neutral-200 dark:border-slate-800 pt-5 xl:pt-0 xl:pl-6 space-y-5"
        >
          <div>
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-slate-100">
              Published Base-Case Verdict (r = g = 15%, 25 yrs)
            </h2>
            <dl className="mt-3 divide-y divide-neutral-200 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex items-baseline justify-between gap-4">
                <dt className="text-neutral-500 dark:text-slate-400">Cavity alone (W02)</dt>
                <dd className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400 text-right">
                  +17,692 EGP · BCR 2.16
                </dd>
              </div>
              <div className="py-2.5 flex items-baseline justify-between gap-4">
                <dt className="text-neutral-500 dark:text-slate-400">Best insulated (W03 EPS 2cm)</dt>
                <dd className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-slate-100 text-right">
                  +16,332 EGP · BCR 1.68
                </dd>
              </div>
              <div className="py-2.5 flex items-baseline justify-between gap-4">
                <dt className="text-neutral-500 dark:text-slate-400">Thermal optimum (W11 PIR 6cm)</dt>
                <dd className="font-mono font-semibold tabular-nums text-red-700 dark:text-red-400 text-right">
                  −12,536 EGP · BCR 0.81
                </dd>
              </div>
              <div className="py-2.5 flex items-baseline justify-between gap-4">
                <dt className="text-neutral-500 dark:text-slate-400">Viable alternatives</dt>
                <dd className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-slate-100 text-right">
                  12 of 13 cases
                </dd>
              </div>
              <div className="py-2.5 flex items-baseline justify-between gap-4">
                <dt className="text-neutral-500 dark:text-slate-400">Insulating cavity breakeven</dt>
                <dd className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-slate-100 text-right">
                  2.42–2.59 EGP/kWh
                </dd>
              </div>
            </dl>
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowRqs((v) => !v)}
              aria-expanded={showRqs}
              className="w-full flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>Research Questions (RQ1–RQ4)</span>
              {showRqs ? (
                <ChevronUp className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0" />
              )}
            </button>

            {showRqs && (
              <ol className="mt-3 space-y-2.5 text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
                {RESEARCH_QUESTIONS.map((rq) => (
                  <li key={rq.id} className="flex gap-2">
                    <span className="font-mono font-semibold text-neutral-900 dark:text-slate-200 shrink-0">
                      {rq.id}.
                    </span>
                    <span>{rq.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};
