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
  assert.deepStrictEqual([r.columns[0].b, r.columns[0].h], [60, 65]); // 3767 cm2 -> 60 x 65 = 3900
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
      assert.ok(c.h / c.b <= 2 + 1e-9 && c.util <= 1 + 1e-9);
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
  assert.ok(E.calculate({ L: 15, Ls: 12.5 }).warnings.includes('hallArea')); // 187.5
  assert.ok(E.calculate({ L: 8, Ls: 7 }).warnings.includes('hallArea'));     // 56
  assert.ok(!E.calculate({ L: 12, Ls: 5 }).warnings.includes('hallArea'));   // 60
  assert.ok(!E.calculate({ L: 15, Ls: 12 }).warnings.includes('hallArea'));  // 180
  assert.ok(E.calculate({ L: 12, Ls: 14 }).warnings.includes('lsLonger'));
  assert.strictEqual(E.calculate({ L: 14, Ls: 12, floors: 2.5 }).errors.floors, 'integer');
  assert.strictEqual(E.calculate({ L: 14, Ls: 12, fcu: 5 }).errors.fcu, 'range');
  assert.strictEqual(E.calculate({ L: NaN, Ls: 12 }).errors.L, 'required');
});

console.log(`\n${passed} test groups passed`);
