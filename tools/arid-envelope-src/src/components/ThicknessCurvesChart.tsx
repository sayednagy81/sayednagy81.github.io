import React, { useMemo, useState } from 'react';
import {
  INSULATED_FAMILIES,
  MATERIAL_SPECS,
  fmtEgp,
  fmtNum,
  fmtSignedEgp,
} from '../data/dataset';
import { ComputedEnvelopeCase, EconomicAssumptions } from '../types/envelope';
import { MaterialLegendSwatch, MaterialMarker, getMaterialColor } from './MaterialMarker';

interface ThicknessCurvesChartProps {
  allCases: ComputedEnvelopeCase[];
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

type CurveMetric = 'npv' | 'bcr' | 'cce' | 'cooling' | 'uValue';

const METRIC_META: Record<
  CurveMetric,
  { label: string; yTitle: string; format: (v: number) => string; note: string }
> = {
  npv: {
    label: 'Lifecycle NPV',
    yTitle: 'Net Present Value (EGP)',
    format: (v) => fmtSignedEgp(v),
    note: 'Monotonic NPV decline from 2 → 4 → 6 cm shows diminishing marginal returns across all four insulation materials under base-case Cairo economics.',
  },
  bcr: {
    label: 'Benefit–Cost Ratio',
    yTitle: 'Benefit–Cost Ratio (PV / C₀)',
    format: (v) => fmtNum(v, 2),
    note: 'Assemblies above BCR = 1.00 are economically viable over the horizon; dashed line shows uninsulated W02 cavity benchmark.',
  },
  cce: {
    label: 'Cost of Conserved Energy',
    yTitle: 'CCE (EGP / kWh elec)',
    format: (v) => `${fmtNum(v, 2)} EGP/kWh`,
    note: 'Assemblies below the dashed electricity tariff line save electricity cheaper than purchasing power from the grid.',
  },
  cooling: {
    label: 'Cooling Load',
    yTitle: 'Annual Cooling Energy (kWh/yr)',
    format: (v) => `${fmtNum(v, 0)} kWh/yr`,
    note: 'Shows steep energy reduction from 0→2 cm followed by flattening diminishing returns from 4→6 cm.',
  },
  uValue: {
    label: 'Thermal U-Value',
    yTitle: 'U-Value (W/m²·K)',
    format: (v) => `${fmtNum(v, 3)} W/m²·K`,
    note: 'PIR/PUR achieves the lowest U-value (0.296 at 6 cm), though its 7,200 EGP/m³ price creates steep cost trade-offs.',
  },
};

const THICKNESSES = [2, 4, 6];

export const ThicknessCurvesChart: React.FC<ThicknessCurvesChartProps> = ({
  allCases,
  assumptions,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [metric, setMetric] = useState<CurveMetric>('npv');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getMetricValue = (c: ComputedEnvelopeCase): number | null => {
    if (metric === 'npv') return c.npvEgp;
    if (metric === 'bcr') return c.bcr;
    if (metric === 'cce') return c.costOfConservedEnergyEgpKwh;
    if (metric === 'cooling') return c.coolingEnergyKwhYr;
    return c.uValue;
  };

  const w02Case = useMemo(
    () => allCases.find((c) => c.caseId === 'Case-02') ?? null,
    [allCases]
  );

  const series = useMemo(() => {
    return INSULATED_FAMILIES.map((family) => {
      const pts = THICKNESSES.map((cm) =>
        allCases.find((c) => c.materialFamily === family && c.thicknessCm === cm)
      ).filter((c): c is ComputedEnvelopeCase => Boolean(c));
      return { family, pts };
    });
  }, [allCases]);

  const width = 560;
  const height = 340;
  const pad = { top: 26, right: 32, bottom: 48, left: 74 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const { yMin, yMax } = useMemo(() => {
    const vals = series
      .flatMap((s) => s.pts.map((p) => getMetricValue(p)))
      .filter((v): v is number => v !== null && Number.isFinite(v));

    if (metric === 'cce') {
      vals.push(assumptions.electricityTariffEgp);
    }
    if (metric === 'npv') {
      vals.push(0);
      if (w02Case?.isPricedAlternative && w02Case.npvEgp !== null) vals.push(w02Case.npvEgp);
    }
    if (metric === 'bcr') {
      vals.push(1.0);
      if (w02Case?.isPricedAlternative && w02Case.bcr !== null) vals.push(w02Case.bcr);
    }

    const rawMin = Math.min(...vals);
    const rawMax = Math.max(...vals);
    const span = rawMax - rawMin || 1;

    return {
      yMin: metric === 'npv' ? rawMin - span * 0.14 : Math.max(0, rawMin - span * 0.12),
      yMax: rawMax + span * 0.14,
    };
  }, [series, metric, assumptions.electricityTariffEgp, w02Case]);

  const scaleX = (cm: number) => {
    const idx = THICKNESSES.indexOf(cm);
    return pad.left + (idx / (THICKNESSES.length - 1)) * plotW;
  };

  const scaleY = (v: number) =>
    pad.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;

  const yTicks = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);
  }, [yMin, yMax]);

