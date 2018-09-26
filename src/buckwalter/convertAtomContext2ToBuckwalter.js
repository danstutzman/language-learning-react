// @flow
import type {AtomContext2} from './addContextToAtoms.js'

const VOWELS = {
  A: '`',
  a: 'a',
  aa: 'A',
  ae: 'Y',
  e: '{',
  i: 'i',
  ii: 'y',
  u: 'u',
  uu: 'w',
}

const CONSONANTS: {[string | null]: string} = {
  D: 'D',
  H: 'H',
  S: 'S',
  T: 'T',
  Z: 'Z',
  b: 'b',
  c: 'E',
  d: 'd',
  dh: '*',
  f: 'f',
  gh: 'g',
  h: 'h',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  q: 'q',
  r: 'r',
  s: 's',
  sh: '$',
  t: 't',
  th: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
}

const NO_O_AFTER_AL: {[string | null]: true} = {
  l: true,
  T: true,
  r: true,
  sh: true,
  "'": true,
}

const IS_CASE_ENDING = {
  a: true,
  i: true,
  u: true,
}

function notFound(left: string | null, atom: string, right: string | null):
  Error {
  return new Error(
    `Can't find buckwalter for ${left || ''},${atom},${right || ''}`)
}

function handleMedialHamza(left: string | null, right: string | null): string {
  // hamza after laam-'alif ligature
  if (left === 'l' && right === 'u') return '>'

  // medial aloof hamza
  if (left === 'uu' && right === 'a') return "'"
  if (left === 'aa' && right === 'a') return "'"
  if (left === 'aa' && right === 'aa') return "'"

  // yaa' seat
  if (left === 'i' || left === 'y' || left === 'ii' ||
      right === 'i' || right === 'y' || right === 'ii') return '}'

  // waaw seat
  if (left === 'u' || right === 'u' || right === 'uu') {
    if (right === 'aa') return '&A'
    if (CONSONANTS[right]) return '&o'
    return '&'
  }

  // 'alif madda
  if (right === 'aa') return '|'

  // 'alif seat
  if (left === 'a' && right === 'a') { return '>' }
  if (CONSONANTS[left] && right === 'a') { return '>' }
  if (left === 'a' && CONSONANTS[right]) { return '>o' }

  throw notFound(left, "'", right)
}

function handleHamza(
  left: string | null,
  right: string | null,
  right2: string | null
): string {
  if (left === null) {
    // initial hamza
    if (right === 'a') return '>'
    if (right === 'aa') return '|'
    if (right === 'i') return '<'
    if (right === 'ii') return '<i'
    if (right === 'u') return '>'
    throw notFound(left, "'", right)
  } else if (right === null || IS_CASE_ENDING[right] && right2 === null) {
    // final hamza
    if (left === 'a') return '>'
    if (left === 'aa') return "'"
    if (left === 'u') return '&'
    if (left === 'i') return '}'
    if (left === 'uu') return "'"
    if (left === 'ii') return "'"
    if (left === 'y') return "'"
    if (CONSONANTS[left]) return "'"
    throw notFound(left, "'", right)
  } else {
    return handleMedialHamza(left, right)
  }
}

function handleConsonant(atomContext2: AtomContext2, buckwalter: string):string{
  const { atom, left, left2, right, endsMorpheme, endsSyllable } = atomContext2

  if (atom === 'l' && (left === 'e' || (left === 'a' && left2 === "'")) &&
    NO_O_AFTER_AL[right]) {
    return 'l'
  }

  if (left === 'l' && (left2 === 'e' || left2 === 'a') && NO_O_AFTER_AL[atom]) {
    return buckwalter
  }

  if (atom === 'h' && endsMorpheme && (left === 'a' || left === 'aa')) {
    return 'p'
  }

  if (endsSyllable)      return buckwalter + 'o'
  if (right === "'")     return buckwalter + 'o'
  if (CONSONANTS[right]) return buckwalter + 'o'
  return buckwalter
}

function handleVowel(atomContext2: AtomContext2, simpleVowel: string): string {
  const { atom, left, left2, right } = atomContext2

  if (atom === 'i' && right === 'N') return ''
  if (atom === 'u' && right === 'N') return ''
  if (atom === 'a' && right === 'N') return 'A'
  if (atom === 'u' && left === "'" && left2 === 'A') return ''
  if (atom === 'a' && left === "'" && right === 'l' && left2 === null) return ''
  if (atom === 'aa' && left === "'" && left2 !== 'aa') return ''
  return simpleVowel
}

function handleN(left: string | null): string {
  if (left === 'ae' || left === 'aa' || left === 'a') return 'F'
  if (left === 'i') return 'K'
  if (left === 'h') return 'K'
  if (left === 'u') return 'N'
  throw notFound(left, 'N', '?')
}

export default function convertAtomContext2ToBuckwalter(
  atomContext2: AtomContext2): string {
  const { atom, left, right, right2 } = atomContext2

  if (atom === "'") return handleHamza(left, right, right2)

  if (atom === 'N') return handleN(left)

  if (CONSONANTS[atom] !== undefined)
    return handleConsonant(atomContext2, CONSONANTS[atom])

  if (VOWELS[atom] !== undefined)
    return handleVowel(atomContext2, VOWELS[atom])

  throw notFound(left, atom, right)
}
