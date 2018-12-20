// @flow
import EventEmitter from 'eventemitter3'
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
  id: number,
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

export type CardsProps = {|
  cards: Array<Card>,
  downloadCards: () => void,
  networkState: 'ASSUMED_OK' | 'WAITING' | 'TIMEOUT' | 'BAD_RESPONSE',
|}

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
  eventEmitter: EventEmitter
  localStorage: LocalStorage
  apiUrl: string
  log: (event: string, details?: {}) => void
  props: CardsProps

  constructor(
    localStorage: LocalStorage,
    apiUrl: string,
    log: (event: string, details?: {},
  ) => void) {
    this.eventEmitter = new EventEmitter()
    this.localStorage = localStorage
    this.apiUrl = apiUrl
    this.log = log
  }

  init() {
    const json = this.localStorage.getItem(CARDS_STORAGE_KEY)
    const cardsSerialized = (json !== null) ? JSON.parse(json) : []
    this.props = {
      networkState: 'ASSUMED_OK',
      cards: expandCardsSerialized(cardsSerialized),
      downloadCards: this.downloadCards,
    }
  }

  downloadCards = () => {
    this.log('DownloadCardsStart')
    let timedOut = false
    const timeout = setTimeout(
      () => {
        timedOut = true
        this.log('DownloadCardsTimeout', { timeout: FETCH_TIMEOUT_MILLIS })
        this.props = { ...this.props, networkState: 'TIMEOUT' }
        this.eventEmitter.emit('cards')
      },
      FETCH_TIMEOUT_MILLIS)
    fetch(this.apiUrl)
      .then(response => {
        if (!timedOut) {
          clearTimeout(timeout)
          this.handleResponse(response)
        }
      })
      .catch(e => {
        if (!timedOut) {
          clearTimeout(timeout)
        }
        this.log('DownloadCardsError', { error: e })
        this.props = { ...this.props, networkState: 'BAD_RESPONSE' }
        this.eventEmitter.emit('cards')
      })
  }

  handleResponse = (response: Response) =>
    response.text().then(text => {
      if (response.ok) {
        try {
          this.log('DownloadCardsSuccess')
          const cardsSerialized = JSON.parse(text).cards
          this.localStorage.setItem(
            CARDS_STORAGE_KEY, JSON.stringify(cardsSerialized))
          this.props = {
            ...this.props,
            networkState: 'ASSUMED_OK',
            cards: expandCardsSerialized(cardsSerialized),
          }
          this.eventEmitter.emit('cards')
        } catch (e) {
          this.log('DownloadCardsFailure', { error: e })
          this.props = { ...this.props, networkState: 'BAD_RESPONSE' }
          this.eventEmitter.emit('cards')
        }
      } else {
        this.log('DownloadCardsFailure', {
          status: response.status,
          text: response.text,
        })
        this.props = { ...this.props, networkState: 'BAD_RESPONSE' }
        this.eventEmitter.emit('cards')
      }
    })
}