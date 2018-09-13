// @flow
import App from './App' // eslint-disable-line no-unused-vars
import './index.css'
import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

const arabicVoices = window.speechSynthesis.getVoices().filter((voice) =>
  voice.lang.startsWith('ar')
).map((voice) => ({
  lang: voice.lang,
  name: voice.name,
}))

function speakText(script: string, selectedVoiceName: string | null) {
  const utterance = new SpeechSynthesisUtterance(script)

  // Default to first Arabic voice, but allow override
  for (const voice of window.speechSynthesis.getVoices()) {
    if (voice.lang.startsWith('ar')) {
      utterance.voice = voice
      break
    }
  }
  for (const voice of window.speechSynthesis.getVoices()) {
    if (voice.name === selectedVoiceName) {
      utterance.voice = voice
    }
  }

  window.speechSynthesis.speak(utterance)
}

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw Error("Can't find element with id=root")
}
ReactDOM.render(
  <App
    arabicVoices={arabicVoices}
    speakText={speakText}
  />, rootElement)
registerServiceWorker()
