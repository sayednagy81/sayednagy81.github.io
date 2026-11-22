import {
  ComputedEnvelopeCase,
  EconomicAssumptions,
  EconomicTier,
  MaterialFamily,
  MaterialVisualSpec,
  RawEnvelopeRow,
} from '../types/envelope';

// Exact Manuscript Base Case (Section 3.4, Tables 4, 5, 8, and 9)
export const DEFAULT_ASSUMPTIONS: EconomicAssumptions = {
  wallAreaM2: 109.45,
  electricityTariffEgp: 2.18,
  analysisHorizonYrs: 25,
  discountRatePct: 15.0,
  energyEscalationPct: 15.0,
  cavityPremiumEgpM2: 139.43,
  insulationInstallEgpM2: 25.0,
  coolingCop: 1.32,
  baselineReferenceId: 'Case-01',
};

export interface EconomicPreset {
  id: string;
  label: string;
  description: string;
  assumptions: EconomicAssumptions;
}

export const ECONOMIC_PRESETS: EconomicPreset[] = [
  {
    id: 'manuscript-base',
    label: 'Manuscript Base (r=15%, g=15%)',
    description: '109.45 m² · 2.18 EGP/kWh · ΔCm 139.43 · CoP 1.32',
    assumptions: { ...DEFAULT_ASSUMPTIONS },
  },
  {
    id: 'scenario-h-escalation',
    label: 'Tariff Outpaces Capital (r=10%, g=15%)',
    description: 'Table 12 Scenario H · All 13 viable, W05-EPS6cm optimal',
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      discountRatePct: 10.0,
      energyEscalationPct: 15.0,
    },
  },
  {
    id: 'scenario-a-stress',
    label: 'Higher Cost of Capital (r=20%, g=15%)',
    description: 'Table 12 Scenario A · Only W02 & W03 remain viable',
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      discountRatePct: 20.0,
      energyEscalationPct: 15.0,
    },
  },
  {
    id: 'incremental-cavity',
    label: 'Incremental vs Cavity (Table 14)',
    description: 'Marginal insulation investment over existing W02 cavity',
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      baselineReferenceId: 'Case-02',
    },
  },
];

export const MATERIAL_SPECS: Record<MaterialFamily, MaterialVisualSpec> = {
  [MaterialFamily.EPS]: {
    family: MaterialFamily.EPS,
    label: 'EPS (Expanded Polystyrene)',
    shortLabel: 'EPS',
    colorLight: '#1D4ED8',
    colorDark: '#60A5FA',
    shape: 'circle',
    thermalConductivityNote: 'λ = 0.038 W/(m·K) · 20 kg/m³ · 2,700 EGP/m³',
  },
  [MaterialFamily.XPS]: {
    family: MaterialFamily.XPS,
    label: 'XPS (Extruded Polystyrene)',
    shortLabel: 'XPS',
    colorLight: '#0F766E',
    colorDark: '#2DD4BF',
    shape: 'square',
    thermalConductivityNote: 'λ = 0.034 W/(m·K) · 35 kg/m³ · 3,500 EGP/m³',
  },
  [MaterialFamily.PIR]: {
    family: MaterialFamily.PIR,
    label: 'PIR/PUR (Polyisocyanurate)',
    shortLabel: 'PIR/PUR',
    colorLight: '#B45309',
    colorDark: '#FBBF24',
    shape: 'diamond',
    thermalConductivityNote: 'λ = 0.023 W/(m·K) · 32 kg/m³ · 7,200 EGP/m³',
  },
  [MaterialFamily.MineralWool]: {
    family: MaterialFamily.MineralWool,
    label: 'Mineral Wool',
    shortLabel: 'Mineral Wool',
    colorLight: '#B91C1C',
    colorDark: '#F87171',
    shape: 'triangle',
    thermalConductivityNote: 'λ = 0.040 W/(m·K) · 100 kg/m³ · 4,000 EGP/m³',
  },
  [MaterialFamily.AirCavity]: {
    family: MaterialFamily.AirCavity,
    label: 'Uninsulated Air Cavity (12+6+12 cm)',
    shortLabel: 'Air Cavity',
    colorLight: '#475569',
    colorDark: '#94A3B8',
    shape: 'ring',
    thermalConductivityNote: 'Two 12 cm brick leaves + 6 cm air gap · ΔCm 139.43 EGP/m²',
  },
  [MaterialFamily.Baseline]: {
    family: MaterialFamily.Baseline,
    label: 'Baseline Solid Brick Wall (25 cm)',
    shortLabel: 'Baseline',
    colorLight: '#1E293B',
    colorDark: '#CBD5E1',
    shape: 'ring',
    thermalConductivityNote: '20 mm plaster + 250 mm solid brick + 20 mm plaster · 654.11 EGP/m²',
  },
};

