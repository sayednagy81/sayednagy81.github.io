import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import {
  FIG1_WORKFLOW_URL,
  TABLE15_ORIENTATION_SENSITIVITY,
  TABLE2_BOUNDARY_CONDITIONS,
  TABLE4_INSULATION_COSTS,
  TABLE5_MASONRY_BOQ,
  WORKFLOW_STAGES,
} from '../data/manuscript';
import { fmtNum } from '../data/dataset';
import { EconomicAssumptions, MaterialFamily } from '../types/envelope';
import { getMaterialColor } from './MaterialMarker';

interface ResearchMethodologyProps {
  assumptions: EconomicAssumptions;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  isDark: boolean;
}

type MethodTab = 'equations' | 'insulation' | 'boq' | 'credibility';

interface Fig3PanelSpec {
  id: string;
  targetCaseId: string;
  title: string;
  subtitle: string;
  family: MaterialFamily;
  uRange: string;
  conductivity: string;
  isSolid?: boolean;
  isEmptyCavity?: boolean;
  layerLabel: string;
}

const FIG3_PANELS: Fig3PanelSpec[] = [
  {
    id: 'w01',
    targetCaseId: 'Case-01',
    title: 'W01-Baseline',
    subtitle: '25 cm Solid Brick Wall',
    family: MaterialFamily.Baseline,
    uRange: 'U = 2.402 W/(m²·K)',
    conductivity: '20 + 250 + 20 mm',
    isSolid: true,
    layerLabel: 'Solid Brick 25 cm',
  },
  {
    id: 'w02',
    targetCaseId: 'Case-02',
    title: 'W02-Double Air Cavity',
    subtitle: 'Uninsulated 12 + 6 + 12 cm',
    family: MaterialFamily.AirCavity,
    uRange: 'U = 1.052 W/(m²·K)',
    conductivity: '60 mm air gap',
    isEmptyCavity: true,
    layerLabel: 'Air Cavity 6 cm',
  },
  {
    id: 'eps',
    targetCaseId: 'Case-03',
    title: 'W03 / W04 / W05',
    subtitle: 'EPS Cavity Insulation',
    family: MaterialFamily.EPS,
    uRange: 'U = 0.771–0.426',
    conductivity: 'λ = 0.038 · 20 kg/m³',
    layerLabel: 'EPS 2 / 4 / 6 cm',
  },
  {
    id: 'xps',
    targetCaseId: 'Case-06',
    title: 'W06 / W07 / W08',
    subtitle: 'XPS Cavity Insulation',
    family: MaterialFamily.XPS,
    uRange: 'U = 0.736–0.394',
    conductivity: 'λ = 0.034 · 35 kg/m³',
    layerLabel: 'XPS 2 / 4 / 6 cm',
  },
  {
    id: 'pir',
    targetCaseId: 'Case-11',
    title: 'W09 / W10 / W11',
    subtitle: 'PIR/PUR Cavity Insulation',
    family: MaterialFamily.PIR,
    uRange: 'U = 0.610–0.296',
    conductivity: 'λ = 0.023 · 32 kg/m³',
    layerLabel: 'PIR/PUR 2 / 4 / 6 cm',
  },
  {
    id: 'mw',
    targetCaseId: 'Case-12',
    title: 'W12 / W13 / W14',
    subtitle: 'Mineral Wool Cavity Insulation',
    family: MaterialFamily.MineralWool,
    uRange: 'U = 0.787–0.440',
    conductivity: 'λ = 0.040 · 100 kg/m³',
    layerLabel: 'Rock Wool 2 / 4 / 6 cm',
  },
];

