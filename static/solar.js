// Solar position: NOAA Solar Calculator algorithm (after Meeus, Astronomical Algorithms, ch. 25 & 28).
// https://gml.noaa.gov/grad/solcalc/calcdetails.html  — angles in degrees, azimuth clockwise from true north.
// Verified against NREL SPA (pvlib): max |dAlt| 0.006 deg, max |dAz| 0.023 deg over tests/reference.json.
// tz = UTC offset applicable on that date (DST included); localHours = decimal local clock hours.
const R = Math.PI / 180, D = 180 / Math.PI;
function julianDay(y, m, d, utcHours) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + utcHours / 24;
}
// lat N+, lon E+, tzHours offset from UTC, localHours decimal local clock time (standard time)
function solarPosition(lat, lon, y, m, d, localHours, tz) {
  const jd = julianDay(y, m, d, localHours - tz);
  const T = (jd - 2451545.0) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * R) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * M * R) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * R) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * R);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * R);
  const decl = Math.asin(Math.sin(eps * R) * Math.sin(lambda * R)) * D;
  const y2 = Math.tan(eps * R / 2) ** 2;
  const eot = 4 * D * (y2 * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) +
    4 * e * y2 * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * y2 * y2 * Math.sin(4 * L0 * R) -
    1.25 * e * e * Math.sin(2 * M * R)); // minutes
  const tst = ((localHours * 60 + eot + 4 * lon - 60 * tz) % 1440 + 1440) % 1440;
  let ha = tst / 4 - 180; if (ha < -180) ha += 360;
  const cosZ = Math.sin(lat * R) * Math.sin(decl * R) + Math.cos(lat * R) * Math.cos(decl * R) * Math.cos(ha * R);
  const zen = Math.acos(Math.max(-1, Math.min(1, cosZ))) * D;
  const alt = 90 - zen;
  // azimuth clockwise from North
  const az = ((Math.atan2(Math.sin(ha * R), Math.cos(ha * R) * Math.sin(lat * R) - Math.tan(decl * R) * Math.cos(lat * R)) * D + 180) % 360 + 360) % 360;
  // atmospheric refraction (NOAA)
  let refr = 0;
  if (alt < 85) {
    const te = Math.tan(alt * R);
    if (alt > 5) refr = 58.1 / te - 0.07 / te ** 3 + 0.000086 / te ** 5;
    else if (alt > -0.575) refr = 1735 + alt * (-518.2 + alt * (103.4 + alt * (-12.79 + alt * 0.711)));
    else refr = -20.772 / te;
    refr /= 3600;
  }
  return { decl, eot, ha, alt, az, altRefracted: alt + refr };
}
// Shadow length for an object of height h: L = h / tan(alt), null if sun below horizon
function shadowLength(h, alt) { return alt > 0 ? h / Math.tan(alt * R) : null; }
if (typeof module !== 'undefined' && module.exports) module.exports = { solarPosition, shadowLength, julianDay };
else window.SunCore = { solarPosition, shadowLength, julianDay };
