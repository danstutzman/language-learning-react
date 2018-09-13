// @flow
import type {Card} from './Card.js'
import type {CardMorpheme} from './Card.js'
import {splitIntoSyllables} from './splitIntoSyllables.js'

function makeCards(buckwalterGlossPairs: Array<[string, string]>): Array<Card> {
  const morphemes: Array<CardMorpheme> = buckwalterGlossPairs.map((pair) => {
    const buckwalter = pair[0]
    const gloss = pair[1]
    const syllableQalam1s = splitIntoSyllables(buckwalter)
    const qalam1 = syllableQalam1s.join('')
    return { buckwalter, gloss, qalam1, syllableQalam1s }
  })
  const qalam1 = morphemes
    .map((morpheme) => morpheme.syllableQalam1s.join(''))
    .join(' ')
    .replace(/(- -| -|- )/g, '')

  let syllableQalam1s: Array<string> = []
  for (const morpheme of morphemes){
    syllableQalam1s = syllableQalam1s.concat(morpheme.syllableQalam1s)
  }

  const buckwalter = buckwalterGlossPairs
    .map((pair) => pair[0])
    .join(' ')
    .replace(/(- -| -|- )/g, '')
  const phraseCard = { buckwalter, qalam1, syllableQalam1s, morphemes }

  return [phraseCard]
}

const phrases = [
  [['Aisom', 'name'], ['-iy', 'my'], ['daAniyaAl', 'Daniel']],
  [['maroHabA', 'welcome'], ['-F', '?']],
  [['Aals-', 'the'], ['salaAm', 'peace'], ['-u', 'nom.'],
    ['Ealayo', 'be unto'], ['-kumo', 'you all']],
  [['kayofa', 'how'], ['HaAl', 'condition'], ['-u', 'nom.'], ['-ka', 'your']],
  [['>anota', 'your']],
  [['xuroTuwmo', 'hose']],
  [['$amos', 'sun']],
  [['gaA}imo', 'cloudy']],

  // 'bisomi {ll~ahi {lr~aHomani {lr~aHiymi',
  // '{loHamodu lil~ahi rab~i {loEa`lamiyna',
  // '{lr~aHoma`ni {lr~aHiymi',
  // 'ma`liki yawomi {ld~iyni',
  // '<iy~aAka naEobudu wa<iy~aAka nasotaEiynu',
  // '{hodinaA {lS~ira`Ta {lomusotaqiyma',
  // 'Sira`Ta {l~a*iyna >anoEamo ta Ealayo himo gayori ' +
  //   '{lo magoDuwbi Ealayo himo wa laA {lD~aA^l~iyna',
]

export default ((phrases
  .map(makeCards)
  .reduce((accum: Array<Card>, cards: Array<Card>) => accum.concat(cards))
): Array<Card>)