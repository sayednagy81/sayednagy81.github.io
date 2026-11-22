import React from 'react';
import { Moon, RotateCcw, Sun, X } from 'lucide-react';
import {
  ALL_FAMILIES,
  DEFAULT_ASSUMPTIONS,
  ECONOMIC_PRESETS,
  MATERIAL_SPECS,
  fmtNum,
} from '../data/dataset';
import {
  BaselineReferenceId,
  EconomicAssumptions,
  FilterState,
  MaterialFamily,
} from '../types/envelope';
import { MaterialLegendSwatch } from './MaterialMarker';

interface EconomicSidebarProps {
  assumptions: EconomicAssumptions;
  onChangeAssumptions: (next: EconomicAssumptions) => void;
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const THICKNESS_OPTIONS = [0, 2, 4, 6];

export const EconomicSidebar: React.FC<EconomicSidebarProps> = ({
  assumptions,
  onChangeAssumptions,
  filters,
  onChangeFilters,
  isDark,
  onToggleTheme,
  mobileOpen,
  onCloseMobile,
}) => {
  const updateAssumption = <K extends keyof EconomicAssumptions>(
    key: K,
    value: EconomicAssumptions[K]
  ) => {
    onChangeAssumptions({ ...assumptions, [key]: value });
  };

  const toggleMaterial = (family: MaterialFamily) => {
    const exists = filters.materials.includes(family);
    const next = exists
      ? filters.materials.filter((m) => m !== family)
      : [...filters.materials, family];
    onChangeFilters({ ...filters, materials: next });
  };

  const toggleThickness = (cm: number) => {
    const exists = filters.thicknesses.includes(cm);
    const next = exists
      ? filters.thicknesses.filter((t) => t !== cm)
      : [...filters.thicknesses, cm];
    onChangeFilters({ ...filters, thicknesses: next });
  };

  const resetAll = () => {
    onChangeAssumptions({ ...DEFAULT_ASSUMPTIONS });
    onChangeFilters({
      materials: [...ALL_FAMILIES],
      thicknesses: [...THICKNESS_OPTIONS],
      paretoOnly: false,
      searchQuery: '',
    });
  };

  const content = (
    <div className="flex h-full flex-col overflow-y-auto px-5 py-6 text-sm">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <h2 className="font-display text-sm font-semibold text-neutral-900 dark:text-slate-100">
            Economic Parameters
          </h2>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
            Live recalculation across all charts
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetAll}
            title="Reset parameters and filters"
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Reset parameters and filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close parameters panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Presets */}
      <div className="py-4 border-b border-neutral-200 dark:border-slate-800">
        <p className="text-xs font-medium text-neutral-600 dark:text-slate-400 mb-2.5">
          Scenario Presets
        </p>
        <div className="flex flex-col gap-1.5">
          {ECONOMIC_PRESETS.map((preset) => {
            const isActive =
              Math.abs(assumptions.wallAreaM2 - preset.assumptions.wallAreaM2) < 0.01 &&
              Math.abs(assumptions.electricityTariffEgp - preset.assumptions.electricityTariffEgp) < 0.005 &&
              assumptions.analysisHorizonYrs === preset.assumptions.analysisHorizonYrs &&
              Math.abs(assumptions.discountRatePct - preset.assumptions.discountRatePct) < 0.05 &&
              Math.abs(assumptions.energyEscalationPct - preset.assumptions.energyEscalationPct) < 0.05 &&
              Math.abs(assumptions.cavityPremiumEgpM2 - preset.assumptions.cavityPremiumEgpM2) < 0.05 &&
              Math.abs(assumptions.insulationInstallEgpM2 - preset.assumptions.insulationInstallEgpM2) < 0.05 &&
              Math.abs(assumptions.coolingCop - preset.assumptions.coolingCop) < 0.01 &&
              assumptions.baselineReferenceId === preset.assumptions.baselineReferenceId;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeAssumptions({ ...preset.assumptions })}
                className={`text-left px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 border-blue-600 text-blue-950 dark:bg-blue-950/50 dark:border-blue-400 dark:text-blue-100'
                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-600'
                }`}
              >
                <span className="block text-xs font-semibold leading-tight">
                  {preset.label}
                </span>
                <span className="block text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="py-4 space-y-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="wallAreaInput"
              className="text-xs font-medium text-neutral-700 dark:text-slate-300"
            >
              Exterior Wall Area (A)
            </label>
            <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
              {fmtNum(assumptions.wallAreaM2, Number.isInteger(assumptions.wallAreaM2) ? 0 : 2)} m²
            </span>
          </div>
          <input
            id="wallAreaInput"
            type="range"
            min={30}
            max={400}
            step={5}
            value={assumptions.wallAreaM2}
            onChange={(e) => updateAssumption('wallAreaM2', Number(e.target.value))}
            className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-slate-500 mt-0.5">
            <span>30 m²</span>
            <span>Dar Misr 109.45 m²</span>
            <span>400 m²</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="tariffInput"
              className="text-xs font-medium text-neutral-700 dark:text-slate-300"
            >
              Electricity Tariff (T)
            </label>
            <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
              {fmtNum(assumptions.electricityTariffEgp, 2)} EGP/kWh
            </span>
          </div>
          <input
            id="tariffInput"
            type="range"
            min={0.8}
            max={5.5}
            step={0.02}
            value={assumptions.electricityTariffEgp}
            onChange={(e) =>
              updateAssumption('electricityTariffEgp', Number(e.target.value))
            }
            className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-slate-500 mt-0.5">
            <span>0.80</span>
            <span>Aug &apos;26: 2.18</span>
            <span>5.50</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="cavityPremiumInput"
              className="text-xs font-medium text-neutral-700 dark:text-slate-300"
            >
              Cavity Masonry Premium (ΔCₘ)
            </label>
            <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
              {fmtNum(assumptions.cavityPremiumEgpM2, 2)} EGP/m²
            </span>
          </div>
          <input
            id="cavityPremiumInput"
            type="range"
            min={0}
            max={250}
            step={5}
            value={assumptions.cavityPremiumEgpM2}
            onChange={(e) =>
              updateAssumption('cavityPremiumEgpM2', Number(e.target.value))
            }
            className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-slate-500 mt-0.5">
            <span>0 EGP</span>
            <span>BOQ 139.43</span>
            <span>250 EGP</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label
                htmlFor="installCostInput"
                className="text-[11px] font-medium text-neutral-700 dark:text-slate-300"
              >
                Install Labor
              </label>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                {fmtNum(assumptions.insulationInstallEgpM2, 0)}/m²
              </span>
            </div>
            <input
              id="installCostInput"
              type="range"
              min={0}
              max={80}
              step={5}
              value={assumptions.insulationInstallEgpM2}
              onChange={(e) =>
                updateAssumption('insulationInstallEgpM2', Number(e.target.value))
              }
              className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label
                htmlFor="copInput"
                className="text-[11px] font-medium text-neutral-700 dark:text-slate-300"
              >
                Cooling CoP
              </label>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                {fmtNum(assumptions.coolingCop, 2)}
              </span>
            </div>
            <input
              id="copInput"
              type="range"
              min={1.0}
              max={3.5}
              step={0.04}
              value={assumptions.coolingCop}
              onChange={(e) =>
                updateAssumption('coolingCop', Number(e.target.value))
              }
              className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
            />
            <p className="text-[10px] font-mono text-neutral-400 dark:text-slate-500 mt-0.5 text-right">
              η = {fmtNum(1 / assumptions.coolingCop, 3)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="horizonInput"
              className="text-xs font-medium text-neutral-700 dark:text-slate-300"
            >
              Lifecycle Horizon (N)
            </label>
            <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
              {assumptions.analysisHorizonYrs} yrs
            </span>
          </div>
          <input
            id="horizonInput"
            type="range"
            min={5}
            max={40}
            step={1}
            value={assumptions.analysisHorizonYrs}
            onChange={(e) =>
              updateAssumption('analysisHorizonYrs', Number(e.target.value))
            }
            className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label
                htmlFor="discountInput"
                className="text-[11px] font-medium text-neutral-700 dark:text-slate-300"
              >
                Discount (r)
              </label>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                {fmtNum(assumptions.discountRatePct, 1)}%
              </span>
            </div>
            <input
              id="discountInput"
              type="range"
              min={0}
              max={25}
              step={0.5}
              value={assumptions.discountRatePct}
              onChange={(e) =>
                updateAssumption('discountRatePct', Number(e.target.value))
              }
              className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <label
                htmlFor="escalationInput"
                className="text-[11px] font-medium text-neutral-700 dark:text-slate-300"
              >
                Escalation (g)
              </label>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-neutral-900 dark:text-slate-100">
                {fmtNum(assumptions.energyEscalationPct, 1)}%
              </span>
            </div>
            <input
              id="escalationInput"
              type="range"
              min={0}
              max={25}
              step={0.5}
              value={assumptions.energyEscalationPct}
              onChange={(e) =>
                updateAssumption('energyEscalationPct', Number(e.target.value))
              }
              className="w-full accent-blue-700 dark:accent-blue-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Baseline Reference Toggle */}
        <div>
          <span className="block text-xs font-medium text-neutral-700 dark:text-slate-300 mb-1.5">
            Savings Reference Wall
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-slate-800/80 rounded-md">
            {(
              [
                { id: 'Case-01', label: 'W01 Baseline' },
                { id: 'Case-02', label: 'W02 Cavity' },
              ] as { id: BaselineReferenceId; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateAssumption('baselineReferenceId', opt.id)}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  assumptions.baselineReferenceId === opt.id
                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-slate-950 dark:text-slate-100'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 space-y-4 border-b border-neutral-200 dark:border-slate-800">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-700 dark:text-slate-300">
              Wall Materials
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  materials:
                    filters.materials.length === ALL_FAMILIES.length
                      ? [MaterialFamily.EPS, MaterialFamily.XPS, MaterialFamily.PIR, MaterialFamily.MineralWool]
                      : [...ALL_FAMILIES],
                })
              }
              className="text-[11px] font-medium text-blue-700 hover:underline dark:text-blue-400 cursor-pointer"
            >
              {filters.materials.length === ALL_FAMILIES.length ? 'Insulated only' : 'Select all'}
            </button>
          </div>
          <div className="space-y-1.5">
            {ALL_FAMILIES.map((family) => {
              const checked = filters.materials.includes(family);
              return (
                <label
                  key={family}
                  className="flex items-center gap-2.5 py-1 text-xs text-neutral-700 dark:text-slate-300 cursor-pointer select-none hover:text-neutral-950 dark:hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMaterial(family)}
                    className="rounded border-neutral-300 accent-blue-700 dark:accent-blue-400 cursor-pointer"
                  />
                  <MaterialLegendSwatch family={family} isDark={isDark} />
                  <span className="truncate">{MATERIAL_SPECS[family].shortLabel}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-neutral-700 dark:text-slate-300 mb-2">
            Insulation Thickness
          </span>
          <div className="grid grid-cols-4 gap-1">
            {THICKNESS_OPTIONS.map((cm) => {
              const active = filters.thicknesses.includes(cm);
              return (
                <button
                  key={cm}
                  type="button"
                  onClick={() => toggleThickness(cm)}
                  className={`py-1.5 text-xs font-mono font-medium rounded border transition-colors cursor-pointer ${
                    active
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  {cm === 0 ? '0 cm' : `${cm} cm`}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center justify-between pt-1 cursor-pointer select-none">
          <span className="text-xs font-medium text-neutral-700 dark:text-slate-300">
            Pareto-optimal frontier only
          </span>
          <input
            type="checkbox"
            checked={filters.paretoOnly}
            onChange={(e) =>
              onChangeFilters({ ...filters, paretoOnly: e.target.checked })
            }
            className="rounded border-neutral-300 accent-blue-700 dark:accent-blue-400 cursor-pointer"
          />
        </label>
      </div>

      {/* Appearance & Provenance */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-700 dark:text-slate-300">
            Appearance
          </span>
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-slate-800 text-[11px] leading-relaxed text-neutral-500 dark:text-slate-400 space-y-1">
          <p className="font-medium text-neutral-700 dark:text-slate-300">
            Dataset Scope
          </p>
          <p>14 wall configurations · Southwest (225°) · 6mm Single Clear Glass</p>
          <p>
            Solar gains column flagged missing in the source dataset
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        aria-label="Economic simulation parameters and filters"
        className="hidden lg:block w-[276px] shrink-0 border-r border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#161D24] sticky top-14 h-[calc(100vh-3.5rem)]"
      >
        {content}
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            aria-label="Economic simulation parameters and filters"
            className="relative z-10 w-[300px] max-w-[85vw] bg-white dark:bg-[#161D24] h-full border-r border-neutral-200 dark:border-slate-800"
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
