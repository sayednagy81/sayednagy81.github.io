import React, { useMemo, useState } from 'react';
import { fmtNum, fmtSignedEgp } from '../data/dataset';
import { ComputedEnvelopeCase, EconomicAssumptions } from '../types/envelope';
import { getMaterialColor } from './MaterialMarker';

interface CashFlowChartProps {
  allCases: ComputedEnvelopeCase[];
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

const DEFAULT_COMPARE_IDS = ['Case-02', 'Case-03', 'Case-04', 'Case-05', 'Case-11'];

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  allCases,
  assumptions,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_COMPARE_IDS);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const pricedCases = useMemo(
    () => allCases.filter((c) => c.isPricedAlternative),
    [allCases]
  );

  // Always include selectedCaseId if it's a priced alternative
  const activeCases = useMemo(() => {
    const ids = new Set(pinnedIds);
    const sel = pricedCases.find((c) => c.caseId === selectedCaseId);
    if (sel) ids.add(sel.caseId);
    const matched = pricedCases.filter((c) => ids.has(c.caseId));
    return matched.length > 0 ? matched : pricedCases.slice(0, 4);
  }, [pricedCases, pinnedIds, selectedCaseId]);

  const toggleCase = (caseId: string) => {
    setPinnedIds((prev) => {
      if (prev.includes(caseId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== caseId);
      }
      return [...prev, caseId];
    });
  };

  const horizon = assumptions.analysisHorizonYrs;
  const width = 760;
  const height = 340;
  const pad = { top: 24, right: 112, bottom: 48, left: 78 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const { yMin, yMax } = useMemo(() => {
    const allVals = activeCases.flatMap((c) => c.cumulativeDiscountedCashFlow);
    allVals.push(0);
    const minV = Math.min(...allVals);
    const maxV = Math.max(...allVals);
    const span = maxV - minV || 1000;
    return {
      yMin: minV - span * 0.1,
      yMax: maxV + span * 0.12,
    };
  }, [activeCases]);

  const scaleX = (yr: number) => pad.left + (yr / Math.max(1, horizon)) * plotW;
  const scaleY = (val: number) =>
    pad.top + plotH - ((val - yMin) / (yMax - yMin || 1)) * plotH;

  const yTicks = useMemo(
    () => Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4),
    [yMin, yMax]
  );

  const xTicks = useMemo(() => {
    const step = horizon <= 10 ? 2 : horizon <= 25 ? 5 : 10;
    const ticks: number[] = [0];
    for (let y = step; y < horizon; y += step) ticks.push(y);
    if (ticks[ticks.length - 1] !== horizon) ticks.push(horizon);
    return ticks;
  }, [horizon]);

  // Prevent right-hand end-label overlaps via simple vertical relaxation
  const endLabels = useMemo(() => {
    const items = activeCases
      .map((c) => {
        const endVal = c.cumulativeDiscountedCashFlow[horizon] ?? 0;
        return {
          c,
          endVal,
          rawY: scaleY(endVal),
          y: scaleY(endVal),
        };
      })
      .sort((a, b) => a.rawY - b.rawY);

    const minGap = 15;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < minGap) {
        items[i].y = items[i - 1].y + minGap;
      }
    }
    return items;
  }, [activeCases, horizon, yMin, yMax]);

  const gridStroke = isDark ? '#26303B' : '#E5E7EB';
  const axisText = isDark ? '#94A3B8' : '#4B5563';
  const zeroY = scaleY(0);

  return (
    <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
            Cumulative Discounted Cash Flow &amp; Breakeven Horizon
          </h3>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1 max-w-2xl">
            Tracks Year 0 capital outlay recovering through discounted annual cooling savings ({fmtNum(assumptions.discountRatePct, 1)}% discount rate, {fmtNum(assumptions.energyEscalationPct, 1)}% tariff escalation). Crossing 0 EGP marks discounted payback.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPinnedIds(DEFAULT_COMPARE_IDS)}
          className="text-xs font-medium text-blue-700 hover:underline dark:text-blue-400 whitespace-nowrap self-start cursor-pointer"
        >
          Reset to Pareto frontier set
        </button>
      </div>

      {/* Interactive Case Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 py-3 border-b border-neutral-100 dark:border-slate-800/70">
        {pricedCases.map((c) => {
          const active = activeCases.some((a) => a.caseId === c.caseId);
          const color = getMaterialColor(c.materialFamily, isDark);
          return (
            <button
              key={c.caseId}
              type="button"
              onClick={() => {
                toggleCase(c.caseId);
                onSelectCase(c.caseId);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              {c.wallId.replace(/^W\d+-/, '')}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block overflow-visible select-none"
          role="img"
          aria-label="Cumulative discounted cash flow curves from year 0 to end of lifecycle horizon"
          onMouseLeave={() => setHoveredYear(null)}
        >
          {/* Y Grid */}
          {yTicks.map((t, idx) => {
            const py = scaleY(t);
            return (
              <g key={`cfy-${idx}`}>
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
                  {Math.abs(t) >= 1000 ? `${fmtNum(t / 1000, 1)}k` : fmtNum(t, 0)}
                </text>
              </g>
            );
          })}

          {/* X Grid */}
          {xTicks.map((yr) => {
            const px = scaleX(yr);
            return (
              <g key={`cfx-${yr}`}>
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
                  Yr {yr}
                </text>
              </g>
            );
          })}

          {/* 0 EGP Breakeven Axis */}
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={zeroY}
            y2={zeroY}
            stroke={isDark ? '#94A3B8' : '#334155'}
            strokeWidth={1.5}
          />
          <text
            x={pad.left + 6}
            y={zeroY - 6}
            fill={isDark ? '#CBD5E1' : '#334155'}
            className="font-mono text-[10px] font-semibold"
          >
            BREAKEVEN (0 EGP)
          </text>

          {/* Axis titles */}
          <text
            x={pad.left + plotW / 2}
            y={height - 8}
            textAnchor="middle"
            fill={axisText}
            className="text-xs font-medium"
          >
            Operating Year (0 to {horizon} yrs)
          </text>
          <text
            transform={`translate(18, ${pad.top + plotH / 2}) rotate(-90)`}
            textAnchor="middle"
            fill={axisText}
            className="text-xs font-medium"
          >
            Cumulative Discounted Cash Flow (EGP)
          </text>

          {/* Curves */}
          {activeCases.map((c) => {
            const color = getMaterialColor(c.materialFamily, isDark);
            const isSel = c.caseId === selectedCaseId;
            const dPath = c.cumulativeDiscountedCashFlow
              .map((val, yr) => `${yr === 0 ? 'M' : 'L'}${scaleX(yr).toFixed(1)},${scaleY(val).toFixed(1)}`)
              .join(' ');

            return (
              <g key={c.caseId}>
                <path
                  d={dPath}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSel ? 3 : 2}
                  opacity={isSel ? 1 : 0.8}
                  strokeDasharray={
                    c.thicknessCm === 0 || c.thicknessCm === 2
                      ? 'none'
                      : c.thicknessCm === 4
                      ? '6 3'
                      : '2 2'
                  }
                />
                {/* Breakeven marker */}
                {c.discountedPaybackYrs !== null && c.discountedPaybackYrs <= horizon && (
                  <circle
                    cx={scaleX(c.discountedPaybackYrs)}
                    cy={zeroY}
                    r={4}
                    fill={isDark ? '#0F1419' : '#FFFFFF'}
                    stroke={color}
                    strokeWidth={2}
                  />
                )}
              </g>
            );
          })}

          {/* Terminal Labels */}
          {endLabels.map(({ c, endVal, y }) => {
            const color = getMaterialColor(c.materialFamily, isDark);
            return (
              <text
                key={`lbl-${c.caseId}`}
                x={width - pad.right + 8}
                y={y + 3.5}
                fill={color}
                className="font-mono text-[10.5px] font-semibold cursor-pointer"
                onClick={() => onSelectCase(c.caseId)}
              >
                {c.wallId.replace(/^W\d+-/, '')} ({endVal >= 0 ? '+' : '−'}
                {fmtNum(Math.abs(endVal) / 1000, 1)}k)
              </text>
            );
          })}

          {/* Vertical Hover Scrub Line */}
          {hoveredYear !== null && (
            <line
              x1={scaleX(hoveredYear)}
              x2={scaleX(hoveredYear)}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke={isDark ? '#94A3B8' : '#475569'}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {/* Invisible Year Scrub Columns */}
          {Array.from({ length: horizon + 1 }, (_, yr) => {
            const colW = plotW / Math.max(1, horizon);
            const x = scaleX(yr) - colW / 2;
            return (
              <rect
                key={`scrub-${yr}`}
                x={Math.max(pad.left, x)}
                y={pad.top}
                width={colW}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoveredYear(yr)}
              />
            );
          })}
        </svg>
      </div>

      {/* Scrubbed Year Telemetry Strip */}
      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-xs">
        <span className="font-mono font-semibold text-neutral-700 dark:text-slate-300">
          {hoveredYear !== null ? `Year ${hoveredYear} Cumulative PV:` : `Year ${horizon} Terminal NPV:`}
        </span>
        <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
          {activeCases.map((c) => {
            const yr = hoveredYear ?? horizon;
            const val = c.cumulativeDiscountedCashFlow[yr] ?? 0;
            const color = getMaterialColor(c.materialFamily, isDark);
            return (
              <span key={`read-${c.caseId}`} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-xs"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-neutral-600 dark:text-slate-400">
                  {c.wallId.replace(/^W\d+-/, '')}:
                </span>
                <strong
                  className={
                    val >= 0
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-700 dark:text-red-400'
                  }
                >
                  {fmtSignedEgp(val)}
                </strong>
              </span>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-2">
        Line dash encodes thickness: solid = cavity / 2 cm · medium dash = 4 cm · dotted = 6 cm. Hollow circles mark discounted breakeven (DPP).
      </p>
    </div>
  );
};
