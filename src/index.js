// @flow
import App from './components/App'
import CardsService from './services/CardsService.js'
import './index.css'
import LogStorage from './services/storage/LogStorage.js'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import SpeechSynthesisService from './services/SpeechSynthesisService.js'

const logStorage = new LogStorage(window.localStorage)

const cardsService = new CardsService(window.localStorage,
  'http://localhost:4000/ar/new-cards.json', logStorage.log)
cardsService.init()
cardsService.eventEmitter.on('cards', render)

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
    speechSynthesis={speechSynthesisService.props}
  />, rootElement)
}
render()

registerServiceWorker()
