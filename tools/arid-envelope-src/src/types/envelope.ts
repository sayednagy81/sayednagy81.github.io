export enum MaterialFamily {
  Baseline = 'Baseline',
  AirCavity = 'Air Cavity',
  EPS = 'EPS',
  XPS = 'XPS',
  PIR = 'PIR/PUR',
  MineralWool = 'Mineral Wool',
}

export enum EconomicTier {
  Reference = 'Reference',
  High = 'High',
  Moderate = 'Moderate',
  Marginal = 'Marginal',
  NonViable = 'Non-viable',
}

export interface RawEnvelopeRow {
  caseId: string;
  wallId: string;
  materialRaw: string;
  materialFamily: MaterialFamily;
  thicknessCm: number;
  thicknessM: number;
  orientation: string;
  glazing: string;
  uValue: number;
  coolingEnergyKwhYr: number;
  thermalDiscomfortHours: number;
  solarGainsNote: string;
  insulationPriceEgpM2: number | null;
  priceUnit: string;
  installationCostEgpM2: number | null;
  sourceFile: string;
}

export type BaselineReferenceId = 'Case-01' | 'Case-02';

export interface EconomicAssumptions {
  wallAreaM2: number;
  electricityTariffEgp: number;
  analysisHorizonYrs: number;
  discountRatePct: number;
  energyEscalationPct: number;
  cavityPremiumEgpM2: number;
  insulationInstallEgpM2: number;
  coolingCop: number;
  baselineReferenceId: BaselineReferenceId;
}

export interface ComputedEnvelopeCase extends RawEnvelopeRow {
  isInsulated: boolean;
  isPricedAlternative: boolean;
  isReference: boolean;
  masonryPremiumEgpM2: number;
  effectiveInstallCostEgpM2: number;
  totalUnitCostEgpM2: number | null;
  totalCapexEgp: number | null;
  coolingSavedKwhYr: number;
  coolingSavedPct: number;
  discomfortSavedHrsYr: number;
  discomfortSavedPct: number;
  uValueReductionPct: number;
  annualElectricitySavedKwhYr: number;
  annualEnergySavingsEgp: number;
  simplePaybackYrs: number | null;
  discountedPaybackYrs: number | null;
  npvEgp: number | null;
  bcr: number | null;
  savingsTolerancePct: number | null;
  economicTier: EconomicTier;
  npvShareOfBestPct: number | null;
  lifecycleDiscountedSavingsEgp: number;
  roiPct: number | null;
  costOfConservedEnergyEgpKwh: number | null;
  unitCostPerKwhSavedEgp: number | null;
  isParetoCostCooling: boolean;
  dominatedByWallId: string | null;
  cumulativeDiscountedCashFlow: number[];
  annualDiscountedSavings: number[];
}

export interface FilterState {
  materials: MaterialFamily[];
  thicknesses: number[];
  paretoOnly: boolean;
  searchQuery: string;
}

export interface MaterialVisualSpec {
  family: MaterialFamily;
  label: string;
  shortLabel: string;
  colorLight: string;
  colorDark: string;
  shape: 'circle' | 'square' | 'diamond' | 'triangle' | 'ring';
  thermalConductivityNote: string;
}
