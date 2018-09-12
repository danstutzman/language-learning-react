const V_TO_ROMANIZED = {
  A: 'A',
  Aa: 'A',
  Ai: 'i',
  a: 'a',
  aA: 'A',
  i: 'i',
  iy: 'I',
  u: 'u',
  uw: 'U',
}

export function romanizeSyllableTriplet(
  triplet: [string | null, string, string | null]): string {

  const v: string = triplet[1]
  const vRomanized = V_TO_ROMANIZED[v]
  if (vRomanized === undefined) {
    throw Error(`Can't romanize v ${v}`)
  }

  return (triplet[0] || '') + vRomanized + (triplet[2] || '')
}