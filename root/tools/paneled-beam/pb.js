/* Paneled Beam (crossed beam) calculator: shared engine, drawings and interface.
   Both Paneled_Beam_Calculator_AR.html and Paneled_Beam_Calculator_EN.html load this file,
   so the two language versions always run the same calculations.
   Educational preliminary sizing only; not a structural analysis or a code-compliant design. */
(function (root) {
  'use strict';

  /* ===================================================================== */
  /* 1. Engine (pure functions, also used by tests/test_paneled_beam.js)   */
  /* ===================================================================== */
  const EPS = 1e-9;
  // Round up to a step, ignoring floating point noise such as 30.000000000000004
  const ceilTo = (v, step) => Math.ceil(v / step - 1e-7) * step;

  const LIMITS = {
    spacingMin: 2, spacingMax: 4, panelArea: 16, panelRatio: 4 / 3,
    hallAreaMin: 60, hallAreaMax: 180, dimMin: 2, dimMax: 60,
    colMin: 25, colStep: 5, colAreaTolerance: 0.10, columnsMin: 4, columnsMax: 24
  };

  // Illustrative, editable teaching presets (kN/m2). NOT verified Egyptian code values.
  const PRESETS = {
    school: { D: 6, LL: 3 },
    office: { D: 6, LL: 3 },
    assembly: { D: 6, LL: 5 }
  };

  const DEFAULTS = {
    L: 14, Ls: 12, pw: 25, iw: 25, grid: 0,
    occupancy: 'school', D: 6, LL: 3, deadMode: 'superimposed', gc: 25, gD: 1.4, gL: 1.6, floors: 4,
    columns: 4, dist: 'balanced', fcu: 25, fy: 360, rho: 1, alpha: 0.35, beta: 0.67, maxRatio: 2,
    ampEdge: 1, ampCorner: 1, aPos: 40, bPos: 60, slabs: 0, mode: 'continuous', ratio: 1.5, choice: {}
  };

  /** Slab and beam depths from the hall width Ls (m). Results in cm. */
  function sizing(Ls) {
    const slabRaw = 100 * Ls / 45, perRaw = 100 * Ls / 16, intRaw = 100 * Ls / 24;
    return { slabRaw, slab: ceilTo(slabRaw, 1), perRaw, per: ceilTo(perRaw, 5), intRaw, int: ceilTo(intRaw, 5) };
  }

  /** All regular beam grids that satisfy spacing 2-4 m, panel area <= 16 m2 and aspect ratio <= 4:3. */
  function gridOptions(L, Ls, lim = LIMITS) {
    const out = [];
    for (let nx = 1; nx <= Math.floor(L / lim.spacingMin + EPS); nx++) {
      const a = L / nx;
      if (a > lim.spacingMax + EPS || a < lim.spacingMin - EPS) continue;
      for (let ny = 1; ny <= Math.floor(Ls / lim.spacingMin + EPS); ny++) {
        const b = Ls / ny;
        if (b > lim.spacingMax + EPS || b < lim.spacingMin - EPS) continue;
        const area = a * b, ratio = Math.max(a, b) / Math.min(a, b);
        if (area > lim.panelArea + EPS || ratio > lim.panelRatio + EPS) continue;
        out.push({ nx, ny, a, b, area, ratio, score: 2 * (ratio - 1) + Math.abs(a - 3) + Math.abs(b - 3) });
      }
    }
    return out.sort((p, q) => p.score - q.score || p.nx * p.ny - q.nx * q.ny);
  }

  /** Perimeter columns of one slab: four corners plus extra columns spread over the allowed sides.
      Coordinates: x along L (0..L), y along Ls (0..Ls). Sides: 0 y=0, 1 x=L, 2 y=Ls, 3 x=0.
      allowed[j] = false keeps extra columns off side j (used for a beam shared with a neighbouring slab). */
  function columnLayout(L, Ls, count, dist, allowed = [true, true, true, true]) {
    count = Math.max(LIMITS.columnsMin, Math.min(LIMITS.columnsMax, Math.round(count)));
    const len = [L, Ls, L, Ls], k = [0, 0, 0, 0], longX = L >= Ls;
    const pref = j => {
      const isX = j % 2 === 0;
      if (dist === 'long') return isX === longX ? 1000 : 1;
      if (dist === 'short') return isX !== longX ? 1000 : 1;
      return 1;
    };
    for (let e = count - 4; e > 0; e--) {
      let best = -1, bestScore = -Infinity;
      for (let j = 0; j < 4; j++) {
        if (!allowed[j]) continue;
        let score = len[j] / (k[j] + 1) * pref(j);
        if (len[j] / (k[j] + 2) < LIMITS.spacingMin - EPS) score /= 1e6; // keep columns at least 2 m apart when possible
        if (score > bestScore + 1e-9) { bestScore = score; best = j; }
      }
      if (best < 0) break;
      k[best]++;
    }
    let pts = [{ x: 0, y: 0 }, { x: L, y: 0 }, { x: L, y: Ls }, { x: 0, y: Ls }];
    for (let j = 0; j < 4; j++) {
      for (let i = 1; i <= k[j]; i++) {
        const t = i / (k[j] + 1);
        pts.push(j === 0 ? { x: t * L, y: 0 } : j === 1 ? { x: L, y: t * Ls } : j === 2 ? { x: (1 - t) * L, y: Ls } : { x: 0, y: (1 - t) * Ls });
      }
    }
    const perimeter = 2 * (L + Ls);
    const u = p => p.y === 0 ? p.x : p.x === L ? L + p.y : p.y === Ls ? L + Ls + (L - p.x) : 2 * L + Ls + (Ls - p.y);
    pts = pts.map(p => ({ ...p, u: u(p) })).sort((a, b) => a.u - b.u);
    return pts.map((p, i) => {
      const prev = pts[(i + pts.length - 1) % pts.length].u, next = pts[(i + 1) % pts.length].u;
      const left = (p.u - prev + perimeter) % perimeter, right = (next - p.u + perimeter) % perimeter;
      const zone = (left + right) / 2;
      const corner = (p.x === 0 || p.x === L) && (p.y === 0 || p.y === Ls);
      const side = corner ? 'corner' : (p.y === 0 || p.y === Ls) ? 'X' : 'Y';
      return { id: i + 1, x: p.x, y: p.y, corner, side, zone, At: L * Ls * zone / perimeter };
    });
  }

  /** Ways to split a hall larger than 180 m2 into k equal slabs along L, each 60-180 m2. */
  function splitOptions(L, Ls, lim = LIMITS) {
    const out = [];
    for (let k = 2; k <= 30; k++) {
      const Li = L / k;
      if (Li < lim.dimMin - EPS) break;
      const a = Li * Ls;
      if (a <= lim.hallAreaMax + EPS && a >= lim.hallAreaMin - EPS) out.push(k);
    }
    return out;
  }

  /** Self-weight of slab and downstand beams, averaged over the slab area (kN/m2). */
  function selfWeight(L, Ls, grid, sz, pw, iw, gc) {
    const A = L * Ls, t = sz.slab / 100;
    const perLen = 2 * (L + Ls);
    const perVol = perLen * (pw / 100) * Math.max(0, sz.per - sz.slab) / 100;
    const intLen = grid ? (grid.nx - 1) * Ls + (grid.ny - 1) * L : 0;
    const intVol = intLen * (iw / 100) * Math.max(0, sz.int - sz.slab) / 100;
    const slab = gc * t, beams = gc * (perVol + intVol) / A;
    return { slab, beams, total: slab + beams, perLen, perVol, intLen, intVol };
  }

  /** Smallest practical rectangle b x h (cm) with b, h multiples of 5, >= 25, h/b <= maxRatio and b*h >= req.
      Among sections within +10 % of the smallest area, the most balanced one is chosen. */
  function chooseSection(req, maxRatio = 2, lim = LIMITS) {
    const step = lim.colStep, min = lim.colMin;
    const cands = [];
    const bMax = Math.max(min, ceilTo(Math.sqrt(Math.max(req, 0)), step)) + 2 * step;
    for (let b = min; b <= bMax; b += step) {
      const h = Math.max(b, ceilTo(req / b, step));
      if (h / b > maxRatio + EPS) continue;
      cands.push({ b, h, area: b * h, ratio: h / b });
    }
    const minA = Math.min(...cands.map(c => c.area));
    return cands.filter(c => c.area <= minA * (1 + lim.colAreaTolerance) + EPS)
      .sort((p, q) => p.ratio - q.ratio || p.area - q.area)[0];
  }

  /** Practical sections for a required area: b, h multiples of 5 cm, at least 25 cm, h/b up to 3,
      area not more than 30 % above the smallest one, plus one 30 cm wide section in every case.
      Sorted from square to elongated. */
  function sectionOptions(req, lim = LIMITS) {
    const step = lim.colStep, min = lim.colMin, out = [];
    const bMax = Math.max(min, ceilTo(Math.sqrt(Math.max(req, 0)), step)) + 2 * step;
    for (let b = min; b <= bMax; b += step) {
      const h = Math.max(b, ceilTo(req / b, step));
      if (h / b > 3 + EPS) continue;
      out.push({ b, h, area: b * h, ratio: h / b });
    }
    const minA = Math.min(...out.map(c => c.area));
    const seen = new Set(); // one option per side ratio (the smaller one)
    const opts = out.filter(c => c.area <= minA * 1.3 + EPS);
    // a 30 cm wide column (to fit a 30 cm wall) is always offered, even when it is long or larger than needed
    if (!opts.some(c => c.b === 30 || c.h === 30)) {
      const h = Math.max(30, ceilTo(req / 30, step));
      opts.push({ b: 30, h, area: 30 * h, ratio: h / 30, wall: true });
    }
    return opts.sort((p, q) => p.ratio - q.ratio || p.area - q.area)
      .filter(c => { const k = c.ratio.toFixed(3); if (seen.has(k) && !c.wall) return false; seen.add(k); return true; });
  }

  /** The option whose side ratio is closest to the target ratio (smaller area on a tie). */
  function recommendSection(options, ratio) {
    return options.slice().sort((p, q) => Math.abs(p.ratio - ratio) - Math.abs(q.ratio - ratio) || p.area - q.area)[0];
  }

  /** Field ranges used for validation. */
  const RANGES = {
    L: [2, 60], Ls: [2, 60], floors: [1, 30], D: [0, 30], LL: [0, 20], gc: [18, 30], gD: [1, 2], gL: [1, 2],
    fcu: [15, 60], fy: [240, 600], rho: [0.5, 4], alpha: [0.2, 0.6], beta: [0.4, 0.9], maxRatio: [1, 3],
    ampEdge: [1, 2], ampCorner: [1, 2], columns: [4, 24]
  };

  function validate(inp) {
    const errors = {};
    for (const [k, [lo, hi]] of Object.entries(RANGES)) {
      const v = inp[k];
      if (!Number.isFinite(v)) errors[k] = 'required';
      else if (v < lo - EPS || v > hi + EPS) errors[k] = 'range';
    }
    if (Number.isFinite(inp.floors) && Math.round(inp.floors) !== inp.floors) errors.floors = 'integer';
    return errors;
  }

  /** Full calculation. A hall over 180 m2 is split into equal slabs along L:
      'separate'  = each slab has its own perimeter beams and four corner columns (a joint between them);
      'continuous' = neighbouring slabs share the dividing beam, treated as a perimeter beam with the
                     perimeter-beam size of the larger slab, and share the columns at its ends. */
  function calculate(raw) {
    const inp = { ...DEFAULTS, ...raw };
    const errors = validate(inp);
    const res = { inp, errors, warnings: [] };
    if (errors.L || errors.Ls) return res;
    const { L, Ls, pw, iw } = inp;
    const area = L * Ls;
    res.area = area;
    res.splitOptions = area > LIMITS.hallAreaMax + EPS ? splitOptions(L, Ls) : [];
    let k = 1, mode = 'single';
    if (res.splitOptions.length) {
      k = res.splitOptions.includes(inp.slabs) ? inp.slabs : res.splitOptions[0];
      mode = inp.mode === 'separate' ? 'separate' : 'continuous';
      res.warnings.push('split');
    } else if (area < LIMITS.hallAreaMin - EPS || area > LIMITS.hallAreaMax + EPS) res.warnings.push('hallArea');
    if (Ls > L + EPS) res.warnings.push('lsLonger');
    const baseWarnings = [...res.warnings];
    // separate slabs: the joint must be wide enough for the twin columns on each side of it
    return build(mode === 'separate' ? pw / 100 : 0, 0);

    function build(joint, depth) {
    res.warnings = [...baseWarnings];
    const Li = (L - (k - 1) * joint) / k;
    const short = k > 1 ? Math.min(Li, Ls) : Ls; // for split slabs the rules use the shorter side of each slab
    res.sz = sizing(short);
    res.grids = gridOptions(Li, Ls);
    res.grid = res.grids[Math.min(inp.grid || 0, Math.max(0, res.grids.length - 1))] || null;
    if (!res.grid) res.warnings.push('noGrid');
    res.slabs = Array.from({ length: k }, (_, i) => ({ id: i + 1, x0: i * (Li + joint), L: Li, Ls, area: Li * Ls }));
    // all slabs are equal, so the larger slab's perimeter beam is the same as every slab's
    res.split = { k, mode, joint, Li, short, sharedDepth: res.sz.per };

    // beam axes: beamsV run along Y at x, beamsH run along X at y (segments x0..x1)
    const g = res.grid, pwm = pw / 100, iwm = iw / 100;
    res.beamsV = []; res.beamsH = [];
    res.slabs.forEach((sl, i) => {
      const xs = g ? Array.from({ length: g.nx + 1 }, (_, j) => sl.x0 + j * Li / g.nx) : [sl.x0, sl.x0 + Li];
      xs.forEach((x, j) => {
        const edge = j === 0 || j === xs.length - 1;
        if (mode === 'continuous' && j === 0 && i > 0) return; // shared beam already added by the previous slab
        const shared = mode === 'continuous' && j === xs.length - 1 && i < k - 1;
        res.beamsV.push({ x, w: edge ? pwm : iwm, d: shared ? res.split.sharedDepth : edge ? res.sz.per : res.sz.int,
          kind: shared ? 'shared' : edge ? 'per' : 'int', y0: 0, y1: Ls });
      });
    });
    const ys = g ? Array.from({ length: g.ny + 1 }, (_, j) => j * Ls / g.ny) : [0, Ls];
    const segs = mode === 'separate' ? res.slabs.map(sl => [sl.x0, sl.x0 + Li]) : [[0, L]];
    ys.forEach((y, j) => {
      const edge = j === 0 || j === ys.length - 1;
      segs.forEach(([a, b]) => res.beamsH.push({ y, w: edge ? pwm : iwm, d: edge ? res.sz.per : res.sz.int, kind: edge ? 'per' : 'int', x0: a, x1: b }));
    });

    const gc = Number.isFinite(inp.gc) ? inp.gc : 25;
    const one = selfWeight(Li, Ls, res.grid, res.sz, pw, iw, gc);
    const slabArea = Li * Ls * k;
    let weight = one.total * slabArea;
    // a shared beam would otherwise be counted once for each slab
    if (mode === 'continuous') weight -= (k - 1) * gc * Ls * pwm * Math.max(0, res.sz.per - res.sz.slab) / 100;
    res.sw = { ...one, beams: weight / slabArea - one.slab, total: weight / slabArea };
    res.loadArea = slabArea;
    if (Object.keys(errors).length) return res;

    const Dtot = inp.deadMode === 'superimposed' ? inp.D + res.sw.total : inp.D;
    if (inp.deadMode === 'total' && inp.D < res.sw.total - EPS) res.warnings.push('deadBelowSelf');
    const ws = Dtot + inp.LL, wu = inp.gD * Dtot + inp.gL * inp.LL;
    const sigma = inp.alpha * inp.fcu + inp.beta * inp.fy * inp.rho / 100; // N/mm2
    res.loads = { Dtot, ws, wu, sigma, Ps: ws * slabArea * inp.floors, Pu: wu * slabArea * inp.floors };

    // columns: each slab's own layout, then columns at the same point (ends of a shared beam) are merged
    const merged = new Map();
    res.slabs.forEach((sl, i) => {
      const allowed = [true, true, true, true];
      if (mode === 'continuous') { if (i < k - 1) allowed[1] = false; if (i > 0) allowed[3] = false; }
      columnLayout(Li, Ls, inp.columns, inp.dist, allowed).forEach(c => {
        const x = c.x + sl.x0, key = `${x.toFixed(6)},${c.y.toFixed(6)}`;
        if (merged.has(key)) { const m = merged.get(key); m.At += c.At; m.shared = true; m.slabs.push(sl.id); }
        else merged.set(key, { x, y: c.y, At: c.At, slabCorner: c.corner, side: c.side, shared: false, slabs: [sl.id] });
      });
    });
    const near = (a, b) => Math.abs(a - b) < 1e-6;
    const onOuter = c => near(c.y, 0) || near(c.y, Ls) || near(c.x, 0) || near(c.x, L);
    const u = c => near(c.y, 0) ? c.x : near(c.x, L) ? L + c.y : near(c.y, Ls) ? L + Ls + (L - c.x) : near(c.x, 0) ? 2 * L + Ls + (Ls - c.y) : 10 * (L + Ls) + c.x * 100 + c.y;
    const cornerAlongX = (mode === 'separate' ? Li : L) >= Ls;
    const base = [...merged.values()].sort((a, b) => u(a) - u(b)).map((c, i) => {
      const corner = mode === 'separate' ? c.slabCorner : (near(c.x, 0) || near(c.x, L)) && (near(c.y, 0) || near(c.y, Ls));
      const side = c.shared ? 'X' : corner ? 'corner' : c.side === 'corner' ? 'X' : c.side;
      const amp = corner ? inp.ampCorner : inp.ampEdge;
      const Ps = ws * c.At * inp.floors, Pu = wu * c.At * inp.floors * amp;
      const req = Pu * 1000 / sigma / 100; // cm2
      return { id: i + 1, x: c.x, y: c.y, corner, side, shared: c.shared, outer: onOuter(c), slabs: c.slabs, At: c.At, amp, Ps, Pu, req,
        group: c.shared ? 'shared' : corner ? 'corner' : 'edge' };
    });
    // one section per column type (corner, edge, shared), sized for the most loaded column of the type
    const ratio = Number.isFinite(inp.ratio) && inp.ratio >= 1 ? inp.ratio : DEFAULTS.ratio;
    const choice = inp.choice || {};
    res.groups = ['corner', 'edge', 'shared'].map(key => {
      const members = base.filter(c => c.group === key);
      if (!members.length) return null;
      const req = Math.max(...members.map(c => c.req));
      const options = sectionOptions(req);
      const rec = recommendSection(options, ratio);
      const chosen = options.find(o => `${o.b}x${o.h}` === choice[key]) || rec;
      return { key, ids: members.map(c => c.id), req, options, rec, chosen };
    }).filter(Boolean);
    res.columns = base.map(c => {
      const sec = res.groups.find(gr => gr.key === c.group).chosen;
      // long side parallel to the edge it sits on; corners follow the longer side of their slab (or hall)
      const alongX = c.side === 'X' || (c.corner && cornerAlongX);
      return { ...c, b: sec.b, h: sec.h, provided: sec.area, ratio: sec.ratio, util: c.req / sec.area,
        dx: (alongX ? sec.h : sec.b) / 100, dy: (alongX ? sec.b : sec.h) / 100 };
    });
    const gaps = arr => { const v = [...arr].sort((a, b) => a - b), d = []; for (let i = 0; i + 1 < v.length; i++) d.push(v[i + 1] - v[i]); return d; };
    res.spacing = { L: gaps(res.columns.filter(c => near(c.y, 0)).map(c => c.x)), Ls: gaps(res.columns.filter(c => near(c.x, 0)).map(c => c.y)) };
    if (res.columns.some(c => Math.max(c.b, c.h) > 100)) res.warnings.push('bigColumn');
    if (mode === 'separate' && depth < 5) {
      const atJoint = res.columns.filter(c => c.x > 1e-6 && c.x < L - 1e-6);
      const need = Math.max(0, ...atJoint.map(c => c.dx));
      if (need > joint + 1e-9) return build(need, depth + 1);
    }
    return res;
    }
  }

  const engine = { LIMITS, PRESETS, DEFAULTS, RANGES, ceilTo, sizing, gridOptions, columnLayout, splitOptions, sectionOptions, recommendSection, selfWeight, chooseSection, validate, calculate };
  if (typeof module !== 'undefined' && module.exports) module.exports = engine;
  root.PaneledBeam = engine;
  if (typeof document === 'undefined') return;

  /* ===================================================================== */
  /* 2. Text in both languages                                              */
  /* ===================================================================== */
  const STR = {
    en: {
      slabsWord: 'slabs', joint: 'joint', legShared: 'Shared beam', sharedBeam: 'Shared beam', contOver: 'continuous over the shared beam', shared: 'Shared',
      splitInfo: 'The hall is larger than 180 m², so it is divided into equal paneled slabs of 60–180 m² each, separated by beams across the length L.',
      slabsCount: 'Number of slabs', modeLabel: 'How neighbouring slabs meet',
      modes: { separate: 'separate', continuous: 'continuous', single: 'single' },
      modeOpts: { continuous: 'Continuous: slabs share the dividing beam and its columns', separate: 'Separate: each slab has its own beams and 4 corner columns' },
      modeNote: 'Simple (separate) slabs: each slab is a hall of its own, with its own perimeter beams and four corner columns, and a joint between neighbouring slabs. Continuous slabs: neighbouring slabs share the dividing beam. It is treated as a perimeter beam with the perimeter-beam size of the larger slab, internal beams run continuously over it, and the columns at its ends carry load from both slabs. The Ls/45, Ls/16 and Ls/24 rules are for the simple case, so continuous sizing is only a rough preliminary estimate: continuity creates a negative moment over the shared beam, which needs top reinforcement.',
      eachSlab: 'Each slab', slabRuleSide: 'For split slabs the rules use the shorter side of each slab',
      colCountSlab: 'Perimeter columns per slab',
      c1: 'Number of columns', c2: 'Ratio of column width to length', c3: 'Required cross-section area', c4: 'Column section options',
      ratioLabel: 'Width : length', spacingL: 'Column spacing along L', spacingLs: 'Column spacing along Ls',
      groupNames: { corner: 'Corner columns', edge: 'Edge columns', shared: 'Columns at the shared beam' },
      wallOpt: 'width 30 cm (fits a 30 cm wall)', reqArea: 'Required area', colSection: 'Section (cm)', okCheck: 'Provided ≥ required', recLabel: 'closest to the chosen ratio',
      areaNote: 'The required area grows with the floors carried and with the distance between columns, and falls when you add columns. It comes from built-in teaching loads for an educational building (finishes 6 kN/m² plus the slab and beam self-weight, live load 3 kN/m²), which are not shown here.',
      optNote: 'Every option has at least the required area, with both sides in multiples of 5 cm and at least 25 cm. A 30 cm wide option is always offered; when the load is high it becomes long. ★ marks the option closest to the chosen ratio. Click any option to use it in the plan and sections.',
      steps: ['Hall geometry', 'Beam grid and slab', 'Column sizing', 'Structural plan', 'Sections A–A and B–B', 'Summary and exports'],
      step: 'Step',
      L: 'Hall length L (m)', Ls: 'Hall width Ls (m)', example: 'Load example 12 × 14 m', reset: 'Reset',
      geoNote: 'L runs along X, Ls along Y. All dimensions are between beam axes. The slab and beam depths below are all taken from the width Ls.',
      area: 'Hall area', areaRange: 'Allowed range for one paneled slab: 60–180 m²',
      gridRule: 'The hall is divided into panels by internal beams spaced 2–4 m in each direction, with a panel area of no more than 16 m² and a long-to-short side ratio of no more than 4:3. Internal beam intersections never get columns.',
      gridChoice: 'Beam grid', panels: 'Panels', division: 'Division', panelSize: 'Panel size', ratio: 'Aspect ratio', panelArea: 'Panel area',
      pw: 'Perimeter beam width (cm)', iw: 'Internal beam width (cm)',
      sizeRule: 'Educational preliminary rules, not code-certified formulas: slab thickness = Ls/45 (rounded up to the next cm), perimeter beam overall depth = Ls/16 and internal beam overall depth = Ls/24 (rounded up to the next 5 cm). The beam depth includes the slab; the drop below the slab = depth − slab thickness.',
      element: 'Element', rule: 'Rule', calc: 'Calculated', adopted: 'Adopted', section: 'Section (b × depth)', drop: 'Drop below slab',
      slab: 'Slab', perBeam: 'Perimeter beam', intBeam: 'Internal beam',
      occupancy: 'Occupancy', occ: { school: 'School / classrooms', office: 'Government / administrative offices', assembly: 'Public service / assembly', custom: 'Custom' },
      D: 'Dead load D (kN/m²)', LL: 'Live load L (kN/m²)', deadMode: 'D represents', deadModes: { superimposed: 'Superimposed load only (finishes, partitions); self-weight added automatically', total: 'Total dead load including self-weight' },
      floors: 'Floors supported by the columns n', gc: 'Concrete unit weight (kN/m³)', gD: 'Dead load factor', gL: 'Live load factor',
      loadNote: 'The presets are illustrative, editable teaching assumptions, not verified Egyptian code values. The load factors are also editable; check them against the code edition you use. This calculator does not claim compliance with any code.',
      selfSlab: 'Slab self-weight', selfBeams: 'Beam downstands (averaged over the hall)', selfTotal: 'Self-weight of slab and beams',
      dTotal: 'Total dead load used', service: 'Service load w = D + L', factored: 'Factored load wu = γD·D + γL·L',
      serviceHall: 'Service load on the hall, all floors', factoredHall: 'Factored load on the hall, all floors', perM2: 'kN/m²',
      colCount: 'Perimeter columns', dist: 'Extra columns go', dists: { balanced: 'Balanced around the perimeter', long: 'On the long sides first', short: 'On the short sides first' },
      fcu: 'Concrete strength fcu (N/mm²)', fy: 'Steel yield fy (N/mm²)', rho: 'Steel ratio ρ (%)', maxRatio: 'Maximum side ratio h/b',
      advanced: 'More assumptions', alpha: 'Concrete stress factor α', beta: 'Steel stress factor β', ampEdge: 'Load allowance, edge columns', ampCorner: 'Load allowance, corner columns',
      capNote: 'Preliminary effective stress σ = α·fcu + β·fy·ρ. This resembles the short tied-column expressions in some codes but is not verified against any code edition, and ignores moments, slenderness and column self-weight. The load allowances (1.0 = none) let you increase edge and corner column loads to reflect bending.',
      tribNote: 'Tributary area: the hall area is shared among the perimeter columns in proportion to half the distance to each neighbouring column along the perimeter. This is a teaching approximation only; it is not a structural analysis of the beam reactions.',
      sizeNote: 'Sections are searched automatically: both sides are multiples of 5 cm, at least 25 cm, with h/b no more than the maximum ratio. Among sections within 10% of the smallest valid area, the most balanced one is chosen. The provided area is never less than the required area, but that alone does not make a column safe.',
      col: 'Column', type: 'Type', corner: 'Corner', edge: 'Edge', At: 'Tributary area (m²)', Ps: 'Service load (kN)', Pu: 'Factored load (kN)',
      req: 'Required area (cm²)', b: 'b (cm)', h: 'h (cm)', provided: 'Provided area (cm²)', util: 'Utilization', total: 'Total',
      sigma: 'Effective stress σ', cols: 'Columns', sizes: 'Section range', maxUtil: 'Highest utilization',
      planTitle: 'STRUCTURAL FRAMING PLAN', planSub: 'Perimeter columns only · no columns at internal beam intersections',
      dimNote: 'Dimensions in metres between beam axes',
      legCol: 'Column (calculated section)', legPer: 'Perimeter beam', legInt: 'Internal beam', legCut: 'Section line',
      aPos: 'Position of A–A across Ls', bPos: 'Position of B–B along L',
      dragNote: 'Drag the red section lines on the plan, or use the sliders. A–A runs along X, B–B along Y. Only elements that the line actually cuts are drawn as cut.',
      secTitle: 'SECTION', cutAt: 'cut at', of: 'of', dirX: 'X direction', dirY: 'Y direction',
      vScale: 'Horizontal and vertical scales differ: vertical scale exaggerated ×', hScaleOnly: 'Same horizontal and vertical scale',
      top: 'Top of slab ±0.00', soffit: 'soffit', colCut: 'cut', noCols: 'No columns are cut by this line',
      longBeam: 'cut along its length',
      sumTitle: 'Calculation summary', item: 'Item', value: 'Value',
      dlPlan: 'Download plan (SVG)', dlA: 'Download section A–A (SVG)', dlB: 'Download section B–B (SVG)', print: 'Print / save as PDF',
      err: { required: 'Enter a number.', range: 'Allowed range: ', integer: 'Enter a whole number.' },
      warn: {
        hallArea: 'The hall area is outside the 60–180 m² range set for one paneled slab. The results are shown for teaching, but this system is not intended for this size.',
        lsLonger: 'Ls is larger than L. Ls is normally the shorter side, and all depths here are taken from Ls.',
        noGrid: 'No regular grid meets all limits (2–4 m spacing, panel ≤ 16 m², ratio ≤ 4:3). Change the hall dimensions or the structural system. Internal beams are not drawn.',
        deadBelowSelf: 'D is smaller than the calculated self-weight of the slab and beams. Increase D or choose “superimposed load only”.',
        bigColumn: 'At least one column side exceeds 100 cm. Consider more perimeter columns or another structural system.',
        split: 'The hall is larger than 180 m², so the calculator divides it into several slabs (step 1).'
      },
      limits: 'Limits of this calculator: educational preliminary sizing for architecture students. It does not check bending, shear, deflection, punching, slenderness, reinforcement or detailing, and it is not a substitute for structural analysis or code-compliant design by a structural engineer.',
      m: 'm', cm: 'cm', kN: 'kN', none: '—', yes: 'yes', no: 'no',
      fileTag: 'en'
    },
    ar: {
      slabsWord: 'بلاطات', joint: 'فاصل', legShared: 'كمرة مشتركة', sharedBeam: 'الكمرة المشتركة', contOver: 'مستمرة فوق الكمرة المشتركة', shared: 'مشترك',
      splitInfo: 'مساحة القاعة أكبر من 180 م²، لذلك تُقسَّم إلى بلاطات متساوية من الكمرات المتقاطعة، كل منها بين 60 و180 م²، تفصل بينها كمرات عبر الطول L.',
      slabsCount: 'عدد البلاطات', modeLabel: 'طريقة التقاء البلاطات المتجاورة',
      modes: { separate: 'منفصلة', continuous: 'مستمرة', single: 'واحدة' },
      modeOpts: { continuous: 'مستمرة: تشترك البلاطات في الكمرة الفاصلة وأعمدتها', separate: 'منفصلة: لكل بلاطة كمراتها و4 أعمدة ركنية خاصة بها' },
      modeNote: 'البلاطات البسيطة (المنفصلة): كل بلاطة قاعة مستقلة لها كمراتها المحيطية وأعمدتها الركنية الأربعة، وبين البلاطتين المتجاورتين فاصل. البلاطات المستمرة: تشترك البلاطتان المتجاورتان في الكمرة الفاصلة، وتُعامَل كمرة محيطية بمقاس الكمرة المحيطية للبلاطة الأكبر، وتمر الكمرات الداخلية فوقها مستمرة، والأعمدة عند طرفيها تحمل من البلاطتين. قواعد Ls/45 وLs/16 وLs/24 وُضعت للحالة البسيطة، لذلك يبقى تقدير الحالة المستمرة مبدئيًا تقريبيًا: الاستمرار يُحدث عزمًا سالبًا فوق الكمرة المشتركة يحتاج إلى تسليح علوي.',
      eachSlab: 'كل بلاطة', slabRuleSide: 'في البلاطات المقسَّمة تُطبَّق القواعد على الضلع الأقصر لكل بلاطة',
      colCountSlab: 'عدد الأعمدة المحيطية لكل بلاطة',
      c1: 'عدد الأعمدة', c2: 'النسبة بين عرض العمود وطوله', c3: 'مساحة المقطع المطلوبة', c4: 'اختيارات قطاع العمود',
      ratioLabel: 'العرض : الطول', spacingL: 'التباعد بين الأعمدة على الطول L', spacingLs: 'التباعد بين الأعمدة على العرض Ls',
      groupNames: { corner: 'الأعمدة الركنية', edge: 'الأعمدة الطرفية', shared: 'أعمدة الكمرة المشتركة' },
      wallOpt: 'بعرض 30 سم (يناسب حائط 30 سم)', reqArea: 'المساحة المطلوبة', colSection: 'القطاع (سم)', okCheck: 'المقترحة ≥ المطلوبة', recLabel: 'الأقرب للنسبة المختارة',
      areaNote: 'تزيد المساحة المطلوبة مع عدد الأدوار المحمولة ومع المسافة بين الأعمدة، وتقل كلما زاد عدد الأعمدة. وهي محسوبة من أحمال تعليمية ثابتة لمبنى تعليمي (تشطيبات 6 كيلونيوتن/م² مع وزن البلاطة والكمرات، وحمل حي 3 كيلونيوتن/م²) لا تظهر هنا.',
      optNote: 'كل اختيار مساحته لا تقل عن المطلوبة، وضلعاه من مضاعفات 5 سم ولا يقلان عن 25 سم. ويظهر دائمًا اختيار بعرض 30 سم، ويطول كلما زاد الحمل. العلامة ★ على الاختيار الأقرب للنسبة المختارة. اضغط أي اختيار لاستخدامه في المسقط والقطاعات.',
      steps: ['أبعاد القاعة', 'شبكة الكمرات والبلاطة', 'قطاعات الأعمدة', 'المسقط الإنشائي', 'القطاعان A–A وB–B', 'الملخص والتصدير'],
      step: 'الخطوة',
      L: 'طول القاعة L (م)', Ls: 'عرض القاعة Ls (م)', example: 'مثال قاعة 12 × 14 م', reset: 'إعادة الضبط',
      geoNote: 'الطول L في اتجاه X، والعرض Ls في اتجاه Y. كل الأبعاد بين محاور الكمرات. أعماق البلاطة والكمرات كلها تُحسب من العرض Ls.',
      area: 'مساحة القاعة', areaRange: 'المدى المسموح للبلاطة الواحدة: 60–180 م²',
      gridRule: 'تُقسَّم القاعة إلى بلاطات صغيرة (Panels) بكمرات داخلية تتباعد من 2 إلى 4 م في كل اتجاه، ومساحة البلاطة الصغيرة لا تزيد على 16 م²، ونسبة ضلعها الأطول إلى الأقصر لا تزيد على 4:3. لا توضع أعمدة عند تقاطع الكمرات الداخلية.',
      gridChoice: 'شبكة الكمرات', panels: 'عدد البلاطات الصغيرة', division: 'التقسيم', panelSize: 'مقاس البلاطة الصغيرة', ratio: 'نسبة الضلعين', panelArea: 'مساحة البلاطة الصغيرة',
      pw: 'عرض الكمرة المحيطية (سم)', iw: 'عرض الكمرة الداخلية (سم)',
      sizeRule: 'قواعد تعليمية مبدئية وليست معادلات كود معتمدة: سمك البلاطة = Ls/45 ويُقرَّب لأعلى لأقرب سنتيمتر، والعمق الكلي للكمرة المحيطية = Ls/16 وللكمرة الداخلية = Ls/24 ويُقرَّبان لأعلى لأقرب 5 سم. عمق الكمرة يشمل البلاطة، وسقوطها أسفل البلاطة = العمق − سمك البلاطة.',
      element: 'العنصر', rule: 'القاعدة', calc: 'المحسوب', adopted: 'المعتمد', section: 'القطاع (العرض × العمق)', drop: 'السقوط أسفل البلاطة',
      slab: 'البلاطة', perBeam: 'الكمرة المحيطية', intBeam: 'الكمرة الداخلية',
      occupancy: 'نوع الاستخدام', occ: { school: 'مدرسة / فصول دراسية', office: 'مكاتب حكومية وإدارية', assembly: 'مبنى خدمات عامة / تجمعات', custom: 'قيم مخصصة' },
      D: 'الحمل الميت D (كيلونيوتن/م²)', LL: 'الحمل الحي L (كيلونيوتن/م²)', deadMode: 'يمثل الحمل D', deadModes: { superimposed: 'الأحمال الإضافية فقط (التشطيبات والقواطيع)، ويُضاف الوزن الذاتي تلقائيًا', total: 'الحمل الميت الكلي شاملًا الوزن الذاتي' },
      floors: 'عدد الأدوار المحمولة على الأعمدة n', gc: 'وزن الخرسانة (كيلونيوتن/م³)', gD: 'معامل الحمل الميت', gL: 'معامل الحمل الحي',
      loadNote: 'القيم الجاهزة افتراضات تعليمية توضيحية قابلة للتعديل، وليست قيمًا معتمدة من الكود المصري. ومعاملا الأحمال قابلان للتعديل أيضًا؛ راجعهما على إصدار الكود الذي تستخدمه. الحاسبة لا تدّعي المطابقة لأي كود.',
      selfSlab: 'الوزن الذاتي للبلاطة', selfBeams: 'سقوط الكمرات (موزعًا على مساحة القاعة)', selfTotal: 'الوزن الذاتي للبلاطة والكمرات',
      dTotal: 'الحمل الميت الكلي المستخدم', service: 'حمل التشغيل w = D + L', factored: 'الحمل التصميمي المصعَّد wu = γD·D + γL·L',
      serviceHall: 'حمل التشغيل على القاعة لكل الأدوار', factoredHall: 'الحمل المصعَّد على القاعة لكل الأدوار', perM2: 'كيلونيوتن/م²',
      colCount: 'عدد الأعمدة المحيطية', dist: 'توزيع الأعمدة الإضافية', dists: { balanced: 'متوازن على محيط القاعة', long: 'على الضلعين الطويلين أولًا', short: 'على الضلعين القصيرين أولًا' },
      fcu: 'مقاومة الخرسانة fcu (نيوتن/مم²)', fy: 'إجهاد خضوع الحديد fy (نيوتن/مم²)', rho: 'نسبة الحديد ρ (%)', maxRatio: 'أقصى نسبة بين ضلعي العمود h/b',
      advanced: 'افتراضات إضافية', alpha: 'معامل إجهاد الخرسانة α', beta: 'معامل إجهاد الحديد β', ampEdge: 'زيادة حمل الأعمدة الطرفية', ampCorner: 'زيادة حمل الأعمدة الركنية',
      capNote: 'الإجهاد الفعّال المبدئي σ = α·fcu + β·fy·ρ. تشبه هذه الصيغة معادلات الأعمدة القصيرة ذات الكانات في بعض الأكواد، لكنها غير مراجَعة على أي إصدار كود، وتهمل العزوم والنحافة والوزن الذاتي للعمود. ومعاملا الزيادة (1.0 = بلا زيادة) يسمحان بزيادة أحمال الأعمدة الطرفية والركنية لتمثيل أثر العزوم.',
      tribNote: 'مساحة التحميل: تُوزَّع مساحة القاعة على الأعمدة المحيطية بنسبة نصف المسافة إلى كل عمود مجاور على المحيط. هذا تقريب تعليمي فقط، وليس تحليلًا إنشائيًا لردود أفعال الكمرات.',
      sizeNote: 'يُبحث عن القطاع تلقائيًا: كل ضلع من مضاعفات 5 سم ولا يقل عن 25 سم، ونسبة h/b لا تزيد على الحد الأقصى. ومن بين القطاعات التي لا تزيد مساحتها على أصغر مساحة صالحة بأكثر من 10% يُختار الأكثر توازنًا. المساحة المقترحة لا تقل أبدًا عن المطلوبة، لكن ذلك وحده لا يعني أن العمود آمن.',
      col: 'العمود', type: 'النوع', corner: 'ركني', edge: 'طرفي', At: 'مساحة التحميل (م²)', Ps: 'حمل التشغيل (كيلونيوتن)', Pu: 'الحمل المصعَّد (كيلونيوتن)',
      req: 'المساحة المطلوبة (سم²)', b: 'b (سم)', h: 'h (سم)', provided: 'المساحة المقترحة (سم²)', util: 'نسبة الاستغلال', total: 'الإجمالي',
      sigma: 'الإجهاد الفعّال σ', cols: 'الأعمدة', sizes: 'مدى القطاعات', maxUtil: 'أعلى نسبة استغلال',
      planTitle: 'المسقط الإنشائي', planSub: 'أعمدة على المحيط فقط · لا أعمدة عند تقاطع الكمرات الداخلية',
      dimNote: 'الأبعاد بالمتر بين محاور الكمرات',
      legCol: 'عمود (القطاع المحسوب)', legPer: 'كمرة محيطية', legInt: 'كمرة داخلية', legCut: 'خط قطاع',
      aPos: 'موضع A–A على العرض Ls', bPos: 'موضع B–B على الطول L',
      dragNote: 'اسحب خطي القطاع الأحمرين على المسقط، أو استخدم المؤشرين. القطاع A–A في اتجاه X، وB–B في اتجاه Y. لا يُرسم مقطوعًا إلا ما يقطعه الخط فعلًا.',
      secTitle: 'قطاع', cutAt: 'عند', of: 'من', dirX: 'اتجاه X', dirY: 'اتجاه Y',
      vScale: 'المقياسان الأفقي والرأسي مختلفان: المقياس الرأسي مكبَّر ×', hScaleOnly: 'المقياس الأفقي والرأسي متساويان',
      top: 'سطح البلاطة ±0.00', soffit: 'بطن', colCut: 'مقطوع', noCols: 'لا يقطع هذا الخط أي عمود',
      longBeam: 'مقطوعة بطولها',
      sumTitle: 'ملخص الحسابات', item: 'البند', value: 'القيمة',
      dlPlan: 'تنزيل المسقط (SVG)', dlA: 'تنزيل القطاع A–A (SVG)', dlB: 'تنزيل القطاع B–B (SVG)', print: 'طباعة / حفظ PDF',
      err: { required: 'أدخل رقمًا.', range: 'المدى المسموح: ', integer: 'أدخل عددًا صحيحًا.' },
      warn: {
        hallArea: 'مساحة القاعة خارج المدى المحدد للبلاطة الواحدة (60–180 م²). النتائج معروضة للتعلم، لكن هذا النظام غير مقصود لهذه المساحة.',
        lsLonger: 'العرض Ls أكبر من الطول L. المعتاد أن يكون Ls هو الضلع الأقصر، وكل الأعماق هنا تُحسب من Ls.',
        noGrid: 'لا توجد شبكة منتظمة تحقق كل الشروط (تباعد 2–4 م، بلاطة صغيرة ≤ 16 م²، نسبة ≤ 4:3). غيّر أبعاد القاعة أو النظام الإنشائي. لم تُرسم الكمرات الداخلية.',
        deadBelowSelf: 'الحمل D أقل من الوزن الذاتي المحسوب للبلاطة والكمرات. زِد D أو اختر «الأحمال الإضافية فقط».',
        bigColumn: 'ضلع عمود واحد على الأقل يزيد على 100 سم. فكّر في زيادة الأعمدة المحيطية أو تغيير النظام الإنشائي.',
        split: 'مساحة القاعة أكبر من 180 م²، لذلك تقسمها الحاسبة إلى عدة بلاطات (الخطوة 1).'
      },
      limits: 'حدود هذه الحاسبة: تقدير مبدئي تعليمي لطلاب العمارة. لا تفحص العزوم ولا القص ولا الترخيم ولا الثقب ولا النحافة ولا التسليح ولا التفاصيل، ولا تغني عن التحليل الإنشائي والتصميم المطابق للكود بواسطة مهندس إنشائي.',
      m: 'م', cm: 'سم', kN: 'كيلونيوتن', none: '—', yes: 'نعم', no: 'لا',
      fileTag: 'ar'
    }
  };

  /* ===================================================================== */
  /* 3. Drawings (SVG strings with explicit colours, so downloads look the same) */
  /* ===================================================================== */
  const C = { ink: '#1b2433', muted: '#5b6575', dim: '#6b7686', per: '#13294b', int: '#5d86a8', panel: '#f1f5f9', col: '#c98a3c', colEdge: '#7a4b1c', cut: '#b3263e', slab: '#dbe6ef', shared: '#7a3e8f', colShared: '#dfa45a' };
  const f2 = v => String(Number(v.toFixed(2)));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hatch = id => `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#c9d6e2"/><line x1="0" y1="0" x2="0" y2="7" stroke="#55708a" stroke-width="1.3"/></pattern>`;
  const hatchCol = id => `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="7" height="7" fill="#ecc690"/><line x1="0" y1="0" x2="0" y2="7" stroke="#9a6326" stroke-width="1.3"/></pattern>`;

  // Arabic labels are laid out right to left; text-anchor start/end are swapped so the label keeps its position
  const ARABIC = /[؀-ۿ]/;
  function svgText(x, y, s, o = {}) {
    const size = o.size || 13, fill = o.fill || C.ink, weight = o.weight ? ` font-weight="${o.weight}"` : '';
    const rtl = ARABIC.test(String(s));
    let anchor = o.anchor || 'middle';
    if (rtl && anchor !== 'middle') anchor = anchor === 'start' ? 'end' : 'start';
    const rot = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : '';
    const dir = rtl ? ' direction="rtl" unicode-bidi="embed"' : '';
    return `<text x="${f2(x)}" y="${f2(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${dir}${weight}${rot}>${esc(s)}</text>`;
  }
  const ln = (x1, y1, x2, y2, stroke = C.dim, w = 1, dash = '') =>
    `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const rect = (x, y, w, h, fill, stroke = 'none', sw = 1, extra = '') =>
    `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(Math.max(w, 0))}" height="${f2(Math.max(h, 0))}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`;
  const tick = (x, y) => ln(x - 4, y + 4, x + 4, y - 4, C.ink, 1.2);
  function dimH(x1, x2, y, label, size = 12) {
    return ln(x1, y, x2, y, C.ink, 0.9) + tick(x1, y) + tick(x2, y) + svgText((x1 + x2) / 2, y - 6, label, { size });
  }
  function dimV(y1, y2, x, label, size = 12) {
    return ln(x, y1, x, y2, C.ink, 0.9) + tick(x, y1) + tick(x, y2) + svgText(x - 7, (y1 + y2) / 2, label, { size, rot: -90 });
  }
  const svgWrap = (w, h, body, label, defs = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" direction="ltr" font-family="Arial, Tahoma, sans-serif"><defs>${defs}</defs>${rect(0, 0, w, h, '#ffffff')}${body}</svg>`;

  function planSVG(r, T, aFrac, bFrac) {
    const { L, Ls } = r.inp, g = r.grid, sp = r.split;
    const W = 1000, H = 800, boxW = 600, boxH = 430;
    const s = Math.min(boxW / L, boxH / Ls);
    const ww = L * s, hh = Ls * s, ox = 40 + (W - ww) / 2, oy = 205 + (boxH - hh) / 2;
    const X = x => ox + x * s, Y = y => oy + y * s;
    let o = svgText(W / 2, 34, T.planTitle, { size: 21, weight: 700 }) + svgText(W / 2, 58, sp.k > 1 ? `${T.planSub} · ${sp.k} ${T.slabsWord} (${T.modes[sp.mode]})` : T.planSub, { size: 13, fill: C.muted });
    r.slabs.forEach(sl => { o += rect(X(sl.x0), oy, sl.L * s, hh, C.panel); });
    const colorOf = b => b.kind === 'int' ? C.int : b.kind === 'shared' ? C.shared : C.per;
    const drawV = b => { const ext = b.kind === 'int' ? 0 : b.w * s / 2; return rect(X(b.x) - b.w * s / 2, Y(b.y0) - ext, b.w * s, (b.y1 - b.y0) * s + 2 * ext, colorOf(b)); };
    const drawH = b => { const ext = b.kind === 'int' ? 0 : b.w * s / 2; return rect(X(b.x0) - ext, Y(b.y) - b.w * s / 2, (b.x1 - b.x0) * s + 2 * ext, b.w * s, colorOf(b)); };
    // perimeter and shared beams first; internal beams on top, so continuity over the shared beam is visible
    r.beamsV.filter(b => b.kind !== 'int').forEach(b => { o += drawV(b); });
    r.beamsH.filter(b => b.kind !== 'int').forEach(b => { o += drawH(b); });
    r.beamsV.filter(b => b.kind === 'int').forEach(b => { o += drawV(b); });
    r.beamsH.filter(b => b.kind === 'int').forEach(b => { o += drawH(b); });
    // joints between separate slabs
    if (sp.mode === 'separate') r.slabs.slice(0, -1).forEach(sl => {
      const xj = X(sl.x0 + sl.L + sp.joint / 2);
      o += ln(xj, oy - 14, xj, oy + hh + 14, C.cut, 1, '3 3') + svgText(xj, oy + hh + 26, T.joint, { size: 10, fill: C.cut });
    });
    // panel and slab labels
    r.slabs.forEach(sl => {
      if (g && g.a * s > 62 && g.b * s > 26) {
        for (let i = 0; i < g.nx; i++) for (let j = 0; j < g.ny; j++)
          o += svgText(X(sl.x0 + (i + 0.5) * g.a), Y((j + 0.5) * g.b) + 4, `${f2(g.a)}×${f2(g.b)}`, { size: 11, fill: C.muted });
      }
      if (sp.k > 1) o += `<g opacity="0.75">${rect(X(sl.x0 + sl.L / 2) - 30, Y(Ls / 2) - 15, 60, 24, '#ffffff', C.per, 1)}</g>` + svgText(X(sl.x0 + sl.L / 2), Y(Ls / 2) + 3, `S${sl.id}`, { size: 14, weight: 700, fill: C.per });
    });
    // grid bubbles: numbers along X, letters along Y; axes closer than 26 px share one bubble
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const xs = [...new Set(r.beamsV.map(b => +b.x.toFixed(6)))].sort((a, b) => a - b);
    const ys = [...new Set(r.beamsH.map(b => +b.y.toFixed(6)))].sort((a, b) => a - b);
    let lastX = -1e9, n = 0;
    xs.forEach(x => { if (X(x) - lastX < 26) return; lastX = X(x); n++; o += ln(X(x), oy - 104, X(x), oy - 8, '#9aa6b5', 0.8, '6 4') + `<circle cx="${f2(X(x))}" cy="${f2(oy - 120)}" r="13" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/>` + svgText(X(x), oy - 115.5, String(n), { size: 12, weight: 700 }); });
    ys.forEach((y, j) => { o += ln(ox - 104, Y(y), ox - 8, Y(y), '#9aa6b5', 0.8, '6 4') + `<circle cx="${f2(ox - 120)}" cy="${f2(Y(y))}" r="13" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/>` + svgText(ox - 120, Y(y) + 4.5, letters[j] || String(j + 1), { size: 12, weight: 700 }); });
    // dimension chains: spacing then overall; labels are skipped where a segment is too short to read
    for (let i = 0; i + 1 < xs.length; i++) { const d = xs[i + 1] - xs[i]; o += dimH(X(xs[i]), X(xs[i + 1]), oy - 52, d * s >= 26 ? f2(d) : '', 11); }
    o += dimH(ox, ox + ww, oy - 80, `L = ${f2(L)} m`, 13);
    for (let j = 0; j + 1 < ys.length; j++) o += dimV(Y(ys[j]), Y(ys[j + 1]), ox - 52, f2(ys[j + 1] - ys[j]), 11);
    o += dimV(oy, oy + hh, ox - 80, `Ls = ${f2(Ls)} m`, 13);
    // columns at calculated size and orientation; labels move outwards when they would overlap
    const boxes = [];
    (r.columns || []).forEach(c => {
      const cw = c.dx * s, ch = c.dy * s;
      o += rect(X(c.x) - cw / 2, Y(c.y) - ch / 2, cw, ch, c.shared ? C.colShared : C.col, C.colEdge, 1.2);
      const label = `C${c.id} ${c.b}×${c.h}`, lw = label.length * 6.4;
      const nx = c.x < 1e-6 ? -1 : c.x > L - 1e-6 ? 1 : 0, ny = c.y < 1e-6 ? -1 : c.y > Ls - 1e-6 ? 1 : 0;
      const sideY = nx !== 0 && ny === 0;
      let tx = sideY ? X(c.x) - nx * 10 : X(c.x) + nx * (12 + cw / 2), ty = sideY ? Y(c.y) - ch / 2 - 6 : Y(c.y) + (ny < 0 ? -(ch / 2 + 8) : ch / 2 + 18);
      const anchor = sideY ? (nx < 0 ? 'start' : 'end') : nx < 0 ? 'end' : nx > 0 ? 'start' : 'middle';
      const box = () => { const x1 = anchor === 'start' ? tx : anchor === 'end' ? tx - lw : tx - lw / 2; return [x1, ty - 10, x1 + lw, ty + 2]; };
      for (let tries = 0; tries < 6 && boxes.some(b => { const a = box(); return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]; }); tries++) ty += sideY ? -14 : (ny < 0 ? -13 : 13);
      boxes.push(box());
      o += svgText(tx, ty, label, { size: 11, anchor, fill: C.colEdge, weight: 700 });
    });
    // section lines (draggable on screen)
    const ay = Y(Ls * aFrac), bx = X(L * bFrac);
    const marker = (x, y, label, dir) => {
      const pts = dir === 'up' ? `${x - 9},${y + 6} ${x + 9},${y + 6} ${x},${y - 9}` : `${x + 6},${y - 9} ${x + 6},${y + 9} ${x - 9},${y}`;
      return `<polygon points="${pts}" fill="${C.cut}"/>` + (dir === 'up'
        ? svgText(x + 13, y + 5, label, { size: 15, weight: 700, fill: C.cut, anchor: 'start' })
        : svgText(x, y - 13, label, { size: 15, weight: 700, fill: C.cut }));
    };
    o += `<g class="pb-cut" data-cut="a">${ln(ox - 22, ay, ox + ww + 30, ay, C.cut, 2.4, '12 6')}<line x1="${f2(ox - 22)}" y1="${f2(ay)}" x2="${f2(ox + ww + 30)}" y2="${f2(ay)}" stroke="transparent" stroke-width="22" style="cursor:ns-resize"/></g>`;
    o += marker(ox - 26, ay, 'A', 'left') + marker(ox + ww + 44, ay, 'A', 'left');
    o += `<g class="pb-cut" data-cut="b">${ln(bx, oy - 18, bx, oy + hh + 30, C.cut, 2.4, '12 6')}<line x1="${f2(bx)}" y1="${f2(oy - 18)}" x2="${f2(bx)}" y2="${f2(oy + hh + 30)}" stroke="transparent" stroke-width="22" style="cursor:ew-resize"/></g>`;
    o += marker(bx, oy + hh + 44, 'B', 'up') + marker(bx, oy - 22, 'B', 'up');
    // legend
    const ly = H - 34;
    const items = [[rect(0, -11, 16, 14, C.col, C.colEdge), T.legCol], [rect(0, -8, 26, 8, C.per), T.legPer], [rect(0, -7, 26, 6, C.int), T.legInt]];
    if (sp.mode === 'continuous') items.push([rect(0, -8, 26, 8, C.shared), T.legShared]);
    items.push([ln(0, -4, 26, -4, C.cut, 2.4, '8 4'), T.legCut]);
    let lx = 40;
    items.forEach(([sw, label]) => { o += `<g transform="translate(${lx},${ly})">${sw}</g>` + svgText(lx + 34, ly, label, { size: 12, anchor: 'start' }); lx += 34 + label.length * 6.6 + 26; });
    o += svgText(W - 24, H - 8, T.dimNote, { size: 11, anchor: 'end', fill: C.muted });
    return { svg: svgWrap(W, H, o, T.planTitle), geo: { ox, oy, ww, hh, s } };
  }

  function sectionSVG(r, T, axis, frac) {
    const { L, Ls, pw, iw } = r.inp, sz = r.sz, sp = r.split;
    const alongX = axis === 'X';
    const len = alongX ? L : Ls, cross = alongX ? Ls : L, cut = cross * frac;
    const W = 1000, H = 470, x0 = 190, Wd = 640, top = 120;
    const sH = Wd / len;
    const t = sz.slab / 100, dP = Math.max(sz.per, sp.sharedDepth) / 100, dI = sz.int / 100;
    const sV = Math.max(sH, 120 / dP);
    const ex = sV / sH;
    const X = p => x0 + p * sH, Yd = d => top + d * sV;
    const name = alongX ? 'A–A' : 'B–B';
    const pwm = pw / 100;
    let o = svgText(W / 2, 32, `${T.secTitle} ${name} — ${alongX ? T.dirX : T.dirY}`, { size: 20, weight: 700 });
    o += svgText(W / 2, 54, `${T.cutAt} ${f2(cut)} ${T.m} ${T.of} ${f2(cross)} ${T.m}`, { size: 12, fill: C.muted });
    // beams crossing the line (cut across) and beams lying on it (cut along their length)
    let perp, along;
    if (alongX) {
      perp = r.beamsV.map(b => ({ p: b.x, w: b.w, d: b.d / 100, kind: b.kind }));
      along = r.beamsH.filter(b => Math.abs(cut - b.y) <= b.w / 2 + EPS).map(b => { const ext = b.kind === 'int' ? 0 : pwm / 2; return { a: b.x0 - ext, b: b.x1 + ext, d: b.d / 100, kind: b.kind }; });
    } else {
      const seen = new Set();
      perp = r.beamsH.filter(b => { const ext = b.kind === 'int' ? 0 : pwm / 2; return cut >= b.x0 - ext - EPS && cut <= b.x1 + ext + EPS; })
        .map(b => ({ p: b.y, w: b.w, d: b.d / 100, kind: b.kind })).filter(b => { const key = b.p.toFixed(6); if (seen.has(key)) return false; seen.add(key); return true; });
      along = r.beamsV.filter(b => Math.abs(cut - b.x) <= b.w / 2 + EPS).map(b => ({ a: -pwm / 2, b: Ls + pwm / 2, d: b.d / 100, kind: b.kind }));
    }
    const slabs = alongX ? r.slabs.map(sl => [sl.x0 - pwm / 2, sl.x0 + sl.L + pwm / 2])
      : r.slabs.filter(sl => cut >= sl.x0 - pwm / 2 - EPS && cut <= sl.x0 + sl.L + pwm / 2 + EPS).slice(0, 1).map(() => [-pwm / 2, Ls + pwm / 2]);
    const colorOf = k => k === 'shared' ? C.shared : C.per;
    along.forEach(b => { o += rect(X(b.a), top, (b.b - b.a) * sH, b.d * sV, 'url(#hb)', colorOf(b.kind), 1); });
    slabs.forEach(([a, b]) => { o += rect(X(a), top, (b - a) * sH, t * sV, 'url(#hb)', C.per, 1); });
    perp.forEach(b => { o += rect(X(b.p) - b.w * sH / 2, top, Math.max(3, b.w * sH), b.d * sV, 'url(#hb)', colorOf(b.kind), 1.2); });
    // joints between separate slabs
    if (alongX && sp.mode === 'separate') r.slabs.slice(0, -1).forEach(sl => { const xj = X(sl.x0 + sl.L + sp.joint / 2); o += ln(xj, top - 22, xj, Yd(dP) + 10, C.cut, 1, '3 3') + svgText(xj, top - 26, T.joint, { size: 10, fill: C.cut }); });
    // columns actually cut by the line: the line must pass through the column footprint
    const hits = (r.columns || []).filter(c => Math.abs((alongX ? c.y : c.x) - cut) <= (alongX ? c.dy : c.dx) / 2 + EPS);
    const colH = 95;
    hits.forEach((c, i) => {
      const pos = alongX ? c.x : c.y, wid = (alongX ? c.dx : c.dy) * sH;
      const yTop = Yd(dP);
      o += rect(X(pos) - wid / 2, yTop, wid, colH, 'url(#hc)', C.colEdge, 1.2);
      const zz = `M${f2(X(pos) - wid / 2 - 6)} ${f2(yTop + colH)} l${f2(wid / 3 + 3)} -7 l${f2(wid / 3)} 14 l${f2(wid / 3 + 3)} -7`;
      o += `<path d="${zz}" fill="none" stroke="${C.colEdge}" stroke-width="1.2"/>`;
      o += svgText(X(pos), yTop + colH + 20 + (i % 2) * 13, `C${c.id} ${c.b}×${c.h} (${T.colCut})`, { size: 11, fill: C.colEdge, weight: 700 });
    });
    if (!hits.length) o += svgText(W / 2, Yd(dP) + 60, T.noCols, { size: 12, fill: C.muted });
    // levels relative to the top of the slab
    const lvl = (d, label) => ln(x0 - 150, Yd(d), x0 - 8, Yd(d), C.dim, 0.8, '3 3') + svgText(x0 - 150, Yd(d) - 4, label, { size: 11, anchor: 'start', fill: C.ink });
    o += lvl(0, '±0.00') + lvl(t, `−${t.toFixed(2)} ${T.slab}`) + lvl(dI, `−${dI.toFixed(2)} ${T.soffit}`) + lvl(sz.per / 100, `−${(sz.per / 100).toFixed(2)} ${T.soffit}`);
    // vertical dimensions on the right
    const xr = x0 + Wd + 60;
    o += dimV(Yd(0), Yd(t), xr, `${sz.slab}`, 11) + dimV(Yd(0), Yd(dI), xr + 34, `${sz.int}`, 11) + dimV(Yd(0), Yd(sz.per / 100), xr + 68, `${sz.per}`, 11);
    o += svgText(xr + 34, Yd(0) - 12, 'cm', { size: 11, fill: C.muted });
    // horizontal dimensions: spacing and overall
    const yd = Yd(dP) + colH + 52;
    const axes = [...new Set(perp.map(b => +b.p.toFixed(6)))].sort((a, b) => a - b);
    for (let i = 0; i + 1 < axes.length; i++) { const d = axes[i + 1] - axes[i]; o += dimH(X(axes[i]), X(axes[i + 1]), yd, d * sH >= 26 ? f2(d) : '', 11); }
    o += dimH(X(0), X(len), yd + 26, `${f2(len)} m`, 12);
    // labels
    if (slabs.length) o += svgText(X(len * 0.5), top - 12, `${T.slab} ${sz.slab} cm`, { size: 12 });
    o += svgText(X(0), top - 30, `${T.perBeam} ${pw}×${sz.per}`, { size: 11, anchor: 'start', fill: C.per });
    const firstInt = perp.find(b => b.kind === 'int');
    if (firstInt) o += svgText(X(firstInt.p), Yd(dI) + 16, `${T.intBeam} ${iw}×${sz.int}`, { size: 11, fill: C.per });
    perp.filter(b => b.kind === 'shared').forEach(b => { o += svgText(X(b.p), top - 30, `${T.sharedBeam} ${pw}×${sp.sharedDepth}`, { size: 11, fill: C.shared, weight: 700 }); });
    along.slice(0, 1).forEach(b => {
      const cont = sp.mode === 'continuous' && b.kind === 'int' && alongX && sp.k > 1;
      o += svgText(X(len * 0.27), Yd(b.d) + 34, `${b.kind === 'int' ? T.intBeam : b.kind === 'shared' ? T.sharedBeam : T.perBeam} — ${cont ? T.contOver : T.longBeam}`, { size: 11, fill: colorOf(b.kind) });
    });
    o += svgText(W / 2, H - 12, ex > 1.05 ? `${T.vScale}${ex.toFixed(1)}` : T.hScaleOnly, { size: 12, fill: C.cut });
    return svgWrap(W, H, o, `${T.secTitle} ${name}`, hatch('hb') + hatchCol('hc'));
  }

  /* ===================================================================== */
  /* 4. Interface                                                           */
  /* ===================================================================== */
  const app = document.getElementById('pb-app');
  if (!app) return;
  const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const T = STR[lang];
  const fmt = (v, d = 2) => Number.isFinite(v) ? Number(v.toFixed(d)).toLocaleString('en-US', { maximumFractionDigits: d }) : '—';
  const field = (id, label, attrs = '') => `<label class="pb-field"><span>${label}</span><input id="pb-${id}" type="number" inputmode="decimal" ${attrs} aria-describedby="pb-${id}-err"><small class="pb-err" id="pb-${id}-err" role="alert"></small></label>`;
  const select = (id, label, opts) => `<label class="pb-field"><span>${label}</span><select id="pb-${id}">${opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></label>`;
  const step = (n, id, body) => `<section class="pb-step card" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h"><span class="pb-num">${n}</span>${T.steps[n - 1]}</h2>${body}</section>`;
  const R = engine.RANGES;
  const rng = k => `min="${R[k][0]}" max="${R[k][1]}"`;

  app.insertAdjacentHTML('beforeend', `
<nav class="pb-steps" aria-label="${T.step}">${T.steps.map((s, i) => `<a href="#pb-s${i + 1}"><b>${i + 1}</b> ${s}</a>`).join('')}</nav>
<div id="pb-warnings" class="pb-warnings" aria-live="polite"></div>
${step(1, 'pb-s1', `<p class="pb-note">${T.geoNote}</p>
  <div class="pb-fields">${field('L', T.L, rng('L') + ' step="0.1"')}${field('Ls', T.Ls, rng('Ls') + ' step="0.1"')}</div>
  <div class="btn-row"><button type="button" class="btn btn-primary" id="pb-example">${T.example}</button><button type="button" class="btn" id="pb-reset">${T.reset}</button></div>
  <div class="pb-metrics" id="pb-geo"></div>
  <div id="pb-splitbox" hidden><p class="pb-note">${T.splitInfo}</p>
  <div class="pb-fields">${select('slabs', T.slabsCount, [])}${select('mode', T.modeLabel, Object.entries(T.modeOpts))}</div>
  <p class="pb-note pb-muted">${T.modeNote}</p></div>`)}
${step(2, 'pb-s2', `<p class="pb-note">${T.gridRule}</p>
  <div class="pb-fields">${select('grid', T.gridChoice, [])}${select('pw', T.pw, [['25', '25'], ['30', '30']])}${select('iw', T.iw, [['25', '25'], ['30', '30']])}</div>
  <div class="pb-metrics" id="pb-gridres"></div><p class="pb-note pb-muted">${T.sizeRule}</p><div class="pb-table" id="pb-sizes"></div>`)}
<section id="pb-hidden" hidden>${select('occupancy', T.occupancy, Object.entries(T.occ))}${field('D', T.D, rng('D'))}${field('LL', T.LL, rng('LL'))}${select('deadMode', T.deadMode, Object.entries(T.deadModes))}${field('gc', T.gc, rng('gc'))}${field('gD', T.gD, rng('gD'))}${field('gL', T.gL, rng('gL'))}${field('fcu', T.fcu, rng('fcu'))}${field('fy', T.fy, rng('fy'))}${field('rho', T.rho, rng('rho'))}${field('maxRatio', T.maxRatio, rng('maxRatio'))}${field('alpha', T.alpha, rng('alpha'))}${field('beta', T.beta, rng('beta'))}${field('ampEdge', T.ampEdge, rng('ampEdge'))}${field('ampCorner', T.ampCorner, rng('ampCorner'))}</section>
${step(3, 'pb-s3', `<h3 class="pb-sub"><b>1</b> ${T.c1}</h3>
  <div class="pb-colcount"><span id="pb-colcount-label">${T.colCount}</span><button type="button" class="btn" id="pb-minus" aria-label="−1">−</button><output id="pb-colnum" class="pb-colnum">4</output><button type="button" class="btn" id="pb-plus" aria-label="+1">+</button>
    <span class="pb-presets">${[4, 6, 8, 12, 24].map(n => `<button type="button" class="btn btn-sm pb-preset" data-n="${n}">${n}</button>`).join('')}</span></div>
  <div class="pb-fields">${select('dist', T.dist, Object.entries(T.dists))}${field('floors', T.floors, rng('floors') + ' step="1"')}</div>
  <div class="pb-metrics" id="pb-spacing"></div>
  <h3 class="pb-sub"><b>2</b> ${T.c2}</h3>
  <div class="pb-fields">${select('ratio', T.ratioLabel, [['1', '1 : 1'], ['1.25', '1 : 1.25'], ['1.5', '1 : 1.5'], ['2', '1 : 2'], ['2.5', '1 : 2.5'], ['3', '1 : 3']])}</div>
  <h3 class="pb-sub"><b>3</b> ${T.c3}</h3>
  <div class="pb-metrics" id="pb-areas"></div><p class="pb-note pb-muted">${T.areaNote}</p>
  <h3 class="pb-sub"><b>4</b> ${T.c4}</h3>
  <div id="pb-options"></div><p class="pb-note pb-muted">${T.optNote}</p>
  <div class="pb-table" id="pb-cols"></div><p class="pb-note pb-muted">${T.tribNote}</p>`)}
${step(4, 'pb-s4', `<div class="pb-svg" id="pb-plan"></div><p class="pb-note pb-muted">${T.dragNote}</p>`)}
${step(5, 'pb-s5', `<div class="pb-fields"><label class="pb-field"><span>${T.aPos}: <output id="pb-aOut"></output></span><input id="pb-aPos" type="range" min="0" max="100" step="0.25"></label><label class="pb-field"><span>${T.bPos}: <output id="pb-bOut"></output></span><input id="pb-bPos" type="range" min="0" max="100" step="0.25"></label></div>
  <div class="pb-svg" id="pb-secA"></div><div class="pb-svg" id="pb-secB"></div>`)}
${step(6, 'pb-s6', `<div class="pb-table" id="pb-summary"></div><div class="btn-row pb-noprint"><button type="button" class="btn" id="pb-dlPlan">${T.dlPlan}</button><button type="button" class="btn" id="pb-dlA">${T.dlA}</button><button type="button" class="btn" id="pb-dlB">${T.dlB}</button><button type="button" class="btn btn-primary" onclick="window.print()">${T.print}</button></div>`)}
<p class="pb-note pb-warn pb-limits">${T.limits}</p>`);

  const $ = id => document.getElementById('pb-' + id);
  const numIds = ['L', 'Ls', 'D', 'LL', 'floors', 'gc', 'gD', 'gL', 'fcu', 'fy', 'rho', 'maxRatio', 'alpha', 'beta', 'ampEdge', 'ampCorner'];
  const selIds = ['pw', 'iw', 'occupancy', 'deadMode', 'dist', 'mode', 'ratio'];
  let columns = DEFAULTS.columns, gridIndex = 0, lastGridKey = '', choice = {};

  function setInputs(v) {
    numIds.forEach(k => { $(k).value = v[k] === '' ? '' : v[k]; });
    selIds.forEach(k => { $(k).value = String(v[k]); });
    $('aPos').value = v.aPos; $('bPos').value = v.bPos;
    columns = v.columns; gridIndex = 0; lastGridKey = ''; choice = {};
  }
  function read() {
    const v = {};
    numIds.forEach(k => { const s = $(k).value.trim(); v[k] = s === '' ? NaN : Number(s); });
    v.pw = Number($('pw').value); v.iw = Number($('iw').value);
    v.occupancy = $('occupancy').value; v.deadMode = $('deadMode').value; v.dist = $('dist').value;
    v.columns = columns; v.grid = gridIndex; v.mode = $('mode').value; v.slabs = Number($('slabs').value) || 0;
    v.ratio = Number($('ratio').value); v.choice = choice;
    return v;
  }
  const table = (head, rows, foot) => `<table><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody>${foot ? `<tfoot><tr>${foot.map(c => `<th>${c}</th>`).join('')}</tr></tfoot>` : ''}</table>`;
  const metric = (k, v) => `<div class="pb-metric"><small>${k}</small><strong>${v}</strong></div>`;
  let current = null;

  function update() {
    const v = read();
    // keep the chosen grid when the hall size has not changed
    const key = `${v.L}x${v.Ls}`;
    if (key !== lastGridKey) { gridIndex = 0; v.grid = 0; lastGridKey = key; }
    const r = engine.calculate(v);
    current = r;
    // field errors
    numIds.forEach(k => {
      const e = r.errors[k], el = $(k + '-err');
      el.textContent = !e ? '' : e === 'range' ? T.err.range + R[k][0] + '–' + R[k][1] : T.err[e];
      $(k).setAttribute('aria-invalid', e ? 'true' : 'false');
    });
    $('colnum').textContent = columns;
    $('minus').disabled = columns <= 4; $('plus').disabled = columns >= 24;
    $('aOut').textContent = `${fmt(Number($('aPos').value), 2)}%`; $('bOut').textContent = `${fmt(Number($('bPos').value), 2)}%`;
    $('warnings').innerHTML = r.warnings.map(w => `<p class="pb-note pb-warn" role="status">${T.warn[w]}</p>`).join('');
    const geoOk = !r.errors.L && !r.errors.Ls;
    if (!geoOk) {
      ['geo', 'gridres', 'sizes', 'spacing', 'areas', 'options', 'cols', 'plan', 'secA', 'secB', 'summary'].forEach(id => { $(id).innerHTML = ''; });
      $('grid').innerHTML = ''; return;
    }
    $('geo').innerHTML = metric(T.area, `${fmt(r.area)} m²`) + metric('L / Ls', fmt(r.inp.L / r.inp.Ls)) + `<p class="pb-muted pb-small">${T.areaRange}</p>`;
    const sp = r.split;
    $('splitbox').hidden = !r.splitOptions.length;
    $('slabs').innerHTML = r.splitOptions.map(k => `<option value="${k}">${k} × (${fmt(r.inp.L / k)} × ${fmt(r.inp.Ls)} ${T.m} ≈ ${fmt(r.inp.L / k * r.inp.Ls, 1)} m²)</option>`).join('');
    if (r.splitOptions.length) $('slabs').value = String(sp.k);
    $('colcount-label').textContent = sp.k > 1 ? T.colCountSlab : T.colCount;
    $('grid').innerHTML = r.grids.length ? r.grids.map((g, i) => `<option value="${i}">${g.nx} × ${g.ny} — ${fmt(g.a)} × ${fmt(g.b)} ${T.m}</option>`).join('') : `<option>${T.none}</option>`;
    $('grid').value = String(Math.min(gridIndex, Math.max(0, r.grids.length - 1)));
    const g = r.grid;
    $('gridres').innerHTML = g ? metric(T.panels, g.nx * g.ny) + metric(T.division, `${g.nx} × ${g.ny}`) + metric(T.panelSize, `${fmt(g.a)} × ${fmt(g.b)} ${T.m}`) + metric(T.panelArea, `${fmt(g.area)} m²`) + metric(T.ratio, fmt(g.ratio)) : '';
    const sz = r.sz, pw = r.inp.pw, iw = r.inp.iw, Ls = sp.short;
    $('sizes').innerHTML = table([T.element, T.rule, T.calc, T.adopted, T.section, T.drop], [
      [T.slab, `Ls/45 = ${fmt(Ls)}/45`, `${fmt(sz.slabRaw)} ${T.cm}`, `${sz.slab} ${T.cm}`, T.none, T.none],
      [T.perBeam, `Ls/16 = ${fmt(Ls)}/16`, `${fmt(sz.perRaw)} ${T.cm}`, `${sz.per} ${T.cm}`, `${pw} × ${sz.per}`, `${Math.max(0, sz.per - sz.slab)} ${T.cm}`],
      [T.intBeam, `Ls/24 = ${fmt(Ls)}/24`, `${fmt(sz.intRaw)} ${T.cm}`, `${sz.int} ${T.cm}`, `${iw} × ${sz.int}`, `${Math.max(0, sz.int - sz.slab)} ${T.cm}`]]
      .concat(sp.mode === 'continuous' ? [[T.sharedBeam, T.perBeam, T.none, `${sp.sharedDepth} ${T.cm}`, `${pw} × ${sp.sharedDepth}`, `${Math.max(0, sp.sharedDepth - sz.slab)} ${T.cm}`]] : []))
      + (sp.k > 1 ? `<p class="pb-muted pb-small">${T.eachSlab}: ${fmt(sp.Li)} × ${fmt(r.inp.Ls)} ${T.m}. ${T.slabRuleSide} = ${fmt(sp.short)} ${T.m}.</p>` : '');
    if (r.loads) {
      const cs = r.columns, uniqGaps = arr => [...new Set(arr.map(d => fmt(d)))].join(' / ') || T.none;
      $('spacing').innerHTML = metric(T.cols, cs.length) + metric(T.spacingL, `${uniqGaps(r.spacing.L)} ${T.m}`) + metric(T.spacingLs, `${uniqGaps(r.spacing.Ls)} ${T.m}`);
      const names = ids => ids.map(i => `C${i}`).join('، ');
      $('areas').innerHTML = r.groups.map(gr => metric(`${T.groupNames[gr.key]} (${gr.ids.length})`, `${fmt(gr.req, 0)} cm²`)).join('');
      $('options').innerHTML = r.groups.map(gr => `<div class="pb-group"><p><b>${T.groupNames[gr.key]}</b> <span class="pb-muted">(${names(gr.ids)})</span> — ${T.reqArea}: <b>${fmt(gr.req, 0)} cm²</b></p>
        <div class="pb-chips" role="group" aria-label="${T.groupNames[gr.key]}">${gr.options.map(o => {
          const on = o === gr.chosen, rec = o === gr.rec;
          return `<button type="button" class="pb-chip${on ? ' on' : ''}" data-group="${gr.key}" data-sec="${o.b}x${o.h}" aria-pressed="${on}"${rec ? ` title="${T.recLabel}"` : ''}><b>${o.b} × ${o.h}</b>${rec ? ' ★' : ''}<small>${fmt(o.area, 0)} cm² · 1 : ${fmt(o.ratio)}</small>${o.wall ? `<small>${T.wallOpt}</small>` : ''}</button>`;
        }).join('')}</div></div>`).join('');
      $('cols').innerHTML = table([T.col, T.type, T.At, T.req, T.colSection, T.provided, T.okCheck],
        cs.map(c => [`C${c.id}`, (c.shared ? T.shared + ' · ' : '') + (c.corner ? T.corner : T.edge), fmt(c.At), fmt(c.req, 0), `${c.b} × ${c.h}`, fmt(c.provided, 0), c.provided >= c.req ? '✓' : '✗']));
    } else {
      ['spacing', 'areas', 'options', 'cols'].forEach(id => { $(id).innerHTML = ''; });
    }
    const aF = Number($('aPos').value) / 100, bF = Number($('bPos').value) / 100;
    const plan = planSVG(r, T, aF, bF);
    $('plan').innerHTML = plan.svg; planGeo = plan.geo;
    $('secA').innerHTML = sectionSVG(r, T, 'X', aF);
    $('secB').innerHTML = sectionSVG(r, T, 'Y', bF);
    // summary
    const rows = [[T.L, `${fmt(r.inp.L)} ${T.m}`], [T.Ls, `${fmt(r.inp.Ls)} ${T.m}`], [T.area, `${fmt(r.area)} m²`]];
    if (sp.k > 1) rows.push([T.slabsCount, `${sp.k} × ${fmt(sp.Li)} × ${fmt(r.inp.Ls)} ${T.m}`], [T.modeLabel, T.modeOpts[sp.mode]]);
    if (sp.mode === 'continuous' && sp.k > 1) rows.push([T.sharedBeam, `${pw} × ${sp.sharedDepth} ${T.cm}`]);
    rows.push(
      [T.gridChoice, g ? `${g.nx} × ${g.ny} (${fmt(g.a)} × ${fmt(g.b)} ${T.m})` : T.none],
      [T.slab, `${sz.slab} ${T.cm}`], [T.perBeam, `${pw} × ${sz.per} ${T.cm}`], [T.intBeam, `${iw} × ${sz.int} ${T.cm}`]);
    if (r.loads) {
      rows.push([T.floors, r.inp.floors], [T.cols, r.columns.length], [T.c2, `1 : ${fmt(r.inp.ratio)}`]);
      r.groups.forEach(gr => rows.push([T.groupNames[gr.key], `${gr.chosen.b} × ${gr.chosen.h} ${T.cm} (${T.reqArea} ${fmt(gr.req, 0)} cm²)`]));
    }
    $('summary').innerHTML = table([T.item, T.value], rows);
  }

  // dragging the section lines on the plan
  let planGeo = null, dragging = null;
  function svgPoint(evt) {
    const svg = $('plan').querySelector('svg'); if (!svg) return null;
    const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  $('plan').addEventListener('pointerdown', e => {
    const g = e.target.closest && e.target.closest('.pb-cut'); if (!g) return;
    dragging = g.getAttribute('data-cut'); e.preventDefault();
    $('plan').setPointerCapture(e.pointerId);
  });
  $('plan').addEventListener('pointermove', e => {
    if (!dragging || !planGeo) return;
    const p = svgPoint(e); if (!p) return;
    const { ox, oy, ww, hh } = planGeo;
    const f = dragging === 'a' ? (p.y - oy) / hh : (p.x - ox) / ww;
    const v = Math.round(Math.min(1, Math.max(0, f)) * 400) / 4;
    $(dragging === 'a' ? 'aPos' : 'bPos').value = v;
    update();
  });
  const stop = () => { dragging = null; };
  $('plan').addEventListener('pointerup', stop); $('plan').addEventListener('pointercancel', stop);

  // events
  app.addEventListener('input', e => {
    if (e.target.id === 'pb-occupancy') return;
    if (e.target.id === 'pb-D' || e.target.id === 'pb-LL') $('occupancy').value = 'custom';
    if (e.target.id === 'pb-grid') { gridIndex = Number(e.target.value) || 0; lastGridKey = `${$('L').value}x${$('Ls').value}`.replace(/^/, ''); }
    update();
  });
  app.addEventListener('click', e => {
    const chip = e.target.closest && e.target.closest('.pb-chip');
    if (!chip) return;
    choice = { ...choice, [chip.dataset.group]: chip.dataset.sec };
    update();
  });
  $('ratio').addEventListener('change', () => { choice = {}; update(); });
  $('occupancy').addEventListener('change', () => {
    const p = PRESETS[$('occupancy').value];
    if (p) { $('D').value = p.D; $('LL').value = p.LL; }
    update();
  });
  $('grid').addEventListener('change', e => { gridIndex = Number(e.target.value) || 0; const r = read(); lastGridKey = `${r.L}x${r.Ls}`; update(); });
  $('minus').onclick = () => { columns = Math.max(4, columns - 1); update(); };
  $('plus').onclick = () => { columns = Math.min(24, columns + 1); update(); };
  app.querySelectorAll('.pb-preset').forEach(b => { b.onclick = () => { columns = Number(b.dataset.n); update(); }; });
  $('example').onclick = () => { setInputs({ ...DEFAULTS, L: 14, Ls: 12 }); update(); };
  $('reset').onclick = () => { setInputs({ ...DEFAULTS, L: '', Ls: '' }); update(); };
  function download(id, name) {
    const svg = $(id).querySelector('svg'); if (!svg) return;
    const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }
  $('dlPlan').onclick = () => download('plan', `paneled-beam-plan-${T.fileTag}.svg`);
  $('dlA').onclick = () => download('secA', `paneled-beam-section-AA-${T.fileTag}.svg`);
  $('dlB').onclick = () => download('secB', `paneled-beam-section-BB-${T.fileTag}.svg`);

  setInputs({ ...DEFAULTS, L: 14, Ls: 12 });
  update();
  root.PaneledBeamUI = { update, get current() { return current; }, setColumns: n => { columns = n; update(); } };
})(typeof window !== 'undefined' ? window : globalThis);
