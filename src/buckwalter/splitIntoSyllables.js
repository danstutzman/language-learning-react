// @flow
import { parse } from './buckwalterWord.js'

const SQUIGGLE_REGEXP = new RegExp(
  '([btvjHxd*rzs$SDTZEgfqklmnhwyaA])([aiu])?~', 'g')

export function splitIntoSyllableTriplets(buckwalterWord: string):
  Array<[string | null, string, string | null]> {
  const doubled = buckwalterWord.replace(SQUIGGLE_REGEXP, '$1$1$2')
  try {
    return parse(doubled)
  } catch (e) {
    console.warn(`Error when parsing ${doubled}`) // eslint-disable-line no-console
    throw e
  }
}

export function removeUnpronounced(
  triplets: Array<[string | null, string, string | null]>):
  Array<[string | null, string, string | null]> {
  if (triplets.length < 2) {
    return triplets
  } else {
    const penultimate = triplets[triplets.length - 2]
    const last = triplets[triplets.length - 1]
    if (last[0] !== null &&
      ['a', 'i', 'u'].indexOf(last[1]) !== -1 &&
      last[2] === null) {
      const newLast = [
        penultimate[0],
        penultimate[1],
        (penultimate[2] || '') + last[0],
      ]
      return triplets.slice(0, -2).concat([newLast])
    } else {
      return triplets
    }
  }
}