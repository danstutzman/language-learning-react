// @flow
import type {Card} from './Card.js'
import type {CardWord} from './Card.js'
import {splitIntoSyllables} from './splitIntoSyllables.js'

function makeCards(buckwalter: string): Array<Card> {
  const words: Array<CardWord> = buckwalter.split(' ').map(
    (wordBuckwalter: string) => {
      const [syllableQalam1s, syllableQalam1sIfLast] =
        splitIntoSyllables(wordBuckwalter)

      return {
        buckwalter: wordBuckwalter,
        syllableQalam1s,
        syllableQalam1sIfLast,
      }
    })
  const qalam1 = words.map((word, i) =>
    (i < words.length - 1) ?
      word.syllableQalam1s.join('') : word.syllableQalam1sIfLast.join('')
  ).join(' ')

  let syllableQalam1s: Array<string> = []
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (i < words.length - 1) {
      syllableQalam1s = syllableQalam1s.concat(word.syllableQalam1s)
    } else {
      syllableQalam1s = syllableQalam1s.concat(word.syllableQalam1sIfLast)
    }
  }

  const phraseCard = { buckwalter, qalam1, syllableQalam1s, words }
  const wordCards = words.map((cardWord) => ({
    buckwalter: cardWord.buckwalter,
    qalam1: cardWord.syllableQalam1sIfLast.join(''),
    syllableQalam1s: cardWord.syllableQalam1sIfLast,
    words: [cardWord],
  }))

  return [phraseCard].concat(wordCards)
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