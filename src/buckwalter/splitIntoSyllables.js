// @flow
import { parse } from './buckwalterWord.js'

const SQUIGGLE_REGEXP = new RegExp(
  `([btvjHxd*rzs$SDTZEgfqklmnhwyaA])([aiu])?~`, 'g')

export default function splitIntoSyllables(buckwalterWord: string): Array<string> {
  const doubled = buckwalterWord.replace(SQUIGGLE_REGEXP, '$1$1$2')
  return parse(doubled)
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