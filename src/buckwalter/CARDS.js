// @flow
import type {Card} from './Card.js'
import type {CardSyllable} from './Card.js'
import {convertSyllableTripletToQalam1} from './qalam.js'
import {splitIntoSyllableTriplets} from './splitIntoSyllables.js'
import {removeUnpronounced} from './splitIntoSyllables.js'

function makeCardSyllable(triplet: [string | null, string, string | null]):
  CardSyllable {
  return {
    buckwalter: `${triplet[0] || ''}${triplet[1]}${triplet[2] || ''}`,
    qalam1: convertSyllableTripletToQalam1(triplet),
  }
}

function makeCards(buckwalter: string): Array<Card> {
  const words = buckwalter.split(' ').map((wordBuckwalter: string) => {
    const triplets = splitIntoSyllableTriplets(wordBuckwalter)
    const syllables = triplets.map(makeCardSyllable)
    const syllablesIfLast = removeUnpronounced(triplets).map(makeCardSyllable)

    return {
      buckwalter: wordBuckwalter,
      qalam1: syllables.map((syllable) => syllable.qalam1).join(''),
      qalam1IfLast:
        syllablesIfLast.map((syllable) => syllable.qalam1).join(''),
      syllables,
      syllablesIfLast,
    }
  })
  const qalam1 = words.map((word, i) =>
    (i < words.length - 1) ? word.qalam1 : word.qalam1IfLast).join(' ')

  let syllables: Array<CardSyllable> = []
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (i < words.length - 1) {
      syllables = syllables.concat(word.syllables)
    } else {
      syllables = syllables.concat(word.syllablesIfLast)
    }
  }

  const phraseCard = { buckwalter, qalam1, syllables, words }
  const wordCards = words.map((cardWord) => ({
    buckwalter: cardWord.buckwalter,
    qalam1: cardWord.qalam1IfLast,
    syllables: cardWord.syllables,
    words: [cardWord],
  }))
  const syllableCards = syllables.map((cardSyllable) => ({
    buckwalter: cardSyllable.buckwalter,
    qalam1: cardSyllable.qalam1,
    syllables: [cardSyllable],
    words: [{
      buckwalter: cardSyllable.buckwalter,
      qalam1: cardSyllable.qalam1,
      qalam1IfLast: cardSyllable.qalam1,
      syllables: [cardSyllable],
      syllablesIfLast: [cardSyllable],
    }],
  }))

  return [phraseCard].concat(wordCards).concat(syllableCards)
}

const phrases = [
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
]

export default ((phrases
  .map(makeCards)
  .reduce((accum: Array<Card>, cards: Array<Card>) => accum.concat(cards))
): Array<Card>)