export const INSULATED_FAMILIES: MaterialFamily[] = [
  MaterialFamily.EPS,
  MaterialFamily.XPS,
  MaterialFamily.PIR,
  MaterialFamily.MineralWool,
];

export const ALL_FAMILIES: MaterialFamily[] = [
  MaterialFamily.Baseline,
  MaterialFamily.AirCavity,
  ...INSULATED_FAMILIES,
];

// Embedded copy of the 14-case master dataset (no separate data file is published)
export const EMBEDDED_MASTER_CSV = `Case_ID,Wall_ID,Material,Thickness_cm,Thickness_m,Orientation,Glazing,U_Value_W_m2K,Cooling_Energy_kWh_yr,Thermal_Discomfort_Hours,Solar_Gains_kWh_yr,Insulation_Price,Price_Unit,Installation_Cost,Source_File
Case-01,W01-Baseline,Baseline (existing conventional wall),0.0,0.0,Southwest (225 deg),"Single Clear Glass, 6mm",2.402,10000.04,1739.01,MISSING - not present in supplied data,,,,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-02,W02-Double Air Cavity,Uninsulated cavity wall,0.0,0.0,Southwest (225 deg),"Single Clear Glass, 6mm",1.052,9082.21,1473.0,MISSING - not present in supplied data,,,,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-03,W03-EPS2cm,EPS,2.0,0.02,Southwest (225 deg),"Single Clear Glass, 6mm",0.771,8879.25,1439.24,MISSING - not present in supplied data,54.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-04,W04-EPS4cm,EPS,4.0,0.04,Southwest (225 deg),"Single Clear Glass, 6mm",0.548,8717.54,1422.43,MISSING - not present in supplied data,108.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-05,W05-EPS6cm,EPS,6.0,0.06,Southwest (225 deg),"Single Clear Glass, 6mm",0.426,8626.47,1417.07,MISSING - not present in supplied data,162.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-06,W06-XPS2cm,XPS,2.0,0.02,Southwest (225 deg),"Single Clear Glass, 6mm",0.736,8853.42,1436.78,MISSING - not present in supplied data,70.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-07,W07-XPS4cm,XPS,4.0,0.04,Southwest (225 deg),"Single Clear Glass, 6mm",0.513,8688.97,1421.01,MISSING - not present in supplied data,140.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-08,W08-XPS6cm,XPS,6.0,0.06,Southwest (225 deg),"Single Clear Glass, 6mm",0.394,8601.91,1417.32,MISSING - not present in supplied data,210.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-09,W09-PIR2cm,PIR/PUR,2.0,0.02,Southwest (225 deg),"Single Clear Glass, 6mm",0.61,8759.93,1427.18,MISSING - not present in supplied data,144.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-10,W10-PIR4cm,PIR/PUR,4.0,0.04,Southwest (225 deg),"Single Clear Glass, 6mm",0.398,8606.71,1417.36,MISSING - not present in supplied data,288.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-11,W11-PIR6cm,PIR/PUR,6.0,0.06,Southwest (225 deg),"Single Clear Glass, 6mm",0.296,8530.97,1413.0,MISSING - not present in supplied data,432.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-12,W12-MW2cm,Mineral Wool,2.0,0.02,Southwest (225 deg),"Single Clear Glass, 6mm",0.787,8890.96,1441.4,MISSING - not present in supplied data,80.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-13,W13-MW4cm,Mineral Wool,4.0,0.04,Southwest (225 deg),"Single Clear Glass, 6mm",0.565,8729.16,1425.26,MISSING - not present in supplied data,160.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)
Case-14,W14-MW6cm,Mineral Wool,6.0,0.06,Southwest (225 deg),"Single Clear Glass, 6mm",0.44,8636.35,1419.27,MISSING - not present in supplied data,240.0,EGP/m2,50.0,SW_Wall_Analysis_SingleGlass (Parametric Companion Tables) + 3_Wall_Constructions (Material Library) + Cost Calculator (Cost Database)`;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function classifyMaterial(raw: string): MaterialFamily {
  const normalized = raw.toLowerCase();
  if (normalized.includes('baseline')) return MaterialFamily.Baseline;
  if (normalized.includes('cavity')) return MaterialFamily.AirCavity;
  if (normalized === 'eps') return MaterialFamily.EPS;
  if (normalized === 'xps') return MaterialFamily.XPS;
  if (normalized.includes('pir')) return MaterialFamily.PIR;
  if (normalized.includes('mineral')) return MaterialFamily.MineralWool;
  return MaterialFamily.Baseline;
}

