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
const base = { length: 12, width: 10, edge: 20, topping: 8, baseX: 90, baseY: 90, depth: 45, rib: 15, angle: 5, density: 25, waste: 5,
  dead: 1.5, live: 2, baysX: 2, baysY: 2, pad: 150, storeys: 1, stress: 5, combo: 1, colRatio: 1 };

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
  assert.strictEqual(v.count, 74); near(v.net, 38.918, 0.0005, 'net concrete');
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
  // the example corner column was 15 x 15 cm before; now it is at least 25 x 25
  const corner = v.groups.find(g => g.key === 'corner');
  assert.ok(corner.chosen.b >= 25);
  // a clicked option is used; an invalid one falls back
  const edge = v.groups.find(g => g.key === 'edgeColumn');
  const pick = edge.options[edge.options.length - 1];
  const c = AR.api.solve(base, { edgeColumn: pick.b + 'x' + pick.h }).groups.find(g => g.key === 'edgeColumn');
  assert.strictEqual(c.chosen.b + 'x' + c.chosen.h, pick.b + 'x' + pick.h);
  const bad = AR.api.solve(base, { edgeColumn: '5x5' }).groups.find(g => g.key === 'edgeColumn');
  assert.strictEqual(bad.chosen, bad.rec);
  // ratio choice and more floors
  const r2 = AR.api.solve({ ...base, storeys: 6, colRatio: 2 }).groups.find(g => g.key === 'interior');
  assert.ok(Math.abs(r2.chosen.ratio - 2) <= Math.min(...r2.options.map(o => Math.abs(o.ratio - 2))) + 1e-9);
});

console.log(`\n${passed} test groups passed`);
