// Tests for the paneled beam calculator engine. Run: node tests/test_paneled_beam.js
'use strict';
const assert = require('assert');
const E = require('../root/tools/paneled-beam/pb.js');
let passed = 0;
const near = (a, b, tol = 1e-6, msg = '') => { assert.ok(Math.abs(a - b) <= tol, `${msg} expected ${b}, got ${a}`); };
function test(name, fn) { fn(); passed++; console.log('ok -', name); }

// 1. Hand calculation for the 12 x 14 m example (L = 14, Ls = 12, school, 4 floors, 4 columns)
test('slab and beam sizing from Ls', () => {
  const s = E.sizing(12);
  near(s.slabRaw, 26.6667, 1e-3); assert.strictEqual(s.slab, 27);
  assert.strictEqual(s.per, 75); assert.strictEqual(s.int, 50);
  // floating point traps: 4.8*100/16 = 30.000000000000004 must stay 30
  assert.strictEqual(E.sizing(4.8).per, 30); assert.strictEqual(E.sizing(7.2).int, 30); assert.strictEqual(E.sizing(9).slab, 20);
  assert.strictEqual(E.sizing(12.1).per, 80); // 75.625 -> 80
});

test('example loads and column by hand', () => {
  const r = E.calculate({ L: 14, Ls: 12 });
  assert.deepStrictEqual([r.grid.nx, r.grid.ny], [5, 4]);
  // self-weight by hand: slab 0.27*25 = 6.75; perimeter 52 m * 0.25 * 0.48 = 6.24 m3; internal (4*12 + 3*14) * 0.25 * 0.23 = 5.175 m3
  near(r.sw.slab, 6.75); near(r.sw.beams, 25 * (6.24 + 5.175) / 168);
  const D = 6 + 6.75 + 25 * 11.415 / 168;
  near(r.loads.Dtot, D); near(r.loads.ws, D + 3); near(r.loads.wu, 1.4 * D + 1.6 * 3);
  near(r.loads.sigma, 0.35 * 25 + 0.67 * 360 * 0.01);
  const Pu = (1.4 * D + 4.8) * 42 * 4, req = Pu * 1000 / 11.162 / 100;
  r.columns.forEach(c => { near(c.At, 42); near(c.Pu, Pu, 1e-6); near(c.req, req, 1e-6); });
  // 3767 cm2: options from square to elongated; ratio 1:1.5 (default) -> 50 x 80, ratio 1:1 -> 65 x 65
  assert.deepStrictEqual([r.columns[0].b, r.columns[0].h], [50, 80]);
  const sq = E.calculate({ L: 14, Ls: 12, ratio: 1 }).columns[0];
  assert.deepStrictEqual([sq.b, sq.h], [65, 65]);
});

test('total-dead-load mode and warning', () => {
  const r = E.calculate({ L: 14, Ls: 12, deadMode: 'total', D: 6 });
  near(r.loads.Dtot, 6); assert.ok(r.warnings.includes('deadBelowSelf'));
});

// 2. Independent brute-force check of the section search
function brute(req, maxRatio) {
  const all = [];
  for (let b = 25; b <= 400; b += 5) for (let h = b; h <= 400; h += 5) if (h / b <= maxRatio + 1e-9 && b * h >= req - 1e-9) all.push({ b, h, area: b * h, ratio: h / b });
  const minA = Math.min(...all.map(c => c.area));
  return all.filter(c => c.area <= minA * 1.1 + 1e-9).sort((p, q) => p.ratio - q.ratio || p.area - q.area)[0];
}
test('section search matches brute force', () => {
  for (let req = 1; req <= 30000; req += 37) for (const mr of [1, 1.5, 2, 3]) {
    const s = E.chooseSection(req, mr), x = brute(req, mr);
    assert.deepStrictEqual([s.b, s.h], [x.b, x.h], `req ${req} ratio ${mr}`);
  }
  const s = E.chooseSection(2079, 2); assert.deepStrictEqual([s.b, s.h], [45, 50]); // the example from the brief
  assert.deepStrictEqual([E.chooseSection(10, 2).b, E.chooseSection(10, 2).h], [25, 25]);
});

