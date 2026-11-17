// Tests for the waffle slab calculator pages. Run: node tests/test_waffle_slab.js
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const dir = path.join(__dirname, '..', 'root', 'tools', 'waffle-slab');
function load(file) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  const js = html.slice(html.indexOf("'use strict';"), html.indexOf('function units('));
  return { html, api: new Function(js + ';return {solve, sectionOptions, recommendSection, PRESETS, T};')() };
}
const AR = load('Waffle_Slab_Calculator_AR.html'), EN = load('Waffle_Slab_Calculator_EN.html');
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok -', name); };
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);
const base = { length: 12, width: 10, edge: 25, topping: 8, baseX: 90, baseY: 90, depth: 45, rib: 15, angle: 5, density: 25, waste: 5,
  dead: 1.5, live: 2, colCount: 4, dist: 0, pad: 150, storeys: 1, stress: 11.162, combo: 1, colRatio: 1 };

test('both languages run the same code', () => {
  const code = h => h.slice(h.indexOf('const PRESETS'), h.indexOf('</script>'));
  assert.strictEqual(code(AR.html), code(EN.html));
  assert.deepStrictEqual(Object.keys(AR.api.T).sort(), Object.keys(EN.api.T).sort());
});

test('acceptance checks from the brief', () => {
  const rib = { 60: 10, 75: 12, 90: 15, 10550: 20, 10560: 20 };
  for (const k of Object.keys(rib)) assert.strictEqual(AR.api.PRESETS[k][3], rib[k]);
  const v = AR.api.solve(base);
  near(v.topX * 100, 82.13, 0.01, 'top opening'); near(v.heel * 100, 22.87, 0.01, 'top rib');
  assert.ok(v.topX < v.a && v.heel > v.r);
  // the brief's 74 moulds / 38.918 m3 assumed a 2 x 2 bay grid with an interior column; with perimeter columns only
  // (the user's rule) the same example omits one mould at each corner: count by brute force
  const brute = (pad, cols) => { let n = 0;
    for (let i = 0; i < 11; i++) for (let j = 0; j < 9; j++) {
      const x0 = 0.3 + i * 1.05, y0 = 0.35 + j * 1.05;
      if (!cols.some(c => x0 < c[0] + pad / 2 && x0 + 0.9 > c[0] - pad / 2 && y0 < c[1] + pad / 2 && y0 + 0.9 > c[1] - pad / 2)) n++;
    } return n; };
  assert.strictEqual(v.count, brute(1.5, [[0, 0], [12, 0], [12, 10], [0, 10]]));
  assert.strictEqual(v.count, 95);
  near(v.net, v.full - 95 * v.voidOne, 1e-9, 'net concrete');
  const e = EN.api.solve(base);
  assert.strictEqual(e.count, v.count); assert.strictEqual(e.net, v.net);
  assert.ok(AR.api.solve({ ...base, pad: 300 }).count < v.count && AR.api.solve({ ...base, pad: 0 }).count > v.count);
  const v7 = AR.api.solve({ ...base, angle: 7 });
  assert.ok(v7.topX < v.topX && v7.heel > v.heel);
  // frustum formula, independent of the page's Simpson rule
  near(v.voidOne, 0.45 / 3 * (0.81 + v.topX ** 2 + 0.9 * v.topX), 1e-12, 'void per mould');
});

test('load combinations', () => {
  const v = AR.api.solve(base), a = AR.api.solve({ ...base, combo: 2 });
  near(v.ultimate, 1.4 * v.D + 1.6 * 2, 1e-12, '1.4D + 1.6L');
  near(a.ultimate, Math.max(1.4 * a.D, 1.2 * a.D + 1.6 * 2), 1e-12, 'ACI');
});

test('column sections: minimum 25 cm, multiples of 5, area covered', () => {
  for (let req = 1; req <= 20000; req += 41) AR.api.sectionOptions(req).forEach(o => {
    assert.ok(o.b >= 25 && o.h >= o.b && o.b % 5 === 0 && o.h % 5 === 0 && o.area >= req - 1e-9 && (o.wall || o.h / o.b <= 3 + 1e-9));
  });
  for (const req of [50, 900, 1200, 4000]) assert.ok(AR.api.sectionOptions(req).some(o => o.b === 30 && o.area >= req));
  assert.deepStrictEqual(AR.api.sectionOptions(1200).map(o => [o.b, o.h]), [[35, 35], [30, 40], [25, 50]]);
  const v = AR.api.solve(base);
  v.groups.forEach(g => { assert.ok(g.chosen.b >= 25 && g.chosen.area >= g.req - 1e-9); near(g.req, g.demand * 10 / base.stress, 1e-9, 'required area'); });
  // columns are at least 25 x 25 cm
  const corner = v.groups.find(g => g.key === 'corner');
  assert.ok(corner.chosen.b >= 25);
  // a clicked option is used; an invalid one falls back
  const b8 = { ...base, colCount: 8 }, edge = AR.api.solve(b8).groups.find(g => g.key === 'edgeColumn');
  const pick = edge.options[edge.options.length - 1];
  const c = AR.api.solve(b8, { edgeColumn: pick.b + 'x' + pick.h }).groups.find(g => g.key === 'edgeColumn');
  assert.strictEqual(c.chosen.b + 'x' + c.chosen.h, pick.b + 'x' + pick.h);
  const bad = AR.api.solve(b8, { edgeColumn: '5x5' }).groups.find(g => g.key === 'edgeColumn');
  assert.strictEqual(bad.chosen, bad.rec);
  // ratio choice and more floors
  const r2 = AR.api.solve({ ...base, storeys: 6, colRatio: 2 }).groups.find(g => g.key === 'corner');
  assert.ok(Math.abs(r2.chosen.ratio - 2) <= Math.min(...r2.options.map(o => Math.abs(o.ratio - 2))) + 1e-9);
});

test('perimeter columns only, as in the paneled beam calculator', () => {
  for (const n of [4, 6, 8, 12, 24]) for (const dist of [0, 1, 2]) for (const [L, W] of [[12, 10], [14, 12], [18, 9]]) {
    const v = AR.api.solve({ ...base, length: L, width: W, colCount: n, dist });
    assert.strictEqual(v.cols.length, n);
    v.cols.forEach(c => assert.ok(c.x === 0 || c.x === L || c.y === 0 || c.y === W, 'column on the perimeter'));
    near(v.cols.reduce((a, c) => a + c.At, 0), L * W, 1e-9, 'tributary areas add up');
    assert.ok(!v.groups.some(g => g.key === 'interior'));
    v.groups.forEach(g => near(g.trib, Math.max(...v.cols.filter(c => (g.key === 'corner') === c.corner).map(c => c.At)), 1e-12, 'group area'));
  }
  const long = AR.api.solve({ ...base, length: 18, width: 9, colCount: 8, dist: 1 }).cols.filter(c => !c.corner && c.side === 'X').length;
  const short = AR.api.solve({ ...base, length: 18, width: 9, colCount: 8, dist: 2 }).cols.filter(c => !c.corner && c.side === 'X').length;
  assert.strictEqual(long, 4); assert.strictEqual(short, 0);
  // more columns give smaller required areas; solid zones follow the columns
  const r4 = AR.api.solve({ ...base, storeys: 4 }), r12 = AR.api.solve({ ...base, storeys: 4, colCount: 12 });
  assert.ok(Math.max(...r12.groups.map(g => g.req)) < Math.max(...r4.groups.map(g => g.req)));
  assert.ok(r12.count < r4.count);
});

console.log(`\n${passed} test groups passed`);
