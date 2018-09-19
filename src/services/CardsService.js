// @flow
import {toQalam1} from '../buckwalter/qalam1.js'

export type Syllable = {|
  l2: string,
  qalam1: string,
|}

type MorphemeSerialized = {|
  id: number,
  gloss: string,
  syllableTriplets: Array<[string, string, string]>,
|}

export type Morpheme = {|
  ...MorphemeSerialized,
  l2: string,
  syllables: Array<Syllable>,
  qalam1: string,
|}

type CardSerialized = {|
  id: string,
  enTask: string,
  enContent: string,
  morphemes: Array<MorphemeSerialized>,
|}

export type Card = {|
  ...CardSerialized,
  morphemes: Array<Morpheme>,
  l2: string,
  qalam1: string,
|}

const FETCH_TIMEOUT_MILLIS = 5000
const CARDS_STORAGE_KEY = 'cards'

function expandCardsSerialized(cards: Array<CardSerialized>): Array<Card> {
  return cards.map(card => {
    const morphemesExpanded: Array<Morpheme> = card.morphemes.map(morpheme => {
      const syllables = morpheme.syllableTriplets.map(triplet => {
        const l2 = triplet[0] + triplet[1] + triplet[2]
        const qalam1 = toQalam1(triplet)
        return { l2, qalam1 }
      })
      const morphemeL2 =
        syllables.map(syllable => syllable.l2).join('')
      const morphemeQalam1 =
        syllables.map(syllable => syllable.qalam1).join('')
      return { ...morpheme, syllables, qalam1: morphemeQalam1, l2: morphemeL2 }
    })
    const phraseQalam1 = morphemesExpanded.map(morpheme => morpheme.qalam1)
      .join(' ')
      .replace(/- -/g, '')
      .replace(/ -/g, '')
      .replace(/- /g, '')
    const phraseL2 = morphemesExpanded.map(morpheme => morpheme.l2)
      .join(' ')
      .replace(/- -/g, '')
      .replace(/ -/g, '')
      .replace(/- /g, '')
    return {
      id: card.id,
      enTask: card.enTask,
      enContent: card.enContent,
      l2: phraseL2,
      morphemes: morphemesExpanded,
      qalam1: phraseQalam1,
    }
  })
}

export default class CardsService {
  localStorage: LocalStorage
  apiUrl: string
  log: (event: string, details?: {}) => void

  constructor(
    localStorage: LocalStorage,
    apiUrl: string,
    log: (event: string, details?: {},
  ) => void) {
    this.localStorage = localStorage
    this.apiUrl = apiUrl
    this.log = log
  }

  getCardsFromStorage(): Array<Card> {
    const json = this.localStorage.getItem(CARDS_STORAGE_KEY)
    const cardsSerialized = (json !== null) ? JSON.parse(json) : []
    return expandCardsSerialized(cardsSerialized)
  }

  downloadCards = (): Promise<{cards: Array<Card>}> =>
    new Promise((resolve, reject) => {
      this.log('DownloadCardsStart')
      const timeout = setTimeout(
        () => {
          this.log('DownloadCardsFailure', { timeout: FETCH_TIMEOUT_MILLIS })
          reject(new Error(`Timeout from ${this.apiUrl}`))
        },
        FETCH_TIMEOUT_MILLIS)
      fetch(this.apiUrl)
        .then(response => {
          return response.text().then(text => {
            if (response.ok) {
              clearTimeout(timeout)
              try {
                this.log('DownloadCardsSuccess')
                const { cards } = JSON.parse(text)
                this.localStorage.setItem(
                  CARDS_STORAGE_KEY, JSON.stringify(cards))
                resolve({ cards: expandCardsSerialized(cards) })
              } catch (e) {
                this.log('DownloadCardsFailure', { error: e })
                console.error('Error parsing JSON', text, e) // eslint-disable-line
                reject(e)
              }
            } else {
              this.log('DownloadCardsFailure', {
                status: response.status,
                text: response.text,
              })
              reject(new Error(`Got status ${response.status} and text ${
                text} from ${this.apiUrl}`))
            }
          })
        })
    })

}