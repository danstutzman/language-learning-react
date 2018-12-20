// @flow
import EventEmitter from 'eventemitter3'
import {toQalam1} from '../buckwalter/qalam1.js'

export type Syllable = {|
  l2: string,
  qalam1: string,
|}

type Atom = {|
  atom: string,
  buckwalter: string,
  ipa: string,
  endsSyllable: boolean,
  endsMorpheme: boolean,
  beginsWithHyphen: boolean,
  endsWithHyphen: boolean,
|}

type MorphemeSerialized = {|
  id: number,
  gloss: string,
  atoms: Array<Atom>,
|}

export type Morpheme = {|
  ...MorphemeSerialized,
  l2: string,
  qalam1: string,
|}

type CardSerialized = {|
  id: number,
  enTask: string,
  enContent: string,
  morphemeIds: Array<number>,
|}

export type Card = {|
  id: number,
  enTask: string,
  enContent: string,
  morphemes: Array<Morpheme>,
  l2: string,
  qalam1: string,
|}

const FETCH_TIMEOUT_MILLIS = 5000
const CARDS_STORAGE_KEY = 'cards'
const MORPHEMES_STORAGE_KEY = 'morphemes'

export type CardsProps = {|
  cards: Array<Card>,
  morphemeById: {[number]: Morpheme},
  downloadCards: () => void,
  networkState: 'ASSUMED_OK' | 'WAITING' | 'TIMEOUT' | 'BAD_RESPONSE',
|}

function expandMorphemesSerialized(morphemes: Array<MorphemeSerialized>):
    {[number]: Morpheme} {
  const morphemeById: {[number]: Morpheme} = {}
  for (const morpheme of morphemes) {
    const newMorpheme = {
      ...morpheme,
      qalam1: morpheme.atoms.map(atom => atom.atom).join(''),
      l2: morpheme.atoms.map(atom => atom.buckwalter).join(''),
    }
    morphemeById[newMorpheme.id] = newMorpheme
  }
  return morphemeById
}

function expandCardsSerialized(
  cards: Array<CardSerialized>,
  morphemeById: {[number]: Morpheme},
): Array<Card> {
  return cards.map(card => {
    const morphemes =
      card.morphemeIds.map(morphemeId => morphemeById[morphemeId])
    const phraseQalam1 = morphemes.map(morpheme => morpheme.qalam1)
      .join(' ')
      .replace(/- -/g, '')
      .replace(/ -/g, '')
      .replace(/- /g, '')
    const phraseL2 = morphemes.map(morpheme => morpheme.l2)
      .join(' ')
      .replace(/- -/g, '')
      .replace(/ -/g, '')
      .replace(/- /g, '')
    return {
      id: card.id,
      enTask: card.enTask,
      enContent: card.enContent,
      l2: phraseL2,
      morphemes,
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
    const cardsJson = this.localStorage.getItem(CARDS_STORAGE_KEY)
    const cardsSerialized =
      (cardsJson !== null) ? JSON.parse(cardsJson) : []
    const morphemesJson = this.localStorage.getItem(MORPHEMES_STORAGE_KEY)
    const morphemesSerialized =
      (morphemesJson !== null) ? JSON.parse(morphemesJson) : []
    this.loadFromLocalOrRemote(cardsSerialized, morphemesSerialized)
  }

  loadFromLocalOrRemote(
    cardsSerialized: Array<CardSerialized>,
    morphemesSerialized: Array<MorphemeSerialized>,
  ) {
    const morphemeById = expandMorphemesSerialized(morphemesSerialized)
    this.props = {
      networkState: 'ASSUMED_OK',
      cards: expandCardsSerialized(cardsSerialized, morphemeById),
      morphemeById,
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
          const { cards, morphemes } = JSON.parse(text)
          this.localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards))
          this.localStorage.setItem(MORPHEMES_STORAGE_KEY,
            JSON.stringify(morphemes))
          this.loadFromLocalOrRemote(cards, morphemes)
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
