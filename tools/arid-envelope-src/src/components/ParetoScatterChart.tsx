import React, { useMemo, useState } from 'react';
import {
  ALL_FAMILIES,
  MATERIAL_SPECS,
  fmtEgp,
  fmtNum,
  fmtSignedEgp,
} from '../data/dataset';
import { ComputedEnvelopeCase, EconomicAssumptions } from '../types/envelope';
import { MaterialLegendSwatch, MaterialMarker } from './MaterialMarker';

interface ParetoScatterChartProps {
  allCases: ComputedEnvelopeCase[];
  filteredCases: ComputedEnvelopeCase[];
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

type XAxisKey = 'capex' | 'unitCost' | 'uValue';
type YAxisKey = 'npv' | 'bcr' | 'coolingSaved' | 'payback' | 'discomfortSaved';

const X_LABELS: Record<XAxisKey, string> = {
  capex: 'Incremental Investment C₀ (EGP)',
  unitCost: 'Unit Envelope Premium (EGP/m²)',
  uValue: 'Wall U-Value (W/m²·K)',
};

const Y_LABELS: Record<YAxisKey, string> = {
  npv: 'Lifecycle NPV (EGP)',
  bcr: 'Benefit–Cost Ratio (BCR)',
  coolingSaved: 'Annual Cooling Saved (kWh/yr)',
  payback: 'Simple Payback (Years)',
  discomfortSaved: 'Discomfort Avoided (hrs/yr)',
};

export const ParetoScatterChart: React.FC<ParetoScatterChartProps> = ({
  allCases,
  filteredCases,
  assumptions,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [xAxis, setXAxis] = useState<XAxisKey>('capex');
  const [yAxis, setYAxis] = useState<YAxisKey>('npv');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showFrontier, setShowFrontier] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);

  const filteredSet = useMemo(
    () => new Set(filteredCases.map((c) => c.caseId)),
    [filteredCases]
  );

  const getX = (c: ComputedEnvelopeCase): number | null => {
    if (xAxis === 'capex') return c.totalCapexEgp;
    if (xAxis === 'unitCost') return c.totalUnitCostEgpM2;
    return c.uValue;
  };

  const getY = (c: ComputedEnvelopeCase): number | null => {
    if (yAxis === 'npv') return c.npvEgp;
    if (yAxis === 'bcr') return c.bcr;
    if (yAxis === 'coolingSaved') return c.coolingSavedKwhYr;
    if (yAxis === 'payback') return c.simplePaybackYrs;
    return c.discomfortSavedHrsYr;
  };

  const plottable = useMemo(
    () => allCases.filter((c) => getX(c) !== null && getY(c) !== null),
    [allCases, xAxis, yAxis]
  );

  const activePlottable = useMemo(
    () => plottable.filter((c) => filteredSet.has(c.caseId)),
    [plottable, filteredSet]
  );

