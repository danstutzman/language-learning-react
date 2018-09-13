const V_TO_QALAM1 = {
  A: 'A',
  Aa: 'A',
  Ai: 'i',
  a: 'a',
  aA: 'A',
  i: 'i',
  iy: 'iy',
  u: 'u',
  uw: 'uw',
}

export function convertSyllableTripletToQalam1(
  triplet: [string | null, string, string | null]): string {

  const v: string = triplet[1]
  const vQalam1 = V_TO_QALAM1[v]
  if (vQalam1 === undefined) {
    throw Error(`Can't convert v to qalam1: ${v}`)
  }

  return (triplet[0] || '') + vQalam1 + (triplet[2] || '')
}