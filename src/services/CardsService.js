// @flow

export type Morpheme = {|
  id: number,
  l2: string,
  gloss: string,
|}

export type Card = {|
  id: string,
  enTask: string,
  enContent: string,
  morphemes: Array<Morpheme>,
|}

const FETCH_TIMEOUT_MILLIS = 5000

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
                resolve({ cards })
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