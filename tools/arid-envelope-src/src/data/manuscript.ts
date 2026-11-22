export const FIG1_WORKFLOW_URL = './assets/aistudio/fig1_52223bec.svg';

export const MANUSCRIPT_META = {
  journal: 'Journal of Engineering Sciences (JES), Faculty of Engineering, Assiut University',
  section: 'Part E: Architectural Engineering',
  titleEn:
    'Thermal and Economic Evaluation of External Wall Assemblies for Residential Building Envelopes Under Hot-Arid Conditions: A Case Study from Cairo, Egypt',
  titleAr:
    'الأداء الحراري والاقتصادي لأنظمة العزل في حوائط المباني السكنية بالمناخ الحار الجاف: حالة دراسية من القاهرة',
  keywordsEn: [
    'Building envelope',
    'Cavity wall',
    'Thermal insulation',
    'Cooling energy',
    'Net present value',
    'Hot-arid climate',
  ],
  keywordsAr: [
    'الغلاف الخارجي للمبنى',
    'الحائط المزدوج',
    'العزل الحراري',
    'طاقة التبريد',
    'صافي القيمة الحالية',
    'المناخ الحار الجاف',
  ],
  abstractEn:
    'In hot-arid Cairo, the external wall is a main path of solar heat gain into apartments, yet wall insulation is often chosen on thermal grounds alone. This study evaluates the thermal and economic performance of fourteen external wall assemblies for a typical apartment in the Dar Misr housing project, Cairo: a 25 cm solid brick wall (baseline), an uninsulated double-leaf cavity wall, and twelve cavity walls filled with EPS, XPS, PIR/PUR, or mineral wool at 2, 4, and 6 cm. Annual cooling energy and discomfort hours were simulated in DesignBuilder (EnergyPlus engine) with geometry, schedules, glazing, orientation, and weather held constant. The economic evaluation priced the electricity saved at the August 2026 residential tariff over 25 years and charged each alternative the cost of the cavity masonry, from a Cairo bill of quantities, plus the cost of the insulation. The cavity conversion alone reduced cooling energy by 9.18%; insulation raised the saving to 11.09–14.69%, and PIR/PUR at 6 cm was the thermal optimum. Twelve of the thirteen alternatives were economically viable. The uninsulated cavity wall gave the highest net present value (17,692 EGP) and benefit-cost ratio (2.16), and EPS at 2 cm was the best insulated wall (16,332 EGP; 1.68), whereas the thermal optimum was the only non-viable case (benefit-cost ratio 0.81). No increase in insulation paid for itself on its own savings at the current tariff; insulating the cavity would become worthwhile at about 2.4–2.6 EGP/kWh or if tariffs rose faster than the discount rate. The cavity wall remained the best and PIR/PUR at 6 cm the weakest option by benefit-cost ratio at eight orientations, with three glazing types, and in ten discount-rate and escalation scenarios. Wall specification should therefore follow the decision-maker’s objective rather than assume that the thermal and economic optima coincide.',
  abstractAr:
    'يُعدّ الحائط الخارجي في المناخ الحار الجاف للقاهرة مساراً رئيسياً لاكتساب الحرارة الشمسية داخل الشقق السكنية، ومع ذلك يُختار العزل الحراري للحوائط غالباً على أساس الأداء الحراري وحده. تقيّم هذه الدراسة الأداء الحراري والاقتصادي لأربعة عشر تكويناً للحوائط الخارجية لشقة نموذجية في مشروع دار مصر بالقاهرة: حائط طوب مصمت سمك 25 سم كحالة أساس، وحائط مزدوج بتجويف هوائي غير معزول، واثنتا عشرة حالة يُملأ فيها التجويف بمواد EPS وXPS وPIR/PUR والصوف المعدني بسماكات 2 و4 و6 سم. جرت محاكاة طاقة التبريد السنوية وساعات عدم الراحة الحرارية باستخدام برنامج DesignBuilder بمحرك EnergyPlus مع تثبيت الشكل الهندسي وجداول التشغيل والزجاج والتوجيه وملف الطقس، وقُيّمت الجدوى الاقتصادية على مدى 25 عاماً بتعريفة الكهرباء السكنية لأغسطس 2026، مع تحميل كل بديل فرق تكلفة مباني الحائط المزدوج وفق مقايسة بأسعار القاهرة إضافة إلى تكلفة مادة العزل. خفّض التحول إلى الحائط المزدوج طاقة التبريد بنسبة 9.18%، وارتفع الوفر بإضافة العزل إلى 11.09–14.69%، وكانت PIR/PUR بسمك 6 سم الأفضل حرارياً. اقتصادياً، حققت اثنتا عشرة حالة من ثلاث عشرة جدوى موجبة؛ فسجّل الحائط المزدوج غير المعزول أعلى صافي قيمة حالية (17,692 جنيهاً) وأعلى نسبة منفعة إلى تكلفة (2.16)، وكانت EPS بسمك 2 سم أفضل الحالات المعزولة (16,332 جنيهاً؛ 1.68)، بينما كانت الحالة الأفضل حرارياً هي الوحيدة غير المجدية (0.81). ولم تغطِّ أي زيادة في سمك العزل تكلفتها من وفرها الذاتي بالتعريفة الحالية، وتصبح إضافة العزل مجدية عند تعريفة تقارب 2.4–2.6 جنيه/ك.و.س أو عندما تتصاعد التعريفة بمعدل يفوق معدل الخصم. وظل الحائط المزدوج الأفضل وPIR/PUR بسمك 6 سم الأضعف عبر ثمانية توجيهات وثلاثة أنواع من الزجاج وعشرة سيناريوهات اقتصادية؛ لذا ينبغي اختيار تكوين الحائط وفق هدف صانع القرار، لا على افتراض تطابق الأمثلية الحرارية والاقتصادية.',
};

