import React, { useMemo, useState } from 'react';
import {
  computeEnvelopeEconomics,
  fmtNum,
  fmtSignedEgp,
} from '../data/dataset';
import {
  ComputedEnvelopeCase,
  EconomicAssumptions,
  RawEnvelopeRow,
} from '../types/envelope';
import { MaterialLegendSwatch } from './MaterialMarker';

interface SensitivityHeatmapProps {
  rawRows: RawEnvelopeRow[];
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

type MatrixMetric = 'payback' | 'npv' | 'bcr';

const TARIFF_STEPS = [1.5, 1.95, 2.18, 2.5, 3.0, 3.75, 4.5];

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({
  rawRows,
  assumptions,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [metric, setMetric] = useState<MatrixMetric>('bcr');
  const [maxPaybackHighlight, setMaxPaybackHighlight] = useState<number>(15);

  const matrixByTariff = useMemo(() => {
    return TARIFF_STEPS.map((tariff) => {
      const computed = computeEnvelopeEconomics(rawRows, {
        ...assumptions,
        electricityTariffEgp: tariff,
      });
      return {
        tariff,
        byCaseId: new Map(computed.map((c) => [c.caseId, c])),
      };
    });
  }, [rawRows, assumptions]);

  const pricedRows = useMemo(() => {
    const base = computeEnvelopeEconomics(rawRows, assumptions);
    return base.filter((c) => c.isPricedAlternative);
  }, [rawRows, assumptions]);

  const getCellStyle = (c: ComputedEnvelopeCase | undefined) => {
    if (!c) return { bg: '', text: '' };

    if (metric === 'payback') {
      const pb = c.simplePaybackYrs;
      if (pb === null) return { bg: 'bg-neutral-100 dark:bg-slate-800', text: 'text-neutral-500' };
      const dim = pb > maxPaybackHighlight;
      if (pb <= 10) {
        return {
          bg: dim
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
            : 'bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white',
          text: dim ? 'text-neutral-400 dark:text-slate-600' : 'text-white font-semibold',
        };
      }
      if (pb <= 15) {
        return {
          bg: dim
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
            : 'bg-emerald-100 dark:bg-emerald-900/50',
          text: dim
            ? 'text-neutral-400 dark:text-slate-600'
            : 'text-emerald-950 dark:text-emerald-100 font-medium',
        };
      }
      if (pb <= 22) {
        return {
          bg: dim
            ? 'bg-amber-50/30 dark:bg-amber-950/15'
            : 'bg-amber-100 dark:bg-amber-900/40',
          text: dim
            ? 'text-neutral-400 dark:text-slate-600'
            : 'text-amber-950 dark:text-amber-100',
        };
      }
      return {
        bg: dim
          ? 'bg-neutral-50 dark:bg-slate-900/50'
          : 'bg-red-100 dark:bg-red-950/60',
        text: dim
          ? 'text-neutral-400 dark:text-slate-600'
          : 'text-red-900 dark:text-red-200',
      };
    }

    if (metric === 'bcr') {
      const bcr = c.bcr;
      if (bcr === null) return { bg: 'bg-neutral-100 dark:bg-slate-800', text: 'text-neutral-500' };
      if (bcr >= 2.0) {
        return {
          bg: 'bg-emerald-700 dark:bg-emerald-600',
          text: 'text-white font-semibold',
        };
      }
      if (bcr >= 1.35) {
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/50',
          text: 'text-emerald-950 dark:text-emerald-100 font-medium',
        };
      }
      if (bcr >= 1.0) {
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/40',
          text: 'text-amber-950 dark:text-amber-100',
        };
      }
      return {
        bg: 'bg-red-100 dark:bg-red-950/60',
        text: 'text-red-900 dark:text-red-200',
      };
    }

    const npv = c.npvEgp;
    if (npv === null) return { bg: 'bg-neutral-100 dark:bg-slate-800', text: 'text-neutral-500' };
    if (npv >= 20000) {
      return {
        bg: 'bg-emerald-700 dark:bg-emerald-600',
        text: 'text-white font-semibold',
      };
    }
    if (npv >= 8000) {
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-900/50',
        text: 'text-emerald-950 dark:text-emerald-100 font-medium',
      };
    }
    if (npv >= 0) {
      return {
        bg: 'bg-amber-100 dark:bg-amber-900/40',
        text: 'text-amber-950 dark:text-amber-100',
      };
    }
    return {
      bg: 'bg-red-100 dark:bg-red-950/60',
      text: 'text-red-900 dark:text-red-200',
    };
  };

  return (
    <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
            Electricity Tariff Sensitivity Matrix
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1 max-w-2xl">
            Evaluates all {pricedRows.length} priced wall alternatives across 7 Egyptian tariff regimes (including pre-revision 1.95, August 2026 base 2.18, and 2.50 EGP/kWh cavity-insulation breakeven) at {fmtNum(assumptions.wallAreaM2, Number.isInteger(assumptions.wallAreaM2) ? 0 : 2)} m² and CoP {fmtNum(assumptions.coolingCop, 2)}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {metric === 'payback' && (
            <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-slate-400">
              <span className="whitespace-nowrap">
                Highlight ≤ <strong className="font-mono text-neutral-900 dark:text-slate-100">{maxPaybackHighlight} yrs</strong>
              </span>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={maxPaybackHighlight}
                onChange={(e) => setMaxPaybackHighlight(Number(e.target.value))}
                className="w-24 accent-blue-700 dark:accent-blue-400 cursor-pointer"
              />
            </label>
          )}

          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md">
            {(
              [
                { k: 'bcr', l: 'BCR' },
                { k: 'npv', l: 'Lifecycle NPV' },
                { k: 'payback', l: 'Simple Payback' },
              ] as { k: MatrixMetric; l: string }[]
            ).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setMetric(opt.k)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  metric === opt.k
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-300 dark:border-slate-700 text-neutral-600 dark:text-slate-400">
              <th className="py-2.5 pr-3 text-left font-medium sticky left-0 bg-white dark:bg-[#161D24] z-10 min-w-[162px]">
                Wall Assembly
              </th>
              <th className="py-2.5 px-2 text-right font-mono font-medium whitespace-nowrap">
                Unit Cost
              </th>
              {TARIFF_STEPS.map((tariff) => {
                const isNearActive =
                  Math.abs(tariff - assumptions.electricityTariffEgp) <= 0.12;
                return (
                  <th
                    key={tariff}
                    className={`py-2.5 px-2 text-right font-mono font-medium whitespace-nowrap ${
                      isNearActive
                        ? 'text-blue-700 dark:text-blue-400 underline underline-offset-4'
                        : ''
                    }`}
                  >
                    {fmtNum(tariff, 2)} EGP
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-slate-800 font-mono tabular-nums">
            {pricedRows.map((row) => {
              const isSelected = row.caseId === selectedCaseId;
              return (
                <tr
                  key={row.caseId}
                  onClick={() => onSelectCase(row.caseId)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/30'
                      : 'hover:bg-neutral-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2 pr-3 font-sans font-medium text-neutral-900 dark:text-slate-100 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <MaterialLegendSwatch family={row.materialFamily} isDark={isDark} />
                      <span className="truncate">{row.wallId}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right text-neutral-600 dark:text-slate-400 whitespace-nowrap">
                    {fmtNum(row.totalUnitCostEgpM2, 0)}/m²
                  </td>
                  {matrixByTariff.map(({ tariff, byCaseId }) => {
                    const cell = byCaseId.get(row.caseId);
                    const { bg, text } = getCellStyle(cell);
                    const display =
                      metric === 'payback'
                        ? cell?.simplePaybackYrs !== null && cell?.simplePaybackYrs !== undefined
                          ? `${fmtNum(cell.simplePaybackYrs, 1)}y`
                          : '—'
                        : metric === 'bcr'
                        ? cell?.bcr !== null && cell?.bcr !== undefined
                          ? fmtNum(cell.bcr, 2)
                          : '—'
                        : cell?.npvEgp !== null && cell?.npvEgp !== undefined
                        ? `${cell.npvEgp >= 0 ? '+' : '−'}${fmtNum(Math.abs(cell.npvEgp) / 1000, 1)}k`
                        : '—';

                    return (
                      <td
                        key={`${row.caseId}-${tariff}`}
                        className={`py-2 px-2 text-right border-l border-white dark:border-[#161D24] whitespace-nowrap ${bg} ${text}`}
                        title={
                          cell
                            ? `${row.wallId} @ ${fmtNum(tariff, 2)} EGP/kWh — BCR: ${fmtNum(
                                cell.bcr,
                                2
                              )} · SPP: ${fmtNum(cell.simplePaybackYrs, 1)} yrs · NPV: ${fmtSignedEgp(
                                cell.npvEgp
                              )}`
                            : ''
                        }
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explicit Non-Hue-Only Legend */}
      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          {metric === 'payback' ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-700 inline-block" aria-hidden="true" />
                ≤ 10 yrs (Fast)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 inline-block" aria-hidden="true" />
                10–15 yrs (Strong)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 inline-block" aria-hidden="true" />
                15–22 yrs (Moderate)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 inline-block" aria-hidden="true" />
                &gt; 22 yrs (Slow / Non-viable)
              </span>
            </>
          ) : metric === 'bcr' ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-700 inline-block" aria-hidden="true" />
                BCR ≥ 2.00 (High)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 inline-block" aria-hidden="true" />
                1.35–1.99 (Solid)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 inline-block" aria-hidden="true" />
                1.00–1.34 (Viable)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 inline-block" aria-hidden="true" />
                &lt; 1.00 (Non-viable)
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-700 inline-block" aria-hidden="true" />
                ≥ +20k EGP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 inline-block" aria-hidden="true" />
                +8k to +20k EGP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 inline-block" aria-hidden="true" />
                0 to +8k EGP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 inline-block" aria-hidden="true" />
                Negative NPV (&lt; 0)
              </span>
            </>
          )}
        </div>
        <span>Click any row to inspect wall cross-section.</span>
      </div>
    </div>
  );
};
