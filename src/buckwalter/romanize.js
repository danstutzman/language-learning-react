
const C1_TO_ROMANIZED = {
  D: 'D',
  H: 'H',
  S: 'S',
  T: 'T',
  b: 'b',
  d: 'd',
  f: 'f',
  h: 'h',
  k: 'k',
  l: 'l',
  ll: 'll',
  m: 'm',
  n: 'n',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  w: 'w',
  y: 'y',

  '*': 'dh',
  'E': '\u1d9c',
  // 'E': '\u02bf',
  'x': 'kh',
  '$': 'sh',
  'g': 'gh',
  // "'": '\u02bea',
  "'": '\u2019',
}

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

const C2_TO_ROMANIZED = {
  D: 'D',
  E: 'E',
  H: 'H',
  S: 'S',
  b: 'b',
  d: 'd',
  g: 'g',
  h: 'h',
  l: 'l',
  ls: 'ls',
  m: 'm',
  ms: 'ms',
  n: 'n',
  r: 'r',
  s: 's',
  w: 'w',
  y: 'y',
}

export function romanizeSyllables(
  syllables: Array<[string | null, string, string | null]>): string {
  return syllables.map((syllable) => {
    const c1: string | null = syllable[0]
    let c1Romanized = ''
    if (c1 !== null) {
      c1Romanized = C1_TO_ROMANIZED[c1]
      if (c1Romanized === undefined) {
        throw Error(`Can't romanize c1 ${c1}`)
      }
    }

    const v: string = syllable[1]
    const vRomanized = V_TO_ROMANIZED[v]
    if (vRomanized === undefined) {
      throw Error(`Can't romanize v ${v}`)
    }

    const c2: string | null = syllable[2]
    let c2Romanized = ''
    if (c2 !== null) {
      c2Romanized = C2_TO_ROMANIZED[c2]
      if (c2Romanized === undefined) {
        throw Error(`Can't romanize c2 ${c2}`)
      }
    }

    return c1Romanized + vRomanized + c2Romanized
  }).join('')
}