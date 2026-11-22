import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import {
  fmtEgp,
  fmtNum,
  fmtSignedEgp,
} from '../data/dataset';
import {
  ComputedEnvelopeCase,
  EconomicAssumptions,
  EconomicTier,
} from '../types/envelope';
import { MaterialLegendSwatch } from './MaterialMarker';

interface ParametricTableProps {
  cases: ComputedEnvelopeCase[];
  totalCount: number;
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  isDark: boolean;
}

type SortKey =
  | 'caseId'
  | 'thicknessCm'
  | 'uValue'
  | 'coolingEnergyKwhYr'
  | 'coolingSavedKwhYr'
  | 'thermalDiscomfortHours'
  | 'totalUnitCostEgpM2'
  | 'totalCapexEgp'
  | 'simplePaybackYrs'
  | 'bcr'
  | 'npvEgp';

export const ParametricTable: React.FC<ParametricTableProps> = ({
  cases,
  totalCount,
  assumptions,
  selectedCaseId,
  onSelectCase,
  searchQuery,
  onSearchChange,
  onResetFilters,
  isDark,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('npvEgp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(
        key === 'caseId' ||
          key === 'uValue' ||
          key === 'coolingEnergyKwhYr' ||
          key === 'simplePaybackYrs' ||
          key === 'totalUnitCostEgpM2' ||
          key === 'totalCapexEgp'
          ? 'asc'
          : 'desc'
      );
    }
  };

  const sorted = useMemo(() => {
    return [...cases].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      // Push null values to bottom regardless of direction
      if (av === null && bv === null) return a.caseId.localeCompare(b.caseId);
      if (av === null) return 1;
      if (bv === null) return -1;

      if (typeof av === 'string' && typeof bv === 'string') {
        const cmp = av.localeCompare(bv);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      const cmp = Number(av) - Number(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [cases, sortKey, sortDir]);

  const maxCoolingSaved = useMemo(
    () => Math.max(1, ...cases.map((c) => Math.max(0, c.coolingSavedKwhYr))),
    [cases]
  );

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 opacity-45 shrink-0" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 shrink-0" />
    ) : (
      <ArrowDown className="w-3 h-3 shrink-0" />
    );
  };

  return (
    <section
      id="ledger"
      aria-label="Master parametric envelope dataset ledger"
      className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
            Master Parametric Envelope Ledger
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
            Showing {cases.length} of {totalCount} assemblies · Ref: {assumptions.baselineReferenceId} · A: {fmtNum(assumptions.wallAreaM2, Number.isInteger(assumptions.wallAreaM2) ? 0 : 2)} m² · T: {fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh · CoP: {fmtNum(assumptions.coolingCop, 2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Wall ID or material…"
              aria-label="Search Wall ID or material"
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 w-52 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
            />
          </div>

        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-neutral-800 dark:text-slate-200">
            No envelope cases match your current search and sidebar filters.
          </p>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
            Clear the search query or re-enable materials and thicknesses to inspect all 14 configurations.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-y border-neutral-300 dark:border-slate-700 bg-[#F7F7F5] dark:bg-[#0F1419] text-neutral-600 dark:text-slate-400">
                <th className="py-2.5 px-2.5 text-left font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('caseId')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                  >
                    Wall ID {renderSortIcon('caseId')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('thicknessCm')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    Thick. {renderSortIcon('thicknessCm')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('uValue')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    U-Value {renderSortIcon('uValue')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('coolingEnergyKwhYr')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    Cooling {renderSortIcon('coolingEnergyKwhYr')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('coolingSavedKwhYr')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    Saved / yr {renderSortIcon('coolingSavedKwhYr')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('thermalDiscomfortHours')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    Discomfort {renderSortIcon('thermalDiscomfortHours')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('totalUnitCostEgpM2')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    EGP/m² {renderSortIcon('totalUnitCostEgpM2')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('totalCapexEgp')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    CAPEX {renderSortIcon('totalCapexEgp')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('simplePaybackYrs')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    SPP {renderSortIcon('simplePaybackYrs')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('bcr')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    BCR {renderSortIcon('bcr')}
                  </button>
                </th>
                <th className="py-2.5 px-2 text-right font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('npvEgp')}
                    className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white cursor-pointer ml-auto"
                  >
                    NPV ({assumptions.analysisHorizonYrs}y) {renderSortIcon('npvEgp')}
                  </button>
                </th>
                <th className="py-2.5 px-2.5 text-left font-medium whitespace-nowrap">
                  Tier
                </th>
                <th className="py-2.5 px-2.5 text-left font-medium whitespace-nowrap">
                  Frontier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-slate-800 font-mono tabular-nums">
              {sorted.map((c) => {
                const isSelected = c.caseId === selectedCaseId;
                const barPct =
                  c.coolingSavedKwhYr > 0
                    ? Math.min(100, (c.coolingSavedKwhYr / maxCoolingSaved) * 100)
                    : 0;

                return (
                  <tr
                    key={c.caseId}
                    onClick={() => onSelectCase(c.caseId)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/35'
                        : 'hover:bg-neutral-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-2.5 font-sans font-medium text-neutral-900 dark:text-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MaterialLegendSwatch family={c.materialFamily} isDark={isDark} />
                        <span>{c.wallId}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-600 dark:text-slate-400 whitespace-nowrap">
                      {c.thicknessCm > 0 ? `${fmtNum(c.thicknessCm, 0)} cm` : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-800 dark:text-slate-200 whitespace-nowrap">
                      {fmtNum(c.uValue, 3)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-800 dark:text-slate-200 whitespace-nowrap">
                      {fmtNum(c.coolingEnergyKwhYr, 1)}
                    </td>
                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <span className="w-10 h-1.5 bg-neutral-200 dark:bg-slate-700 overflow-hidden inline-block">
                          <span
                            className="block h-full bg-blue-700 dark:bg-blue-400"
                            style={{ width: `${barPct}%` }}
                          />
                        </span>
                        <span
                          className={
                            c.coolingSavedKwhYr > 0
                              ? 'text-neutral-900 dark:text-slate-100'
                              : 'text-neutral-400 dark:text-slate-500'
                          }
                        >
                          {c.coolingSavedKwhYr === 0
                            ? '0.0'
                            : `${c.coolingSavedKwhYr > 0 ? '+' : '−'}${fmtNum(
                                Math.abs(c.coolingSavedKwhYr),
                                1
                              )}`}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-700 dark:text-slate-300 whitespace-nowrap">
                      {fmtNum(c.thermalDiscomfortHours, 0)} h
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-700 dark:text-slate-300 whitespace-nowrap">
                      {c.totalUnitCostEgpM2 !== null ? fmtNum(c.totalUnitCostEgpM2, 0) : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-800 dark:text-slate-200 whitespace-nowrap">
                      {fmtEgp(c.totalCapexEgp)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-neutral-800 dark:text-slate-200 whitespace-nowrap">
                      {c.simplePaybackYrs !== null ? `${fmtNum(c.simplePaybackYrs, 1)} y` : '—'}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right whitespace-nowrap ${
                        c.bcr === null
                          ? 'text-neutral-400 dark:text-slate-500'
                          : c.bcr >= 1
                          ? 'text-neutral-900 dark:text-slate-100 font-medium'
                          : 'text-red-700 dark:text-red-400 font-medium'
                      }`}
                    >
                      {c.bcr !== null ? fmtNum(c.bcr, 2) : '—'}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right font-semibold whitespace-nowrap ${
                        c.npvEgp === null
                          ? 'text-neutral-400 dark:text-slate-500 font-normal'
                          : c.npvEgp >= 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}
                    >
                      {fmtSignedEgp(c.npvEgp)}
                    </td>
                    <td className="py-2.5 px-2.5 font-sans text-left whitespace-nowrap">
                      <span
                        className={
                          c.economicTier === EconomicTier.High
                            ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                            : c.economicTier === EconomicTier.Moderate
                            ? 'text-neutral-800 dark:text-slate-200'
                            : c.economicTier === EconomicTier.Marginal
                            ? 'text-amber-700 dark:text-amber-400'
                            : c.economicTier === EconomicTier.NonViable
                            ? 'font-medium text-red-700 dark:text-red-400'
                            : 'text-neutral-500 dark:text-slate-400'
                        }
                      >
                        {c.economicTier}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 font-sans text-left whitespace-nowrap">
                      {!c.isPricedAlternative ? (
                        <span className="text-neutral-500 dark:text-slate-400">Reference</span>
                      ) : c.isParetoCostCooling ? (
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          Pareto Optimal
                        </span>
                      ) : (
                        <span className="text-neutral-500 dark:text-slate-400">
                          Dominated ({c.dominatedByWallId?.replace(/^W\d+-/, '')})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
