import React, { useMemo, useState } from 'react';
import { fmtNum } from '../data/dataset';
import { ComputedEnvelopeCase } from '../types/envelope';
import { getMaterialColor } from './MaterialMarker';

interface CostAndComfortBreakdownProps {
  allCases: ComputedEnvelopeCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

export const CostAndComfortBreakdown: React.FC<CostAndComfortBreakdownProps> = ({
  allCases,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [comfortMetric, setComfortMetric] = useState<'cooling' | 'discomfort'>('cooling');

  const pricedSorted = useMemo(() => {
    return allCases
      .filter((c) => c.isPricedAlternative && c.totalUnitCostEgpM2 !== null)
      .sort((a, b) => (a.totalUnitCostEgpM2 ?? 0) - (b.totalUnitCostEgpM2 ?? 0));
  }, [allCases]);

  const maxUnitCost = useMemo(() => {
    const peak = Math.max(200, ...pricedSorted.map((c) => c.totalUnitCostEgpM2 ?? 0));
    return Math.ceil(peak / 50) * 50;
  }, [pricedSorted]);

  const sampleMasonryPremium = pricedSorted[0]?.masonryPremiumEgpM2 ?? 0;
  const sampleInstallCost =
    pricedSorted.find((c) => c.isInsulated)?.effectiveInstallCostEgpM2 ?? 25;

  // Compare all non-baseline cases relative to W01-Baseline so Air Cavity's passive benefit is clearly visible
  const baselineCase = useMemo(
    () => allCases.find((c) => c.caseId === 'Case-01') ?? allCases[0],
    [allCases]
  );

  const savingsRanked = useMemo(() => {
    return allCases
      .filter((c) => c.caseId !== baselineCase.caseId)
      .map((c) => ({
        c,
        coolingReduction: baselineCase.coolingEnergyKwhYr - c.coolingEnergyKwhYr,
        discomfortReduction: baselineCase.thermalDiscomfortHours - c.thermalDiscomfortHours,
      }))
      .sort((a, b) =>
        comfortMetric === 'cooling'
          ? b.coolingReduction - a.coolingReduction
          : b.discomfortReduction - a.discomfortReduction
      );
  }, [allCases, baselineCase, comfortMetric]);

  const maxSavingVal = useMemo(() => {
    return Math.max(
      1,
      ...savingsRanked.map((r) =>
        comfortMetric === 'cooling' ? r.coolingReduction : r.discomfortReduction
      )
    );
  }, [savingsRanked, comfortMetric]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
      {/* Left: Unit Cost Decomposition (Masonry Cavity Premium + Material + Installation) */}
      <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="pb-4 border-b border-neutral-200 dark:border-slate-800">
            <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
              Unit Cost Structure (Cairo BOQ + Insulation)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
              {sampleMasonryPremium > 0
                ? `Masonry cavity premium (${fmtNum(sampleMasonryPremium, 2)} EGP/m²) accounts for 100% of W02, 64% of W03-EPS2cm, and 23% of W11-PIR6cm investment.`
                : `Incremental insulation cost over existing W02 cavity wall (insulation material + ${fmtNum(sampleInstallCost, 0)} EGP/m² installation labor).`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3 text-xs text-neutral-600 dark:text-slate-400">
            {sampleMasonryPremium > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-slate-500 dark:bg-slate-400 inline-block" aria-hidden="true" />
                Cavity Masonry ΔCₘ ({fmtNum(sampleMasonryPremium, 1)})
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-700 dark:bg-blue-400 inline-block" aria-hidden="true" />
              Insulation Material
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 bg-neutral-300 dark:bg-slate-600 inline-block" aria-hidden="true" />
              Install ({fmtNum(sampleInstallCost, 0)} EGP/m²)
            </span>
          </div>

          <div className="space-y-2 mt-1">
            {pricedSorted.map((c) => {
              const masonryCost = c.masonryPremiumEgpM2;
              const matCost = c.insulationPriceEgpM2 ?? 0;
              const instCost = c.effectiveInstallCostEgpM2;
              const total = c.totalUnitCostEgpM2 ?? masonryCost + matCost + instCost;
              const masonryPct = (masonryCost / maxUnitCost) * 100;
              const matPct = (matCost / maxUnitCost) * 100;
              const instPct = (instCost / maxUnitCost) * 100;
              const color = getMaterialColor(c.materialFamily, isDark);
              const isSelected = c.caseId === selectedCaseId;

              return (
                <button
                  key={c.caseId}
                  type="button"
                  onClick={() => onSelectCase(c.caseId)}
                  className={`w-full text-left grid grid-cols-[130px_1fr_76px] items-center gap-3 py-1 px-1.5 rounded transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-neutral-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-xs font-medium text-neutral-800 dark:text-slate-200 truncate">
                    {c.wallId}
                  </span>
                  <div className="h-4.5 bg-neutral-100 dark:bg-slate-800/70 flex overflow-hidden">
                    {masonryCost > 0 && (
                      <div
                        style={{ width: `${masonryPct}%` }}
                        className="h-full bg-slate-500 dark:bg-slate-400"
                        title={`Masonry Cavity Premium ΔCm: ${fmtNum(masonryCost, 2)} EGP/m²`}
                      />
                    )}
                    {matCost > 0 && (
                      <div
                        style={{ width: `${matPct}%`, backgroundColor: color }}
                        className="h-full border-l border-white dark:border-[#161D24]"
                        title={`Insulation Material: ${fmtNum(matCost, 0)} EGP/m²`}
                      />
                    )}
                    {instCost > 0 && (
                      <div
                        style={{ width: `${instPct}%` }}
                        className="h-full bg-neutral-300 dark:bg-slate-600 border-l border-white dark:border-[#161D24]"
                        title={`Installation Labor: ${fmtNum(instCost, 0)} EGP/m²`}
                      />
                    )}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-right text-neutral-800 dark:text-slate-200">
                    {fmtNum(total, 0)} EGP
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800">
          Equation (1) unit cost composition: ΔCₘ (Table 5 Cairo BOQ) + Insulation Material + Installation Labor (Table 4) in EGP/m².
        </p>
      </div>

      {/* Right: Thermal Cooling vs Comfort Savings vs W01-Baseline */}
      <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-slate-800">
            <div>
              <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
                Thermal &amp; Comfort Gains vs. Baseline
              </h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
                Ranked savings relative to W01-Baseline (10,000 kWh/yr · 1,739 discomfort hrs/yr)
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md self-start">
              <button
                type="button"
                onClick={() => setComfortMetric('cooling')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  comfortMetric === 'cooling'
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                Cooling Saved
              </button>
              <button
                type="button"
                onClick={() => setComfortMetric('discomfort')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  comfortMetric === 'discomfort'
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                Discomfort Hrs
              </button>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {savingsRanked.map(({ c, coolingReduction, discomfortReduction }) => {
              const val = comfortMetric === 'cooling' ? coolingReduction : discomfortReduction;
              const pct = (val / maxSavingVal) * 100;
              const color = getMaterialColor(c.materialFamily, isDark);
              const isSelected = c.caseId === selectedCaseId;

              return (
                <button
                  key={c.caseId}
                  type="button"
                  onClick={() => onSelectCase(c.caseId)}
                  className={`w-full text-left grid grid-cols-[130px_1fr_86px] items-center gap-3 py-1 px-1.5 rounded transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-neutral-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-xs font-medium text-neutral-800 dark:text-slate-200 truncate">
                    {c.wallId}
                  </span>
                  <div className="h-4 bg-neutral-100 dark:bg-slate-800/70 overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      className="h-full transition-transform origin-left"
                    />
                  </div>
                  <span className="text-xs font-mono tabular-nums text-right text-neutral-800 dark:text-slate-200">
                    {comfortMetric === 'cooling'
                      ? `−${fmtNum(val, 0)} kWh`
                      : `−${fmtNum(val, 0)} hrs`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800">
          Notice W02-Double Air Cavity captures 62.5% of max cooling savings (918 kWh/yr) and 81.6% of max comfort gains (266 hrs/yr) without insulation material.
        </p>
      </div>
    </div>
  );
};
