const logger = require('../core/logger');

const gpsService = {
  validateRoute(gpsPoints) {
    if (!gpsPoints || !Array.isArray(gpsPoints)) return { valid: true };
    const invalid = gpsPoints.filter(p => !p.latitude || !p.longitude || !p.timestamp);
    if (invalid.length > 0) return { valid: false, message: `${invalid.length} invalid GPS points` };
    return { valid: true, totalPoints: gpsPoints.length };
  },

  compressRoute(gpsPoints, tolerance = 0.0001) {
    if (!gpsPoints || gpsPoints.length < 3) return gpsPoints || [];
    return ramerDouglasPeucker(gpsPoints, tolerance);
  },

  calculateBoundingBox(gpsPoints) {
    if (!gpsPoints || gpsPoints.length === 0) return null;
    return {
      north: Math.max(...gpsPoints.map(p => p.latitude)),
      south: Math.min(...gpsPoints.map(p => p.latitude)),
      east: Math.max(...gpsPoints.map(p => p.longitude)),
      west: Math.min(...gpsPoints.map(p => p.longitude)),
    };
  },

  calculateDistance(gpsPoints) {
    if (!gpsPoints || gpsPoints.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < gpsPoints.length; i++) {
      total += haversine(gpsPoints[i - 1], gpsPoints[i]);
    }
    return total;
  }
};

function haversine(p1, p2) {
  const R = 6371000;
  const dLat = (p2.latitude - p1.latitude) * Math.PI / 180;
  const dLon = (p2.longitude - p1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ramerDouglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;
  let dmax = 0, idx = 0;
  const first = points[0], last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], first, last);
    if (d > dmax) { idx = i; dmax = d; }
  }
  if (dmax > epsilon) {
    const r1 = ramerDouglasPeucker(points.slice(0, idx + 1), epsilon);
    const r2 = ramerDouglasPeucker(points.slice(idx), epsilon);
    return [...r1.slice(0, -1), ...r2];
  }
  return [first, last];
}

function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.longitude - lineStart.longitude;
  const dy = lineEnd.latitude - lineStart.latitude;
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return haversine(point, lineStart);
  const u = ((point.longitude - lineStart.longitude) * dx + (point.latitude - lineStart.latitude) * dy) / (mag * mag);
  const ix = lineStart.longitude + u * dx;
  const iy = lineStart.latitude + u * dy;
  return haversine(point, { latitude: iy, longitude: ix });
}

module.exports = gpsService;
