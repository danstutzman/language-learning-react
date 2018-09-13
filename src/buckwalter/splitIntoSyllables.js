// @flow
import type {CardSyllable} from './Card.js'
import {parse} from './buckwalterWord.js'

const SQUIGGLE_REGEXP = new RegExp(
  '([btvjHxd*rzs$SDTZEgfqklmnhwyaA])([aiu])?~', 'g')

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
  '': '',
  'a`': 'a', // dagger
  'aA^': 'A',
  '>a': "'a",
  '<i': "'i",
  '{': 'a', // how to handle alef wasla?
}

const C2_BUCKWALTER_TO_QALAM1 = {
  '': '',
  Eo: 'E',
  F: 'n',
  Ho: 'H',
  b: 'b',
  d: 'd',
  do: 'd',
  fo: 'f',
  go: 'g',
  ho: 'h',
  l: 'l',
  lD: 'lD', // should combine?
  lS: 'lS', // should combine?
  ld: 'ld', // should combine?
  lo: 'l',
  lr: 'lr', // should combine?
  ls: 'ls', // should combine?
  m: 'm',
  mo: 'm',
  mos: 'ms',
  n: 'n',
  no: 'n',
  p: '', // teh marbuta should become a t sometimes?
  ro: 'r',
  so: 's',
  som: 'sm',
  to: 't',
  w: 'w',
  wo: 'w',
  y: 'y',
  yo: 'y',
  "'": "'",
}

export function splitIntoSyllables(buckwalterWord: string): Array<CardSyllable>{
  if (buckwalterWord.startsWith('-')) {
    return [{ buckwalter: buckwalterWord, qalam1: buckwalterWord }]
  }

  const dashAfter = buckwalterWord.endsWith('-') ? '-' : ''
  const doubled = buckwalterWord
    .replace(/-$/, '').replace(SQUIGGLE_REGEXP, '$1$1$2')

  try {
    const triplets = parse(doubled)
    return triplets.map((triplet: [string, string, string]) => {
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

      return { buckwalter: buckwalterWord + dashAfter, qalam1: c1 + v + c2 }
    })
  } catch (e) {
    console.warn(`Error when parsing ${doubled}`) // eslint-disable-line no-console
    throw e
  }
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