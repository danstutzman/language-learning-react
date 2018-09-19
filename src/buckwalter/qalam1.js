// @flow

const C1_BUCKWALTER_TO_QALAM1 = {
  '': '',
  D: 'D',
  E: 'E',
  H: 'H',
  S: 'S',
  T: 'T',
  Z: 'Z',
  b: 'b',
  d: 'd',
  'd-': 'd',
  f: 'f',
  g: 'g',
  h: 'h',
  j: 'j',
  k: 'k',
  l: 'l',
  ll: 'll', // for allah
  m: 'm',
  n: 'n',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
  '$': '$',
  '}': "'",
  '*': '*',
  '-b': '-b',
  '-k': '-k',
  '-m': '-m',
  '-n': '-n',
  '-z': '-z',
}

const V_BUCKWALTER_TO_QALAM1 = {
  A: 'A',
  Aa: 'A',
  Ai: 'i',
  a: 'a',
  aA: 'A',
  ay: 'ay',
  i: 'i',
  iy: 'iy',
  u: 'u',
  uw: 'uw',
  y: 'y',
  '': '',
  'a`': 'a', // dagger
  'aA^': 'A',
  '>a': "'a",
  '<i': "'i",
  '{': 'a', // how to handle alef wasla?
  '-a': '-a',
  '-iy': '-iy',
  '-u': '-u',
  '-uw': '-uw',
  '`': 'a', // dagger
}

const C2_BUCKWALTER_TO_QALAM1 = {
  '': '',
  Eo: 'E',
  'E-': 'E-',
  F: 'n',
  Ho: 'H',
  Y: 'Y', // ?
  b: 'b',
  bo: 'b',
  'b-': 'b-',
  d: 'd',
  do: 'd',
  'f-': 'f-',
  fo: 'f',
  go: 'g',
  'k-': 'k',
  h: 'h',
  ho: 'h',
  l: 'l',
  'l-': 'l-',
  lD: 'lD', // should combine?
  lS: 'lS', // should combine?
  ld: 'ld', // should combine?
  lo: 'l',
  'lo-': 'l-',
  lr: 'lr', // should combine?
  ls: 'ls', // should combine?
  'ls-': 'ls-', // should combine?
  m: 'm',
  mo: 'm',
  mos: 'ms',
  n: 'n',
  'n-': 'n-',
  no: 'n',
  p: '', // teh marbuta should become a t sometimes?
  r: 'r',
  rK: 'rK',
  'r-': 'r-',
  ro: 'r',
  's-': 's-',
  so: 's',
  som: 'sm',
  to: 't',
  w: 'w',
  'w-': 'w-',
  wo: 'w',
  xo: 'x',
  y: 'y',
  yo: 'y',
  "'": "'",
  '-': '-',
  '-Eo': '-E',
  '-do': '-d',
  '-jo': '-j',
  '-ko': '-k',
  '-so': '-s',
  '-o': '-',
  '$-': '$-',
  '-?': '-?',
  '-.': '-.',
  '-!': '-!',
  '$oq': '$q',
}

export function toQalam1(triplet: [string, string, string]): string {
  const c1 = C1_BUCKWALTER_TO_QALAM1[triplet[0]]
  if (c1 === undefined) {
    throw new Error(`No C1_BUCKWALTER_TO_QALAM for ${triplet[0]}`)
  }

  const v = V_BUCKWALTER_TO_QALAM1[triplet[1]]
  if (v === undefined) {
    throw new Error(`No V_BUCKWALTER_TO_QALAM for ${triplet[1]}`)
  }

  const c2 = C2_BUCKWALTER_TO_QALAM1[triplet[2]]
  if (c2 === undefined) {
    throw new Error(`No C2_BUCKWALTER_TO_QALAM for ${triplet[2]}`)
  }

  const dashAfter = ''
  return c1 + v + c2
}

export function removeUnpronounced(syllables: Array<string>): Array<string> {
  if (syllables.length < 2) {
    return syllables
  } else {
    const penultimate = syllables[syllables.length - 2]
    const last = syllables[syllables.length - 1]
    const match = /(.+)[aiu]$/.exec(last)
    if (match !== null) {
      const newLast = penultimate + match[1]
      return syllables.slice(0, -2).concat([newLast])
    } else {
      return syllables
    }
  }
}
