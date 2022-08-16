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
