// @flow
import type {AtomContext2} from './addContextToAtoms.js'

const IS_CASE_ENDING = {
  a: true,
  i: true,
  u: true,
}

const TO_IPA = {
  a: 'a',
  aa: 'æ',
  i: 'i',
  ii: 'iː',
  u: 'u',
  uu: 'uː',

  "'": 'ʔ', // glottal stop
  D: 'dˤ',
  H: 'ħ',
  S: 'sˤ',
  T: 'tˤ',
  Z: 'zˤ',
  b: 'b',
  c: 'ʕ', // guttural voiced h
  d: 'd',
  dh: 'ð', // "these"
  gh: 'ɣ', // French "parler"
  f: 'f',
  h: 'h',
  j: 'dʒ', // "jam"
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  q: 'q', // "scar"
  r: 'r', // tapped
  s: 's',
  sh: 'ʃ',
  t: 't',
  th: 'θ', // "three"
  w: 'w',
  x: 'x', // "Bach"
  y: 'j',
  z: 'z',
}

export default function pronunceAtomContext2(atomContext2: AtomContext2):string{
  const { atom, left, right, right2 } = atomContext2

  if (IS_CASE_ENDING[atom] && right === null) {
    return ''
  } else if (atom === 'a' || atom === 'aa') {
    if (left === 'D' || right === 'D' || right2 === 'D') { return 'ɑ' }
    else if (left === 'S' || right === 'S' || right2 === 'S') { return 'ɑ' }
    else if (left === 'T' || right === 'T' || right2 === 'T') { return 'ɑ' }
    else if (left === 'Z' || right === 'Z' || right2 === 'Z') { return 'ɑ' }
    else if (left === 'q' || right === 'q' || right2 === 'q') { return 'ɑ' }
    else { return 'æ' }
  } else if (atom === 'i') {
    if (left === 'D' || right === 'D' || right2 === 'D') { return 'ɘ' }
    else if (left === 'S' || right === 'S' || right2 === 'S') { return 'ɘ' }
    else if (left === 'T' || right === 'T' || right2 === 'T') { return 'ɘ' }
    else if (left === 'Z' || right === 'Z' || right2 === 'Z') { return 'ɘ' }
    else { return 'ɪ' }
  } else if (atom === 'u') {
    if (left === 'y') { return 'u' }
    else if (left === 'D' || right === 'D' || right2 === 'D') { return 'ɔ' }
    else if (left === 'S' || right === 'S' || right2 === 'S') { return 'ɔ' }
    else if (left === 'T' || right === 'T' || right2 === 'T') { return 'ɔ' }
    else if (left === 'Z' || right === 'Z' || right2 === 'Z') { return 'ɔ' }
    else { return 'o' }
  } else if (atom === 'e') {
    if (left === null) {
      if (right === 'l') {
        return 'ʔa'
      } else {
        return 'ʔi'
      }
    } else {
      return ''
    }
  } else if (atom === 'l' && left === 'e' && right === right2) {
    return ''
  } else {
    const ipa = TO_IPA[atom]
    if (ipa === undefined) {
      throw new Error(`Unknown mapping for atom ${atom}`)
    }
    return ipa
  }
}