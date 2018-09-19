// @flow
import App from './components/App'
import './index.css'
import LogStorage from './services/storage/LogStorage.js'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import SpeechSynthesisService from './services/SpeechSynthesisService.js'

const logStorage = new LogStorage(window.localStorage)

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
    log={logStorage.log}
    speechSynthesis={speechSynthesisService.props}
  />, rootElement)
}
render()

registerServiceWorker()
