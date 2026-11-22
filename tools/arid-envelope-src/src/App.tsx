import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  ALL_FAMILIES,
  DEFAULT_ASSUMPTIONS,
  EMBEDDED_MASTER_CSV,
  computeEnvelopeEconomics,
  fmtEgp,
  fmtNum,
  fmtSignedEgp,
  parseEnvelopeCsv,
} from './data/dataset';
import {
  EconomicAssumptions,
  FilterState,
  RawEnvelopeRow,
} from './types/envelope';
import { EconomicSidebar } from './components/EconomicSidebar';
import { ResearchAbstract } from './components/ResearchAbstract';
import { ResearchMethodology } from './components/ResearchMethodology';
import { WallInspector } from './components/WallInspector';
import { ParetoScatterChart } from './components/ParetoScatterChart';
import { ThicknessCurvesChart } from './components/ThicknessCurvesChart';
import { CashFlowChart } from './components/CashFlowChart';
import { CostAndComfortBreakdown } from './components/CostAndComfortBreakdown';
import { SensitivityHeatmap } from './components/SensitivityHeatmap';
import { ParametricTable } from './components/ParametricTable';

const INITIAL_FILTERS: FilterState = {
  materials: [...ALL_FAMILIES],
  thicknesses: [0, 2, 4, 6],
  paretoOnly: false,
  searchQuery: '',
};

