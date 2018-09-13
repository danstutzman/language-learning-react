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

// Returns array with 1st element: syllables if word is not last
//                    2nd element, syllables if word is last
export function splitIntoSyllables(buckwalterWord: string):
  [Array<string>, Array<string>] {
  const triplets = splitIntoSyllableTriplets(buckwalterWord)
  const tripletsIfLast = removeUnpronounced(triplets)
  const joined = triplets.map((triplet) =>
    (triplet[0] || '') + triplet[1] + (triplet[2] || ''))
  const joinedIfLast = tripletsIfLast.map((triplet) =>
    (triplet[0] || '') + triplet[1] + (triplet[2] || ''))
  return [joined, joinedIfLast]
}

function removeUnpronounced(
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