// @flow
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
  i: true,
  ii: true,
  u: true,
  uu: true,
  w: true,
  y: true,
}

export default function groupAtomsIntoSyllables(atoms: Array<string>):
  Array<Array<string>> {
  const syllables = []
  let currentSyllable = []
  let currentSyllableHasVowel = false
  let currentSyllableHasInitialConsonant = false

  for (let i = atoms.length - 1; i >= 0; i--) {
    const atom = atoms[i]
    if (COUNTS_AS_CONSONANT[atom]) {
      if (currentSyllableHasInitialConsonant) {
        syllables.unshift(currentSyllable)
        currentSyllable = [atom]
        currentSyllableHasVowel = false
        currentSyllableHasInitialConsonant = false
      } else {
        currentSyllable.unshift(atom)
        if (currentSyllableHasVowel) {
          currentSyllableHasInitialConsonant = true
        }
      }
    } else if (COUNTS_AS_VOWEL[atom]) {
      if (currentSyllableHasInitialConsonant) {
        syllables.unshift(currentSyllable)
        currentSyllable = [atom]
        currentSyllableHasVowel = true
        currentSyllableHasInitialConsonant = false
      } else {
        currentSyllable.unshift(atom)
        currentSyllableHasVowel = true
      }
    }
  }
  if (currentSyllable.length > 0) {
    syllables.unshift(currentSyllable)
  }

  return syllables
}