// 3. Column layouts for 4, 6, 8, 12 and 24 columns, several halls and presets
test('columns: counts, perimeter only, areas, rounding, utilisation', () => {
  const halls = [[14, 12], [12, 12], [15, 10], [18, 10], [10, 6], [20, 9]];
  for (const [L, Ls] of halls) for (const n of [4, 6, 8, 12, 24]) for (const dist of ['balanced', 'long', 'short']) for (const occ of ['school', 'office', 'assembly']) {
    const p = E.PRESETS[occ];
    const r = E.calculate({ L, Ls, columns: n, dist, occupancy: occ, D: p.D, LL: p.LL, floors: 3 });
    const cs = r.columns;
    assert.strictEqual(cs.length, n, `${L}x${Ls} n=${n}`);
    near(cs.reduce((a, c) => a + c.At, 0), L * Ls, 1e-6, 'tributary areas add up to the hall');
    near(cs.reduce((a, c) => a + c.Pu, 0), r.loads.wu * L * Ls * 3, 1e-6, 'column loads add up');
    assert.strictEqual(cs.filter(c => c.corner).length, 4);
    cs.forEach(c => {
      assert.ok(c.x === 0 || c.x === L || c.y === 0 || c.y === Ls, 'column on the perimeter');
      assert.ok(c.b % 5 === 0 && c.h % 5 === 0 && c.b >= 25 && c.h >= 25, 'multiples of 5, min 25');
      assert.ok(c.provided >= c.req - 1e-9, 'provided >= required');
      assert.ok(c.h / c.b <= 3 + 1e-9 && c.util <= 1 + 1e-9);
    });
    // no two columns at the same point
    assert.strictEqual(new Set(cs.map(c => `${c.x.toFixed(4)},${c.y.toFixed(4)}`)).size, n);
  }
});

test('distribution options change the layout', () => {
  const side = cs => cs.filter(c => !c.corner && c.side === 'X').length;
  const long = E.calculate({ L: 18, Ls: 10, columns: 8, dist: 'long' }).columns;
  const short = E.calculate({ L: 18, Ls: 10, columns: 8, dist: 'short' }).columns;
  assert.strictEqual(side(long), 4); assert.strictEqual(side(short), 0);
});

test('more columns reduce the corner column section', () => {
  const a = E.calculate({ L: 14, Ls: 12, columns: 4 }).columns[0], b = E.calculate({ L: 14, Ls: 12, columns: 12 }).columns[0];
  assert.ok(b.provided < a.provided);
});

test('section options follow the area and the chosen ratio', () => {
  // the example from the user: about 1,200 cm2 -> 35 x 35, 30 x 40 or 25 x 50
  assert.deepStrictEqual(E.sectionOptions(1200).map(o => [o.b, o.h]), [[35, 35], [30, 40], [25, 50]]);
  assert.deepStrictEqual([1, 1.5, 2].map(r => { const o = E.recommendSection(E.sectionOptions(1200), r); return [o.b, o.h]; }), [[35, 35], [30, 40], [25, 50]]);
  for (let req = 1; req <= 20000; req += 53) E.sectionOptions(req).forEach(o => {
    assert.ok(o.area >= req - 1e-9 && o.b % 5 === 0 && o.h % 5 === 0 && o.b >= 25 && o.h >= o.b && o.h / o.b <= 3 + 1e-9);
  });
  // a clicked option is used; an option that is no longer valid falls back to the recommended one
  const r = E.calculate({ L: 14, Ls: 12, columns: 8, choice: { edge: '40x55' } });
  const edge = r.groups.find(g => g.key === 'edge');
  assert.deepStrictEqual([edge.chosen.b, edge.chosen.h], [40, 55]);
  r.columns.filter(c => c.group === 'edge').forEach(c => assert.deepStrictEqual([c.b, c.h], [40, 55]));
  const bad = E.calculate({ L: 14, Ls: 12, columns: 8, choice: { edge: '25x25' } }).groups.find(g => g.key === 'edge');
  assert.strictEqual(bad.chosen, bad.rec);
});