export const App: React.FC = () => {
  const [rawRows] = useState<RawEnvelopeRow[]>(() =>
    parseEnvelopeCsv(EMBEDDED_MASTER_CSV)
  );
  const [assumptions, setAssumptions] = useState<EconomicAssumptions>(DEFAULT_ASSUMPTIONS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('Case-02');
  const [compareCaseId, setCompareCaseId] = useState<string>('Case-01');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });


  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        try {
          localStorage.setItem('aridenvelope.theme', 'dark');
        } catch {
          // ignore storage errors
        }
      } else {
        document.documentElement.classList.remove('dark');
        try {
          localStorage.setItem('aridenvelope.theme', 'light');
        } catch {
          // ignore storage errors
        }
      }
      return next;
    });
  };

  const computedCases = useMemo(
    () => computeEnvelopeEconomics(rawRows, assumptions),
    [rawRows, assumptions]
  );

  const filteredCases = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return computedCases.filter((c) => {
      if (!filters.materials.includes(c.materialFamily)) return false;
      if (!filters.thicknesses.includes(c.thicknessCm)) return false;
      if (filters.paretoOnly && !c.isParetoCostCooling) return false;
      if (
        q &&
        !c.wallId.toLowerCase().includes(q) &&
        !c.materialRaw.toLowerCase().includes(q) &&
        !c.caseId.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [computedCases, filters]);

  const pricedCases = useMemo(
    () => computedCases.filter((c) => c.isPricedAlternative),
    [computedCases]
  );

  const bestNpvCase = useMemo(() => {
    return pricedCases.reduce((best, cur) => {
      if (best.npvEgp === null) return cur;
      if (cur.npvEgp === null) return best;
      return cur.npvEgp > best.npvEgp ? cur : best;
    }, pricedCases[0] ?? computedCases[0]);
  }, [pricedCases, computedCases]);

  const fastestPaybackCase = useMemo(() => {
    const valid = pricedCases.filter((c) => c.simplePaybackYrs !== null);
    if (valid.length === 0) return pricedCases[0] ?? computedCases[0];
    return valid.reduce((best, cur) =>
      cur.simplePaybackYrs! < best.simplePaybackYrs! ? cur : best
    );
  }, [pricedCases, computedCases]);

  const peakCoolingCase = useMemo(() => {
    return computedCases.reduce((best, cur) =>
      cur.coolingSavedKwhYr > best.coolingSavedKwhYr ? cur : best
    );
  }, [computedCases]);

  const maxComfortCase = useMemo(() => {
    return computedCases.reduce((best, cur) =>
      cur.discomfortSavedHrsYr > best.discomfortSavedHrsYr ? cur : best
    );
  }, [computedCases]);

  const paretoCount = useMemo(
    () => pricedCases.filter((c) => c.isParetoCostCooling).length,
    [pricedCases]
  );

  const selectedCase = useMemo(
    () => computedCases.find((c) => c.caseId === selectedCaseId) ?? computedCases[0],
    [computedCases, selectedCaseId]
  );

  const compareCase = useMemo(
    () => computedCases.find((c) => c.caseId === compareCaseId) ?? computedCases[0],
    [computedCases, compareCaseId]
  );

  const referenceCase = useMemo(
    () =>
      computedCases.find((c) => c.caseId === assumptions.baselineReferenceId) ??
      computedCases[0],
    [computedCases, assumptions.baselineReferenceId]
  );

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] dark:bg-[#0F1419] text-[#111827] dark:text-[#F1F5F9]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-[#161D24]/95 backdrop-blur border-b border-neutral-200 dark:border-slate-800">
        <div className="h-full max-w-[1680px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#abstract"
            className="font-display text-lg font-bold tracking-tight text-neutral-950 dark:text-white whitespace-nowrap shrink-0"
          >
            AridEnvelope
          </a>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Dashboard sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-slate-400"
          >
            <a
              href="#abstract"
              className="hover:text-neutral-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Abstract
            </a>
            <a
              href="#methodology"
              className="hover:text-neutral-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            <a
              href="#pareto"
              className="hover:text-neutral-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Pareto
            </a>
            <a
              href="#lifecycle"
              className="hover:text-neutral-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Lifecycle
            </a>
            <a
              href="#ledger"
              className="hover:text-neutral-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Ledger
            </a>
          </nav>

        </div>
      </header>

      {/* Workspace Canvas: Persistent Left Sidebar + Scrollable Main Viewport */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        <EconomicSidebar
          assumptions={assumptions}
          onChangeAssumptions={setAssumptions}
          filters={filters}
          onChangeFilters={setFilters}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {/* Mobile Parameters Toolbar Trigger */}
          <div className="flex lg:hidden items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-slate-800">
            <span className="text-xs font-mono text-neutral-600 dark:text-slate-400 tabular-nums">
              {assumptions.wallAreaM2} m² · {fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh · {assumptions.analysisHorizonYrs}y
            </span>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-200 whitespace-nowrap cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Parameters &amp; Filters
            </button>
          </div>

          {/* SECTION 1: BILINGUAL RESEARCH ABSTRACT */}
          <ResearchAbstract />

          {/* LIVE HEADLINE KPI STRIP (Reacts to Sidebar Economic Controls) */}
          <section aria-label="Live economic and thermal headline indicators" className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-neutral-500 dark:text-slate-400">
              <p>
                Live indicators vs.{' '}
                <strong className="font-semibold text-neutral-800 dark:text-slate-200">
                  {referenceCase.wallId}
                </strong>{' '}
                ({fmtNum(referenceCase.coolingEnergyKwhYr, 0)} kWh/yr) · {paretoCount} of{' '}
                {pricedCases.length} priced alternatives on Pareto frontier
              </p>
              <span className="font-mono tabular-nums">
                A = {fmtNum(assumptions.wallAreaM2, Number.isInteger(assumptions.wallAreaM2) ? 0 : 2)} m² · T = {fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh · CoP {fmtNum(assumptions.coolingCop, 2)} · r = {fmtNum(assumptions.discountRatePct, 1)}% · g = {fmtNum(assumptions.energyEscalationPct, 1)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCaseId(bestNpvCase.caseId)}
                className="p-5 text-left hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <p className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                  Economic Optimum (Max NPV)
                </p>
                <p
                  className={`font-mono text-2xl sm:text-[26px] font-semibold tabular-nums mt-2 tracking-tight ${
                    bestNpvCase.npvEgp !== null && bestNpvCase.npvEgp >= 0
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}
                >
                  {fmtSignedEgp(bestNpvCase.npvEgp)}
                </p>
                <p className="text-xs text-neutral-700 dark:text-slate-300 mt-1.5 font-medium">
                  {bestNpvCase.wallId}{' '}
                  <span className="text-neutral-400" aria-hidden="true">·</span>{' '}
                  <span className="font-mono tabular-nums text-neutral-500 dark:text-slate-400">
                    BCR {bestNpvCase.bcr !== null ? fmtNum(bestNpvCase.bcr, 2) : '—'}
                  </span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCaseId(fastestPaybackCase.caseId)}
                className="p-5 text-left hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <p className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                  Fastest Simple Payback (SPP)
                </p>
                <p className="font-mono text-2xl sm:text-[26px] font-semibold tabular-nums text-neutral-950 dark:text-white mt-2 tracking-tight">
                  {fastestPaybackCase.simplePaybackYrs !== null
                    ? `${fmtNum(fastestPaybackCase.simplePaybackYrs, 1)} yrs`
                    : '—'}
                </p>
                <p className="text-xs text-neutral-700 dark:text-slate-300 mt-1.5 font-medium">
                  {fastestPaybackCase.wallId}{' '}
                  <span className="text-neutral-400" aria-hidden="true">·</span>{' '}
                  <span className="font-mono tabular-nums text-neutral-500 dark:text-slate-400">
                    C₀ {fmtEgp(fastestPaybackCase.totalCapexEgp)}
                  </span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCaseId(peakCoolingCase.caseId)}
                className="p-5 text-left hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <p className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                  Thermal Optimum (Peak Cooling)
                </p>
                <p className="font-mono text-2xl sm:text-[26px] font-semibold tabular-nums text-neutral-950 dark:text-white mt-2 tracking-tight">
                  −{fmtNum(peakCoolingCase.coolingSavedKwhYr, 0)}
                  <span className="text-sm font-normal text-neutral-500 ml-1">kWh/yr</span>
                </p>
                <p className="text-xs text-neutral-700 dark:text-slate-300 mt-1.5 font-medium">
                  {peakCoolingCase.wallId}{' '}
                  <span className="text-neutral-400" aria-hidden="true">·</span>{' '}
                  <span className="font-mono tabular-nums text-neutral-500 dark:text-slate-400">
                    −{fmtNum(peakCoolingCase.coolingSavedPct, 1)}% · BCR{' '}
                    {peakCoolingCase.bcr !== null ? fmtNum(peakCoolingCase.bcr, 2) : '—'}
                  </span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCaseId(maxComfortCase.caseId)}
                className="p-5 text-left hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <p className="text-xs font-medium text-neutral-500 dark:text-slate-400">
                  Max Discomfort Avoided
                </p>
                <p className="font-mono text-2xl sm:text-[26px] font-semibold tabular-nums text-neutral-950 dark:text-white mt-2 tracking-tight">
                  −{fmtNum(maxComfortCase.discomfortSavedHrsYr, 0)}
                  <span className="text-sm font-normal text-neutral-500 ml-1">hrs/yr</span>
                </p>
                <p className="text-xs text-neutral-700 dark:text-slate-300 mt-1.5 font-medium">
                  {maxComfortCase.wallId}{' '}
                  <span className="text-neutral-400" aria-hidden="true">·</span>{' '}
                  <span className="font-mono tabular-nums text-neutral-500 dark:text-slate-400">
                    −{fmtNum(maxComfortCase.discomfortSavedPct, 1)}% vs ref
                  </span>
                </p>
              </button>
            </div>
          </section>

          {/* SECTION 2: ILLUSTRATED RESEARCH METHODOLOGY (FIGURES 1, 2, 3 & TABLES 2, 4, 5) */}
          <ResearchMethodology
            assumptions={assumptions}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            isDark={isDark}
          />

          {/* SECTION 3: INTERACTIVE WALL ASSEMBLY INSPECTOR */}
          <WallInspector
            allCases={computedCases}
            selectedCase={selectedCase}
            compareCase={compareCase}
            onSelectCase={setSelectedCaseId}
            onSelectCompare={setCompareCaseId}
            assumptions={assumptions}
            isDark={isDark}
          />

          {/* SECTION 2: PARETO FRONTIER & DIMINISHING RETURNS */}
          <section id="pareto" className="space-y-6 scroll-mt-20">
            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-stretch">
              <div className="2xl:col-span-7">
                <ParetoScatterChart
                  allCases={computedCases}
                  filteredCases={filteredCases}
                  assumptions={assumptions}
                  selectedCaseId={selectedCaseId}
                  onSelectCase={setSelectedCaseId}
                  isDark={isDark}
                />
              </div>
              <div className="2xl:col-span-5 flex">
                <div className="w-full flex flex-col">
                  <ThicknessCurvesChart
                    allCases={computedCases}
                    assumptions={assumptions}
                    selectedCaseId={selectedCaseId}
                    onSelectCase={setSelectedCaseId}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: LIFECYCLE CASH FLOW & COST/COMFORT STRUCTURE */}
          <section id="lifecycle" className="space-y-6 scroll-mt-20">
            <CashFlowChart
              allCases={computedCases}
              assumptions={assumptions}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              isDark={isDark}
            />

            <CostAndComfortBreakdown
              allCases={computedCases}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              isDark={isDark}
            />
          </section>

          {/* SECTION 4: TARIFF SENSITIVITY MATRIX */}
          <section id="sensitivity" className="scroll-mt-20">
            <SensitivityHeatmap
              rawRows={rawRows}
              assumptions={assumptions}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              isDark={isDark}
            />
          </section>

          {/* SECTION 5: MASTER PARAMETRIC LEDGER */}
          <ParametricTable
            cases={filteredCases}
            totalCount={computedCases.length}
            assumptions={assumptions}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            searchQuery={filters.searchQuery}
            onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
            onResetFilters={resetFilters}
            isDark={isDark}
          />

          {/* Methodology & Source Audit Footer */}
          <footer className="border-t border-neutral-200 dark:border-slate-800 pt-6 pb-8 text-xs text-neutral-500 dark:text-slate-400">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-neutral-800 dark:text-slate-200 mb-1.5">
                  Economic Formulation (Eq. 1–3)
                </h4>
                <p className="leading-relaxed">
                  <span className="font-mono">C₀ = (ΔCₘ + Cᵢ) × A</span> using Cairo BOQ cavity premium (139.43 EGP/m²) and Table 4 insulation + 25 EGP/m² labor. Year-1 saving{' '}
                  <span className="font-mono">S₁ = ΔE × (1/CoP) × T</span> is discounted over N years to derive NPV, BCR, SPP, and DPP.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 dark:text-slate-200 mb-1.5">
                  Data Audit &amp; Completeness
                </h4>
                <p className="leading-relaxed">
                  All thermal loads, U-values, discomfort hours, and material rates are drawn from the verified 14-case Cairo parametric dataset. <span className="font-mono">Solar_Gains_kWh_yr</span> is explicitly absent across all 14 rows in the source dataset and noted transparently.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800 dark:text-slate-200 mb-1.5">
                  Manuscript Provenance
                </h4>
                <p className="leading-relaxed">
                  Thermal and Economic Evaluation of External Wall Assemblies for Residential Building Envelopes Under Hot-Arid Conditions: A Case Study from Cairo, Egypt (JES Part E: Architectural Engineering). DesignBuilder v7.3 / EnergyPlus v23.1.0, Cairo Airport TMY.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
