// @flow
import type {Card} from './Card.js'
import type {CardSyllable} from './Card.js'
import {romanizeSyllableTriplet} from './romanize.js'
import {splitIntoSyllableTriplets} from './splitIntoSyllables.js'
import {removeUnpronounced} from './splitIntoSyllables.js'

function makeCardSyllable(triplet: [string | null, string, string | null]):
  CardSyllable {
  return {
    buckwalter: `${triplet[0] || ''}${triplet[1]}${triplet[2] || ''}`,
    romanized: romanizeSyllableTriplet(triplet),
  }
}

function makeCard(buckwalter: string): Card {
  const words = buckwalter.split(' ').map((wordBuckwalter: string) => {
    const triplets = splitIntoSyllableTriplets(wordBuckwalter)
    const syllables = triplets.map(makeCardSyllable)
    const syllablesIfLast = removeUnpronounced(triplets).map(makeCardSyllable)

    return {
      buckwalter: wordBuckwalter,
      romanized: syllables.map((syllable) => syllable.romanized).join(''),
      romanizedIfLast:
        syllablesIfLast.map((syllable) => syllable.romanized).join(''),
      syllables,
      syllablesIfLast,
    }
  })
  const romanized = words.map((word, i) =>
    (i < words.length - 1) ? word.romanized : word.romanizedIfLast).join(' ')

  let syllables: Array<CardSyllable> = []
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (i < words.length - 1) {
      syllables = syllables.concat(word.syllables)
    } else {
      syllables = syllables.concat(word.syllablesIfLast)
    }
  }

  return { buckwalter, romanized, syllables, words }
}

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
].map(makeCard): Array<Card>)