function toNullableNumber(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseEnvelopeCsv(csvText: string): RawEnvelopeRow[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const colIndex = (name: string) => headers.indexOf(name);

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const get = (name: string) => cells[colIndex(name)] ?? '';
    const materialRaw = get('Material');

    return {
      caseId: get('Case_ID'),
      wallId: get('Wall_ID'),
      materialRaw,
      materialFamily: classifyMaterial(materialRaw),
      thicknessCm: Number(get('Thickness_cm')) || 0,
      thicknessM: Number(get('Thickness_m')) || 0,
      orientation: get('Orientation'),
      glazing: get('Glazing'),
      uValue: Number(get('U_Value_W_m2K')) || 0,
      coolingEnergyKwhYr: Number(get('Cooling_Energy_kWh_yr')) || 0,
      thermalDiscomfortHours: Number(get('Thermal_Discomfort_Hours')) || 0,
      solarGainsNote: get('Solar_Gains_kWh_yr'),
      insulationPriceEgpM2: toNullableNumber(get('Insulation_Price')),
      priceUnit: get('Price_Unit') || 'EGP/m2',
      installationCostEgpM2: toNullableNumber(get('Installation_Cost')),
      sourceFile: get('Source_File'),
    };
  });
}

export function computeEnvelopeEconomics(
  rawRows: RawEnvelopeRow[],
  assumptions: EconomicAssumptions
): ComputedEnvelopeCase[] {
  const refRow =
    rawRows.find((r) => r.caseId === assumptions.baselineReferenceId) ?? rawRows[0];

  const r = assumptions.discountRatePct / 100;
  const g = assumptions.energyEscalationPct / 100;
  const n = Math.max(1, Math.round(assumptions.analysisHorizonYrs));
  const eta = 1 / Math.max(0.5, assumptions.coolingCop);

  // Capital Recovery Factor for Cost of Conserved Energy (CCE)
  const crf = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;

  const comparingToSolidBaseline = assumptions.baselineReferenceId === 'Case-01';

  const preliminary: ComputedEnvelopeCase[] = rawRows.map((row) => {
    const isInsulated = row.insulationPriceEgpM2 !== null;
    const isReference = row.caseId === refRow.caseId;

    // When reference is W01 solid brick, W02–W14 are all priced alternatives bearing ΔCm (+ Ci for insulated)
    // When reference is W02 cavity wall, only W03–W14 are priced incremental alternatives bearing Ci only
    const isPricedAlternative = comparingToSolidBaseline
      ? row.caseId !== 'Case-01'
      : isInsulated;

    const masonryPremiumEgpM2 =
      comparingToSolidBaseline && isPricedAlternative
        ? assumptions.cavityPremiumEgpM2
        : 0;

    const effectiveInstallCostEgpM2 = isInsulated
      ? assumptions.insulationInstallEgpM2
      : 0;

    const totalUnitCostEgpM2 = isPricedAlternative
      ? masonryPremiumEgpM2 + (row.insulationPriceEgpM2 ?? 0) + effectiveInstallCostEgpM2
      : null;

    const totalCapexEgp =
      totalUnitCostEgpM2 !== null ? totalUnitCostEgpM2 * assumptions.wallAreaM2 : null;

    const coolingSavedKwhYr = refRow.coolingEnergyKwhYr - row.coolingEnergyKwhYr;
    const coolingSavedPct =
      refRow.coolingEnergyKwhYr > 0
        ? (coolingSavedKwhYr / refRow.coolingEnergyKwhYr) * 100
        : 0;

    const discomfortSavedHrsYr =
      refRow.thermalDiscomfortHours - row.thermalDiscomfortHours;
    const discomfortSavedPct =
      refRow.thermalDiscomfortHours > 0
        ? (discomfortSavedHrsYr / refRow.thermalDiscomfortHours) * 100
        : 0;

    const uValueReductionPct =
      refRow.uValue > 0 ? ((refRow.uValue - row.uValue) / refRow.uValue) * 100 : 0;

    // Eq. (2): S1 = ΔE × η × T
    const annualElectricitySavedKwhYr = coolingSavedKwhYr * eta;
    const annualEnergySavingsEgp =
      annualElectricitySavedKwhYr * assumptions.electricityTariffEgp;

    const simplePaybackYrs =
      totalCapexEgp !== null && annualEnergySavingsEgp > 0
        ? totalCapexEgp / annualEnergySavingsEgp
        : null;

    const annualDiscountedSavings: number[] = [];
    const cumulativeDiscountedCashFlow: number[] = [];
    let pvSavingsSum = 0;

    if (totalCapexEgp !== null) {
      cumulativeDiscountedCashFlow.push(-totalCapexEgp);
    } else {
      cumulativeDiscountedCashFlow.push(0);
    }

    let discountedPaybackYrs: number | null = null;

    // Eq. (3): NPV = Σ S1(1 + g)^(t-1) / (1 + r)^t - C0
    for (let yr = 1; yr <= n; yr++) {
      const nominalSaving = annualEnergySavingsEgp * Math.pow(1 + g, yr - 1);
      const pvSaving = nominalSaving / Math.pow(1 + r, yr);
      annualDiscountedSavings.push(pvSaving);
      pvSavingsSum += pvSaving;

      const prevCum = cumulativeDiscountedCashFlow[yr - 1];
      const currCum = prevCum + pvSaving;
      cumulativeDiscountedCashFlow.push(currCum);

      if (
        discountedPaybackYrs === null &&
        totalCapexEgp !== null &&
        prevCum < 0 &&
        currCum >= 0 &&
        pvSaving > 0
      ) {
        discountedPaybackYrs = yr - 1 + Math.abs(prevCum) / pvSaving;
      }
    }

    const npvEgp = totalCapexEgp !== null ? pvSavingsSum - totalCapexEgp : null;
    const bcr =
      totalCapexEgp !== null && totalCapexEgp > 0 ? pvSavingsSum / totalCapexEgp : null;
    const savingsTolerancePct =
      bcr !== null && bcr > 1 ? (1 - 1 / bcr) * 100 : null;
    const roiPct =
      totalCapexEgp !== null && totalCapexEgp > 0 && npvEgp !== null
        ? (npvEgp / totalCapexEgp) * 100
        : null;

    const costOfConservedEnergyEgpKwh =
      totalCapexEgp !== null && annualElectricitySavedKwhYr > 0
        ? (totalCapexEgp * crf) / annualElectricitySavedKwhYr
        : null;

    const unitCostPerKwhSavedEgp =
      totalCapexEgp !== null && coolingSavedKwhYr > 0
        ? totalCapexEgp / coolingSavedKwhYr
        : null;

    return {
      ...row,
      isInsulated,
      isPricedAlternative,
      isReference,
      masonryPremiumEgpM2,
      effectiveInstallCostEgpM2,
      totalUnitCostEgpM2,
      totalCapexEgp,
      coolingSavedKwhYr,
      coolingSavedPct,
      discomfortSavedHrsYr,
      discomfortSavedPct,
      uValueReductionPct,
      annualElectricitySavedKwhYr,
      annualEnergySavingsEgp,
      simplePaybackYrs,
      discountedPaybackYrs,
      npvEgp,
      bcr,
      savingsTolerancePct,
      economicTier: EconomicTier.Reference,
      npvShareOfBestPct: null,
      lifecycleDiscountedSavingsEgp: pvSavingsSum,
      roiPct,
      costOfConservedEnergyEgpKwh,
      unitCostPerKwhSavedEgp,
      isParetoCostCooling: false,
      dominatedByWallId: null,
      cumulativeDiscountedCashFlow,
      annualDiscountedSavings,
    };
  });

  // Assign Economic Performance Tiers per Table 10 (High >= 85%, Moderate 50–85%, Marginal < 50%, Non-viable <= 0)
  const priced = preliminary.filter(
    (c) => c.isPricedAlternative && c.totalUnitCostEgpM2 !== null
  );
  const maxPositiveNpv = Math.max(
    0,
    ...priced.map((c) => (c.npvEgp !== null ? c.npvEgp : 0))
  );

  for (const item of priced) {
    if (item.npvEgp === null || item.npvEgp <= 0) {
      item.economicTier = EconomicTier.NonViable;
      item.npvShareOfBestPct = null;
    } else if (maxPositiveNpv > 0) {
      const share = (item.npvEgp / maxPositiveNpv) * 100;
      item.npvShareOfBestPct = share;
      if (share >= 85) item.economicTier = EconomicTier.High;
      else if (share >= 50) item.economicTier = EconomicTier.Moderate;
      else item.economicTier = EconomicTier.Marginal;
    }
  }

  // Pareto optimality check among all priced alternatives (minimize unit cost, maximize cooling savings)
  for (const candidate of priced) {
    let dominator: ComputedEnvelopeCase | null = null;
    for (const other of priced) {
      if (other.caseId === candidate.caseId) continue;
      const otherCost = other.totalUnitCostEgpM2!;
      const candCost = candidate.totalUnitCostEgpM2!;
      const betterOrEqualCost = otherCost <= candCost;
      const betterOrEqualSavings = other.coolingSavedKwhYr >= candidate.coolingSavedKwhYr;
      const strictlyBetter =
        otherCost < candCost || other.coolingSavedKwhYr > candidate.coolingSavedKwhYr;

      if (betterOrEqualCost && betterOrEqualSavings && strictlyBetter) {
        if (!dominator || other.coolingSavedKwhYr > dominator.coolingSavedKwhYr) {
          dominator = other;
        }
      }
    }
    candidate.isParetoCostCooling = dominator === null;
    candidate.dominatedByWallId = dominator ? dominator.wallId : null;
  }

  return preliminary;
}

export function fmtNum(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function fmtEgp(val: number | null | undefined, decimals = 0): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '—';
  const sign = val < 0 ? '−' : '';
  return `${sign}${fmtNum(Math.abs(val), decimals)} EGP`;
}

export function fmtSignedEgp(val: number | null | undefined, decimals = 0): string {
  if (val === null || val === undefined || !Number.isFinite(val)) return '—';
  const sign = val > 0 ? '+' : val < 0 ? '−' : '';
  return `${sign}${fmtNum(Math.abs(val), decimals)} EGP`;
}