export interface WorkflowStage {
  step: number;
  title: string;
  detail: string;
  phase: 'thermal' | 'economic';
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: 1,
    title: 'Data audit and validation',
    detail: 'Input geometry, weather, material library, and Cairo BOQ/tariff settings verified.',
    phase: 'thermal',
  },
  {
    step: 2,
    title: 'Definition of 14 wall cases',
    detail: 'W01 25 cm solid baseline, W02 uninsulated cavity, and W03–W14 insulated (EPS, XPS, PIR/PUR, MW; 2–6 cm).',
    phase: 'thermal',
  },
  {
    step: 3,
    title: 'DesignBuilder / EnergyPlus simulation',
    detail: 'Hourly heat-balance model (v2025.1.1 / v23.1.0) at SW 225°, 6 mm single clear glass, Cairo TMY.',
    phase: 'thermal',
  },
  {
    step: 4,
    title: 'Thermal analysis',
    detail: 'Annual cooling energy, savings vs W01/W02, ISO 6946 U-values, and ASHRAE 55 discomfort hours.',
    phase: 'thermal',
  },
  {
    step: 5,
    title: 'Economic analysis',
    detail: 'Cairo masonry BOQ premium (139.43 EGP/m²), insulation cost, SPP, DPP, NPV, BCR, and r/g sensitivity.',
    phase: 'economic',
  },
  {
    step: 6,
    title: 'Thermal vs. economic comparison',
    detail: 'Cross-referencing the thermal optimum (W11) against the economic optimum (W02) and marginal steps.',
    phase: 'economic',
  },
  {
    step: 7,
    title: 'Interpretation & specification',
    detail: 'Two-step Cairo wall specification guidance aligned to owner objective and tariff regime.',
    phase: 'economic',
  },
];

export interface BoundaryConditionRow {
  item: string;
  value: string;
}

