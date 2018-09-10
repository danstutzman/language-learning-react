// @flow
import { parse } from './buckwalterWord.js'

const SQUIGGLE_REGEXP = new RegExp(
  '([btvjHxd*rzs$SDTZEgfqklmnhwyaA])([aiu])?~', 'g')

export default function splitIntoSyllables(buckwalterWord: string):
  Array<[string | null, string, string | null]> {
  const doubled = buckwalterWord.replace(SQUIGGLE_REGEXP, '$1$1$2')
  try {
    return parse(doubled)
  } catch (e) {
    if (e.name === 'SyntaxError') {
      console.warn(`Error when parsing ${doubled}`) // eslint-disable-line no-console
    }
    throw e
  }
}

/*
  // Remove -u case ending since it's not pronounced
  if (syllables.length > 0) {
    const last = syllables[syllables.length - 1]
    if (last.endsWith('u')) {
      const lastSyllableRemoved = syllables.pop()
      syllables[syllables.length - 1] += lastSyllableRemoved.replace('u', '')
    } else if (last.endsWith('i')) {
      const lastSyllableRemoved = syllables.pop()
      syllables[syllables.length - 1] += lastSyllableRemoved.replace('i', '')
    }
  }
*/
