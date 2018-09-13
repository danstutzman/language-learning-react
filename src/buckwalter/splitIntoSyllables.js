// @flow
import { parse } from './buckwalterWord.js'

const SQUIGGLE_REGEXP = new RegExp(
  '([btvjHxd*rzs$SDTZEgfqklmnhwyaA])([aiu])?~', 'g')

export function splitIntoSyllables(buckwalterWord: string): Array<string> {
  const doubled = buckwalterWord.replace(SQUIGGLE_REGEXP, '$1$1$2')
  if (doubled.startsWith('-')) {
    return [doubled]
  } else {
    try {
      return parse(doubled)
    } catch (e) {
      console.warn(`Error when parsing ${doubled}`) // eslint-disable-line no-console
      throw e
    }
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