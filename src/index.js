// @flow
import App from './components/App'
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import SpeechSynthesisService from './services/SpeechSynthesisService.js'

function log(event: string, details?: {}) {
  console.log('TODO DELETE ME', event, details)
}
const speechSynthesisService =
  new SpeechSynthesisService(window.speechSynthesis, log)
speechSynthesisService.init()
speechSynthesisService.eventEmitter.on('props', render)

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw Error("Can't find element with id=root")
}
function render() {
  ReactDOM.render(<App
    speechSynthesis={speechSynthesisService.props}
  />, rootElement)
}
render()

registerServiceWorker()