  const hoveredCase = useMemo(
    () => allCases.find((c) => c.caseId === hoveredId) ?? null,
    [allCases, hoveredId]
  );

  const gridStroke = isDark ? '#26303B' : '#E5E7EB';
  const axisText = isDark ? '#94A3B8' : '#4B5563';

  return (
    <div className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-slate-800">
          <div>
            <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-slate-100">
              Diminishing Returns by Thickness
            </h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">
              Material trajectories across 2 cm, 4 cm, and 6 cm insulation layers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md self-start">
            {(
              [
                { k: 'npv', l: 'NPV' },
                { k: 'bcr', l: 'BCR' },
                { k: 'cce', l: 'CCE' },
                { k: 'cooling', l: 'Cooling' },
                { k: 'uValue', l: 'U-Value' },
              ] as { k: CurveMetric; l: string }[]
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

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-neutral-600 dark:text-slate-400">
          {INSULATED_FAMILIES.map((fam) => (
            <span key={fam} className="inline-flex items-center gap-1.5">
              <MaterialLegendSwatch family={fam} isDark={isDark} />
              <span>{MATERIAL_SPECS[fam].shortLabel}</span>
            </span>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block overflow-visible select-none"
          role="img"
          aria-label={`Line chart of ${METRIC_META[metric].label} across insulation thicknesses`}
        >
          {yTicks.map((t, idx) => {
            const py = scaleY(t);
            return (
              <g key={`ty-${idx}`}>
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
                  {metric === 'npv'
                    ? Math.abs(t) >= 1000
                      ? `${fmtNum(t / 1000, 1)}k`
                      : fmtNum(t, 0)
                    : metric === 'uValue' || metric === 'cce' || metric === 'bcr'
                    ? fmtNum(t, 2)
                    : fmtNum(t, 0)}
                </text>
              </g>
            );
          })}

          {/* X-axis vertical ticks */}
          {THICKNESSES.map((cm) => {
            const px = scaleX(cm);
            return (
              <g key={`tx-${cm}`}>
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
                  y={height - pad.bottom + 20}
                  textAnchor="middle"
                  fill={axisText}
                  className="font-mono text-xs font-medium"
                >
                  {cm} cm
                </text>
              </g>
            );
          })}

          {/* Reference threshold lines */}
          {metric === 'npv' && yMin < 0 && yMax > 0 && (
            <g>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={scaleY(0)}
                y2={scaleY(0)}
                stroke={isDark ? '#64748B' : '#94A3B8'}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={width - pad.right}
                y={scaleY(0) - 6}
                textAnchor="end"
                fill={axisText}
                className="font-mono text-[10px]"
              >
                0 EGP Breakeven
              </text>
            </g>
          )}

          {metric === 'npv' && w02Case?.isPricedAlternative && w02Case.npvEgp !== null && (
            <g>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={scaleY(w02Case.npvEgp)}
                y2={scaleY(w02Case.npvEgp)}
                stroke={isDark ? '#94A3B8' : '#475569'}
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <text
                x={pad.left + 4}
                y={scaleY(w02Case.npvEgp) - 6}
                fill={isDark ? '#CBD5E1' : '#334155'}
                className="font-mono text-[10px] font-medium"
              >
                W02 Cavity Only ({fmtSignedEgp(w02Case.npvEgp)})
              </text>
            </g>
          )}

          {metric === 'bcr' && yMin < 1 && yMax > 1 && (
            <g>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={scaleY(1)}
                y2={scaleY(1)}
                stroke={isDark ? '#64748B' : '#94A3B8'}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={width - pad.right}
                y={scaleY(1) - 6}
                textAnchor="end"
                fill={axisText}
                className="font-mono text-[10px]"
              >
                Viability (BCR = 1.00)
              </text>
            </g>
          )}

          {metric === 'bcr' && w02Case?.isPricedAlternative && w02Case.bcr !== null && (
            <g>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={scaleY(w02Case.bcr)}
                y2={scaleY(w02Case.bcr)}
                stroke={isDark ? '#94A3B8' : '#475569'}
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <text
                x={pad.left + 4}
                y={scaleY(w02Case.bcr) - 6}
                fill={isDark ? '#CBD5E1' : '#334155'}
                className="font-mono text-[10px] font-medium"
              >
                W02 Cavity Only (BCR {fmtNum(w02Case.bcr, 2)})
              </text>
            </g>
          )}

          {metric === 'cce' && (
            <g>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={scaleY(assumptions.electricityTariffEgp)}
                y2={scaleY(assumptions.electricityTariffEgp)}
                stroke={isDark ? '#34D399' : '#059669'}
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
              <text
                x={width - pad.right}
                y={scaleY(assumptions.electricityTariffEgp) - 6}
                textAnchor="end"
                fill={isDark ? '#34D399' : '#059669'}
                className="font-mono text-[10px] font-medium"
              >
                Grid Tariff ({fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh)
              </text>
            </g>
          )}

          {/* Y axis title */}
          <text
            transform={`translate(16, ${pad.top + plotH / 2}) rotate(-90)`}
            textAnchor="middle"
            fill={axisText}
            className="text-xs font-medium"
          >
            {METRIC_META[metric].yTitle}
          </text>

          {/* Series Polylines & Markers */}
          {series.map(({ family, pts }) => {
            const color = getMaterialColor(family, isDark);
            const validPts = pts.filter((p) => getMetricValue(p) !== null);
            return (
              <g key={family}>
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={2.25}
                  points={validPts
                    .map(
                      (p) =>
                        `${scaleX(p.thicknessCm).toFixed(1)},${scaleY(
                          getMetricValue(p)!
                        ).toFixed(1)}`
                    )
                    .join(' ')}
                />
                {validPts.map((p) => {
                  const cx = scaleX(p.thicknessCm);
                  const cy = scaleY(getMetricValue(p)!);
                  const isSel = p.caseId === selectedCaseId;
                  const isHov = p.caseId === hoveredId;
                  return (
                    <g
                      key={p.caseId}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer focus:outline-none"
                      aria-label={`${p.wallId}: ${METRIC_META[metric].format(getMetricValue(p)!)}`}
                      onClick={() => onSelectCase(p.caseId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectCase(p.caseId);
                        }
                      }}
                      onMouseEnter={() => setHoveredId(p.caseId)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(p.caseId)}
                      onBlur={() => setHoveredId(null)}
                    >
                      <circle cx={cx} cy={cy} r={14} fill="transparent" />
                      <MaterialMarker
                        family={family}
                        x={cx}
                        y={cy}
                        size={isSel || isHov ? 7.5 : 5.8}
                        isDark={isDark}
                        selected={isSel}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live readout & commentary */}
      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-slate-800 space-y-1.5">
        {hoveredCase ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums text-neutral-800 dark:text-slate-200">
            <span className="font-sans font-semibold">{hoveredCase.wallId}</span>
            <span>
              {METRIC_META[metric].label}:{' '}
              <strong>
                {getMetricValue(hoveredCase) !== null
                  ? METRIC_META[metric].format(getMetricValue(hoveredCase)!)
                  : '—'}
              </strong>
            </span>
            <span>CAPEX: {fmtEgp(hoveredCase.totalCapexEgp)}</span>
          </div>
        ) : (
          <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">
            {METRIC_META[metric].note}
          </p>
        )}
      </div>
    </div>
  );
};
