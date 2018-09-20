// @flow
import App from './components/App'
import CardsService from './services/CardsService.js'
import GradesService from './services/GradesService.js'
import './index.css'
import LogStorage from './services/storage/LogStorage.js'
import PreferencesStorage from './services/storage/PreferencesStorage.js'
import React from 'react'
import ReactDOM from 'react-dom'
import RecorderService from './services/recorder/RecorderService.js'
import registerServiceWorker from './registerServiceWorker'
import SpeechSynthesisService from './services/SpeechSynthesisService.js'

const logStorage = new LogStorage(window.localStorage)

const cardsService = new CardsService(window.localStorage,
  'http://localhost:4000/ar/new-cards.json', logStorage.log)
cardsService.init()
cardsService.eventEmitter.on('cards', render)

const gradesService = new GradesService(window.localStorage, logStorage.log)
gradesService.init()
gradesService.eventEmitter.on('grades', () => {
  console.log('grades', gradesService.props)
  render()
})

const preferencesStorage = new PreferencesStorage(window.localStorage)
preferencesStorage.init()
preferencesStorage.eventEmitter.on('preferences', render)

const recorderService = new RecorderService('BASE_URL', logStorage.log)
recorderService.init()
recorderService.em.addEventListener('recordings', render)

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
    grades={gradesService.props}
    log={logStorage.log}
    preferences={preferencesStorage.props}
    recorder={recorderService.props}
    speechSynthesis={speechSynthesisService.props}
  />, rootElement)
}
render()

registerServiceWorker()