  // Dimensions
  const width = 760;
  const height = 400;
  const pad = { top: 28, right: 32, bottom: 54, left: 78 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    const source = plottable.length > 0 ? plottable : allCases;
    const xs = source.map((c) => getX(c) ?? 0);
    const ys = source.map((c) => getY(c) ?? 0);
    let minX = Math.min(...xs);
    let maxX = Math.max(...xs);
    let minY = Math.min(...ys);
    let maxY = Math.max(...ys);

    if (yAxis === 'npv') {
      minY = Math.min(minY, 0);
      maxY = Math.max(maxY, 0);
    } else if (yAxis === 'bcr') {
      minY = Math.min(minY, 0.5);
      maxY = Math.max(maxY, 1.1);
    } else if (yAxis === 'payback') {
      minY = 0;
    }

    const xPad = (maxX - minX || 1) * 0.1;
    const yPad = (maxY - minY || 1) * 0.12;

    return {
      xMin: Math.max(0, minX - xPad * (xAxis === 'uValue' ? 0.5 : 0.7)),
      xMax: maxX + xPad,
      yMin: yAxis === 'npv' ? minY - yPad : Math.max(0, minY - yPad * 0.5),
      yMax: maxY + yPad,
    };
  }, [plottable, allCases, xAxis, yAxis]);

  const scaleX = (v: number) =>
    pad.left + ((v - xMin) / (xMax - xMin || 1)) * plotW;
  const scaleY = (v: number) =>
    pad.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  // Build Pareto frontier polyline for insulated cases
  const frontierPoints = useMemo(() => {
    const pareto = plottable
      .filter((c) => c.isParetoCostCooling && filteredSet.has(c.caseId))
      .sort((a, b) => (getX(a) ?? 0) - (getX(b) ?? 0));
    return pareto;
  }, [plottable, filteredSet, xAxis, yAxis]);

  const xTicks = useMemo(() => {
    const count = 5;
    return Array.from({ length: count + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / count);
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const count = 5;
    return Array.from({ length: count + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / count);
  }, [yMin, yMax]);

  const hoveredCase = useMemo(
    () => plottable.find((c) => c.caseId === hoveredId) ?? null,
    [plottable, hoveredId]
  );

  const selectedCase = useMemo(
    () => plottable.find((c) => c.caseId === selectedCaseId) ?? null,
    [plottable, selectedCaseId]
  );

  const formatXTick = (v: number) => {
    if (xAxis === 'uValue') return fmtNum(v, 2);
    if (xAxis === 'capex') return v >= 1000 ? `${fmtNum(v / 1000, 1)}k` : fmtNum(v, 0);
    return fmtNum(v, 0);
  };

  const formatYTick = (v: number) => {
    if (yAxis === 'payback') return `${fmtNum(v, 1)}y`;
    if (yAxis === 'bcr') return fmtNum(v, 2);
    if (yAxis === 'npv') return Math.abs(v) >= 1000 ? `${fmtNum(v / 1000, 1)}k` : fmtNum(v, 0);
    return fmtNum(v, 0);
  };

  const gridStroke = isDark ? '#26303B' : '#E5E7EB';
  const axisText = isDark ? '#94A3B8' : '#4B5563';
  const zeroStroke = isDark ? '#64748B' : '#94A3B8';

  return (
    <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
            Cost–Performance Pareto Frontier
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1 max-w-2xl">
            Click any assembly point to inspect its cross-section and lifecycle economics. Dashed path connects Pareto-optimal envelopes where no cheaper wall saves more cooling energy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md">
            {(
              [
                { k: 'npv', l: 'NPV' },
                { k: 'bcr', l: 'BCR' },
                { k: 'coolingSaved', l: 'kWh Saved' },
                { k: 'payback', l: 'Payback' },
                { k: 'discomfortSaved', l: 'Comfort' },
              ] as { k: YAxisKey; l: string }[]
            ).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setYAxis(opt.k)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  yAxis === opt.k
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md">
            {(
              [
                { k: 'capex', l: 'vs CAPEX' },
                { k: 'unitCost', l: 'vs EGP/m²' },
                { k: 'uValue', l: 'vs U-Value' },
              ] as { k: XAxisKey; l: string }[]
            ).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setXAxis(opt.k)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  xAxis === opt.k
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

      {/* Legend & Frontier Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-neutral-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          {ALL_FAMILIES.filter((f) =>
            plottable.some((c) => c.materialFamily === f)
          ).map((family) => (
            <span key={family} className="inline-flex items-center gap-1.5">
              <MaterialLegendSwatch family={family} isDark={isDark} />
              <span>{MATERIAL_SPECS[family].shortLabel}</span>
            </span>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showFrontier}
            onChange={(e) => setShowFrontier(e.target.checked)}
            className="rounded border-neutral-300 accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
          <span>Show Pareto frontier</span>
        </label>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {activePlottable.length === 0 ? (
          <div className="h-[340px] flex flex-col items-center justify-center text-center border border-dashed border-neutral-300 dark:border-slate-700 rounded-md p-6">
            <p className="text-sm font-medium text-neutral-800 dark:text-slate-200">
              No wall assemblies match the active filters for this axis pairing.
            </p>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
              Re-enable wall families or thicknesses in the left sidebar to populate this axis pairing.
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block overflow-visible select-none"
            role="img"
            aria-label={`Scatter plot of ${Y_LABELS[yAxis]} against ${X_LABELS[xAxis]}`}
          >
            {/* Horizontal grid lines */}
            {yTicks.map((t, idx) => {
              const py = scaleY(t);
              return (
                <g key={`yt-${idx}`}>
                  <line
                    x1={pad.left}
                    x2={width - pad.right}
                    y1={py}
                    y2={py}
                    stroke={gridStroke}
                    strokeWidth={1}
                  />
                  <text
                    x={pad.left - 10}
                    y={py + 4}
                    textAnchor="end"
                    fill={axisText}
                    className="font-mono text-[11px] tabular-nums"
                  >
                    {formatYTick(t)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid lines */}
            {xTicks.map((t, idx) => {
              const px = scaleX(t);
              return (
                <g key={`xt-${idx}`}>
                  <line
                    x1={px}
                    x2={px}
                    y1={pad.top}
                    y2={height - pad.bottom}
                    stroke={gridStroke}
                    strokeWidth={1}
                  />
                  <text
                    x={px}
                    y={height - pad.bottom + 18}
                    textAnchor="middle"
                    fill={axisText}
                    className="font-mono text-[11px] tabular-nums"
                  >
                    {formatXTick(t)}
                  </text>
                </g>
              );
            })}

            {/* Zero breakeven line for NPV */}
            {yAxis === 'npv' && yMin < 0 && yMax > 0 && (
              <g>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={scaleY(0)}
                  y2={scaleY(0)}
                  stroke={zeroStroke}
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
                <text
                  x={width - pad.right - 4}
                  y={scaleY(0) - 6}
                  textAnchor="end"
                  fill={axisText}
                  className="font-mono text-[10px]"
                >
                  Breakeven (0 EGP NPV)
                </text>
              </g>
            )}

            {/* Viability threshold line for BCR = 1.0 */}
            {yAxis === 'bcr' && yMin < 1 && yMax > 1 && (
              <g>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={scaleY(1)}
                  y2={scaleY(1)}
                  stroke={zeroStroke}
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
                <text
                  x={width - pad.right - 4}
                  y={scaleY(1) - 6}
                  textAnchor="end"
                  fill={axisText}
                  className="font-mono text-[10px]"
                >
                  Viability Threshold (BCR = 1.00)
                </text>
              </g>
            )}

            {/* Horizon cap line for Payback */}
            {yAxis === 'payback' &&
              assumptions.analysisHorizonYrs >= yMin &&
              assumptions.analysisHorizonYrs <= yMax && (
                <g>
                  <line
                    x1={pad.left}
                    x2={width - pad.right}
                    y1={scaleY(assumptions.analysisHorizonYrs)}
                    y2={scaleY(assumptions.analysisHorizonYrs)}
                    stroke={isDark ? '#F87171' : '#DC2626'}
                    strokeWidth={1.25}
                    strokeDasharray="4 4"
                  />
                  <text
                    x={width - pad.right - 4}
                    y={scaleY(assumptions.analysisHorizonYrs) - 6}
                    textAnchor="end"
                    fill={isDark ? '#F87171' : '#DC2626'}
                    className="font-mono text-[10px]"
                  >
                    Horizon Limit ({assumptions.analysisHorizonYrs} yrs)
                  </text>
                </g>
              )}

            {/* Axes labels */}
            <text
              x={pad.left + plotW / 2}
              y={height - 10}
              textAnchor="middle"
              fill={axisText}
              className="text-xs font-medium"
            >
              {X_LABELS[xAxis]}
            </text>
            <text
              transform={`translate(18, ${pad.top + plotH / 2}) rotate(-90)`}
              textAnchor="middle"
              fill={axisText}
              className="text-xs font-medium"
            >
              {Y_LABELS[yAxis]}
            </text>

            {/* Pareto Frontier Polyline */}
            {showFrontier && frontierPoints.length >= 2 && (
              <polyline
                fill="none"
                stroke={isDark ? '#60A5FA' : '#1D4ED8'}
                strokeWidth={1.75}
                strokeDasharray="5 4"
                opacity={0.75}
                points={frontierPoints
                  .map((c) => `${scaleX(getX(c)!).toFixed(1)},${scaleY(getY(c)!).toFixed(1)}`)
                  .join(' ')}
              />
            )}

            {/* Data Points */}
            {plottable.map((c) => {
              const cx = scaleX(getX(c)!);
              const cy = scaleY(getY(c)!);
              const isIncluded = filteredSet.has(c.caseId);
              const isSelected = c.caseId === selectedCaseId;
              const isHovered = c.caseId === hoveredId;

              const showStaticLabel =
                isIncluded && (c.isParetoCostCooling || isSelected || isHovered || !c.isPricedAlternative);

              // Prevent right-edge clipping
              const nearRight = cx > width - pad.right - 90;
              const nearTop = cy < pad.top + 24;

              return (
                <g
                  key={c.caseId}
                  role="button"
                  tabIndex={isIncluded ? 0 : -1}
                  aria-label={`${c.wallId}, ${c.materialRaw}, ${fmtNum(c.thicknessCm, 0)} cm`}
                  className={isIncluded ? 'cursor-pointer focus:outline-none' : 'pointer-events-none'}
                  onClick={() => isIncluded && onSelectCase(c.caseId)}
                  onKeyDown={(e) => {
                    if (isIncluded && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectCase(c.caseId);
                    }
                  }}
                  onMouseEnter={() => isIncluded && setHoveredId(c.caseId)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => isIncluded && setHoveredId(c.caseId)}
                  onBlur={() => setHoveredId(null)}
                >
                  <circle cx={cx} cy={cy} r={14} fill="transparent" />
                  <MaterialMarker
                    family={c.materialFamily}
                    x={cx}
                    y={cy}
                    size={isSelected || isHovered ? 7.5 : 6}
                    isDark={isDark}
                    selected={isSelected}
                    dimmed={!isIncluded}
                  />
                  {showStaticLabel && (
                    <text
                      x={nearRight ? cx - 10 : cx + 10}
                      y={nearTop ? cy + 14 : cy - 8}
                      textAnchor={nearRight ? 'end' : 'start'}
                      fill={
                        isSelected || isHovered
                          ? isDark
                            ? '#F8FAFC'
                            : '#0F172A'
                          : axisText
                      }
                      className={`font-mono text-[10.5px] ${
                        isSelected || isHovered ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {c.wallId.replace(/^W\d+-/, '')}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Active Inspection Strip below chart */}
        {(hoveredCase || selectedCase) && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
            {(() => {
              const target = hoveredCase ?? selectedCase!;
              return (
                <>
                  <div className="flex items-center gap-2">
                    <MaterialLegendSwatch family={target.materialFamily} isDark={isDark} />
                    <span className="font-semibold text-neutral-900 dark:text-slate-100">
                      {target.wallId}
                    </span>
                    <span className="text-neutral-400" aria-hidden="true">·</span>
                    <span className="text-neutral-600 dark:text-slate-400">
                      {target.isPricedAlternative
                        ? target.isParetoCostCooling
                          ? `Pareto Optimal · ${target.economicTier}`
                          : `Dominated by ${target.dominatedByWallId} · ${target.economicTier}`
                        : 'Reference Wall'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums text-neutral-700 dark:text-slate-300">
                    <span>U: {fmtNum(target.uValue, 3)} W/m²K</span>
                    <span>C₀: {fmtEgp(target.totalCapexEgp)}</span>
                    <span>Saved: {fmtNum(target.coolingSavedKwhYr, 0)} kWh/yr</span>
                    <span>
                      BCR: {target.bcr !== null ? fmtNum(target.bcr, 2) : '—'}
                    </span>
                    <span>
                      SPP:{' '}
                      {target.simplePaybackYrs !== null
                        ? `${fmtNum(target.simplePaybackYrs, 1)} yrs`
                        : '—'}
                    </span>
                    <span
                      className={
                        target.npvEgp !== null && target.npvEgp >= 0
                          ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                          : target.npvEgp !== null
                          ? 'text-red-700 dark:text-red-400 font-semibold'
                          : ''
                      }
                    >
                      NPV: {fmtSignedEgp(target.npvEgp)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Expandable Accessible Data Table */}
      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <p className="text-[11px] text-neutral-500 dark:text-slate-400">
          Pareto frontier evaluates minimum incremental cost (EGP/m²) vs maximum annual cooling savings (kWh/yr) across all priced alternatives.
        </p>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs font-medium text-blue-700 hover:underline dark:text-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {showTable ? 'Hide chart data' : 'Show chart data'}
        </button>
      </div>

      {showTable && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-y border-neutral-200 dark:border-slate-700 text-neutral-500 dark:text-slate-400">
                <th className="py-2 text-left font-medium">Wall ID</th>
                <th className="py-2 text-right font-medium">Unit Cost</th>
                <th className="py-2 text-right font-medium">CAPEX (C₀)</th>
                <th className="py-2 text-right font-medium">Cooling Saved</th>
                <th className="py-2 text-right font-medium">BCR</th>
                <th className="py-2 text-right font-medium">SPP</th>
                <th className="py-2 text-right font-medium">Lifecycle NPV</th>
                <th className="py-2 text-left font-medium pl-4">Frontier / Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-slate-800/80 font-mono tabular-nums">
              {activePlottable.map((c) => (
                <tr key={c.caseId} className="hover:bg-neutral-50 dark:hover:bg-slate-800/40">
                  <td className="py-1.5 font-sans font-medium text-neutral-900 dark:text-slate-100">
                    {c.wallId}
                  </td>
                  <td className="py-1.5 text-right">
                    {c.totalUnitCostEgpM2 !== null ? `${fmtNum(c.totalUnitCostEgpM2, 1)} EGP/m²` : '—'}
                  </td>
                  <td className="py-1.5 text-right">{fmtEgp(c.totalCapexEgp)}</td>
                  <td className="py-1.5 text-right">{fmtNum(c.coolingSavedKwhYr, 1)} kWh</td>
                  <td className="py-1.5 text-right">{c.bcr !== null ? fmtNum(c.bcr, 2) : '—'}</td>
                  <td className="py-1.5 text-right">
                    {c.simplePaybackYrs !== null ? `${fmtNum(c.simplePaybackYrs, 2)} yr` : '—'}
                  </td>
                  <td className="py-1.5 text-right">{fmtSignedEgp(c.npvEgp)}</td>
                  <td className="py-1.5 pl-4 font-sans text-neutral-600 dark:text-slate-400">
                    {!c.isPricedAlternative
                      ? 'Reference'
                      : c.isParetoCostCooling
                      ? `Pareto Optimal · ${c.economicTier}`
                      : `Dominated (${c.dominatedByWallId}) · ${c.economicTier}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
