// @flow
import type {Card} from './Card.js'
import {romanizeJoinedSyllables} from './convertBuckwalter.js'
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
    const romanWord = romanizeJoinedSyllables(wordSyllables.map((syllable) =>
      `${syllable[0] || ''}${syllable[1]}${syllable[2] || ''}`).join(''))
    romanWords.push(romanWord)
  }
  const roman = romanWords.join(' ')
  return { buckwalter, roman, syllables }
}): Array<Card>)