test('loads and column spacing change the required area', () => {
  const req = o => Math.max(...E.calculate({ L: 14, Ls: 12, ...o }).groups.map(g => g.req));
  assert.ok(req({ floors: 1 }) < req({ floors: 4 }) && req({ floors: 4 }) < req({ floors: 8 }));
  assert.ok(req({ columns: 4 }) > req({ columns: 8 }) && req({ columns: 8 }) > req({ columns: 12 }));
  const sp = E.calculate({ L: 14, Ls: 12, columns: 8 }).spacing;
  assert.deepStrictEqual(sp, { L: [7, 7], Ls: [6, 6] });
});

// 4. Grids and limits
test('grid limits and infeasible layouts', () => {
  for (const [L, Ls] of [[14, 12], [12, 12], [15, 10], [9, 7.5]]) {
    const g = E.gridOptions(L, Ls);
    assert.ok(g.length > 0);
    g.forEach(o => { assert.ok(o.a >= 2 - 1e-9 && o.a <= 4 + 1e-9 && o.b >= 2 - 1e-9 && o.b <= 4 + 1e-9 && o.area <= 16 + 1e-9 && o.ratio <= 4 / 3 + 1e-9); });
  }
  // 9 x 5: a in {3, 2.25}, b in {2.5}: 3/2.5 = 1.2 ok -> feasible. 4.5 x 7.9: a=2.25 or 4.5(no); b=3.95, 2.633, ... ratio 3.95/2.25 > 4/3; 2.633/2.25 = 1.17 ok
  assert.ok(E.gridOptions(9, 5).length > 0);
  // 1.8 m wide: no spacing in 2-4 m is possible
  assert.strictEqual(E.gridOptions(10, 1.8).length, 0);
  // 2.1 x 3.9: a = 2.1, b = 3.9 -> ratio 1.86 > 4/3, b = 1.95 < 2 -> infeasible
  assert.strictEqual(E.gridOptions(2.1, 3.9).length, 0);
  const r = E.calculate({ L: 2.1, Ls: 3.9 });
  assert.ok(r.warnings.includes('noGrid') && r.warnings.includes('hallArea'));
});

test('hall area range 60-180 m2 and validation', () => {
  assert.ok(!E.calculate({ L: 14, Ls: 12 }).warnings.includes('hallArea'));
  assert.ok(E.calculate({ L: 15, Ls: 12.5 }).warnings.includes('split'));    // 187.5 -> split, not rejected
  assert.ok(E.calculate({ L: 8, Ls: 7 }).warnings.includes('hallArea'));     // 56
  assert.ok(!E.calculate({ L: 12, Ls: 5 }).warnings.includes('hallArea'));   // 60
  assert.ok(!E.calculate({ L: 15, Ls: 12 }).warnings.includes('hallArea'));  // 180
  assert.ok(E.calculate({ L: 12, Ls: 14 }).warnings.includes('lsLonger'));
  assert.strictEqual(E.calculate({ L: 14, Ls: 12, floors: 2.5 }).errors.floors, 'integer');
  assert.strictEqual(E.calculate({ L: 14, Ls: 12, fcu: 5 }).errors.fcu, 'range');
  assert.strictEqual(E.calculate({ L: NaN, Ls: 12 }).errors.L, 'required');
});