export const TABLE2_BOUNDARY_CONDITIONS: BoundaryConditionRow[] = [
  { item: 'Location', value: 'Dar Misr housing project, El Shorouk, Cairo, Egypt (NUCA)' },
  { item: 'Weather file', value: 'Cairo International Airport, Egyptian TMY (WMO 623660)' },
  { item: 'Software', value: 'DesignBuilder v2025.1.1 (interface) with EnergyPlus v23.1.0 engine' },
  { item: 'Building typology', value: 'Residential block, ground + 5 upper floors, 4 apartments per floor' },
  { item: 'Modelled unit', value: 'Typical-floor apartment facing south-west (225°)' },
  { item: 'Floor / external wall area', value: '120.89 m² floor / 109.45 m² external wall; WWR 16.6%' },
  { item: 'Glazing', value: 'Single clear glass 6 mm; U = 5.807 W/(m²·K), SHGC = 0.863' },
  { item: 'Operation schedule', value: 'Occupancy 09:00–22:00; cooling 14:00–23:00 at 25 °C (ASHRAE 55)' },
  { item: 'Cooling & electricity', value: 'Ideal-loads cooling; electricity = cooling energy / 1.32 (η = 0.758)' },
  { item: 'Baseline wall (W01)', value: '20 mm plaster + 250 mm solid brick + 20 mm plaster; U = 2.402 W/(m²·K)' },
  { item: 'Alternative walls (W02–W14)', value: 'Two 120 mm brick leaves + 60 mm cavity (empty or 20/40/60 mm insul.)' },
  { item: 'Baseline cooling result', value: '10,000.04 kWh/yr (82.7 kWh/m²); 1,739.01 discomfort hrs/yr' },
];

export interface OrientationSensitivityRow {
  azimuth: number;
  compass: string;
  w01CoolingKwh: number;
  rank: number;
  cavitySavingPct: number;
  w11SavingPct: number;
  highestNpvWall: string;
  highestNpvEgp: number;
  w03Bcr: number;
  w11Bcr: number;
  nonViable: string;
  spearmanRho: number;
}

export const TABLE15_ORIENTATION_SENSITIVITY: OrientationSensitivityRow[] = [
  { azimuth: 0, compass: 'N', w01CoolingKwh: 9181, rank: 7, cavitySavingPct: 11.32, w11SavingPct: 17.97, highestNpvWall: 'W02', highestNpvEgp: 22062, w03Bcr: 1.88, w11Bcr: 0.91, nonViable: 'W11', spearmanRho: 0.99 },
  { azimuth: 45, compass: 'NE', w01CoolingKwh: 9390, rank: 6, cavitySavingPct: 10.05, w11SavingPct: 15.88, highestNpvWall: 'W02', highestNpvEgp: 18633, w03Bcr: 1.71, w11Bcr: 0.82, nonViable: 'W11', spearmanRho: 1.0 },
  { azimuth: 90, compass: 'E', w01CoolingKwh: 9818, rank: 4, cavitySavingPct: 8.73, w11SavingPct: 13.7, highestNpvWall: 'W02', highestNpvEgp: 15504, w03Bcr: 1.55, w11Bcr: 0.74, nonViable: 'W10, W11', spearmanRho: 0.98 },
  { azimuth: 135, compass: 'SE', w01CoolingKwh: 9415, rank: 5, cavitySavingPct: 9.09, w11SavingPct: 14.4, highestNpvWall: 'W02', highestNpvEgp: 15475, w03Bcr: 1.55, w11Bcr: 0.75, nonViable: 'W10, W11', spearmanRho: 0.98 },
  { azimuth: 180, compass: 'S', w01CoolingKwh: 8569, rank: 8, cavitySavingPct: 10.16, w11SavingPct: 16.34, highestNpvWall: 'W02', highestNpvEgp: 15993, w03Bcr: 1.59, w11Bcr: 0.77, nonViable: 'W10, W11', spearmanRho: 0.98 },
  { azimuth: 225, compass: 'SW', w01CoolingKwh: 10000, rank: 3, cavitySavingPct: 9.18, w11SavingPct: 14.69, highestNpvWall: 'W02', highestNpvEgp: 17692, w03Bcr: 1.68, w11Bcr: 0.81, nonViable: 'W11', spearmanRho: 1.0 },
  { azimuth: 270, compass: 'W', w01CoolingKwh: 11165, rank: 1, cavitySavingPct: 8.96, w11SavingPct: 14.44, highestNpvWall: 'W02', highestNpvEgp: 20674, w03Bcr: 1.84, w11Bcr: 0.89, nonViable: 'W11', spearmanRho: 0.99 },
  { azimuth: 315, compass: 'NW', w01CoolingKwh: 10806, rank: 2, cavitySavingPct: 10.11, w11SavingPct: 16.21, highestNpvWall: 'W04', highestNpvEgp: 24541, w03Bcr: 2.01, w11Bcr: 0.96, nonViable: 'W11', spearmanRho: 0.97 },
];

