// @flow
import App from './components/App'
import CardsService from './services/CardsService.js'
import './index.css'
import LogStorage from './services/storage/LogStorage.js'
import PreferencesStorage from './services/storage/PreferencesStorage.js'
import React from 'react'
import ReactDOM from 'react-dom'
import RecorderService from './services/recorder/RecorderService.js'
import type {Recording} from './services/recorder/Recording.js'
import registerServiceWorker from './registerServiceWorker'
import SpeechSynthesisService from './services/SpeechSynthesisService.js'

const logStorage = new LogStorage(window.localStorage)

const cardsService = new CardsService(window.localStorage,
  'http://localhost:4000/ar/new-cards.json', logStorage.log)
cardsService.init()
cardsService.eventEmitter.on('cards', render)

const preferencesStorage = new PreferencesStorage(window.localStorage)
preferencesStorage.init()
preferencesStorage.eventEmitter.on('preferences', render)

export type RecorderProps = {|
  isRecording: boolean,
  recordings: Array<Recording>,
  startRecording: (timeslice?: number) => void,
  stopRecording: () => void,
|}
const recorderService = new RecorderService('BASE_URL', logStorage.log)
let recorderProps = {
  isRecording: false,
  recordings: [],
  startRecording: (timeslice?: number) => {
    recorderService.startRecording(timeslice)
    recorderProps = {
      ...recorderProps,
      isRecording: recorderService.state === 'recording',
    }
    render()
  },
  stopRecording: () => {
    recorderService.stopRecording()
    recorderProps = {
      ...recorderProps,
      isRecording: recorderService.state === 'recording',
    }
    render()
  },
}
recorderService.em.addEventListener('recording', (e: any) => {
  recorderProps = {
    ...recorderProps,
    recordings: recorderProps.recordings.concat([e.detail.recording]),
  }
  render()
})

const speechSynthesisService =
  new SpeechSynthesisService(window.speechSynthesis, logStorage.log)
speechSynthesisService.init()
speechSynthesisService.eventEmitter.on('props', render)

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw Error("Can't find element with id=root")
}
function render() {
  ReactDOM.render(<App
    cards={cardsService.props}
    log={logStorage.log}
    preferences={preferencesStorage.props}
    recorder={recorderProps}
    speechSynthesis={speechSynthesisService.props}
  />, rootElement)
}
render()

registerServiceWorker()