export const ResearchMethodology: React.FC<ResearchMethodologyProps> = ({
  assumptions,
  selectedCaseId,
  onSelectCase,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<MethodTab>('equations');
  const [activeAzimuth, setActiveAzimuth] = useState<number>(225);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const activeOrient =
    TABLE15_ORIENTATION_SENSITIVITY.find((o) => o.azimuth === activeAzimuth) ??
    TABLE15_ORIENTATION_SENSITIVITY[5];

  const isPanelActive = (panel: Fig3PanelSpec) => {
    if (panel.id === 'w01') return selectedCaseId === 'Case-01';
    if (panel.id === 'w02') return selectedCaseId === 'Case-02';
    if (panel.id === 'eps') return ['Case-03', 'Case-04', 'Case-05'].includes(selectedCaseId);
    if (panel.id === 'xps') return ['Case-06', 'Case-07', 'Case-08'].includes(selectedCaseId);
    if (panel.id === 'pir') return ['Case-09', 'Case-10', 'Case-11'].includes(selectedCaseId);
    return ['Case-12', 'Case-13', 'Case-14'].includes(selectedCaseId);
  };

  const brickFill = isDark ? '#7C3A2D' : '#C25E44';
  const brickStroke = isDark ? '#A55A49' : '#8C3B28';
  const plasterFill = isDark ? '#475569' : '#D6D3D1';

  return (
    <section
      id="methodology"
      aria-labelledby="methodology-heading"
      className="space-y-6 scroll-mt-20"
    >
      {/* Section Heading */}
      <div className="space-y-1.5">
        <p className="text-xs font-mono font-medium text-blue-700 dark:text-blue-400">
          02. Research Methodology &amp; Illustrated Framework
        </p>
        <h2
          id="methodology-heading"
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white [text-wrap:balance]"
        >
          Seven-stage thermal simulation and Cairo BOQ economic protocol
        </h2>
        <p className="text-sm text-neutral-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          All fourteen assemblies share identical Dar Misr apartment geometry, occupancy schedules, 6 mm single clear glazing, southwest 225° orientation, and Cairo Airport TMY weather—isolating the masonry cavity conversion (W01 → W02) from the insulation layer (W02 → W03–W14).
        </p>
      </div>

      {/* FIGURE 1: UPLOADED RESEARCH WORKFLOW SVG */}
      <figure className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-slate-800">
          <div>
            <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-slate-100">
              Fig. 1 — Seven-Stage Research Workflow
            </h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Thermal simulation pipeline (Stages 1–4) coupled with 25-year BOQ economic evaluation and optima comparison (Stages 5–7)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-neutral-800 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap self-start shrink-0 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand diagram
          </button>
        </div>

        {/* Crisp bright plate so the author's original light-ground SVG remains 100% legible in Dark Mode */}
        <div className="mt-4 bg-white border border-neutral-200 dark:border-slate-700 rounded-md p-3 sm:p-5 flex justify-center">
          <img
            src={FIG1_WORKFLOW_URL}
            alt="Research workflow diagram showing 7 stages: 1 Data audit and validation, 2 Definition of 14 wall cases, 3 DesignBuilder EnergyPlus simulation, 4 Thermal analysis, 5 Economic analysis, 6 Thermal versus economic comparison, and 7 Interpretation."
            referrerPolicy="no-referrer"
            onClick={() => setLightboxOpen(true)}
            className="w-full max-w-4xl h-auto block cursor-zoom-in"
          />
        </div>

        {/* Concise 7-Stage Editorial Legend */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {WORKFLOW_STAGES.map((stage) => (
            <div key={stage.step} className="space-y-0.5">
              <p className="font-semibold text-neutral-900 dark:text-slate-100">
                <span className="font-mono text-blue-700 dark:text-blue-400 mr-1.5">
                  0{stage.step}.
                </span>
                {stage.title}
              </p>
              <p className="text-[11.5px] text-neutral-500 dark:text-slate-400 leading-relaxed">
                {stage.detail}
              </p>
            </div>
          ))}
        </div>

        <figcaption className="mt-4 pt-3 border-t border-neutral-100 dark:border-slate-800/70 text-[11px] text-neutral-500 dark:text-slate-400">
          Fig. 1 — Author&apos;s research workflow for thermal and economic evaluation of external wall assemblies (Cairo residential case study).
        </figcaption>
      </figure>

      {/* FIGURE 2: CASE STUDY & SOLAR PATH + TABLE 2 BOUNDARY CONDITIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <figure className="xl:col-span-7 bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-neutral-200 dark:border-slate-800">
              <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-slate-100">
                Fig. 2 — Dar Misr Typical-Floor Case Study &amp; 8-Orientation Solar Path
              </h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                El Shorouk, Cairo residential block (120.89 m² apartment, 109.45 m² exterior wall, 16.6% WWR). Click any compass azimuth to inspect Table 15 orientation sensitivity.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Architectural Plan Schematic */}
              <div className="bg-[#F7F7F5] dark:bg-[#0F1419] border border-neutral-200 dark:border-slate-800 rounded-md p-3">
                <p className="font-mono text-[10px] font-semibold text-neutral-500 dark:text-slate-400 mb-2">
                  A. TYPICAL APARTMENT ENVELOPE (120.89 m²)
                </p>
                <svg
                  viewBox="0 0 260 205"
                  className="w-full h-auto block select-none"
                  role="img"
                  aria-label="Simplified schematic floor plan of the modelled 120.89 m2 Dar Misr apartment showing exterior exposed wall and glazing"
                >
                  {/* Adjacent apartments context */}
                  <rect
                    x="18"
                    y="16"
                    width="110"
                    height="78"
                    fill={isDark ? '#161D24' : '#E7E5E4'}
                    stroke={isDark ? '#334155' : '#A8A29E'}
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                  <text
                    x="73"
                    y="58"
                    textAnchor="middle"
                    fill={isDark ? '#64748B' : '#78716C'}
                    className="font-mono text-[8.5px]"
                  >
                    Adjacent Unit (Adiabatic)
                  </text>

                  {/* Core / Stairwell */}
                  <rect
                    x="128"
                    y="16"
                    width="42"
                    height="78"
                    fill={isDark ? '#1E293B' : '#D6D3D1'}
                    stroke={isDark ? '#475569' : '#78716C'}
                    strokeWidth="1"
                  />
                  <text
                    x="149"
                    y="58"
                    textAnchor="middle"
                    fill={isDark ? '#94A3B8' : '#57534E'}
                    className="font-mono text-[8px]"
                  >
                    Core
                  </text>

                  {/* Modelled Apartment Footprint */}
                  <rect
                    x="18"
                    y="94"
                    width="216"
                    height="90"
                    fill={isDark ? '#1E3A5F' : '#DBEAFE'}
                    fillOpacity={isDark ? '0.45' : '0.6'}
                    stroke={isDark ? '#60A5FA' : '#1D4ED8'}
                    strokeWidth="2.5"
                  />
                  {/* Interior Room Partitions */}
                  <line
                    x1="96"
                    y1="94"
                    x2="96"
                    y2="184"
                    stroke={isDark ? '#475569' : '#94A3B8'}
                    strokeWidth="1"
                  />
                  <line
                    x1="164"
                    y1="94"
                    x2="164"
                    y2="184"
                    stroke={isDark ? '#475569' : '#94A3B8'}
                    strokeWidth="1"
                  />
                  <line
                    x1="96"
                    y1="140"
                    x2="234"
                    y2="140"
                    stroke={isDark ? '#475569' : '#94A3B8'}
                    strokeWidth="1"
                  />

                  {/* Room Labels */}
                  <text
                    x="57"
                    y="142"
                    textAnchor="middle"
                    fill={isDark ? '#E2E8F0' : '#1E3A8A'}
                    className="font-sans text-[9.5px] font-semibold"
                  >
                    Reception
                  </text>
                  <text
                    x="130"
                    y="120"
                    textAnchor="middle"
                    fill={isDark ? '#CBD5E1' : '#1E40AF'}
                    className="font-sans text-[8.5px]"
                  >
                    Bedrooms
                  </text>
                  <text
                    x="199"
                    y="120"
                    textAnchor="middle"
                    fill={isDark ? '#CBD5E1' : '#1E40AF'}
                    className="font-sans text-[8.5px]"
                  >
                    Master
                  </text>
                  <text
                    x="130"
                    y="165"
                    textAnchor="middle"
                    fill={isDark ? '#CBD5E1' : '#1E40AF'}
                    className="font-sans text-[8.5px]"
                  >
                    Bath / Kit.
                  </text>
                  <text
                    x="199"
                    y="165"
                    textAnchor="middle"
                    fill={isDark ? '#CBD5E1' : '#1E40AF'}
                    className="font-sans text-[8.5px]"
                  >
                    Living
                  </text>

                  {/* 6mm Single Clear Glazing Window Strips (16.6% WWR) */}
                  <line x1="36" y1="184" x2="78" y2="184" stroke="#F59E0B" strokeWidth="4" />
                  <line x1="112" y1="184" x2="148" y2="184" stroke="#F59E0B" strokeWidth="4" />
                  <line x1="182" y1="184" x2="218" y2="184" stroke="#F59E0B" strokeWidth="4" />
                  <line x1="234" y1="108" x2="234" y2="132" stroke="#F59E0B" strokeWidth="4" />

                  {/* Exposed SW Facade Callout */}
                  <text
                    x="126"
                    y="198"
                    textAnchor="middle"
                    fill={isDark ? '#FBBF24' : '#B45309'}
                    className="font-mono text-[8.5px] font-semibold"
                  >
                    Exposed External Wall (109.45 m²) · 6mm Glass (16.6% WWR)
                  </text>
                </svg>
              </div>

              {/* Interactive 8-Orientation Solar Path Compass (Table 15) */}
              <div className="bg-[#F7F7F5] dark:bg-[#0F1419] border border-neutral-200 dark:border-slate-800 rounded-md p-3">
                <p className="font-mono text-[10px] font-semibold text-neutral-500 dark:text-slate-400 mb-2">
                  B. SOLAR ORIENTATION SENSITIVITY (CLICK AZIMUTH)
                </p>
                <svg
                  viewBox="0 0 240 205"
                  className="w-full h-auto block select-none"
                  role="img"
                  aria-label="Interactive 8-orientation compass rose showing Cairo solar azimuth cooling demand from Table 15"
                >
                  {/* Concentric solar altitude rings */}
                  <circle
                    cx="120"
                    cy="102"
                    r="76"
                    fill="none"
                    stroke={isDark ? '#26303B' : '#D6D3D1'}
                    strokeWidth="1"
                  />
                  <circle
                    cx="120"
                    cy="102"
                    r="50"
                    fill="none"
                    stroke={isDark ? '#26303B' : '#E5E7EB'}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="120"
                    cy="102"
                    r="22"
                    fill={isDark ? '#161D24' : '#FFFFFF'}
                    stroke={isDark ? '#475569' : '#94A3B8'}
                    strokeWidth="1"
                  />

                  {/* Summer afternoon solar arc (SW-W) */}
                  <path
                    d="M 120 178 A 76 76 0 0 1 44 102"
                    fill="none"
                    stroke={isDark ? '#F59E0B' : '#D97706'}
                    strokeWidth="3"
                    opacity="0.55"
                  />

                  {/* 8 Orientation Nodes */}
                  {TABLE15_ORIENTATION_SENSITIVITY.map((o) => {
                    // Convert compass bearing (0 = N top, clockwise) to SVG angle
                    const rad = ((o.azimuth - 90) * Math.PI) / 180;
                    const loadRatio = (o.w01CoolingKwh - 8000) / 3400;
                    const rBar = 32 + loadRatio * 40;
                    const xEnd = 120 + Math.cos(rad) * rBar;
                    const yEnd = 102 + Math.sin(rad) * rBar;
                    const xLbl = 120 + Math.cos(rad) * 86;
                    const yLbl = 102 + Math.sin(rad) * 86;
                    const isSelected = o.azimuth === activeAzimuth;
                    const isMain = o.azimuth === 225;

                    return (
                      <g
                        key={o.azimuth}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer focus:outline-none"
                        aria-label={`${o.compass} (${o.azimuth} degrees): Baseline cooling ${o.w01CoolingKwh} kWh/yr`}
                        onClick={() => setActiveAzimuth(o.azimuth)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveAzimuth(o.azimuth);
                          }
                        }}
                      >
                        <line
                          x1="120"
                          y1="102"
                          x2={xEnd}
                          y2={yEnd}
                          stroke={
                            isSelected
                              ? isDark
                                ? '#60A5FA'
                                : '#1D4ED8'
                              : isMain
                              ? '#D97706'
                              : isDark
                              ? '#475569'
                              : '#94A3B8'
                          }
                          strokeWidth={isSelected ? 3 : 1.75}
                        />
                        <circle
                          cx={xEnd}
                          cy={yEnd}
                          r={isSelected ? 6 : 4.2}
                          fill={
                            isSelected
                              ? isDark
                                ? '#60A5FA'
                                : '#1D4ED8'
                              : isMain
                              ? '#D97706'
                              : isDark
                              ? '#94A3B8'
                              : '#64748B'
                          }
                        />
                        <circle cx={xLbl} cy={yLbl} r="13" fill="transparent" />
                        <text
                          x={xLbl}
                          y={yLbl + 3.5}
                          textAnchor="middle"
                          fill={
                            isSelected
                              ? isDark
                                ? '#F8FAFC'
                                : '#0F172A'
                              : isDark
                              ? '#94A3B8'
                              : '#475569'
                          }
                          className={`font-mono text-[9.5px] ${
                            isSelected ? 'font-bold' : 'font-medium'
                          }`}
                        >
                          {o.compass}
                        </text>
                      </g>
                    );
                  })}

                  <text
                    x="120"
                    y="105"
                    textAnchor="middle"
                    fill={isDark ? '#E2E8F0' : '#0F172A'}
                    className="font-mono text-[9px] font-semibold"
                  >
                    {activeOrient.azimuth}°
                  </text>
                </svg>
              </div>
            </div>

            {/* Live Selected Orientation Strip (Table 15) */}
            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400">
                  Selected Azimuth
                </span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-slate-100">
                  {activeOrient.compass} ({activeOrient.azimuth}°)
                  {activeOrient.azimuth === 225 ? ' · Base' : ''}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400">
                  W01 Cooling Load
                </span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                  {fmtNum(activeOrient.w01CoolingKwh, 0)} kWh/yr
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400">
                  Cavity / W11 Saving
                </span>
                <span className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                  {fmtNum(activeOrient.cavitySavingPct, 1)}% / {fmtNum(activeOrient.w11SavingPct, 1)}%
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400">
                  Highest NPV Wall
                </span>
                <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                  {activeOrient.highestNpvWall} ({fmtNum(activeOrient.highestNpvEgp, 0)} EGP)
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400">
                  W11 BCR / ρ vs 225°
                </span>
                <span className="font-mono font-semibold tabular-nums text-red-700 dark:text-red-400">
                  {fmtNum(activeOrient.w11Bcr, 2)} · ρ {fmtNum(activeOrient.spearmanRho, 2)}
                </span>
              </div>
            </div>
          </div>

          <figcaption className="mt-4 pt-3 border-t border-neutral-100 dark:border-slate-800/70 text-[11px] text-neutral-500 dark:text-slate-400">
            Fig. 2 — Dar Misr apartment envelope geometry and DesignBuilder 8-orientation sensitivity (Table 15). W02 holds the highest BCR and W11 remains non-viable (BCR 0.74–0.96) at every orientation.
          </figcaption>
        </figure>

        {/* TABLE 2: SIMULATION BOUNDARY CONDITIONS */}
        <div className="xl:col-span-5 bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-neutral-200 dark:border-slate-800">
              <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-slate-100">
                Table 2 — Simulation Boundary Conditions
              </h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                Fixed EnergyPlus v23.1.0 inputs held constant across all 14 wall assemblies
              </p>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 dark:divide-slate-800 text-xs">
              {TABLE2_BOUNDARY_CONDITIONS.map((row) => (
                <div
                  key={row.item}
                  className="py-2 grid grid-cols-[132px_1fr] gap-3 items-baseline"
                >
                  <dt className="font-medium text-neutral-500 dark:text-slate-400">
                    {row.item}
                  </dt>
                  <dd className="text-neutral-900 dark:text-slate-100 leading-snug">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-3 pt-3 border-t border-neutral-100 dark:border-slate-800/70 text-[11px] text-neutral-500 dark:text-slate-400">
            Discomfort hours report EnergyPlus &ldquo;Discomfort (All Clothing)&rdquo; outside the ASHRAE 55-2004 simple comfort zone.
          </p>
        </div>
      </div>

      {/* FIGURE 3: 6-ASSEMBLY CROSS-SECTION MATRIX + TABBED EQUATIONS / TABLES 4 & 5 */}
      <figure className="bg-white dark:bg-[#161D24] border border-neutral-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-6">
        <div className="pb-4 border-b border-neutral-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-slate-100">
              Fig. 3 — Cross-Sections of the Six Wall Construction Families (W01–W14)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
              Click any wall construction below to load it into the live Wall Assembly Inspector and economic charts
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-slate-400">
            ISO 6946 declared U-values
          </span>
        </div>

        {/* 6-Panel Architectural Section Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FIG3_PANELS.map((panel) => {
            const active = isPanelActive(panel);
            const accent = getMaterialColor(panel.family, isDark);

            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => onSelectCase(panel.targetCaseId)}
                className={`text-left rounded-md border p-3.5 transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-950/25'
                    : 'border-neutral-200 bg-[#F7F7F5] hover:border-neutral-400 dark:border-slate-800 dark:bg-[#0F1419] dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="font-semibold text-xs text-neutral-900 dark:text-slate-100">
                    {panel.title}
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500 dark:text-slate-400">
                    {panel.uRange}
                  </span>
                </div>

                {/* Isometric / Section Layer SVG */}
                <svg
                  viewBox="0 0 220 96"
                  className="w-full h-auto block"
                  aria-hidden="true"
                >
                  {/* Exterior label */}
                  <text
                    x="10"
                    y="12"
                    fill={isDark ? '#94A3B8' : '#64748B'}
                    className="font-mono text-[8px]"
                  >
                    EXT 2 cm
                  </text>
                  <text
                    x="210"
                    y="12"
                    textAnchor="end"
                    fill={isDark ? '#94A3B8' : '#64748B'}
                    className="font-mono text-[8px]"
                  >
                    INT 2 cm
                  </text>

                  {panel.isSolid ? (
                    <g>
                      {/* Outer plaster */}
                      <rect x="44" y="20" width="12" height="54" fill={plasterFill} stroke={isDark ? '#64748B' : '#78716C'} strokeWidth="0.8" />
                      {/* 25cm Solid Brick */}
                      <rect x="56" y="20" width="108" height="54" fill={brickFill} stroke={brickStroke} strokeWidth="1" />
                      {[31, 42, 53, 64].map((ry) => (
                        <line key={ry} x1="56" x2="164" y1={ry} y2={ry} stroke={isDark ? '#3B1810' : '#FDE6D8'} strokeWidth="0.7" opacity="0.55" />
                      ))}
                      {/* Inner plaster */}
                      <rect x="164" y="20" width="12" height="54" fill={plasterFill} stroke={isDark ? '#64748B' : '#78716C'} strokeWidth="0.8" />
                    </g>
                  ) : (
                    <g>
                      {/* Outer plaster */}
                      <rect x="30" y="20" width="10" height="54" fill={plasterFill} stroke={isDark ? '#64748B' : '#78716C'} strokeWidth="0.8" />
                      {/* Outer 12cm Brick Leaf */}
                      <rect x="40" y="20" width="52" height="54" fill={brickFill} stroke={brickStroke} strokeWidth="1" />
                      {[31, 42, 53, 64].map((ry) => (
                        <line key={`l-${ry}`} x1="40" x2="92" y1={ry} y2={ry} stroke={isDark ? '#3B1810' : '#FDE6D8'} strokeWidth="0.7" opacity="0.55" />
                      ))}

                      {/* 6cm Cavity: Empty Air or Insulation Fill */}
                      <rect
                        x="92"
                        y="20"
                        width="36"
                        height="54"
                        fill={panel.isEmptyCavity ? (isDark ? '#161D24' : '#FFFFFF') : accent}
                        fillOpacity={panel.isEmptyCavity ? 1 : 0.28}
                        stroke={accent}
                        strokeWidth="1.5"
                        strokeDasharray={panel.isEmptyCavity ? '3 2' : undefined}
                      />
                      {!panel.isEmptyCavity && (
                        <>
                          <line x1="92" y1="34" x2="128" y2="20" stroke={accent} strokeWidth="0.9" opacity="0.7" />
                          <line x1="92" y1="52" x2="128" y2="38" stroke={accent} strokeWidth="0.9" opacity="0.7" />
                          <line x1="92" y1="70" x2="128" y2="56" stroke={accent} strokeWidth="0.9" opacity="0.7" />
                        </>
                      )}

                      {/* Inner 12cm Brick Leaf */}
                      <rect x="128" y="20" width="52" height="54" fill={brickFill} stroke={brickStroke} strokeWidth="1" />
                      {[31, 42, 53, 64].map((ry) => (
                        <line key={`r-${ry}`} x1="128" x2="180" y1={ry} y2={ry} stroke={isDark ? '#3B1810' : '#FDE6D8'} strokeWidth="0.7" opacity="0.55" />
                      ))}
                      {/* Inner plaster */}
                      <rect x="180" y="20" width="10" height="54" fill={plasterFill} stroke={isDark ? '#64748B' : '#78716C'} strokeWidth="0.8" />
                    </g>
                  )}

                  {/* Bottom Dimension Callout */}
                  <text
                    x="110"
                    y="89"
                    textAnchor="middle"
                    fill={accent}
                    className="font-mono text-[9px] font-semibold"
                  >
                    {panel.layerLabel}
                  </text>
                </svg>

                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-slate-400">
                  <span>{panel.subtitle}</span>
                  <span className="font-mono">{panel.conductivity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tabbed Economic Equations & Cairo BOQ Reference Tables */}
        <div className="pt-4 border-t border-neutral-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h4 className="font-display text-sm font-semibold text-neutral-900 dark:text-slate-100">
              Economic Formulation &amp; Cost Database Reference
            </h4>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md self-start">
              {(
                [
                  { id: 'equations', label: 'Equations (1–3)' },
                  { id: 'insulation', label: 'Insulation Costs (Table 4)' },
                  { id: 'boq', label: 'Cairo BOQ (Table 5)' },
                  { id: 'credibility', label: 'Validation & Limits' },
                ] as { id: MethodTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'equations' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="border border-neutral-200 dark:border-slate-800 rounded-md p-4 bg-[#F7F7F5] dark:bg-[#0F1419]">
                <p className="text-[11px] font-mono text-neutral-500 dark:text-slate-400">
                  Equation (1) · Incremental Investment
                </p>
                <p className="font-mono text-base font-semibold text-neutral-950 dark:text-white mt-2">
                  C₀ = (ΔCₘ + Cᵢ) × A
                </p>
                <p className="text-xs text-neutral-600 dark:text-slate-400 mt-2 leading-relaxed">
                  ΔCₘ = <span className="font-mono">{fmtNum(assumptions.cavityPremiumEgpM2, 2)} EGP/m²</span> cavity masonry premium over W01 solid brick; Cᵢ = insulation material + <span className="font-mono">{fmtNum(assumptions.insulationInstallEgpM2, 0)} EGP/m²</span> labour; A = <span className="font-mono">{fmtNum(assumptions.wallAreaM2, 2)} m²</span> external wall.
                </p>
              </div>

              <div className="border border-neutral-200 dark:border-slate-800 rounded-md p-4 bg-[#F7F7F5] dark:bg-[#0F1419]">
                <p className="text-[11px] font-mono text-neutral-500 dark:text-slate-400">
                  Equation (2) · Year-1 Electricity Saving
                </p>
                <p className="font-mono text-base font-semibold text-neutral-950 dark:text-white mt-2">
                  S₁ = ΔE × η × T
                </p>
                <p className="text-xs text-neutral-600 dark:text-slate-400 mt-2 leading-relaxed">
                  ΔE = simulated cooling saving vs reference (kWh/yr); η = 1 / CoP = <span className="font-mono">{fmtNum(1 / assumptions.coolingCop, 3)}</span> (CoP <span className="font-mono">{fmtNum(assumptions.coolingCop, 2)}</span>); T = <span className="font-mono">{fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh</span> (Aug 2026 351–650 kWh bracket).
                </p>
              </div>

              <div className="border border-neutral-200 dark:border-slate-800 rounded-md p-4 bg-[#F7F7F5] dark:bg-[#0F1419]">
                <p className="text-[11px] font-mono text-neutral-500 dark:text-slate-400">
                  Equation (3) · 25-Year Lifecycle Indicators
                </p>
                <p className="font-mono text-sm font-semibold text-neutral-950 dark:text-white mt-2">
                  NPV = Σ S₁(1+g)ᵗ⁻¹/(1+r)ᵗ − C₀
                </p>
                <p className="font-mono text-xs text-neutral-700 dark:text-slate-300 mt-1">
                  BCR = PV / C₀ · SPP = C₀ / S₁ · Tolerance = 1 − 1/BCR
                </p>
                <p className="text-xs text-neutral-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Nominal r = <span className="font-mono">{fmtNum(assumptions.discountRatePct, 1)}%</span>, g = <span className="font-mono">{fmtNum(assumptions.energyEscalationPct, 1)}%</span> over N = <span className="font-mono">{assumptions.analysisHorizonYrs} yrs</span>. At r = g = 15%, DPP = 1.15 × SPP.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'insulation' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-y border-neutral-300 dark:border-slate-700 bg-[#F7F7F5] dark:bg-[#0F1419] text-neutral-600 dark:text-slate-400">
                    <th className="py-2 px-3 text-left font-medium">Material</th>
                    <th className="py-2 px-3 text-right font-medium">λ (W/m·K)</th>
                    <th className="py-2 px-3 text-right font-medium">Thickness</th>
                    <th className="py-2 px-3 text-right font-medium">Price (EGP/m³)</th>
                    <th className="py-2 px-3 text-right font-medium">Material (EGP/m²)</th>
                    <th className="py-2 px-3 text-right font-medium">Install (EGP/m²)</th>
                    <th className="py-2 px-3 text-right font-medium">Total Cᵢ (EGP/m²)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-slate-800 font-mono tabular-nums">
                  {TABLE4_INSULATION_COSTS.map((r) => (
                    <tr
                      key={`${r.material}-${r.thicknessCm}`}
                      className="hover:bg-neutral-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-1.5 px-3 font-sans font-medium text-neutral-900 dark:text-slate-100">
                        {r.material}
                      </td>
                      <td className="py-1.5 px-3 text-right">{fmtNum(r.conductivity, 3)}</td>
                      <td className="py-1.5 px-3 text-right">{r.thicknessCm} cm</td>
                      <td className="py-1.5 px-3 text-right">{fmtNum(r.pricePerM3, 0)}</td>
                      <td className="py-1.5 px-3 text-right">{fmtNum(r.materialCostM2, 0)}</td>
                      <td className="py-1.5 px-3 text-right">{fmtNum(r.installationM2, 0)}</td>
                      <td className="py-1.5 px-3 text-right font-semibold text-neutral-900 dark:text-slate-100">
                        {fmtNum(r.totalInsulationM2, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'boq' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-y border-neutral-300 dark:border-slate-700 bg-[#F7F7F5] dark:bg-[#0F1419] text-neutral-600 dark:text-slate-400">
                    <th className="py-2 px-3 text-left font-medium">
                      Cairo Masonry Cost Item (August 2026)
                    </th>
                    <th className="py-2 px-3 text-right font-medium">
                      Solid Wall 25 cm (W01)
                    </th>
                    <th className="py-2 px-3 text-right font-medium">
                      Cavity Wall 12+6+12 cm (W02–W14)
                    </th>
                    <th className="py-2 px-3 text-right font-medium">Difference (EGP/m²)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-slate-800 font-mono tabular-nums">
                  {TABLE5_MASONRY_BOQ.map((row) => {
                    const diff = row.cavityWallEgpM2 - row.solidWallEgpM2;
                    return (
                      <tr
                        key={row.item}
                        className={
                          row.isTotal
                            ? 'bg-blue-50/60 dark:bg-blue-950/30 font-semibold text-neutral-950 dark:text-white'
                            : row.isSubtotal
                            ? 'bg-neutral-50 dark:bg-slate-800/40 font-medium'
                            : ''
                        }
                      >
                        <td className="py-2 px-3 font-sans">{row.item}</td>
                        <td className="py-2 px-3 text-right">{fmtNum(row.solidWallEgpM2, 2)}</td>
                        <td className="py-2 px-3 text-right">{fmtNum(row.cavityWallEgpM2, 2)}</td>
                        <td
                          className={`py-2 px-3 text-right ${
                            row.isTotal
                              ? 'text-blue-700 dark:text-blue-400'
                              : diff > 0
                              ? 'text-neutral-800 dark:text-slate-200'
                              : 'text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {diff >= 0 ? '+' : '−'}
                          {fmtNum(Math.abs(diff), 2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-2">
                Crew output: 8 m²/day for 25 cm solid brick wall vs. 5 m²/day for 12 + 6 + 12 cm double-leaf cavity wall (excluding plaster, finishes, lintels, or wall ties).
              </p>
            </div>
          )}

          {activeTab === 'credibility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
              <div className="border border-neutral-200 dark:border-slate-800 rounded-md p-4 space-y-1.5">
                <p className="font-semibold text-neutral-900 dark:text-slate-100">
                  Model Credibility &amp; Relative Ranking Robustness
                </p>
                <p>
                  EnergyPlus is validated under ANSI/ASHRAE Standard 140 and prior Cairo/New Cairo residential benchmarks. Because all 14 walls share geometry, schedules, and weather, systematic errors cancel across cases: cooling demand scales linearly with U-value (R² &gt; 0.999, ~733 kWh/yr per W/m²·K), and the BCR ranking is mathematically invariant to uniform simulation bias or CoP scaling.
                </p>
              </div>
              <div className="border border-neutral-200 dark:border-slate-800 rounded-md p-4 space-y-1.5">
                <p className="font-semibold text-neutral-900 dark:text-slate-100">
                  Key Study Limitations &amp; Ageing Sensitivity
                </p>
                <p>
                  No metered data existed to calibrate this apartment to ASHRAE Guideline 14, and Cairo Airport TMY omits urban heat island effects. With higher-efficiency AC units (above CoP 1.32), EPS 2 cm remains viable up to CoP ~2.2 and W02 up to CoP ~2.8. Thermal ageing (15–26% conductivity drift in PIR/PUR) pushes W10-PIR4cm into non-viability (BCR 0.975) while leaving W02, W03, and W04 at the top.
                </p>
              </div>
            </div>
          )}
        </div>

        <figcaption className="pt-3 border-t border-neutral-100 dark:border-slate-800/70 text-[11px] text-neutral-500 dark:text-slate-400">
          Fig. 3 — Six wall assembly cross-sections (W01–W14) paired with Equations (1)–(3) and Cairo August 2026 BOQ unit costs (Tables 4 &amp; 5).
        </figcaption>
      </figure>

      {/* Fig. 1 Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Fig. 1 Research Workflow Diagram"
          className="fixed inset-0 z-50 bg-neutral-950/75 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-5xl w-full p-4 sm:p-6 border border-neutral-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <span className="font-display text-sm font-semibold text-neutral-900">
                Fig. 1 — Seven-Stage Research Workflow (Full Vector View)
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-md text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 cursor-pointer"
                aria-label="Close expanded diagram"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={FIG1_WORKFLOW_URL}
              alt="Expanded seven-stage research workflow diagram"
              referrerPolicy="no-referrer"
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}
    </section>
  );
};
