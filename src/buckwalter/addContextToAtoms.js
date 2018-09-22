// @flow

export type AtomContext1 = {|
  atom: string,
  endsMorpheme: boolean,
  endsWord: boolean,
  beginPunctuation: string,
  endPunctuation: string,
|}

export type AtomContext2 = {|
  ...AtomContext1,
  left: string | null,
  left2: string | null,
  right: string | null,
  right2: string | null,
  endsSyllable: boolean,
|}

const COUNTS_AS_CONSONANT = {
  D: true,
  H: true,
  S: true,
  N: true,
  T: true,
  Z: true,
  b: true,
  c: true,
  d: true,
  dh: true,
  f: true,
  gh: true,
  h: true,
  j: true,
  k: true,
  l: true,
  m: true,
  n: true,
  q: true,
  r: true,
  s: true,
  sh: true,
  t: true,
  th: true,
  w: true,
  x: true,
  y: true,
  z: true,
  "'": true,
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

export default function addContext2ToAtoms(
  atomContext1s: Array<AtomContext1>): Array<AtomContext2> {

  const atomContext2s = []
  let currentSyllableHasVowel = false
  let currentSyllableHasInitialConsonant = false

  for (let i = atomContext1s.length - 1; i >= 0; i--) {
    const atomContext1 = atomContext1s[i]
    const atom = atomContext1s[i].atom
    const left = (i > 0) ? atomContext1s[i - 1].atom : null
    const right = (i < atomContext1s.length - 1) ?
      atomContext1s[i + 1].atom : null
    const left2 = (i > 1) ? atomContext1s[i - 2].atom : null
    const right2 = (i < atomContext1s.length - 2) ?
      atomContext1s[i + 2].atom : null

    if (COUNTS_AS_CONSONANT[atom]) {
      if (currentSyllableHasInitialConsonant) {
        atomContext2s.unshift(
          { ...atomContext1, left, right, left2, right2, endsSyllable: true })
        currentSyllableHasVowel = false
        currentSyllableHasInitialConsonant = false
      } else {
        atomContext2s.unshift({
          ...atomContext1, left, right, left2, right2,
          endsSyllable: atomContext1.endsWord,
        })
        if (currentSyllableHasVowel) {
          currentSyllableHasInitialConsonant = true
        }
      }
    } else if (COUNTS_AS_VOWEL[atom]) {
      if (currentSyllableHasInitialConsonant) {
        atomContext2s.unshift(
          { ...atomContext1, left, right, left2, right2, endsSyllable: true })
        currentSyllableHasVowel = true
        currentSyllableHasInitialConsonant = false
      } else {
        atomContext2s.unshift({
          ...atomContext1, left, right, left2, right2,
          endsSyllable: atomContext1.endsWord,
        })
        currentSyllableHasVowel = true
      }
    } else {
      throw new Error(`Can't handle ${atom}`)
    }
  }

  return atomContext2s
}