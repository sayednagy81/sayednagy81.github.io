import React from 'react';
import {
  MATERIAL_SPECS,
  fmtEgp,
  fmtNum,
  fmtSignedEgp,
} from '../data/dataset';
import { ComputedEnvelopeCase, EconomicAssumptions, MaterialFamily } from '../types/envelope';
import { MaterialLegendSwatch, getMaterialColor } from './MaterialMarker';

interface WallInspectorProps {
  allCases: ComputedEnvelopeCase[];
  selectedCase: ComputedEnvelopeCase;
  compareCase: ComputedEnvelopeCase;
  onSelectCase: (caseId: string) => void;
  onSelectCompare: (caseId: string) => void;
  assumptions: EconomicAssumptions;
  isDark: boolean;
}

export const WallInspector: React.FC<WallInspectorProps> = ({
  allCases,
  selectedCase,
  compareCase,
  onSelectCase,
  onSelectCompare,
  assumptions,
  isDark,
}) => {
  const insColor = getMaterialColor(selectedCase.materialFamily, isDark);

  // Scaled insulation layer width in SVG cross-section (0 cm -> 0px, 6 cm -> 64px)
  const insWidth =
    selectedCase.materialFamily === MaterialFamily.AirCavity
      ? 34
      : selectedCase.thicknessCm > 0
      ? 16 + selectedCase.thicknessCm * 8
      : 0;

  // Heat flux arrow count & intensity proportional to U-value (2.402 down to 0.296)
  const fluxRatio = Math.min(1, Math.max(0.12, selectedCase.uValue / 2.402));

  // Deltas (Selected minus Compare)
  const deltaCooling = selectedCase.coolingEnergyKwhYr - compareCase.coolingEnergyKwhYr;
  const deltaDiscomfort =
    selectedCase.thermalDiscomfortHours - compareCase.thermalDiscomfortHours;
  const deltaCapex =
    selectedCase.totalCapexEgp !== null && compareCase.totalCapexEgp !== null
      ? selectedCase.totalCapexEgp - compareCase.totalCapexEgp
      : selectedCase.totalCapexEgp;
  const deltaNpv =
    selectedCase.npvEgp !== null && compareCase.npvEgp !== null
      ? selectedCase.npvEgp - compareCase.npvEgp
      : selectedCase.npvEgp;

  return (
    <section
      aria-label="Selected wall assembly inspector and comparator"
      className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
            Wall Assembly Inspector &amp; Comparison
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
            Inspect thermal cross-section, unit cost composition, and side-by-side deltas against any benchmark assembly
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-2">
            <span className="text-neutral-500 dark:text-slate-400 whitespace-nowrap">
              Inspect:
            </span>
            <select
              value={selectedCase.caseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-neutral-900 dark:text-slate-100 font-mono text-xs cursor-pointer"
            >
              {allCases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.wallId} ({fmtNum(c.uValue, 3)} W/m²K)
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-neutral-500 dark:text-slate-400 whitespace-nowrap">
              Compare to:
            </span>
            <select
              value={compareCase.caseId}
              onChange={(e) => onSelectCompare(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-neutral-900 dark:text-slate-100 font-mono text-xs cursor-pointer"
            >
              {allCases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.wallId}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-stretch">
        {/* Left: Architectural Section Schematic */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MaterialLegendSwatch family={selectedCase.materialFamily} isDark={isDark} />
              <span className="font-semibold text-sm text-neutral-900 dark:text-slate-100">
                {selectedCase.wallId}
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-500 dark:text-slate-400">
              {selectedCase.isPricedAlternative
                ? selectedCase.isParetoCostCooling
                  ? `Pareto Optimal · ${selectedCase.economicTier} Tier`
                  : `Dominated by ${selectedCase.dominatedByWallId} · ${selectedCase.economicTier}`
                : 'Reference Baseline'}
            </span>
          </div>

          <svg
            viewBox="0 0 380 185"
            className="w-full h-auto block bg-[#F7F7F5] dark:bg-[#0F1419] border border-neutral-200 dark:border-slate-800 rounded-md"
            role="img"
            aria-label={`Wall cross section schematic for ${selectedCase.wallId}`}
          >
            <defs>
              <pattern
                id="masonryHatch"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke={isDark ? '#334155' : '#CBD5E1'}
                  strokeWidth="1.5"
                />
              </pattern>
              <pattern
                id="insHatch"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke={insColor}
                  strokeWidth="1.5"
                  opacity="0.45"
                />
              </pattern>
            </defs>

            {/* Exterior Hot Arid Sun Side */}
            <text
              x="20"
              y="26"
              fill={isDark ? '#F59E0B' : '#B45309'}
              className="font-mono text-[10px] font-semibold"
            >
              EXTERIOR · SW 225°
            </text>
            <text
              x="20"
              y="40"
              fill={isDark ? '#94A3B8' : '#64748B'}
              className="font-mono text-[10px]"
            >
              Hot Arid Solar Load
            </text>

            {/* Interior Conditioned Side */}
            <text
              x="360"
              y="26"
              textAnchor="end"
              fill={isDark ? '#60A5FA' : '#1D4ED8'}
              className="font-mono text-[10px] font-semibold"
            >
              INTERIOR ZONE
            </text>
            <text
              x="360"
              y="40"
              textAnchor="end"
              fill={isDark ? '#94A3B8' : '#64748B'}
              className="font-mono text-[10px]"
            >
              {fmtNum(selectedCase.coolingEnergyKwhYr, 0)} kWh/yr
            </text>

            {/* Centered Wall Layers */}
            {(() => {
              const extPlasterW = 14;
              const masonryW =
                selectedCase.materialFamily === MaterialFamily.AirCavity ? 44 : 84;
              const masonry2W =
                selectedCase.materialFamily === MaterialFamily.AirCavity ? 44 : 0;
              const intPlasterW = 14;
              const totalW = extPlasterW + masonryW + insWidth + masonry2W + intPlasterW;
              const startX = (380 - totalW) / 2;
              const wallY = 56;
              const wallH = 92;

              const xExtPlaster = startX;
              const xMid1 = xExtPlaster + extPlasterW;
              const xIns =
                selectedCase.materialFamily === MaterialFamily.AirCavity
                  ? xMid1 + masonryW
                  : xMid1;
              const xMasonry =
                selectedCase.materialFamily === MaterialFamily.AirCavity
                  ? xMid1
                  : xIns + insWidth;
              const xMasonry2 = xIns + insWidth;
              const xIntPlaster =
                selectedCase.materialFamily === MaterialFamily.AirCavity
                  ? xMasonry2 + masonry2W
                  : xMasonry + masonryW;

              return (
                <g>
                  {/* Exterior plaster */}
                  <rect
                    x={xExtPlaster}
                    y={wallY}
                    width={extPlasterW}
                    height={wallH}
                    fill={isDark ? '#334155' : '#D6D3D1'}
                    stroke={isDark ? '#64748B' : '#78716C'}
                    strokeWidth="1"
                  />

                  {/* Masonry Layer 1 */}
                  <rect
                    x={xMasonry}
                    y={wallY}
                    width={masonryW}
                    height={wallH}
                    fill="url(#masonryHatch)"
                    stroke={isDark ? '#64748B' : '#64748B'}
                    strokeWidth="1"
                  />

                  {/* Insulation or Air Cavity Layer */}
                  {insWidth > 0 && (
                    <g>
                      <rect
                        x={xIns}
                        y={wallY}
                        width={insWidth}
                        height={wallH}
                        fill={
                          selectedCase.materialFamily === MaterialFamily.AirCavity
                            ? isDark
                              ? '#1E293B'
                              : '#FFFFFF'
                            : 'url(#insHatch)'
                        }
                        stroke={insColor}
                        strokeWidth="1.5"
                        strokeDasharray={
                          selectedCase.materialFamily === MaterialFamily.AirCavity
                            ? '3 2'
                            : undefined
                        }
                      />
                      <text
                        x={xIns + insWidth / 2}
                        y={wallY + wallH + 18}
                        textAnchor="middle"
                        fill={insColor}
                        className="font-mono text-[10px] font-semibold"
                      >
                        {selectedCase.materialFamily === MaterialFamily.AirCavity
                          ? 'Air Cavity'
                          : `${MATERIAL_SPECS[selectedCase.materialFamily].shortLabel} ${fmtNum(
                              selectedCase.thicknessCm,
                              0
                            )}cm`}
                      </text>
                    </g>
                  )}

                  {/* Second Masonry Leaf for Double Cavity */}
                  {masonry2W > 0 && (
                    <rect
                      x={xMasonry2}
                      y={wallY}
                      width={masonry2W}
                      height={wallH}
                      fill="url(#masonryHatch)"
                      stroke={isDark ? '#64748B' : '#64748B'}
                      strokeWidth="1"
                    />
                  )}

                  {/* Interior plaster */}
                  <rect
                    x={xIntPlaster}
                    y={wallY}
                    width={intPlasterW}
                    height={wallH}
                    fill={isDark ? '#334155' : '#E7E5E4'}
                    stroke={isDark ? '#64748B' : '#78716C'}
                    strokeWidth="1"
                  />

                  {/* Incoming Exterior Heat Arrows */}
                  {[76, 102, 128].map((ay) => (
                    <g key={`ext-${ay}`}>
                      <line
                        x1="28"
                        x2={startX - 10}
                        y1={ay}
                        y2={ay}
                        stroke={isDark ? '#F59E0B' : '#D97706'}
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${startX - 10},${ay - 4} ${startX - 3},${ay} ${startX - 10},${ay + 4}`}
                        fill={isDark ? '#F59E0B' : '#D97706'}
                      />
                    </g>
                  ))}

                  {/* Transmitted Interior Heat Flux Arrows scaled by U-value */}
                  {[76, 102, 128].map((ay) => {
                    const arrowLen = 16 + fluxRatio * 52;
                    const xStart = xIntPlaster + intPlasterW + 8;
                    const xEnd = xStart + arrowLen;
                    return (
                      <g key={`int-${ay}`} opacity={0.35 + fluxRatio * 0.65}>
                        <line
                          x1={xStart}
                          x2={xEnd}
                          y1={ay}
                          y2={ay}
                          stroke={isDark ? '#F87171' : '#DC2626'}
                          strokeWidth={1.2 + fluxRatio * 1.4}
                        />
                        <polygon
                          points={`${xEnd},${ay - 3.5} ${xEnd + 6},${ay} ${xEnd},${ay + 3.5}`}
                          fill={isDark ? '#F87171' : '#DC2626'}
                        />
                      </g>
                    );
                  })}

                  {/* U-Value label below masonry if Baseline */}
                  {insWidth === 0 && (
                    <text
                      x="190"
                      y={wallY + wallH + 18}
                      textAnchor="middle"
                      fill={isDark ? '#94A3B8' : '#475569'}
                      className="font-mono text-[10px]"
                    >
                      Uninsulated Conventional Masonry
                    </text>
                  )}
                </g>
              );
            })()}
          </svg>

          <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            {MATERIAL_SPECS[selectedCase.materialFamily].thermalConductivityNote}. Glazing fixed at{' '}
            {selectedCase.glazing}.
          </p>
        </div>

        {/* Right: Structured Thermal & Economic Telemetry Comparison Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 content-center border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">U-Value</p>
            <p className="font-mono text-xl font-semibold tabular-nums text-neutral-900 dark:text-slate-100 mt-1">
              {fmtNum(selectedCase.uValue, 3)}
              <span className="text-xs font-normal text-neutral-500 ml-1">W/m²K</span>
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.uValueReductionPct > 0
                ? `−${fmtNum(selectedCase.uValueReductionPct, 1)}% vs ref`
                : 'Reference value'}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">Incremental CAPEX (C₀)</p>
            <p className="font-mono text-xl font-semibold tabular-nums text-neutral-900 dark:text-slate-100 mt-1">
              {selectedCase.totalCapexEgp !== null
                ? fmtNum(selectedCase.totalCapexEgp, 0)
                : '—'}
              {selectedCase.totalCapexEgp !== null && (
                <span className="text-xs font-normal text-neutral-500 ml-1">EGP</span>
              )}
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.totalUnitCostEgpM2 !== null
                ? `ΔCm ${fmtNum(selectedCase.masonryPremiumEgpM2, 1)} + Ins. ${fmtNum(
                    (selectedCase.insulationPriceEgpM2 ?? 0) + selectedCase.effectiveInstallCostEgpM2,
                    0
                  )} EGP/m²`
                : 'Reference wall'}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Lifecycle NPV ({assumptions.analysisHorizonYrs}y)
            </p>
            <p
              className={`font-mono text-xl font-semibold tabular-nums mt-1 ${
                selectedCase.npvEgp === null
                  ? 'text-neutral-900 dark:text-slate-100'
                  : selectedCase.npvEgp >= 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {selectedCase.npvEgp !== null ? fmtSignedEgp(selectedCase.npvEgp) : '—'}
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.isPricedAlternative
                ? `Tier: ${selectedCase.economicTier}${
                    selectedCase.npvShareOfBestPct !== null
                      ? ` (${fmtNum(selectedCase.npvShareOfBestPct, 0)}% of best)`
                      : ''
                  }`
                : 'Reference baseline'}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Benefit–Cost Ratio (BCR)
            </p>
            <p
              className={`font-mono text-xl font-semibold tabular-nums mt-1 ${
                selectedCase.bcr === null
                  ? 'text-neutral-900 dark:text-slate-100'
                  : selectedCase.bcr >= 1
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {selectedCase.bcr !== null ? fmtNum(selectedCase.bcr, 2) : '—'}
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.savingsTolerancePct !== null
                ? `Tolerance: ${fmtNum(selectedCase.savingsTolerancePct, 0)}% drop`
                : selectedCase.bcr !== null
                ? 'Below 1.00 viability'
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">Simple Payback (SPP)</p>
            <p className="font-mono text-xl font-semibold tabular-nums text-neutral-900 dark:text-slate-100 mt-1">
              {selectedCase.simplePaybackYrs !== null
                ? `${fmtNum(selectedCase.simplePaybackYrs, 1)} yrs`
                : '—'}
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.discountedPaybackYrs !== null
                ? `DPP: ${fmtNum(selectedCase.discountedPaybackYrs, 1)} yrs`
                : selectedCase.isPricedAlternative
                ? `Exceeds ${assumptions.analysisHorizonYrs}y horizon`
                : '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Discomfort Hours
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums text-neutral-900 dark:text-slate-100 mt-1">
              {fmtNum(selectedCase.thermalDiscomfortHours, 0)}
              <span className="text-xs font-normal text-neutral-500 ml-1">hrs/yr</span>
            </p>
            <p className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-slate-400 mt-0.5">
              {selectedCase.discomfortSavedHrsYr > 0
                ? `−${fmtNum(selectedCase.discomfortSavedHrsYr, 0)} hrs (−${fmtNum(
                    selectedCase.discomfortSavedPct,
                    1
                  )}%)`
                : 'Reference baseline'}
            </p>
          </div>

          {/* Head-to-head Delta Strip */}
          <div className="col-span-2 sm:col-span-3 pt-3 mt-1 border-t border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-neutral-500 dark:text-slate-400">
              Delta vs <strong className="text-neutral-800 dark:text-slate-200">{compareCase.wallId}</strong>:
            </span>
            <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
              <span
                className={
                  deltaCooling < 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : deltaCooling > 0
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-neutral-500'
                }
              >
                {deltaCooling <= 0 ? '−' : '+'}
                {fmtNum(Math.abs(deltaCooling), 0)} kWh/yr
              </span>
              <span
                className={
                  deltaDiscomfort < 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : deltaDiscomfort > 0
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-neutral-500'
                }
              >
                {deltaDiscomfort <= 0 ? '−' : '+'}
                {fmtNum(Math.abs(deltaDiscomfort), 0)} discomfort hrs
              </span>
              <span className="text-neutral-700 dark:text-slate-300">
                C₀ Δ: {deltaCapex !== null ? fmtSignedEgp(deltaCapex) : '—'}
              </span>
              <span
                className={
                  deltaNpv !== null && deltaNpv >= 0
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : deltaNpv !== null
                    ? 'text-red-700 dark:text-red-400 font-semibold'
                    : 'text-neutral-500'
                }
              >
                NPV Δ: {deltaNpv !== null ? fmtSignedEgp(deltaNpv) : '—'}
              </span>
              {selectedCase.bcr !== null && compareCase.bcr !== null && (
                <span
                  className={
                    selectedCase.bcr - compareCase.bcr >= 0
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-700 dark:text-red-400'
                  }
                >
                  BCR Δ: {selectedCase.bcr - compareCase.bcr >= 0 ? '+' : '−'}
                  {fmtNum(Math.abs(selectedCase.bcr - compareCase.bcr), 2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
