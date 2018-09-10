// @flow
const BUCKWALTER_TO_ARABIC = {
  A: '\u0627',
  D: '\u0636',
  E: '\u0639',
  F: '\u064b',
  H: '\u062d',
  K: '\u064d',
  N: '\u064c',
  S: '\u0635',
  T: '\u0637',
  Y: '\u0649',
  Z: '\u0638',
  a: '\u064e',
  b: '\u0628',
  d: '\u062f',
  f: '\u0641',
  g: '\u063a',
  h: '\u0647',
  i: '\u0650',
  j: '\u062c',
  k: '\u0643',
  l: '\u0644',
  m: '\u0645',
  n: '\u0646',
  o: '\u0652',
  p: '\u0629',
  q: '\u0642',
  r: '\u0631',
  s: '\u0633',
  t: '\u062a',
  u: '\u064f',
  v: '\u062b',
  w: '\u0648',
  x: '\u062e',
  y: '\u064a',
  z: '\u0632',
  '$': '\u0634',
  '*': '\u0630',
  "'": '\u0621',
  '>': '\u0623',
  '<': '\u0625',
  '_': '\u0640',
  '&': '\u0624',
  '}': '\u0626',
  '~': '\u0651',
  '|': '\u0622',
  '{': '\u0671',
  '`': '\u0670',
  '0': '\u06f0',
  '1': '\u06f1',
  '2': '\u06f2',
  '3': '\u06f3',
  '4': '\u06f4',
  '5': '\u06f5',
  '6': '\u06f6',
  '7': '\u06f7',
  '8': '\u06f8',
  '9': '\u06f9',
  ' ': ' ',
}

const BUCKWALTER_TO_MIDDLES = {
  A: '\ufe8e',
  D: '\ufec0',
  E: '\ufecc',
  F: '\u064b',
  H: '\ufea4',
  K: '\u064d',
  N: '\u064c',
  S: '\ufebc',
  T: '\ufec4',
  Y: '\ufef0',
  Z: '\ufec8',
  a: '\u064e',
  b: '\ufe92',
  d: '\ufeaa',
  f: '\ufed4',
  g: '\ufec8',
  h: '\ufeec',
  i: '\u0650',
  j: '\ufea0',
  k: '\ufedc',
  l: '\ufee0',
  m: '\ufee4',
  n: '\ufee8',
  o: '\u0652',
  p: '\u0629',
  q: '\ufed8',
  r: '\ufeae',
  s: '\ufeb4',
  t: '\ufe98',
  u: '\u064f',
  v: '\ufe9c',
  w: '\ufeee',
  x: '\ufea8',
  y: '\ufef4',
  z: '\ufeb0',
  '$': '\ufeb8',
  '*': '\ufeaa',
  "'": '\u0621',
  '>': '\u0623',
  '<': '\u0625',
  '_': '\u0640',
  '&': '\u0624',
  '}': '\u0626',
  '~': '\u0651',
  '|': '\u0622',
  '{': '\ufb51',
  '`': '\u0670',
  '0': '\u06f0',
  '1': '\u06f1',
  '2': '\u06f2',
  '3': '\u06f3',
  '4': '\u06f4',
  '5': '\u06f5',
  '6': '\u06f6',
  '7': '\u06f7',
  '8': '\u06f8',
  '9': '\u06f9',
  ' ': ' ',
}

const ARABIC_TO_BUCKWALTER = {}
for (const key in BUCKWALTER_TO_ARABIC) {
  ARABIC_TO_BUCKWALTER[BUCKWALTER_TO_ARABIC[key]] = key
}

export function convertBuckwalterToArabic(buckwalter: string): string {
  return buckwalter
    .trim()
    .split('')
    .map(function (c) { return BUCKWALTER_TO_ARABIC[c] })
    .join('')
}

export function convertArabicToBuckwalter(arabic: string): string {
  return arabic
    .trim()
    .split('')
    .map(function (c) { return ARABIC_TO_BUCKWALTER[c] })
    .join('')
}

export function convertBuckwalterToMiddles(buckwalter: string): string {
  return buckwalter
    .trim()
    .split('')
    .map(function (c) { return BUCKWALTER_TO_MIDDLES[c] })
    .join('')
    .replace(/\ufee0\ufe8e/, '\ufee0\ufeff\ufe8e') // split up l+a ligature
}

export function romanizeJoinedSyllables(joinedSyllables: string): string {
  return joinedSyllables
    .replace('*', 'dh')
    .replace('E', '\u1d9c')
    // .replace('E', '\u02bf')
    .replace('x', 'kh')
    .replace('$', 'sh')
    .replace('g', 'gh')
    // .replace("'", '\u02bea')
    .replace("'", '\u2019')
    .replace('o', '')
}

export function mergeDigraphs(userInput: string): string {
  return userInput
    .replace('c', 'E')
    .replace('th', 'v')
    .replace('kh', 'x')
    .replace('dh', '*')
    .replace('sh', '$')
    .replace('gh', 'g')
}