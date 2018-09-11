// @flow
import type {Card} from './Card.js'
import {romanizeSyllables} from './romanize.js'
import splitIntoSyllables from './splitIntoSyllables.js'

export default ([
  'Aisomiy daAniyaAl',
  'maroHabAF',
  'Aalsa~laAmu Ealayokumo',
  'kayofa HaAluka',
  '>anota',
  'xuroTuwmo',
  '$amos',
  'gaA}imo',

  'bisomi {ll~ahi {lr~aHomani {lr~aHiymi',
  '{loHamodu lil~ahi rab~i {loEa`lamiyna',
  '{lr~aHoma`ni {lr~aHiymi',
  'ma`liki yawomi {ld~iyni',
  '<iy~aAka naEobudu wa<iy~aAka nasotaEiynu',
  '{hodinaA {lS~ira`Ta {lomusotaqiyma',
  'Sira`Ta {l~a*iyna >anoEamo ta Ealayo himo gayori ' +
    '{lo magoDuwbi Ealayo himo wa laA {lD~aA^l~iyna',
].map((buckwalter: string) => {
  let syllables: Array<[string | null, string, string | null]> = []
  let romanWords = []
  for (const word of buckwalter.split(' ')) {
    const wordSyllables = splitIntoSyllables(word)
    syllables = syllables.concat(wordSyllables)
    const romanWord = romanizeSyllables(wordSyllables)
    romanWords.push(romanWord)
  }
  const roman = romanWords.join(' ')
  return { buckwalter, roman, syllables }
}): Array<Card>)
