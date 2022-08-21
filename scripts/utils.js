// linear interp
export function lerp(A, B, t) {
  return A + (B - A) * t
}

// intersection of 2 segments
export function getIntercection(A, B, C, D) {
  const bottom = (D.y - C.y) * (B.x - A.x) - (B.y - A.y) * (D.x - C.x)
  if (bottom === 0) {
    return
  }

  const tTop = (A.y - C.y) * (D.x - C.x) - (D.y - C.y) * (A.x - C.x)
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)

  const t = tTop / bottom
  const u = uTop / bottom

  if (!(t > 0 && t < 1 && u > 0 && u < 1)) {
    return
  }

  return {
    x: A.x + (B.x - A.x) * t,
    y: A.y + (B.y - A.y) * t,
    offset: t,
  }
}

export function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntercection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      )
      if (touch) {
        return true
      }
    }
  }
  return false
}

export function getNormalizedRandom() {
  return Math.random() * 2 - 1
}
