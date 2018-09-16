// @flow
import type {Card} from './Card.js'
import type {CardMorpheme} from './Card.js'
import type {CardSyllable} from './Card.js'
import {splitIntoSyllables} from './splitIntoSyllables.js'

function makeCards(buckwalterGlossPairs: Array<[string, string]>): Array<Card> {
  const morphemes: Array<CardMorpheme> = buckwalterGlossPairs.map((pair) => {
    const buckwalter = pair[0]
    const gloss = pair[1]
    const syllables = splitIntoSyllables(buckwalter)
    const qalam1 = syllables.join('')
    return { buckwalter, gloss, qalam1, syllables }
  })
  const qalam1 = morphemes
    .map((morpheme) => morpheme.syllables.map(s => s.qalam1).join(''))
    .join(' ')
    .replace(/(- -| -|- )/g, '')

  let syllables: Array<CardSyllable> = []
  for (const morpheme of morphemes){
    syllables = syllables.concat(morpheme.syllables)
  }

  const buckwalter = buckwalterGlossPairs
    .map((pair) => pair[0])
    .join(' ')
    .replace(/(- -| -|- )/g, '')
  const phraseCard = { buckwalter, qalam1, syllables, morphemes }

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

  [['>alifo', 'alef']],
  [["baA'", 'beh']],
  [["taA'", 'teh']],
  [["vaA'", 'theh']],
  [['jiymo', 'jeem']],
  [["HaA'", 'kah']],
  [["xaA'", 'khah']],
  [['daAlo', 'dal']],
  [['*aAlo', 'thal']],
  [["raA'", 'reh']],
  [['zaAyo', 'zain']],
  [['siyno', 'seen']],
  [['$iyno', 'sheen']],
  [['SaAdo', 'sad']],
  [['DaAdo', 'dad']],
  [["TaA'", 'tah']],
  [["ZaA'", 'zah']],
  [['Eayn', 'ain']],
  [['gayn', 'ghain']],
  [["faA'", 'feh']],
  [['qaAfo', 'qaf']],
  [['kaAfo', 'kaf']],
  [['lAamo', 'lam']],
  [['miymo', 'meem']],
  [['nuwno', 'noon']],
  [["haA'", 'heh']],
  [['waAwo', 'waw']],
  [["yaA'", 'yeh']],
  [['hamozap', 'hamza']],
  [['>alifo', 'alef'], ['hamozap', 'hamza']],
  [['waAwo', 'waw'], ['hamozap', 'hamza']],
  [["yaA'", 'yeh'], ['hamozap', 'hamaza']],
  [['>alifo', 'alef'], ['mada~p', 'madda']],
  [["tA'", 'teh'], ['marobuwTap', 'marbuta']],
  [['>alifo', 'alef'], ['muSawi~rap', 'maksura']],
  [['sukuwn', 'sukun']],
  [['>alifo', 'alef'], ['xanojariya~p', 'dagger']],
  [['fatoHap', 'opening']],
  [['kasorap', 'breaking']],
  [['Dama~p', 'dammah']],
  [['$ada~p', 'shaddah']],

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