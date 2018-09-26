// @flow
import type {AtomContext2} from './addContextToAtoms.js'

const SIMPLE_VOWELS = {
  A: '`',
  a: 'a',
  ae: 'Y',
  e: '{',
  i: 'i',
  ii: 'y',
  u: 'u',
  uu: 'w',
}

const COUNTS_AS_VOWEL = {
  A: true,
  a: true,
  aa: true,
  ae: true,
  e: true,
  i: true,
  ii: true,
  u: true,
  uu: true,
  w: true,
  y: true,
}

const SIMPLE_CONSONANTS: {[string]: string} = {
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
  x: 'x',
  z: 'z',
}

const NO_O_AFTER_L = {
  "'": true,
  sh: true,
}

const DOUBLE_C_AFTER_AL = {
  T: true,
  r: true,
  sh: true,
}

export default function convertAtomContext2ToBuckwalter(
  atomContext2: AtomContext2): string {

  const { atom, left, right, left2, right2, endsSyllable, endsMorpheme } =
    atomContext2

  const simpleConsonant = SIMPLE_CONSONANTS[atom]
  if (simpleConsonant !== undefined) {
    if (atom === 'l' && (left === 'e' || (left === 'a' && left2 === "'")) &&
      right && DOUBLE_C_AFTER_AL[right]) {
      return 'l'
    } else if (atom === 'l' && right && NO_O_AFTER_L[right]) {
      return 'l'
    } else if (atom === 'h' && endsMorpheme &&
      (left === 'a' || left === 'aa')) {
      return 'p'
    } else {
      if (right === atom) {
        return simpleConsonant
      } else if (endsSyllable || right === "'" ||
        (right && SIMPLE_CONSONANTS[right])) {
        return simpleConsonant + 'o'
      } else {
        return simpleConsonant
      }
    }
  } else {
    const simpleVowel = SIMPLE_VOWELS[atom]
    if (simpleVowel !== undefined) {
      if ((atom === 'i' || atom === 'u') && right === 'N') { return '' }
      else if (atom === 'a' && right === 'N') { return 'A' }
      else if (atom === 'u' && left === "'" && left2 === 'A') { return '' }
      else if (atom === 'a' && left === "'" && right === 'l' &&
        left2 === null) { return '' }
      else { return simpleVowel }
    } else {
      if (atom === "'") {
        if (left === null && right === 'a') { return '>' }
        else if (left === 'a' && right === 'a') { return '>' }
        else if (left === null && right === 'i') { return '<' }
        else if (left === null && right === 'ii') { return '<i' }
        else if (left === null && right === 'u') { return '>' }
        else if (left === 'a' && right === 'u') { return '>' }
        else if (left === 'aa' && right === 'aa') { return "'A" }
        else if (left === 'u' && right === 'aa') { return '&A' }
        else if (right === 'aa') { return '|' }
        else if (left === 'l' && right === 'u') { return '>' }
        else if (left === 'aa' && right === 'i') {
          return (right2 === null) ? "'" : '}'
        }
        else if (left === 'a' && right === 'ii') { return '}' }
        else if (left === 'a' && right === 'uu') { return '&' }
        else if (left === 'aa' && right === 'a') { return "'" }
        else if (left === 'u' && right === null) { return '&' }
        else if (left === 'u' && right === 'a') { return '&' }
        else if (left === 'u' && right === 'uu') { return '&' }
        else if (left === 'u' && right === 'i') { return '}' }
        else if (left === 'w' && right === 'i') { return '}' }
        else if (left === 'i' && right === null) { return '}' }
        else if (left === 'a' && right === null) { return '>' }
        else if (left === 'aa' && right === 'ii') { return '}' }
        else if (left === 'aa' && right === 'u') {
          return (right2 === null) ? "'" : '&'
        }
        else if (left === 'aa' && right === null) { return "'" }
        else if (left === 'uu' && right === 'a') { return "'" }
        else if (left === 'y' && right === 'a') { return '}' }
        else if (left === 'A' && right === 'u') { return '&' }
        else if (left === 'i' && right && SIMPLE_CONSONANTS[right]) { return '}' }
        else if (left === 'a' && right && SIMPLE_CONSONANTS[right]) { return '>o' }
        else if (left === 'A' && right && SIMPLE_CONSONANTS[right]) { return '&' }
        else if (left === 'u' && right && SIMPLE_CONSONANTS[right]) { return '&o' }
        else if (left && SIMPLE_CONSONANTS[left] && right === 'a') { return '>' }
        else if (right === null) { return "'" }
        else { return `?(${left || ''},${right || ''})` }
      } else if (atom === 'N') {
        if (left === 'ae' || left === 'aa') { return 'F' }
        else if (left === 'i') { return 'K' }
        else if (left === 'h') { return 'K' }
        else if (left === 'u') { return 'N' }
        else if (left === 'a') { return 'F' }
        else { return '?' }
      } else if (atom === 'w') {
        if (right && COUNTS_AS_VOWEL[right]) { return 'w' }
        else { return 'wo' }
      } else if (atom === 'y') {
        if (endsSyllable || right === "'") { return 'yo' }
        else { return 'y' }
      } else if (atom === 'aa') {
        if (left === "'") { return '' }
        else { return 'A' }
      } else {
        throw Error(`Can't handle atom ${atom}`)
      }
    }
  }
}