// 5. Halls over 180 m2 are split into slabs of 60-180 m2
test('split options', () => {
  assert.deepStrictEqual(E.splitOptions(20, 12), [2, 3, 4]); // 120, 80, 60 m2
  assert.deepStrictEqual(E.splitOptions(30, 12), [2, 3, 4, 5, 6]); // 180, 120, 90, 72, 60 m2
  const r = E.calculate({ L: 20, Ls: 12 });
  assert.strictEqual(r.split.k, 2); assert.strictEqual(r.split.mode, 'continuous');
  assert.ok(!r.warnings.includes('hallArea'));
  // each slab 10 x 12: the rules use the shorter side 10 m
  assert.strictEqual(r.split.short, 10); assert.deepStrictEqual([r.sz.slab, r.sz.per, r.sz.int], [23, 65, 45]);
  assert.strictEqual(E.calculate({ L: 20, Ls: 12, slabs: 3 }).split.k, 3);
  assert.strictEqual(E.calculate({ L: 20, Ls: 12, slabs: 7 }).split.k, 2); // invalid choice falls back
});

test('continuous slabs share the dividing beam and its columns', () => {
  const r = E.calculate({ L: 20, Ls: 12, mode: 'continuous', columns: 4 });
  const cs = r.columns;
  assert.strictEqual(cs.length, 6); // 4 + 4 minus 2 shared
  const shared = cs.filter(c => c.shared);
  assert.strictEqual(shared.length, 2);
  // by hand: slab 10 x 12, perimeter 44, corner zone 11 -> At = 120 * 11 / 44 = 30; shared column takes both sides
  shared.forEach(c => { near(c.x, 10); near(c.At, 60); assert.ok(!c.corner); });
  cs.filter(c => !c.shared).forEach(c => near(c.At, 30));
  near(cs.reduce((a, c) => a + c.At, 0), 240);
  cs.forEach(c => assert.ok(c.outer, 'no column inside the hall'));
  const sb = r.beamsV.filter(b => b.kind === 'shared');
  assert.strictEqual(sb.length, 1); near(sb[0].x, 10); assert.strictEqual(sb[0].d, r.split.sharedDepth); assert.strictEqual(sb[0].d, r.sz.per);
  // internal beams along X run continuously over the shared beam
  r.beamsH.filter(b => b.kind === 'int').forEach(b => { near(b.x0, 0); near(b.x1, 20); });
  // extra columns stay on the outer sides, never along the shared beam
  E.calculate({ L: 20, Ls: 12, mode: 'continuous', columns: 12 }).columns.forEach(c => assert.ok(c.outer));
  // shared beam self-weight counted once
  const sep = E.calculate({ L: 20, Ls: 12, mode: 'separate' });
  assert.ok(r.sw.total < E.calculate({ L: 20, Ls: 12, mode: 'continuous', pw: 25 }).sw.total + 1e-9);
  assert.ok(sep.columns.length === 8);
});

test('separate slabs are independent halls with a joint', () => {
  const r = E.calculate({ L: 20, Ls: 12, mode: 'separate', columns: 4 });
  assert.strictEqual(r.columns.length, 8);
  assert.ok(r.columns.every(c => !c.shared && c.corner));
  const j = r.split.joint;
  assert.ok(j >= 0.25 - 1e-9);
  near(r.split.Li, (20 - j) / 2);
  near(r.columns.reduce((a, c) => a + c.At, 0), r.loadArea);
  assert.ok(r.beamsV.every(b => b.kind !== 'shared'));
  near(r.slabs[1].x0 - (r.slabs[0].x0 + r.slabs[0].L), j);
  // twin columns at the joint must not overlap
  for (const n of [4, 8, 12]) for (const L of [20, 26, 32]) {
    const q = E.calculate({ L, Ls: 12, mode: 'separate', columns: n, floors: 6 });
    for (const y of [0, 12]) {
      const row = q.columns.filter(c => Math.abs(c.y - y) < 1e-6).sort((a, b) => a.x - b.x);
      for (let i = 0; i + 1 < row.length; i++) assert.ok(row[i + 1].x - row[i].x >= (row[i].dx + row[i + 1].dx) / 2 - 1e-9, `overlap L=${L} n=${n}`);
    }
  }
});

console.log(`\n${passed} test groups passed`);