export interface InsulationUnitCostRow {
  material: string;
  conductivity: number;
  densityKgM3: number;
  pricePerM3: number;
  thicknessCm: number;
  materialCostM2: number;
  installationM2: number;
  totalInsulationM2: number;
}

export const TABLE4_INSULATION_COSTS: InsulationUnitCostRow[] = [
  { material: 'EPS', conductivity: 0.038, densityKgM3: 20, pricePerM3: 2700, thicknessCm: 2, materialCostM2: 54, installationM2: 25, totalInsulationM2: 79 },
  { material: 'EPS', conductivity: 0.038, densityKgM3: 20, pricePerM3: 2700, thicknessCm: 4, materialCostM2: 108, installationM2: 25, totalInsulationM2: 133 },
  { material: 'EPS', conductivity: 0.038, densityKgM3: 20, pricePerM3: 2700, thicknessCm: 6, materialCostM2: 162, installationM2: 25, totalInsulationM2: 187 },
  { material: 'XPS', conductivity: 0.034, densityKgM3: 35, pricePerM3: 3500, thicknessCm: 2, materialCostM2: 70, installationM2: 25, totalInsulationM2: 95 },
  { material: 'XPS', conductivity: 0.034, densityKgM3: 35, pricePerM3: 3500, thicknessCm: 4, materialCostM2: 140, installationM2: 25, totalInsulationM2: 165 },
  { material: 'XPS', conductivity: 0.034, densityKgM3: 35, pricePerM3: 3500, thicknessCm: 6, materialCostM2: 210, installationM2: 25, totalInsulationM2: 235 },
  { material: 'PIR/PUR', conductivity: 0.023, densityKgM3: 32, pricePerM3: 7200, thicknessCm: 2, materialCostM2: 144, installationM2: 25, totalInsulationM2: 169 },
  { material: 'PIR/PUR', conductivity: 0.023, densityKgM3: 32, pricePerM3: 7200, thicknessCm: 4, materialCostM2: 288, installationM2: 25, totalInsulationM2: 313 },
  { material: 'PIR/PUR', conductivity: 0.023, densityKgM3: 32, pricePerM3: 7200, thicknessCm: 6, materialCostM2: 432, installationM2: 25, totalInsulationM2: 457 },
  { material: 'Mineral wool', conductivity: 0.04, densityKgM3: 100, pricePerM3: 4000, thicknessCm: 2, materialCostM2: 80, installationM2: 25, totalInsulationM2: 105 },
  { material: 'Mineral wool', conductivity: 0.04, densityKgM3: 100, pricePerM3: 4000, thicknessCm: 4, materialCostM2: 160, installationM2: 25, totalInsulationM2: 185 },
  { material: 'Mineral wool', conductivity: 0.04, densityKgM3: 100, pricePerM3: 4000, thicknessCm: 6, materialCostM2: 240, installationM2: 25, totalInsulationM2: 265 },
];

export interface MasonryBoqRow {
  item: string;
  solidWallEgpM2: number;
  cavityWallEgpM2: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
}

export const TABLE5_MASONRY_BOQ: MasonryBoqRow[] = [
  { item: 'Materials (brick, cement, sand)', solidWallEgpM2: 239.34, cavityWallEgpM2: 224.26 },
  { item: 'Labour (mason and labourer)', solidWallEgpM2: 170.0, cavityWallEgpM2: 272.0 },
  { item: 'Equipment and tools', solidWallEgpM2: 47.5, cavityWallEgpM2: 70.0 },
  { item: 'Transport and hoisting', solidWallEgpM2: 42.1, cavityWallEgpM2: 39.04 },
  { item: 'Total direct cost', solidWallEgpM2: 498.94, cavityWallEgpM2: 605.3, isSubtotal: true },
  { item: 'Contractor profit and overheads (15%)', solidWallEgpM2: 74.84, cavityWallEgpM2: 90.79 },
  { item: 'VAT (14%)', solidWallEgpM2: 80.33, cavityWallEgpM2: 97.45 },
  { item: 'Total masonry cost (EGP/m²)', solidWallEgpM2: 654.11, cavityWallEgpM2: 793.54, isTotal: true },
];
